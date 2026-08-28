import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';

export const AdminActivityLogScreen: React.FC = () => {
  const { activityLogs, setCurrentScreen } = useApp();

  return (
    <div className="bg-background min-h-screen pb-24 font-body-md text-on-surface">
      <Header
        title="Administrative Audit Logs"
        showBack={true}
        onBack={() => setCurrentScreen('admin_dashboard')}
      />

      <main className="p-container-padding max-w-xl mx-auto space-y-stack-gap pt-4">
        <section className="bg-surface-container-lowest rounded-xl p-card-padding border border-outline-variant/50 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-headline-md text-sm font-bold text-on-surface">
                Hospital System Audit Trail
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Immutable chronological log of shift changes, supervisor reassignments, and alert reviews.
              </p>
            </div>
            <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full font-mono">
              {activityLogs.length} Records
            </span>
          </div>

          <div className="space-y-2.5">
            {activityLogs.map((log) => {
              const isShift = log.action_type === 'SHIFT_CHANGE';
              const isMentor = log.action_type === 'MENTOR_REASSIGN';
              const isReview = log.action_type === 'ALERT_REVIEW';
              const isAdd = log.action_type === 'STUDENT_ADD';

              return (
                <div
                  key={log.id}
                  className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/30 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-outline uppercase bg-surface px-1.5 py-0.5 rounded border border-outline-variant/30">
                      {log.action_type}
                    </span>
                    <span className="font-mono text-[11px] text-on-surface-variant">
                      {log.timestamp}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-on-surface pt-1">
                    {log.student_name} ({log.student_register_number})
                  </div>

                  <div className="text-on-surface text-xs font-medium">
                    {log.details}
                  </div>

                  <div className="bg-surface-container-lowest p-2 rounded text-[11px] text-on-surface-variant border border-outline-variant/20">
                    <span className="font-semibold text-outline">Reason: </span>
                    <span>{log.reason}</span>
                  </div>

                  <div className="text-[10px] text-outline text-right pt-0.5">
                    Authorized by: <span className="font-semibold text-on-surface">{log.performed_by}</span>
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
