import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';

interface VerificationResultScreenProps {
  forceAttention?: boolean;
}

export const VerificationResultScreen: React.FC<VerificationResultScreenProps> = ({
  forceAttention = false,
}) => {
  const {
    currentUser,
    students,
    verifications,
    setCurrentScreen,
    switchRoleQuickly,
    setSelectedAlert,
  } = useApp();

  const student =
    students.find((s) => s.register_number === currentUser?.registerNumber) ||
    students[0];

  const latestVerification = verifications[0];
  const isBreach =
    forceAttention ||
    student.current_status === 'NEEDS ATTENTION' ||
    latestVerification?.status === 'NEEDS ATTENTION';

  const isNoGps =
    !isBreach &&
    (student.current_status === 'GPS UNAVAILABLE' ||
      latestVerification?.status === 'GPS UNAVAILABLE');

  const handleReviewAsMentor = () => {
    setSelectedAlert('alert_arun_01');
    switchRoleQuickly('MENTOR');
    setCurrentScreen('mentor_review_arun_kumar');
  };

  return (
    <div className="bg-background min-h-screen pb-28 font-body-md text-on-surface flex flex-col">
      <Header
        title="Verification Result"
        showBack={true}
        onBack={() => setCurrentScreen('student_dashboard')}
      />

      <main className="p-3.5 space-y-3.5 flex-1">
        {/* Large Result Status Card */}
        <section
          id="verification-result-card"
          className={`rounded-2xl p-5 border shadow-sm text-center ${
            isBreach
              ? 'bg-error-container/20 border-error/50'
              : isNoGps
              ? 'bg-surface-variant/30 border-outline'
              : 'bg-tertiary-container/10 border-tertiary-container/40'
          }`}
        >
          {/* Status Icon */}
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-md mb-3 ${
              isBreach
                ? 'bg-error text-on-error animate-bounce'
                : isNoGps
                ? 'bg-surface-variant text-on-surface'
                : 'bg-tertiary-container text-on-tertiary'
            }`}
          >
            <span className="material-symbols-outlined text-4xl fill">
              {isBreach ? 'warning' : isNoGps ? 'location_off' : 'verified'}
            </span>
          </div>

          <div
            className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full uppercase mb-1.5 ${
              isBreach
                ? 'bg-error text-on-error'
                : isNoGps
                ? 'bg-surface-variant text-on-surface font-mono'
                : 'bg-tertiary-container text-on-tertiary'
            }`}
          >
            {isBreach
              ? 'NEEDS ATTENTION • GEOFENCE BREACH'
              : isNoGps
              ? 'GPS SIGNAL UNAVAILABLE'
              : 'VERIFIED • WITHIN PERIMETER'}
          </div>

          <h2 className="font-display-id text-xl font-bold text-on-surface mt-1">
            {isBreach
              ? 'Location Outside Hospital Perimeter'
              : isNoGps
              ? 'Satellite Signal Timed Out'
              : 'Location Successfully Verified'}
          </h2>

          <p className="text-xs text-on-surface-variant max-w-xs mx-auto mt-1">
            {isBreach
              ? 'GPS fix detected at 420m from hospital perimeter center (threshold ≤150m). Incident alert logged for mentor review.'
              : isNoGps
              ? 'Unable to acquire accurate GPS fix within timeout window.'
              : 'Continuous verification completed at 03:42 AM within the accredited 150m geofence radius.'}
          </p>
        </section>

        {/* Telemetry Breakdown Details */}
        <section
          id="verification-telemetry-breakdown"
          className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-xs space-y-2.5"
        >
          <h3 className="font-bold text-xs uppercase text-on-surface-variant tracking-wider">
            Telemetry Captured
          </h3>

          <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/40 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Timestamp:</span>
              <span className="font-mono font-bold text-on-surface">
                {latestVerification?.time_display || '03:42 AM'} (Cross-Midnight)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Distance Recorded:</span>
              <span
                className={`font-mono font-bold ${
                  isBreach ? 'text-error' : 'text-primary'
                }`}
              >
                {isBreach ? '420 meters' : '28 meters'} (Limit: ≤150m)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Estimated Accuracy:</span>
              <span className="font-mono font-semibold text-secondary">
                ±{latestVerification?.accuracy_meters || 4.2}m
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Coordinates:</span>
              <span className="font-mono text-[11px] text-outline">
                {latestVerification?.latitude?.toFixed(4) || '13.0827'}° N,{' '}
                {latestVerification?.longitude?.toFixed(4) || '80.2707'}° E
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Supervising Mentor:</span>
              <span className="font-semibold text-on-surface">
                {student.mentor_name}
              </span>
            </div>
          </div>
        </section>

        {/* Action CTAs */}
        <section className="space-y-2 pt-1">
          {isBreach ? (
            <button
              id="btn-goto-mentor-review"
              onClick={handleReviewAsMentor}
              className="w-full bg-error text-on-error rounded-xl py-3.5 font-bold text-sm hover:bg-error-container hover:text-on-error-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[48px] active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[20px] fill">fact_check</span>
              Review as Mentor (Dr. Anitha)
            </button>
          ) : (
            <button
              id="btn-return-shift-screen"
              onClick={() => setCurrentScreen('active_shift')}
              className="w-full bg-primary text-on-primary rounded-xl py-3.5 font-bold text-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[48px] active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[20px]">radar</span>
              Return to Active Shift Monitor
            </button>
          )}

          <button
            id="btn-goto-student-dashboard"
            onClick={() => setCurrentScreen('student_dashboard')}
            className="w-full bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/50 rounded-xl py-2.5 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            Back to Student Dashboard
          </button>
        </section>
      </main>
    </div>
  );
};
