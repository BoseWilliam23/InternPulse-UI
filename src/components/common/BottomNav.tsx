import React from 'react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentUser, currentScreen, setCurrentScreen, alerts } = useApp();

  if (!currentUser || currentScreen === 'login') return null;

  const role = currentUser.role || 'STUDENT';
  const pendingAlertsCount = alerts.filter((a) => a.status === 'NEEDS ATTENTION').length;

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-outline-variant/50 px-1 py-1 flex items-center justify-around shadow-lg max-w-md mx-auto"
    >
      {role === 'STUDENT' && (
        <>
          <button
            id="nav-student-dashboard"
            onClick={() => setCurrentScreen('student_dashboard')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              currentScreen === 'student_dashboard'
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                currentScreen === 'student_dashboard' ? 'fill' : ''
              }`}
            >
              dashboard
            </span>
            <span className="text-[10px] tracking-tight mt-0.5">Dashboard</span>
          </button>

          <button
            id="nav-student-shift"
            onClick={() => setCurrentScreen('active_shift')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              currentScreen === 'active_shift'
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                currentScreen === 'active_shift' ? 'fill' : ''
              }`}
            >
              radar
            </span>
            <span className="text-[10px] tracking-tight mt-0.5">Active Shift</span>
          </button>

          <button
            id="nav-student-gps-history"
            onClick={() => setCurrentScreen('gps_history')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              currentScreen === 'gps_history'
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                currentScreen === 'gps_history' ? 'fill' : ''
              }`}
            >
              history
            </span>
            <span className="text-[10px] tracking-tight mt-0.5">GPS History</span>
          </button>
        </>
      )}

      {role === 'MENTOR' && (
        <>
          <button
            id="nav-mentor-dashboard"
            onClick={() => setCurrentScreen('mentor_dashboard')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              currentScreen === 'mentor_dashboard'
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                currentScreen === 'mentor_dashboard' ? 'fill' : ''
              }`}
            >
              dashboard
            </span>
            <span className="text-[10px] tracking-tight mt-0.5">Dashboard</span>
          </button>

          <button
            id="nav-mentor-review"
            onClick={() => setCurrentScreen('mentor_review_arun_kumar')}
            className={`flex-1 relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              currentScreen === 'mentor_review_arun_kumar'
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                currentScreen === 'mentor_review_arun_kumar' ? 'fill' : ''
              }`}
            >
              fact_check
            </span>
            <span className="text-[10px] tracking-tight mt-0.5">Review Alert</span>
            {pendingAlertsCount > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 bg-error text-on-error rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {pendingAlertsCount}
              </span>
            )}
          </button>

          <button
            id="nav-mentor-students"
            onClick={() => setCurrentScreen('department_students')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              currentScreen === 'department_students'
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                currentScreen === 'department_students' ? 'fill' : ''
              }`}
            >
              group
            </span>
            <span className="text-[10px] tracking-tight mt-0.5">Interns</span>
          </button>
        </>
      )}

      {role === 'HOD' && (
        <>
          <button
            id="nav-hod-dashboard"
            onClick={() => setCurrentScreen('hod_dashboard')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              currentScreen === 'hod_dashboard'
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                currentScreen === 'hod_dashboard' ? 'fill' : ''
              }`}
            >
              clinical_notes
            </span>
            <span className="text-[10px] tracking-tight mt-0.5">Overview</span>
          </button>

          <button
            id="nav-hod-alerts"
            onClick={() => setCurrentScreen('department_alerts')}
            className={`flex-1 relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              currentScreen === 'department_alerts'
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                currentScreen === 'department_alerts' ? 'fill' : ''
              }`}
            >
              notification_important
            </span>
            <span className="text-[10px] tracking-tight mt-0.5">Alerts</span>
            {pendingAlertsCount > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 bg-error text-on-error rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {pendingAlertsCount}
              </span>
            )}
          </button>

          <button
            id="nav-hod-analytics"
            onClick={() => setCurrentScreen('hod_analytics_dashboard')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              currentScreen === 'hod_analytics_dashboard'
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                currentScreen === 'hod_analytics_dashboard' ? 'fill' : ''
              }`}
            >
              analytics
            </span>
            <span className="text-[10px] tracking-tight mt-0.5">Analytics</span>
          </button>
        </>
      )}

      {role === 'ADMIN' && (
        <>
          <button
            id="nav-admin-dashboard"
            onClick={() => setCurrentScreen('admin_dashboard')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              currentScreen === 'admin_dashboard'
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                currentScreen === 'admin_dashboard' ? 'fill' : ''
              }`}
            >
              admin_panel_settings
            </span>
            <span className="text-[10px] tracking-tight mt-0.5">Roster</span>
          </button>

          <button
            id="nav-admin-shift"
            onClick={() => setCurrentScreen('admin_change_shift')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              currentScreen === 'admin_change_shift'
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                currentScreen === 'admin_change_shift' ? 'fill' : ''
              }`}
            >
              edit_calendar
            </span>
            <span className="text-[10px] tracking-tight mt-0.5">Shifts</span>
          </button>

          <button
            id="nav-admin-mentor"
            onClick={() => setCurrentScreen('admin_change_mentor')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              currentScreen === 'admin_change_mentor'
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                currentScreen === 'admin_change_mentor' ? 'fill' : ''
              }`}
            >
              assignment_ind
            </span>
            <span className="text-[10px] tracking-tight mt-0.5">Mentors</span>
          </button>

          <button
            id="nav-admin-logs"
            onClick={() => setCurrentScreen('admin_activity_log')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              currentScreen === 'admin_activity_log'
                ? 'text-primary font-bold bg-primary/10'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                currentScreen === 'admin_activity_log' ? 'fill' : ''
              }`}
            >
              receipt_long
            </span>
            <span className="text-[10px] tracking-tight mt-0.5">Audit Log</span>
          </button>
        </>
      )}
    </nav>
  );
};
