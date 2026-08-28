import { GpsSimulationMode, GpsVerification, Student, VerificationStatus } from '../types';
import { HOSPITAL_CONFIG } from './mockData';

export interface GpsCheckResult {
  status: VerificationStatus;
  distance_meters: number;
  accuracy_meters: number;
  latitude: number;
  longitude: number;
  is_inside_geofence: boolean;
  timestamp: string;
  time_display: string;
  message: string;
}

export class MockGpsService {
  private static currentSimulationMode: GpsSimulationMode = 'INSIDE_HOSPITAL';

  public static setSimulationMode(mode: GpsSimulationMode) {
    this.currentSimulationMode = mode;
  }

  public static getSimulationMode(): GpsSimulationMode {
    return this.currentSimulationMode;
  }

  public static getCurrentTimeString(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  public static performGpsCheck(
    student: Student,
    forcedMode?: GpsSimulationMode,
    customTime?: string,
    verificationType: GpsVerification['verification_type'] = 'MANUAL'
  ): GpsVerification {
    const mode = forcedMode || this.currentSimulationMode;
    const now = new Date();
    const isoTimestamp = now.toISOString();
    const timeDisplay = customTime || this.getCurrentTimeString();

    let status: VerificationStatus = 'VERIFIED';
    let distance = 32;
    let accuracy = 4;
    let lat = HOSPITAL_CONFIG.latitude;
    let lng = HOSPITAL_CONFIG.longitude;
    let inside = true;

    if (mode === 'INSIDE_HOSPITAL') {
      status = 'VERIFIED';
      distance = Math.floor(Math.random() * 45) + 20; // 20 - 65m
      accuracy = Math.floor(Math.random() * 3) + 3; // 3 - 6m
      lat = HOSPITAL_CONFIG.latitude + (Math.random() - 0.5) * 0.0004;
      lng = HOSPITAL_CONFIG.longitude + (Math.random() - 0.5) * 0.0004;
      inside = true;
    } else if (mode === 'OUTSIDE_HOSPITAL') {
      status = 'NEEDS ATTENTION';
      distance = Math.floor(Math.random() * 150) + 380; // 380 - 530m
      accuracy = Math.floor(Math.random() * 6) + 7; // 7 - 13m
      lat = HOSPITAL_CONFIG.latitude + 0.0035 + Math.random() * 0.001;
      lng = HOSPITAL_CONFIG.longitude + 0.0035 + Math.random() * 0.001;
      inside = false;
    } else if (mode === 'GPS_UNAVAILABLE') {
      status = 'GPS UNAVAILABLE';
      distance = 0;
      accuracy = 0;
      lat = 0;
      lng = 0;
      inside = false;
    }

    const verification: GpsVerification = {
      id: `v_${student.register_number}_${Date.now()}`,
      register_number: student.register_number,
      student_name: student.name,
      department: student.department,
      timestamp: isoTimestamp,
      time_display: timeDisplay,
      status,
      distance_meters: distance,
      accuracy_meters: accuracy,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      is_inside_geofence: inside,
      verification_type: verificationType,
    };

    return verification;
  }
}
