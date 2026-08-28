import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { AdminChangeShiftModal } from './AdminChangeShiftModal';
import { AdminChangeMentorModal } from './AdminChangeMentorModal';
import { AdminAddStudentModal } from './AdminAddStudentModal';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    mentors,
    alerts,
    activityLogs,
    setCurrentScreen,
    setSelectedStudent,
    deleteStudent,
  } = useApp();

  const [activeModal, setActiveModal] = useState<'SHIFT' | 'MENTOR' | 'ADD' | null>(null);
  const [targetStudentReg, setTargetStudentReg] = useState<string>('AHS001');

  const handleOpenShiftModal = (regNumber: string) => {
    setTargetStudentReg(regNumber);
    setActiveModal('SHIFT');
  };

  const handleOpenMentorModal = (regNumber: string) => {
    setTargetStudentReg(regNumber);
    setActiveModal('MENTOR');
  };

  const handleDelete = (regNumber: string) => {
    if (confirm(`Are you sure you want to remove student ${regNumber} from the internship roster?`)) {
      deleteStudent(regNumber, 'Administrative removal by coordinator');
    }
  };

  return (
    <div className="bg-background min-h-screen pb-24 font-body-md text-on-surface">
      <Header title="Hospital Administration" />

      <main className="p-container-padding max-w-2xl mx-auto space-y-stack-gap pt-4">
        {/* Hospital Admin Metric Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/50 shadow-xs">
            <div className="text-on-surface-variant text-[10px] uppercase font-bold">
              Total Interns
            </div>
            <div className="font-display-id text-2xl font-bold text-primary mt-1">
              {students.length}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/50 shadow-xs">
            <div className="text-on-surface-variant text-[10px] uppercase font-bold">
              Active on Shift
            </div>
            <div className="font-display-id text-2xl font-bold text-tertiary-container mt-1">
              {students.filter((s) => s.is_active_shift).length}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-xl border border-error/40 shadow-xs">
            <div className="text-error text-[10px] uppercase font-bold">
              Pending Alerts
            </div>
            <div className="font-display-id text-2xl font-bold text-error mt-1">
              {alerts.filter((a) => a.status === 'NEEDS ATTENTION').length}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/50 shadow-xs">
            <div className="text-on-surface-variant text-[10px] uppercase font-bold">
              Mentors
            </div>
            <div className="font-display-id text-2xl font-bold text-secondary mt-1">
              {mentors.length}
            </div>
          </div>
        </section>

        {/* Admin Quick Operations */}
        <section className="bg-surface-container-lowest rounded-xl p-card-padding border border-outline-variant/50 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-headline-md text-sm font-bold text-on-surface">
              Administrative Operations
            </h3>
            <button
              onClick={() => setActiveModal('ADD')}
              className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              Enroll Intern
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleOpenShiftModal('AHS001')}
              className="p-2.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 rounded-lg text-left transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-primary mb-1">
                edit_calendar
              </span>
              <div className="font-bold text-on-surface">Change Shift</div>
              <div className="text-[10px] text-on-surface-variant">Update time & geofence</div>
            </button>

            <button
              onClick={() => handleOpenMentorModal('AHS001')}
              className="p-2.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 rounded-lg text-left transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary mb-1">
                assignment_ind
              </span>
              <div className="font-bold text-on-surface">Reassign Mentor</div>
              <div className="text-[10px] text-on-surface-variant">Switch clinical supervisor</div>
            </button>

            <button
              onClick={() => setCurrentScreen('admin_activity_log')}
              className="p-2.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 rounded-lg text-left transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-tertiary-container mb-1">
                receipt_long
              </span>
              <div className="font-bold text-on-surface">Audit Trail</div>
              <div className="text-[10px] text-on-surface-variant">
                {activityLogs.length} logged actions
              </div>
            </button>
          </div>
        </section>

        {/* Intern Management Roster */}
        <section className="bg-surface-container-lowest rounded-xl p-card-padding border border-outline-variant/50 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-headline-md text-sm font-bold text-on-surface">
                Internship Roster Management
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Click controls to reassign shifts or mentors
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {students.map((stud) => (
              <div
                key={stud.register_number}
                className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/40 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={
                        stud.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={stud.name}
                      className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                    />
                    <div>
                      <div className="font-bold text-sm text-on-surface">{stud.name}</div>
                      <div className="text-xs text-on-surface-variant">
                        Reg: <span className="font-mono font-bold text-primary">{stud.register_number}</span> • {stud.department}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`font-status-badge text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      stud.current_status === 'NEEDS ATTENTION'
                        ? 'bg-error-container text-error'
                        : stud.current_status === 'VERIFIED'
                        ? 'bg-tertiary-container/15 text-tertiary-container'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {stud.current_status}
                  </span>
                </div>

                <div className="bg-surface-container-lowest p-2 rounded-lg text-xs space-y-1 mb-2.5 border border-outline-variant/30">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Current Shift:</span>
                    <span className="font-semibold text-primary">{stud.shift_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Assigned Mentor:</span>
                    <span className="font-semibold text-secondary">{stud.mentor_name}</span>
                  </div>
                </div>

                {/* Operations Toolbar */}
                <div className="flex gap-1.5 text-xs">
                  <button
                    onClick={() => handleOpenShiftModal(stud.register_number)}
                    className="flex-1 py-1.5 px-2 bg-surface-container-highest hover:bg-surface-variant text-on-surface rounded-lg transition-colors font-medium cursor-pointer text-center"
                  >
                    Shift
                  </button>

                  <button
                    onClick={() => handleOpenMentorModal(stud.register_number)}
                    className="flex-1 py-1.5 px-2 bg-surface-container-highest hover:bg-surface-variant text-on-surface rounded-lg transition-colors font-medium cursor-pointer text-center"
                  >
                    Mentor
                  </button>

                  <button
                    onClick={() => {
                      setSelectedStudent(stud.register_number);
                      setCurrentScreen('gps_history');
                    }}
                    className="py-1.5 px-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors font-semibold cursor-pointer"
                  >
                    Logs
                  </button>

                  <button
                    onClick={() => handleDelete(stud.register_number)}
                    aria-label="Delete student"
                    className="py-1.5 px-2 text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Admin Modals */}
      {activeModal === 'SHIFT' && (
        <AdminChangeShiftModal
          studentReg={targetStudentReg}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'MENTOR' && (
        <AdminChangeMentorModal
          studentReg={targetStudentReg}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'ADD' && (
        <AdminAddStudentModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};
