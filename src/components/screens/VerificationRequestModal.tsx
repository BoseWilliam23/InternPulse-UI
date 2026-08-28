import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const VerificationRequestModal: React.FC = () => {
  const {
    isVerificationModalOpen,
    dismissVerificationModal,
    performGpsVerification,
    currentUser,
    students,
    setCurrentScreen,
  } = useApp();

  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes window

  useEffect(() => {
    if (!isVerificationModalOpen) {
      setTimeLeft(120);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVerificationModalOpen]);

  if (!isVerificationModalOpen) return null;

  const student =
    students.find((s) => s.register_number === currentUser?.registerNumber) ||
    students[0];

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    dismissVerificationModal();
    const result = await performGpsVerification(undefined, '03:42 AM', 'RANDOM_PROMPT');
    if (result.status === 'NEEDS ATTENTION') {
      setCurrentScreen('verification_result_needs_attention');
    } else {
      setCurrentScreen('verification_result');
    }
  };

  return (
    <div
      id="verification-request-modal"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-surface-container-lowest text-on-surface w-full max-w-sm rounded-3xl border border-primary/40 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Urgent Header */}
        <div className="bg-primary text-on-primary p-4 text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary mx-auto flex items-center justify-center shadow-md mb-2 border border-primary-fixed-dim">
            <span className="material-symbols-outlined text-3xl fill text-primary-fixed animate-pulse">
              radar
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary-fixed-dim block">
            Clinical Safety Protocol
          </span>
          <h3 className="font-display-id text-lg font-bold text-on-primary leading-tight">
            Location Verification Required
          </h3>
          <p className="text-xs text-primary-fixed-dim mt-0.5 font-mono">
            Prompt Time: 03:42 AM (Cross-Midnight)
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 text-center">
          {/* Countdown Clock */}
          <div className="bg-surface-container-low rounded-2xl p-3 border border-outline-variant/40">
            <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
              Remaining Response Window
            </div>
            <div
              className={`font-mono text-3xl font-bold mt-0.5 tracking-tight ${
                timeLeft < 30 ? 'text-error animate-pulse' : 'text-primary'
              }`}
            >
              {formatTimer(timeLeft)}
            </div>
            <div className="text-[10px] text-outline mt-0.5">
              Accreditation geofence compliance requires response within 2 mins
            </div>
          </div>

          {/* Student & Hospital Info */}
          <div className="bg-surface rounded-xl p-3 border border-outline-variant/30 text-left text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Intern:</span>
              <span className="font-bold text-on-surface">{student.name} ({student.register_number})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Assigned Ward:</span>
              <span className="font-semibold text-on-surface">{student.hospital}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Duty Supervisor:</span>
              <span className="font-semibold text-secondary">{student.mentor_name}</span>
            </div>
          </div>

          <p className="text-xs text-on-surface-variant">
            Tap below to capture your encrypted high-precision GPS coordinates against the 150m perimeter.
          </p>

          {/* Primary Action Button */}
          <div className="space-y-2 pt-1">
            <button
              id="btn-confirm-location-verify"
              onClick={handleVerify}
              className="w-full bg-primary text-on-primary rounded-xl py-3.5 font-bold text-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[48px] active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[20px] fill">my_location</span>
              VERIFY LOCATION NOW
            </button>

            <button
              id="btn-dismiss-verify-modal"
              onClick={dismissVerificationModal}
              className="w-full text-xs font-semibold text-on-surface-variant hover:text-on-surface py-2 cursor-pointer transition-colors"
            >
              Dismiss (Testing)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
