import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';

export const DepartmentAlertsScreen: React.FC = () => {
  const { alerts, setCurrentScreen, setSelectedAlert, setSelectedStudent } = useApp();
  const [filter, setFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'NEEDS ATTENTION') return a.status === 'NEEDS ATTENTION';
    if (filter === 'REVIEWED') return a.status === 'REVIEWED';
    return true;
  });

  const handleInspect = (alertId: string, regNumber: string) => {
    setSelectedAlert(alertId);
    setSelectedStudent(regNumber);
    setCurrentScreen('mentor_review_arun_kumar');
  };

  return (
    <div className="bg-background min-h-screen pb-24 font-body-md text-on-surface">
      <Header
        title="Department Alerts"
        showBack={true}
        onBack={() => setCurrentScreen('hod_dashboard')}
      />

      <main className="p-container-padding max-w-xl mx-auto space-y-stack-gap pt-4">
        {/* Filter Pills */}
        <div className="flex gap-2 text-xs">
          {['ALL', 'NEEDS ATTENTION', 'REVIEWED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40'
              }`}
            >
              {tab} ({tab === 'ALL' ? alerts.length : alerts.filter((a) => a.status === tab).length})
            </button>
          ))}
        </div>

        {/* Alert Cards */}
        <div className="space-y-2.5">
          {filteredAlerts.map((alert) => {
            const isAttention = alert.status === 'NEEDS ATTENTION';

            return (
              <div
                key={alert.id}
                className={`bg-surface-container-lowest rounded-xl p-3.5 border shadow-xs transition-all ${
                  isAttention ? 'border-error/40' : 'border-outline-variant/40'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isAttention ? 'text-error' : 'text-secondary'
                      }`}
                    >
                      {isAttention ? 'warning' : 'verified'}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">
                        {alert.student_name} ({alert.register_number})
                      </h4>
                      <p className="text-[11px] text-on-surface-variant">
                        {alert.department} • Mentor: {alert.mentor_name}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-status-badge text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isAttention
                        ? 'bg-error-container text-error'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>

                <div className="bg-surface-container-low p-2.5 rounded-lg text-xs space-y-1 mb-2.5 border border-outline-variant/30">
                  <div className="text-on-surface font-medium">{alert.reason}</div>
                  <div className="text-[11px] text-on-surface-variant flex justify-between">
                    <span>Triggered: {alert.time_display}</span>
                    <span>Distance: {alert.distance_meters}m</span>
                  </div>
                </div>

                {alert.reviewed_by && (
                  <div className="text-[11px] text-secondary font-medium mb-2.5">
                    ✓ Reviewed by {alert.reviewed_by} ({alert.reviewed_at})
                  </div>
                )}

                <button
                  onClick={() => handleInspect(alert.id, alert.register_number)}
                  className="w-full py-2 bg-surface-container-highest hover:bg-surface-variant text-primary font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  Inspect Audit Trail
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
