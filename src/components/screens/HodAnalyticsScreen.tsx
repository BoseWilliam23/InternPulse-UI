import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';

export const HodAnalyticsScreen: React.FC = () => {
  const { departments, setCurrentScreen } = useApp();

  return (
    <div className="bg-background min-h-screen pb-24 font-body-md text-on-surface">
      <Header
        title="Departmental Analytics"
        showBack={true}
        onBack={() => setCurrentScreen('hod_dashboard')}
      />

      <main className="p-container-padding max-w-xl mx-auto space-y-stack-gap pt-4">
        {/* Compliance Rate Card */}
        <section className="bg-surface-container-lowest rounded-xl p-card-padding border border-outline-variant/50 shadow-xs text-center">
          <div className="text-xs uppercase font-bold text-secondary tracking-wider mb-1">
            Overall Hospital Geofence Compliance
          </div>
          <div className="font-display-id text-4xl font-bold text-primary mb-1">
            94.8%
          </div>
          <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
            Calculated across all Allied Health Science student shifts within 150m perimeter.
          </p>

          <div className="mt-4 pt-3 border-t border-outline-variant/30 grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-outline uppercase font-bold block">On-Time Starts</span>
              <span className="font-bold text-sm text-on-surface">98.2%</span>
            </div>
            <div>
              <span className="text-[10px] text-outline uppercase font-bold block">Prompt Response</span>
              <span className="font-bold text-sm text-primary">1m 42s</span>
            </div>
            <div>
              <span className="text-[10px] text-outline uppercase font-bold block">Review Time</span>
              <span className="font-bold text-sm text-secondary">&lt; 15 mins</span>
            </div>
          </div>
        </section>

        {/* Breakdown by Department */}
        <section className="bg-surface-container-lowest rounded-xl p-card-padding border border-outline-variant/50 shadow-xs">
          <h3 className="font-headline-md text-sm font-bold text-on-surface mb-3">
            Department Performance Breakdown
          </h3>

          <div className="space-y-3">
            {departments.map((dept) => {
              const compliance = Math.round(
                ((dept.verified_today) / (dept.verified_today + dept.needs_attention)) * 100
              );

              return (
                <div key={dept.id} className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-bold text-on-surface">{dept.name}</span>
                    <span className="font-bold text-primary">{compliance}% Compliance</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-outline-variant/30 rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${compliance}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-on-surface-variant">
                    <span>Verified: {dept.verified_today}</span>
                    <span>Breaches: {dept.needs_attention}</span>
                    <span>Total Interns: {dept.total_students}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Export Report Action */}
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 text-center">
          <span className="material-symbols-outlined text-3xl text-secondary mb-1">
            description
          </span>
          <h4 className="font-bold text-sm text-on-surface">Weekly Attendance Dossier</h4>
          <p className="text-xs text-on-surface-variant mt-0.5 mb-3">
            Official accredited audit report for Clinical Deans and Accreditation Councils.
          </p>
          <button
            onClick={() => alert('Exporting signed PDF audit report with encrypted geofence telemetry...')}
            className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer shadow-xs"
          >
            Download Accredited Audit PDF
          </button>
        </div>
      </main>
    </div>
  );
};
