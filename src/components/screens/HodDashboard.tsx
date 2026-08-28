import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';

export const HodDashboard: React.FC = () => {
  const {
    currentUser,
    departments,
    students,
    alerts,
    setCurrentScreen,
    setSelectedStudent,
  } = useApp();

  const totalInterns = students.length;
  const onShift = students.filter((s) => s.is_active_shift).length;
  const needsAttentionCount = alerts.filter((a) => a.status === 'NEEDS ATTENTION').length;
  const reviewedCount = alerts.filter((a) => a.status === 'REVIEWED').length;

  return (
    <div className="bg-background min-h-screen pb-24 font-body-md text-on-surface">
      <Header title="Department Head Oversight" />

      <main className="p-container-padding max-w-xl mx-auto space-y-stack-gap pt-4">
        {/* HOD Profile Card */}
        <section className="bg-surface-container-lowest rounded-xl p-card-padding border border-outline-variant/50 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
              }
              alt="HOD Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-xs"
            />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                Head of Department
              </span>
              <h2 className="font-headline-lg text-base font-bold text-on-surface leading-tight">
                {currentUser?.name || 'Dr. Sarah Mitchell'}
              </h2>
              <p className="text-xs text-on-surface-variant">
                Allied Health Sciences • Radiology & Clinical Rotations
              </p>
            </div>
          </div>
        </section>

        {/* Executive Department Metrics Bento Grid */}
        <section className="grid grid-cols-2 gap-2.5">
          <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/50 shadow-xs">
            <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
              <span>Active on Shift</span>
              <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
            </div>
            <div className="font-display-id text-2xl font-bold text-primary mt-1">
              {onShift} <span className="text-xs text-on-surface-variant font-normal">/ {totalInterns}</span>
            </div>
            <div className="text-[10px] text-on-surface-variant mt-1">
              Night Shift Rotation
            </div>
          </div>

          <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-error/40 shadow-xs">
            <div className="flex items-center justify-between text-error text-[11px] font-bold uppercase tracking-wider">
              <span>Pending Alerts</span>
              <span className="material-symbols-outlined text-[16px]">warning</span>
            </div>
            <div className="font-display-id text-2xl font-bold text-error mt-1">
              {needsAttentionCount}
            </div>
            <div className="text-[10px] text-on-surface-variant mt-1">
              {reviewedCount} Resolved today
            </div>
          </div>
        </section>

        {/* Department Overview Cards */}
        <section className="bg-surface-container-lowest rounded-xl p-card-padding border border-outline-variant/50 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-headline-md text-sm font-bold text-on-surface">
              Department Cohort Performance
            </h3>
            <button
              onClick={() => setCurrentScreen('hod_analytics_dashboard')}
              className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
            >
              Analytics
              <span className="material-symbols-outlined text-[15px]">chevron_right</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-on-surface text-sm leading-tight">
                    {dept.name}
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    HOD: {dept.hod_name} • Code: {dept.code}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="font-bold text-primary">{dept.on_shift} On Shift</div>
                    <div className="text-[10px] text-on-surface-variant">
                      {dept.active_interns} Active Interns
                    </div>
                  </div>
                  {dept.needs_attention > 0 ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Department Alert Stream */}
        <section className="bg-surface-container-lowest rounded-xl p-card-padding border border-outline-variant/50 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-headline-md text-sm font-bold text-on-surface">
              Department Alert Stream
            </h3>
            <button
              onClick={() => setCurrentScreen('department_alerts')}
              className="text-xs text-primary font-bold hover:underline cursor-pointer"
            >
              View All ({alerts.length})
            </button>
          </div>

          <div className="space-y-2">
            {alerts.slice(0, 3).map((a) => {
              const isNeedsAtt = a.status === 'NEEDS ATTENTION';

              return (
                <div
                  key={a.id}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    isNeedsAtt
                      ? 'bg-error-container/20 border-error/40'
                      : 'bg-surface-container-low border-outline-variant/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        isNeedsAtt ? 'text-error' : 'text-secondary'
                      }`}
                    >
                      {isNeedsAtt ? 'warning' : 'fact_check'}
                    </span>
                    <div>
                      <div className="font-bold text-on-surface">
                        {a.student_name} ({a.register_number})
                      </div>
                      <div className="text-[11px] text-on-surface-variant">
                        {a.department} • {a.time_display}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-status-badge text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isNeedsAtt
                          ? 'bg-error-container text-error'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      {a.status}
                    </span>
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
