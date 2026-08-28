import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';

export const MentorDashboard: React.FC = () => {
  const {
    currentUser,
    students,
    alerts,
    setCurrentScreen,
    setSelectedStudent,
    setSelectedAlert,
  } = useApp();

  const assignedStudents = students.filter(
    (s) => s.mentor_id === currentUser?.id || s.mentor_name?.includes('Anitha')
  );

  const pendingAlerts = alerts.filter(
    (a) =>
      a.status === 'NEEDS ATTENTION' &&
      (a.mentor_name?.includes('Anitha') || a.register_number === 'AHS001')
  );

  const handleReviewIncident = (alertId: string, registerNumber: string) => {
    setSelectedAlert(alertId);
    setSelectedStudent(registerNumber);
    setCurrentScreen('mentor_review_arun_kumar');
  };

  const handleViewStudentLogs = (registerNumber: string) => {
    setSelectedStudent(registerNumber);
    setCurrentScreen('gps_history');
  };

  return (
    <div className="bg-background min-h-screen pb-28 font-body-md text-on-surface flex flex-col">
      <Header title="Mentor Portal" />

      <main className="p-3.5 space-y-3.5 flex-1">
        {/* Mentor Profile Card */}
        <section
          id="mentor-profile-card"
          className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1594824813580-b228b3a0e676?w=150&auto=format&fit=crop&q=80'
              }
              alt="Mentor Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-secondary shadow-xs shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">
                Clinical Supervisor
              </span>
              <h2 className="font-bold text-base text-on-surface truncate">
                {currentUser?.name || 'Dr. Anitha'}
              </h2>
              <p className="text-xs text-on-surface-variant truncate">
                {currentUser?.department || 'Radiology & Clinical Rotations'}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
              Active Interns
            </span>
            <span className="font-mono text-xl font-bold text-primary">
              {assignedStudents.length}
            </span>
          </div>
        </section>

        {/* Urgent Action Banner: Pending Geofence Incidents */}
        {pendingAlerts.length > 0 && (
          <section
            id="pending-alerts-banner"
            className="bg-error-container/20 rounded-2xl p-4 border border-error/50 shadow-xs space-y-3 animate-in fade-in"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-2xl animate-pulse shrink-0">
                  warning
                </span>
                <div>
                  <h3 className="font-bold text-sm text-error">
                    Geofence Alert Requiring Review
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {pendingAlerts.length} incident logged during cross-midnight shift
                  </p>
                </div>
              </div>

              <span className="bg-error text-on-error font-bold text-[10px] px-2 py-0.5 rounded-full uppercase shrink-0">
                ACTION REQUIRED
              </span>
            </div>

            {pendingAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-surface-container-lowest rounded-xl p-3 border border-error/40 space-y-2"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-on-surface">
                    {alert.student_name} ({alert.register_number})
                  </span>
                  <span className="font-mono text-error font-bold">
                    {alert.time_display}
                  </span>
                </div>

                <div className="text-xs text-on-surface-variant bg-surface-container-low p-2 rounded-lg border border-outline-variant/30">
                  <div className="font-semibold text-error">
                    {alert.reason} ({alert.distance_meters}m vs 150m limit)
                  </div>
                  <div className="text-[11px] text-outline mt-0.5">
                    Location: Outside Radiology Block • 2 min response window
                  </div>
                </div>

                <button
                  id="btn-mentor-review-incident"
                  onClick={() => handleReviewIncident(alert.id, alert.register_number)}
                  className="w-full bg-error text-on-error rounded-xl py-2.5 font-bold text-xs hover:bg-error-container hover:text-on-error-container transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs min-h-[44px] active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[18px]">fact_check</span>
                  Review & Endorse Clinical Incident
                </button>
              </div>
            ))}
          </section>
        )}

        {/* Assigned Interns List */}
        <section
          id="assigned-interns-roster"
          className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-xs space-y-3"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-on-surface">
              Supervised Intern Roster
            </h3>
            <span className="text-xs text-on-surface-variant">
              {assignedStudents.filter((s) => s.is_active_shift).length} on shift now
            </span>
          </div>

          <div className="space-y-2.5">
            {assignedStudents.map((stud) => {
              const isAlert = stud.current_status === 'NEEDS ATTENTION';
              const isReviewed = stud.current_status === 'REVIEWED';

              return (
                <div
                  key={stud.register_number}
                  className={`bg-surface-container-low rounded-xl p-3 border transition-all ${
                    isAlert
                      ? 'border-error/40 bg-error-container/5'
                      : 'border-outline-variant/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={
                          stud.avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                        }
                        alt={stud.name}
                        className="w-10 h-10 rounded-full object-cover border border-outline-variant shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-on-surface truncate">
                          {stud.name}
                        </div>
                        <div className="text-[11px] text-on-surface-variant font-mono">
                          {stud.register_number} • {stud.department}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isAlert
                            ? 'bg-error-container text-error animate-pulse'
                            : isReviewed
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-tertiary-container/15 text-tertiary-container'
                        }`}
                      >
                        {stud.current_status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-outline-variant/30 text-xs">
                    <span className="text-[11px] text-on-surface-variant">
                      Shift: {stud.shift_time}
                    </span>

                    <div className="flex items-center gap-2">
                      {isAlert && (
                        <button
                          onClick={() => handleReviewIncident('alert_arun_01', stud.register_number)}
                          className="px-2.5 py-1 bg-error text-on-error rounded-lg font-bold text-[11px] hover:bg-error-container transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      )}
                      <button
                        onClick={() => handleViewStudentLogs(stud.register_number)}
                        className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        GPS Logs →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
