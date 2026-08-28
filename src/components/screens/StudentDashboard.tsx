import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    students,
    startShift,
    setCurrentScreen,
    verifications,
    triggerRandomVerificationPrompt,
  } = useApp();

  const student =
    students.find((s) => s.register_number === currentUser?.registerNumber) ||
    students[0];

  const studentVerifications = verifications
    .filter((v) => v.register_number === student.register_number)
    .slice(0, 4);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="bg-tertiary-container/15 text-tertiary-container text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-tertiary-container/30 uppercase flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] fill">check_circle</span>
            VERIFIED
          </span>
        );
      case 'NEEDS ATTENTION':
        return (
          <span className="bg-error-container text-error text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-error/30 uppercase flex items-center gap-1 animate-pulse">
            <span className="material-symbols-outlined text-[13px] fill">warning</span>
            NEEDS ATTENTION
          </span>
        );
      case 'GPS UNAVAILABLE':
        return (
          <span className="bg-surface-variant text-on-surface-variant text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-outline uppercase flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">location_off</span>
            GPS UNAVAILABLE
          </span>
        );
      default:
        return (
          <span className="bg-surface-container text-on-surface-variant text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-outline-variant uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-background min-h-screen pb-28 font-body-md text-on-surface flex flex-col">
      <Header title="Student Portal" />

      <main className="p-3.5 space-y-3.5 flex-1">
        {/* Student Profile Card */}
        <section
          id="student-profile-card"
          className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/50 shadow-xs"
        >
          <div className="flex items-center gap-3">
            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.name}
                className="w-13 h-13 rounded-full object-cover border-2 border-primary-container shadow-xs shrink-0"
              />
            ) : (
              <div className="w-13 h-13 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-base shrink-0">
                {student.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <h2 className="font-bold text-base text-on-surface leading-snug truncate">
                  {student.name}
                </h2>
                <div className="shrink-0">{getStatusBadge(student.current_status)}</div>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                <span className="font-mono font-bold text-primary">
                  {student.register_number}
                </span>
                <span className="text-outline-variant">•</span>
                <span className="text-on-surface-variant truncate">
                  {student.department}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1 flex items-center gap-1 truncate">
                <span className="material-symbols-outlined text-[14px] text-secondary shrink-0">
                  supervisor_account
                </span>
                <span>Mentor: <strong className="text-on-surface font-semibold">{student.mentor_name}</strong></span>
              </p>
            </div>
          </div>
        </section>

        {/* Assigned Shift Protocol Card */}
        <section
          id="today-shift-card"
          className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-xs relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
              Clinical Shift Protocol
            </span>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
              {student.is_night_shift ? 'Night Shift' : 'Day Shift'}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-2xl fill text-primary-fixed">bedtime</span>
            </div>
            <div className="min-w-0">
              <div className="font-bold text-base text-primary truncate">
                {student.shift_time}
              </div>
              <div className="text-xs text-on-surface-variant truncate">
                Hospital: <strong className="text-on-surface font-semibold">{student.hospital}</strong>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/40 mb-3.5 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Geofence Boundary:</span>
              <span className="font-bold text-on-surface">150m Perimeter Center</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Shift Type:</span>
              <span className="font-semibold text-on-surface">Continuous Cross-Midnight Log</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Last Check:</span>
              <span className="font-mono font-bold text-primary">{student.last_verified_at || '10:00 PM'}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2">
            {student.is_active_shift ? (
              <button
                id="btn-view-active-shift"
                onClick={() => setCurrentScreen('active_shift')}
                className="w-full bg-primary text-on-primary rounded-xl py-3 font-bold text-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[48px] active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[20px] fill">radar</span>
                Open Active Shift Monitor
              </button>
            ) : (
              <button
                id="btn-start-shift"
                onClick={() => startShift(student.register_number)}
                className="w-full bg-tertiary-container text-on-tertiary rounded-xl py-3 font-bold text-sm hover:bg-tertiary transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[48px] active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[20px] fill">play_arrow</span>
                Start Shift & Verify GPS (10:00 PM)
              </button>
            )}

            <button
              id="btn-quick-verify-modal"
              onClick={() => triggerRandomVerificationPrompt()}
              className="w-full bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/50 rounded-xl py-2.5 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[18px]">notification_important</span>
              Simulate 03:42 AM Verification Prompt
            </button>
          </div>
        </section>

        {/* Verification History Preview */}
        <section
          id="verification-history-preview"
          className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/50 shadow-xs"
        >
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="font-bold text-sm text-on-surface">
              Recent GPS Checks
            </h3>
            <button
              id="btn-view-all-history"
              onClick={() => setCurrentScreen('gps_history')}
              className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
            >
              Full Log
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="divide-y divide-outline-variant/30">
            {studentVerifications.map((v) => (
              <div key={v.id} className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      v.status === 'VERIFIED'
                        ? 'bg-tertiary-container/15 text-tertiary-container'
                        : v.status === 'NEEDS ATTENTION'
                        ? 'bg-error-container text-error'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {v.status === 'VERIFIED'
                        ? 'check'
                        : v.status === 'NEEDS ATTENTION'
                        ? 'warning'
                        : 'location_off'}
                    </span>
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="text-xs font-bold text-on-surface">{v.time_display}</div>
                    <div className="text-[11px] text-on-surface-variant truncate">
                      Dist: {v.distance_meters}m • Acc: ±{v.accuracy_meters}m
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {getStatusBadge(v.status)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
