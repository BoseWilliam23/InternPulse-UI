import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';

export const ActiveShiftScreen: React.FC = () => {
  const {
    currentUser,
    students,
    gpsMode,
    performGpsVerification,
    triggerRandomVerificationPrompt,
    endShift,
    setCurrentScreen,
  } = useApp();

  const student =
    students.find((s) => s.register_number === currentUser?.registerNumber) ||
    students[0];

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(20520); // 5 hours 42 minutes into night shift

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsedTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isBreach = gpsMode === 'OUTSIDE_HOSPITAL' || student.current_status === 'NEEDS ATTENTION';
  const isNoGps = gpsMode === 'GPS_UNAVAILABLE' || student.current_status === 'GPS UNAVAILABLE';

  const distance = isBreach ? 420 : isNoGps ? 0 : 28;
  const accuracy = isNoGps ? 0 : 4.2;

  const handleInstantGpsCheck = async () => {
    const result = await performGpsVerification(undefined, undefined, 'MANUAL');
    if (result.status === 'NEEDS ATTENTION') {
      setCurrentScreen('verification_result_needs_attention');
    } else {
      setCurrentScreen('verification_result');
    }
  };

  const handleEndShiftConfirm = () => {
    if (confirm('Are you sure you want to end your clinical night shift and submit the final telemetry log?')) {
      endShift(student.register_number);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-28 font-body-md text-on-surface flex flex-col">
      <Header
        title="Active Shift Monitor"
        showBack={true}
        onBack={() => setCurrentScreen('student_dashboard')}
      />

      <main className="p-3.5 space-y-3.5 flex-1">
        {/* Shift Countdown & Live Status Banner */}
        <section
          id="shift-timer-banner"
          className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-xs"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Shift Active • Geofence Monitoring
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Night Rotation
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div>
              <div className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                Shift Elapsed Time
              </div>
              <div className="font-mono text-2xl font-bold text-on-surface tracking-tight">
                {formatElapsedTime(elapsedSeconds)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                Shift Window
              </div>
              <div className="font-semibold text-xs text-primary">
                {student.shift_time}
              </div>
            </div>
          </div>
        </section>

        {/* Live Hospital Geofence Radar Display */}
        <section
          id="geofence-radar-container"
          className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-xs flex flex-col items-center relative overflow-hidden"
        >
          <div className="w-full flex justify-between items-center mb-2 text-xs">
            <span className="font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary">satellite_alt</span>
              Live Geofence Boundary (150m)
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                isBreach
                  ? 'bg-error-container text-error animate-pulse'
                  : isNoGps
                  ? 'bg-surface-variant text-on-surface'
                  : 'bg-tertiary-container/15 text-tertiary-container'
              }`}
            >
              {isBreach ? 'BREACH (420m)' : isNoGps ? 'NO FIX' : 'WITHIN PERIMETER'}
            </span>
          </div>

          {/* Radar Graphics Visual */}
          <div className="relative w-56 h-56 my-2 flex items-center justify-center">
            {/* Outer Geofence Ring (150m) */}
            <div
              className={`absolute inset-0 rounded-full border-2 border-dashed ${
                isBreach
                  ? 'border-error/60 bg-error-container/10'
                  : 'border-primary/40 bg-primary/5'
              } flex items-center justify-center`}
            >
              {/* Mid Ring */}
              <div className="w-40 h-40 rounded-full border border-outline-variant/40 flex items-center justify-center">
                {/* Inner Ring */}
                <div className="w-24 h-24 rounded-full border border-outline-variant/30 flex items-center justify-center"></div>
              </div>
            </div>

            {/* Radar Sweeping Line */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="w-full h-full border-r border-secondary/40 origin-center animate-spin duration-3000"></div>
            </div>

            {/* Hospital Center Point */}
            <div className="absolute z-10 flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md border border-primary-container">
                <span className="material-symbols-outlined text-[16px] fill">local_hospital</span>
              </div>
              <span className="text-[9px] font-bold text-primary mt-0.5 bg-surface-container-lowest/90 px-1 rounded shadow-2xs">
                Hospital Ward
              </span>
            </div>

            {/* Student Location Point */}
            <div
              className={`absolute z-20 transition-all duration-700 flex flex-col items-center ${
                isBreach
                  ? 'top-2 right-2'
                  : 'top-16 left-20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-white shadow-md border-2 border-surface ${
                  isBreach ? 'bg-error animate-ping' : 'bg-tertiary-container animate-pulse'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div
                className={`text-[9px] font-bold mt-0.5 px-1.5 py-0.5 rounded shadow-2xs ${
                  isBreach
                    ? 'bg-error text-on-error'
                    : 'bg-tertiary-container text-on-tertiary'
                }`}
              >
                {isBreach ? 'Breach: 420m' : 'Arun: 28m'}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-on-surface-variant text-center max-w-xs">
            {isBreach
              ? '⚠️ Current location is 420m outside the accredited 150m boundary. Shift mentor has been notified.'
              : '✓ You are inside the authorized hospital perimeter. Continuous GPS checks active.'}
          </div>
        </section>

        {/* Telemetry Metrics Grid */}
        <section className="grid grid-cols-2 gap-2.5">
          <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
              Distance to Center
            </div>
            <div
              className={`text-xl font-bold font-mono mt-0.5 ${
                isBreach ? 'text-error' : 'text-primary'
              }`}
            >
              {distance}m
            </div>
            <div className="text-[10px] text-outline mt-0.5">Threshold: ≤150m</div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
              GPS Accuracy
            </div>
            <div className="text-xl font-bold font-mono text-secondary mt-0.5">
              {isNoGps ? 'N/A' : `±${accuracy}m`}
            </div>
            <div className="text-[10px] text-outline mt-0.5">High Precision (Dual)</div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
              Clinical Supervisor
            </div>
            <div className="text-xs font-bold text-on-surface mt-1 truncate">
              {student.mentor_name}
            </div>
            <div className="text-[10px] text-secondary font-medium">Duty On-Call</div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
              Random Prompt Window
            </div>
            <div className="text-xs font-bold text-primary font-mono mt-1">
              ~03:42 AM
            </div>
            <div className="text-[10px] text-outline">Response window: 2 mins</div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="space-y-2 pt-1">
          <button
            id="btn-perform-gps-check"
            onClick={handleInstantGpsCheck}
            className="w-full bg-primary text-on-primary rounded-xl py-3 font-bold text-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[48px] active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[20px]">pin_drop</span>
            Perform Instant GPS Check
          </button>

          <button
            id="btn-simulate-prompt"
            onClick={() => triggerRandomVerificationPrompt()}
            className="w-full bg-surface-container-high hover:bg-surface-container-highest text-primary border border-outline-variant/50 rounded-xl py-2.5 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[18px]">alarm</span>
            Simulate 03:42 AM Verification Prompt
          </button>

          <button
            id="btn-end-shift"
            onClick={handleEndShiftConfirm}
            className="w-full text-error bg-error-container/20 hover:bg-error-container/40 border border-error/30 rounded-xl py-2.5 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[18px]">stop_circle</span>
            End Night Shift & Lock Log
          </button>
        </section>
      </main>
    </div>
  );
};
