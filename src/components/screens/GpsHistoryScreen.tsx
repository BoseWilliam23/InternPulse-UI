import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';

export const GpsHistoryScreen: React.FC = () => {
  const {
    verifications,
    students,
    currentUser,
    selectedStudentRegisterNumber,
    setCurrentScreen,
  } = useApp();

  const [filter, setFilter] = useState<string>('ALL');

  const targetReg = selectedStudentRegisterNumber || currentUser?.registerNumber || 'AHS001';
  const student = students.find((s) => s.register_number === targetReg) || students[0];

  const studentVerifications = verifications.filter((v) => v.register_number === student.register_number);

  const filteredLogs = studentVerifications.filter((v) => {
    if (filter === 'VERIFIED') return v.status === 'VERIFIED';
    if (filter === 'NEEDS ATTENTION') return v.status === 'NEEDS ATTENTION';
    if (filter === 'REVIEWED') return v.status === 'REVIEWED';
    return true;
  });

  const totalChecks = studentVerifications.length;
  const verifiedCount = studentVerifications.filter((v) => v.status === 'VERIFIED' || v.status === 'REVIEWED').length;
  const complianceRate = totalChecks > 0 ? Math.round((verifiedCount / totalChecks) * 100) : 100;

  return (
    <div className="bg-background min-h-screen pb-28 font-body-md text-on-surface flex flex-col">
      <Header
        title="GPS Verification History"
        showBack={true}
        onBack={() => {
          if (currentUser?.role === 'STUDENT') setCurrentScreen('student_dashboard');
          else if (currentUser?.role === 'MENTOR') setCurrentScreen('mentor_dashboard');
          else if (currentUser?.role === 'HOD') setCurrentScreen('hod_dashboard');
          else setCurrentScreen('admin_dashboard');
        }}
      />

      <main className="p-3.5 space-y-3.5 flex-1">
        {/* Student Summary Card */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">
                Continuous Shift Telemetry
              </span>
              <h2 className="font-bold text-base text-on-surface truncate">
                {student.name}
              </h2>
              <div className="text-xs text-on-surface-variant">
                Reg: <span className="font-mono font-bold text-primary">{student.register_number}</span> • {student.department}
              </div>
            </div>

            {/* Compliance Gauge */}
            <div className="text-right shrink-0">
              <div className="text-[10px] uppercase font-bold text-on-surface-variant">
                Shift Compliance
              </div>
              <div className="font-mono text-xl font-bold text-primary">
                {complianceRate}%
              </div>
              <div className="text-[10px] text-outline">
                {verifiedCount}/{totalChecks} Verified
              </div>
            </div>
          </div>
        </section>

        {/* Filter Pills */}
        <div className="flex gap-1.5 text-xs overflow-x-auto pb-0.5">
          {['ALL', 'VERIFIED', 'NEEDS ATTENTION', 'REVIEWED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-colors shrink-0 cursor-pointer min-h-[36px] ${
                filter === tab
                  ? 'bg-primary text-on-primary shadow-2xs'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/50'
              }`}
            >
              {tab} (
              {tab === 'ALL'
                ? studentVerifications.length
                : studentVerifications.filter((v) => v.status === tab).length}
              )
            </button>
          ))}
        </div>

        {/* Timeline Log Entries */}
        <section className="space-y-2.5">
          {filteredLogs.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/40 text-on-surface-variant text-xs">
              No logs matching "{filter}".
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isBreach = log.status === 'NEEDS ATTENTION';
              const isReviewed = log.status === 'REVIEWED';

              return (
                <div
                  key={log.id}
                  className={`bg-surface-container-lowest rounded-xl p-3.5 border shadow-2xs transition-all ${
                    isBreach
                      ? 'border-error/50 bg-error-container/5'
                      : isReviewed
                      ? 'border-secondary/40'
                      : 'border-outline-variant/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          isBreach
                            ? 'bg-error text-on-error'
                            : isReviewed
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-tertiary-container text-on-tertiary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isBreach ? 'warning' : isReviewed ? 'fact_check' : 'check'}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                          <span>{log.time_display}</span>
                          <span className="text-[10px] font-mono text-outline font-normal">
                            ({log.verification_type})
                          </span>
                        </div>
                        <div className="text-[11px] text-on-surface-variant font-mono">
                          Dist: <strong className={isBreach ? 'text-error' : 'text-primary'}>{log.distance_meters}m</strong> (Limit ≤150m) • Acc: ±{log.accuracy_meters}m
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                        isBreach
                          ? 'bg-error-container text-error animate-pulse'
                          : isReviewed
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-tertiary-container/15 text-tertiary-container'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>

                  {/* Geofence Breach Note */}
                  {isBreach && (
                    <div className="bg-error-container/20 rounded-lg p-2.5 text-xs text-error border border-error/30 mb-1 flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                        error
                      </span>
                      <div>
                        <strong>Geofence Breach Detected:</strong> Student was 420m from ward center. Automatically logged for clinical supervisor review.
                      </div>
                    </div>
                  )}

                  {/* Supervisor Review Endorsement Note */}
                  {isReviewed && (
                    <div className="bg-secondary-container/20 rounded-lg p-2.5 text-xs text-on-secondary-container border border-secondary/30 text-[11px] space-y-0.5">
                      <div className="font-bold flex items-center gap-1 text-secondary">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Endorsed by {log.review_details?.reviewer_name || 'Dr. Anitha'}
                      </div>
                      <p className="italic text-on-surface-variant">
                        "{log.review_details?.review_notes || 'Dispatched to Blood Bank for emergency cross-match.'}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
};
