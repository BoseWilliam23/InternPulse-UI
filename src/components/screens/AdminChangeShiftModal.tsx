import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface Props {
  studentReg: string;
  onClose: () => void;
}

export const AdminChangeShiftModal: React.FC<Props> = ({ studentReg, onClose }) => {
  const { students, shifts, changeStudentShift } = useApp();

  const student = students.find((s) => s.register_number === studentReg) || students[0];
  const [selectedShiftId, setSelectedShiftId] = useState<string>(student.shift_id || 'shift_night');
  const [reason, setReason] = useState<string>(
    'Departmental rotation schedule adjustment for clinical radiology block.'
  );
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Reason for change is required for administrative audit logs.');
      return;
    }

    changeStudentShift(student.register_number, selectedShiftId, reason);
    onClose();
  };

  return (
    <div
      id="change-shift-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/60">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
            </div>
            <h3 className="font-headline-md text-base font-bold text-on-surface">
              Change Assigned Shift
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-on-surface-variant hover:text-on-surface p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-error-container text-error text-xs rounded-lg font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-label-caps text-on-surface-variant mb-1 uppercase font-bold text-[10px]">
              Student
            </label>
            <div className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/40 font-bold text-on-surface">
              {student.name} ({student.register_number}) • {student.department}
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-on-surface-variant mb-1 uppercase font-bold text-[10px]">
              Select New Shift Timing
            </label>
            <div className="space-y-1.5">
              {shifts.map((sh) => (
                <label
                  key={sh.id}
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    selectedShiftId === sh.id
                      ? 'bg-primary/10 border-primary text-primary font-bold'
                      : 'bg-surface border-outline-variant/40 text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shiftOption"
                      value={sh.id}
                      checked={selectedShiftId === sh.id}
                      onChange={() => setSelectedShiftId(sh.id)}
                      className="accent-primary"
                    />
                    <span>{sh.label}</span>
                  </div>
                  {sh.is_continuous_night && (
                    <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">
                      Night
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-on-surface-variant mb-1 uppercase font-bold text-[10px]">
              Reason for Shift Change (Mandatory for Audit)
            </label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State institutional rotation reason..."
              className="w-full p-2.5 bg-surface border border-outline-variant rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="space-y-2 pt-2">
            <button
              id="btn-confirm-shift-change"
              type="submit"
              className="w-full bg-primary text-on-primary rounded-xl py-3 font-headline-md text-sm hover:bg-primary-container transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[48px]"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              Update Shift & Log Audit Entry
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
