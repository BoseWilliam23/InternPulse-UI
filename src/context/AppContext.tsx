import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Mentor,
  Department,
  Shift,
  GpsVerification,
  DepartmentAlert,
  AdminActivityLog,
  UserProfile,
  GpsSimulationMode,
  UserRole,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_MENTORS,
  INITIAL_DEPARTMENTS,
  INITIAL_SHIFTS,
  INITIAL_VERIFICATIONS,
  INITIAL_ALERTS,
  INITIAL_LOGS,
  DEMO_USERS,
} from '../services/mockData';
import { MockGpsService } from '../services/mockGpsService';

interface AppContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole | null;
  students: Student[];
  mentors: Mentor[];
  departments: Department[];
  shifts: Shift[];
  verifications: GpsVerification[];
  alerts: DepartmentAlert[];
  activityLogs: AdminActivityLog[];
  gpsMode: GpsSimulationMode;
  currentScreen: string;
  selectedStudentRegisterNumber: string | null;
  selectedAlertId: string | null;
  isVerificationModalOpen: boolean;
  isVerifying: boolean;
  lastVerification: GpsVerification | null;
  pendingRandomRequest: boolean;

  // Actions
  login: (id: string, password?: string) => boolean;
  logout: () => void;
  switchRoleQuickly: (role: UserRole) => void;
  setCurrentScreen: (screen: string) => void;
  setSelectedStudent: (regNumber: string | null) => void;
  setSelectedAlert: (alertId: string | null) => void;
  setGpsMode: (mode: GpsSimulationMode) => void;
  
  // Student Actions
  startShift: (regNumber: string) => Promise<GpsVerification>;
  endShift: (regNumber: string) => void;
  performGpsVerification: (forcedMode?: GpsSimulationMode, customTime?: string, type?: GpsVerification['verification_type']) => Promise<GpsVerification>;
  triggerRandomVerificationPrompt: (customTime?: string) => void;
  dismissVerificationModal: () => void;

  // Mentor Actions
  markAlertAsReviewed: (alertId: string, notes: string) => void;

  // Admin Actions
  changeStudentShift: (regNumber: string, newShiftId: string, reason: string) => void;
  changeStudentMentor: (regNumber: string, newMentorId: string, reason: string) => void;
  addStudent: (student: Omit<Student, 'is_active_shift' | 'current_status'>, reason: string) => void;
  deleteStudent: (regNumber: string, reason: string) => void;
  
  // Demo helper
  runDemonstrationStep: (step: 'NIGHT_START' | 'RANDOM_0342_ALERT' | 'REVIEW_ALERT' | 'NORMAL_VERIFIED') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [students, setStudents] = useState<Student[]>(() => INITIAL_STUDENTS);
  const [mentors, setMentors] = useState<Mentor[]>(() => INITIAL_MENTORS);
  const [departments, setDepartments] = useState<Department[]>(() => INITIAL_DEPARTMENTS);
  const [shifts] = useState<Shift[]>(() => INITIAL_SHIFTS);
  const [verifications, setVerifications] = useState<GpsVerification[]>(() => INITIAL_VERIFICATIONS);
  const [alerts, setAlerts] = useState<DepartmentAlert[]>(() => INITIAL_ALERTS);
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>(() => INITIAL_LOGS);
  
  const [gpsMode, setGpsModeState] = useState<GpsSimulationMode>('INSIDE_HOSPITAL');
  const [currentScreen, setCurrentScreen] = useState<string>('login');
  const [selectedStudentRegisterNumber, setSelectedStudent] = useState<string | null>('AHS001');
  const [selectedAlertId, setSelectedAlert] = useState<string | null>('alert_arun_01');
  
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [lastVerification, setLastVerification] = useState<GpsVerification | null>(null);
  const [pendingRandomRequest, setPendingRandomRequest] = useState<boolean>(false);

  const setGpsMode = (mode: GpsSimulationMode) => {
    setGpsModeState(mode);
    MockGpsService.setSimulationMode(mode);
  };

  const login = (identifier: string, _password?: string): boolean => {
    const trimmed = identifier.trim();
    // Check known demo accounts
    if (DEMO_USERS[trimmed]) {
      const user = DEMO_USERS[trimmed];
      setCurrentUser(user);
      if (user.role === 'STUDENT') {
        setCurrentScreen('student_dashboard');
        setSelectedStudent(user.registerNumber || 'AHS001');
      } else if (user.role === 'MENTOR') {
        setCurrentScreen('mentor_dashboard');
      } else if (user.role === 'HOD') {
        setCurrentScreen('hod_dashboard');
      } else if (user.role === 'ADMIN') {
        setCurrentScreen('admin_dashboard');
      }
      return true;
    }

    // Check student by register number
    const foundStudent = students.find((s) => s.register_number.toLowerCase() === trimmed.toLowerCase());
    if (foundStudent) {
      const studentUser: UserProfile = {
        id: foundStudent.register_number,
        registerNumber: foundStudent.register_number,
        name: foundStudent.name,
        role: 'STUDENT',
        department: foundStudent.department,
        avatar: foundStudent.avatar,
      };
      setCurrentUser(studentUser);
      setSelectedStudent(foundStudent.register_number);
      setCurrentScreen('student_dashboard');
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const switchRoleQuickly = (role: UserRole) => {
    if (role === 'STUDENT') {
      setCurrentUser(DEMO_USERS['AHS001']);
      setSelectedStudent('AHS001');
      setCurrentScreen('student_dashboard');
    } else if (role === 'MENTOR') {
      setCurrentUser(DEMO_USERS['mentor01']);
      setCurrentScreen('mentor_dashboard');
    } else if (role === 'HOD') {
      setCurrentUser(DEMO_USERS['hod01']);
      setCurrentScreen('hod_dashboard');
    } else if (role === 'ADMIN') {
      setCurrentUser(DEMO_USERS['admin01']);
      setCurrentScreen('admin_dashboard');
    }
  };

  // Perform a simulated GPS check
  const performGpsVerification = async (
    forcedMode?: GpsSimulationMode,
    customTime?: string,
    verificationType: GpsVerification['verification_type'] = 'MANUAL'
  ): Promise<GpsVerification> => {
    setIsVerifying(true);
    
    // Slight simulated delay for scanning clinical GPS
    await new Promise((resolve) => setTimeout(resolve, 800));

    const targetReg = currentUser?.registerNumber || selectedStudentRegisterNumber || 'AHS001';
    const targetStudent = students.find((s) => s.register_number === targetReg) || students[0];

    const result = MockGpsService.performGpsCheck(targetStudent, forcedMode || gpsMode, customTime, verificationType);

    // Update verifications log
    setVerifications((prev) => [result, ...prev]);
    setLastVerification(result);

    // Update student status
    setStudents((prev) =>
      prev.map((s) => {
        if (s.register_number === targetStudent.register_number) {
          return {
            ...s,
            current_status: result.status,
            last_verified_at: result.time_display,
            is_active_shift: true,
          };
        }
        return s;
      })
    );

    // If outside geofence (NEEDS ATTENTION), automatically push an alert to mentor/HOD/admin
    if (result.status === 'NEEDS ATTENTION') {
      const newAlert: DepartmentAlert = {
        id: `alert_${Date.now()}`,
        verification_id: result.id,
        register_number: targetStudent.register_number,
        student_name: targetStudent.name,
        department: targetStudent.department,
        mentor_id: targetStudent.mentor_id,
        mentor_name: targetStudent.mentor_name,
        triggered_at: result.timestamp,
        time_display: result.time_display,
        status: 'NEEDS ATTENTION',
        distance_meters: result.distance_meters,
        accuracy_meters: result.accuracy_meters,
        reason: `Geofence Breach: ${result.distance_meters}m outside hospital perimeter during active night shift.`,
      };
      setAlerts((prev) => [newAlert, ...prev]);
      setSelectedAlert(newAlert.id);
    }

    setIsVerifying(false);
    setPendingRandomRequest(false);
    return result;
  };

  const startShift = async (regNumber: string): Promise<GpsVerification> => {
    const student = students.find((s) => s.register_number === regNumber) || students[0];
    const result = await performGpsVerification('INSIDE_HOSPITAL', '10:00 PM', 'SHIFT_START');
    
    setStudents((prev) =>
      prev.map((s) =>
        s.register_number === student.register_number
          ? { ...s, is_active_shift: true, shift_started_at: new Date().toISOString(), current_status: 'VERIFIED' }
          : s
      )
    );

    setCurrentScreen('active_shift');
    return result;
  };

  const endShift = (regNumber: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.register_number === regNumber
          ? { ...s, is_active_shift: false, current_status: 'OFF SHIFT' }
          : s
      )
    );
  };

  const triggerRandomVerificationPrompt = (customTime = '03:42 AM') => {
    setPendingRandomRequest(true);
    setIsVerificationModalOpen(true);
  };

  const dismissVerificationModal = () => {
    setIsVerificationModalOpen(false);
  };

  const markAlertAsReviewed = (alertId: string, notes: string) => {
    const reviewer = currentUser?.name || 'Dr. Anitha (Clinical Supervisor)';
    const nowIso = new Date().toISOString();
    const timeStr = MockGpsService.getCurrentTimeString();

    // 1. Update Alert item
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          return {
            ...a,
            status: 'REVIEWED',
            reviewed_by: reviewer,
            reviewed_at: `${timeStr} (Today)`,
            review_notes: notes || 'Location verified with ward supervisor on night duty.',
          };
        }
        return a;
      })
    );

    // 2. Find associated verification and update
    const targetAlert = alerts.find((a) => a.id === alertId);
    if (targetAlert) {
      setVerifications((prev) =>
        prev.map((v) => {
          if (v.id === targetAlert.verification_id || (v.register_number === targetAlert.register_number && v.time_display === targetAlert.time_display)) {
            return {
              ...v,
              status: 'REVIEWED',
              review_details: {
                reviewer_name: reviewer,
                reviewed_at: timeStr,
                previous_status: 'NEEDS ATTENTION',
                review_notes: notes || 'Location verified with ward supervisor.',
              },
            };
          }
          return v;
        })
      );

      // 3. Update student status to REVIEWED or VERIFIED
      setStudents((prev) =>
        prev.map((s) => {
          if (s.register_number === targetAlert.register_number) {
            return {
              ...s,
              current_status: 'REVIEWED',
            };
          }
          return s;
        })
      );

      // 4. Log in admin activity
      const newLog: AdminActivityLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        action_type: 'ALERT_REVIEW',
        student_register_number: targetAlert.register_number,
        student_name: targetAlert.student_name,
        details: `Alert marked as REVIEWED by ${reviewer}`,
        reason: notes || 'Supervisor manual verification',
        performed_by: reviewer,
      };
      setActivityLogs((prev) => [newLog, ...prev]);
    }
  };

  const changeStudentShift = (regNumber: string, newShiftId: string, reason: string) => {
    const selectedShift = shifts.find((sh) => sh.id === newShiftId);
    if (!selectedShift) return;

    const student = students.find((s) => s.register_number === regNumber);
    if (!student) return;

    const oldShiftLabel = student.shift_time;

    setStudents((prev) =>
      prev.map((s) => {
        if (s.register_number === regNumber) {
          return {
            ...s,
            shift_id: selectedShift.id,
            shift_name: selectedShift.name,
            shift_time: selectedShift.label,
            is_night_shift: selectedShift.is_continuous_night,
          };
        }
        return s;
      })
    );

    const newLog: AdminActivityLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action_type: 'SHIFT_CHANGE',
      student_register_number: regNumber,
      student_name: student.name,
      details: `Shift changed from "${oldShiftLabel}" to "${selectedShift.label}"`,
      reason: reason || 'Rotational department scheduling requirement',
      performed_by: currentUser?.name || 'Admin Operations',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const changeStudentMentor = (regNumber: string, newMentorId: string, reason: string) => {
    const targetMentor = mentors.find((m) => m.id === newMentorId);
    if (!targetMentor) return;

    const student = students.find((s) => s.register_number === regNumber);
    if (!student) return;

    const oldMentorName = student.mentor_name;

    setStudents((prev) =>
      prev.map((s) => {
        if (s.register_number === regNumber) {
          return {
            ...s,
            mentor_id: targetMentor.id,
            mentor_name: targetMentor.name,
          };
        }
        return s;
      })
    );

    const newLog: AdminActivityLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action_type: 'MENTOR_REASSIGN',
      student_register_number: regNumber,
      student_name: student.name,
      details: `Mentor reassigned from ${oldMentorName} to ${targetMentor.name}`,
      reason: reason || 'Supervision balancing across clinical wards',
      performed_by: currentUser?.name || 'Admin Operations',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const addStudent = (newStudent: Omit<Student, 'is_active_shift' | 'current_status'>, reason: string) => {
    const studentWithDefaults: Student = {
      ...newStudent,
      is_active_shift: false,
      current_status: 'OFF SHIFT',
      avatar: newStudent.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };

    setStudents((prev) => [...prev, studentWithDefaults]);

    const newLog: AdminActivityLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action_type: 'STUDENT_ADD',
      student_register_number: newStudent.register_number,
      student_name: newStudent.name,
      details: `Enrolled new student in ${newStudent.department} under ${newStudent.mentor_name}`,
      reason: reason || 'New internship cohort intake',
      performed_by: currentUser?.name || 'Admin Operations',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const deleteStudent = (regNumber: string, reason: string) => {
    const student = students.find((s) => s.register_number === regNumber);
    if (!student) return;

    setStudents((prev) => prev.filter((s) => s.register_number !== regNumber));

    const newLog: AdminActivityLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action_type: 'STUDENT_DELETE',
      student_register_number: regNumber,
      student_name: student.name,
      details: `Removed student registration record`,
      reason: reason || 'Internship completion or withdrawal',
      performed_by: currentUser?.name || 'Admin Operations',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const runDemonstrationStep = async (step: 'NIGHT_START' | 'RANDOM_0342_ALERT' | 'REVIEW_ALERT' | 'NORMAL_VERIFIED') => {
    if (step === 'NIGHT_START') {
      switchRoleQuickly('STUDENT');
      setGpsMode('INSIDE_HOSPITAL');
      await startShift('AHS001');
    } else if (step === 'RANDOM_0342_ALERT') {
      setGpsMode('OUTSIDE_HOSPITAL');
      triggerRandomVerificationPrompt('03:42 AM');
    } else if (step === 'REVIEW_ALERT') {
      switchRoleQuickly('MENTOR');
      setSelectedAlert('alert_arun_01');
      setCurrentScreen('mentor_review_arun_kumar');
    } else if (step === 'NORMAL_VERIFIED') {
      setGpsMode('INSIDE_HOSPITAL');
      await performGpsVerification('INSIDE_HOSPITAL', undefined, 'MANUAL');
      setCurrentScreen('verification_result');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        students,
        mentors,
        departments,
        shifts,
        verifications,
        alerts,
        activityLogs,
        gpsMode,
        currentScreen,
        selectedStudentRegisterNumber,
        selectedAlertId,
        isVerificationModalOpen,
        isVerifying,
        lastVerification,
        pendingRandomRequest,
        login,
        logout,
        switchRoleQuickly,
        setCurrentScreen,
        setSelectedStudent,
        setSelectedAlert,
        setGpsMode,
        startShift,
        endShift,
        performGpsVerification,
        triggerRandomVerificationPrompt,
        dismissVerificationModal,
        markAlertAsReviewed,
        changeStudentShift,
        changeStudentMentor,
        addStudent,
        deleteStudent,
        runDemonstrationStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
