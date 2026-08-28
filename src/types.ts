export type UserRole = 'STUDENT' | 'MENTOR' | 'HOD' | 'ADMIN';

export type VerificationStatus =
  | 'VERIFIED'
  | 'FAILED'
  | 'NEEDS ATTENTION'
  | 'REVIEWED'
  | 'GPS UNAVAILABLE'
  | 'OFF SHIFT';

export type GpsSimulationMode = 'INSIDE_HOSPITAL' | 'OUTSIDE_HOSPITAL' | 'GPS_UNAVAILABLE';

export interface UserProfile {
  id: string;
  registerNumber?: string;
  name: string;
  role: UserRole;
  department: string;
  email?: string;
  avatar?: string;
}

export interface Student {
  register_number: string; // Unique Student Identifier
  name: string;
  department: string;
  mentor_id: string;
  mentor_name: string;
  hospital: string;
  shift_id: string;
  shift_name: string;
  shift_time: string; // e.g. "10:00 PM – 06:00 AM"
  is_night_shift: boolean;
  is_active_shift: boolean;
  shift_started_at?: string;
  current_status: VerificationStatus;
  last_verified_at?: string;
  avatar?: string;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  department: string;
  hospital: string;
  assigned_students_count: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hod_name: string;
  total_students: number;
  active_interns: number;
  on_shift: number;
  verified_today: number;
  needs_attention: number;
  gps_unavailable: number;
}

export interface Shift {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  label: string; // e.g. "Night (10:00 PM - 06:00 AM)"
  is_continuous_night: boolean;
}

export interface GpsVerification {
  id: string;
  register_number: string;
  student_name: string;
  department: string;
  timestamp: string; // ISO string
  time_display: string; // e.g. "03:42 AM"
  status: VerificationStatus;
  distance_meters: number;
  accuracy_meters: number;
  latitude: number;
  longitude: number;
  is_inside_geofence: boolean;
  verification_type: 'SHIFT_START' | 'RANDOM_PROMPT' | 'MANUAL' | 'SCHEDULED';
  review_details?: {
    reviewer_name: string;
    reviewed_at: string;
    previous_status: VerificationStatus;
    review_notes: string;
  };
}

export interface DepartmentAlert {
  id: string;
  verification_id: string;
  register_number: string;
  student_name: string;
  department: string;
  mentor_id: string;
  mentor_name: string;
  triggered_at: string;
  time_display: string;
  status: 'NEEDS ATTENTION' | 'REVIEWED';
  distance_meters: number;
  accuracy_meters: number;
  reason: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
}

export interface AdminActivityLog {
  id: string;
  timestamp: string;
  action_type: 'SHIFT_CHANGE' | 'MENTOR_REASSIGN' | 'STUDENT_ADD' | 'STUDENT_DELETE' | 'ALERT_REVIEW';
  student_register_number: string;
  student_name: string;
  details: string;
  reason: string;
  performed_by: string;
}

export interface HospitalGeofence {
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
}
