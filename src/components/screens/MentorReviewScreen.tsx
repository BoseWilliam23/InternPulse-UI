import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';

export const MentorReviewScreen: React.FC = () => {
  const {
    currentUser,
    selectedAlertId,
    alerts,
    students,
    markAlertAsReviewed,
    setCurrentScreen,
  } = useApp();

  const alert =
    alerts.find((a) => a.id === selectedAlertId) ||
    alerts.find((a) => a.status === 'NEEDS ATTENTION') ||
    alerts[0];

  const student =
    students.find((s) => s.register_number === alert?.register_number) ||
    students[0];

  const [predefinedReason, setPredefinedReason] = useState<string>(
    'Emergency Clinical Dispatch to Blood Bank for Cross-Match'
  );
  const [customNotes, setCustomNotes] = useState<string>(
    'Student was instructed by Senior Resident on-duty to fetch emergency blood units for emergency trauma OT. Geofence excursion is justified and accredited.'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  const isAlreadyReviewed = alert?.status === 'REVIEWED';

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const fullNotes = `[${predefinedReason}] ${customNotes}`;
      markAlertAsReviewed(alert.id, fullNotes);
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        setCurrentScreen('mentor_dashboard');
      }, 1200);
    }, 500);
  };

  return (
    <div className="bg-background min-h-screen pb-28 font-body-md text-on-surface flex flex-col">
      <Header
        title="Incident Audit Review"
        showBack={true}
        onBack={() => setCurrentScreen('mentor_dashboard')}
      />

      <main className="p-3.5 space-y-3.5 flex-1">
        {/* Success Toast */}
        {showSuccessToast && (
          <div className="bg-secondary-container text-on-secondary-container p-3 rounded-xl border border-secondary font-bold text-xs flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-[20px] text-secondary fill">
              check_circle
            </span>
            <span>Incident reviewed and signed successfully! Redirecting...</span>
          </div>
        )}

        {/* Incident Summary Card */}
        <section
          id="incident-dossier-card"
          className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-xs space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-error tracking-wider block">
                Geofence Perimeter Incident
              </span>
              <h2 className="font-bold text-base text-on-surface">
                {alert.student_name} ({alert.register_number})
              </h2>
              <p className="text-xs text-on-surface-variant">
                {alert.department} • Night Shift Rotation
              </p>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                isAlreadyReviewed
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-error-container text-error animate-pulse'
              }`}
            >
              {alert.status}
            </span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/30 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Timestamp:</span>
              <span className="font-mono font-bold text-on-surface">
                {alert.time_display} (Continuous Prompt)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Breach Distance:</span>
              <span className="font-mono font-bold text-error">
                {alert.distance_meters} meters (Perimeter Limit: 150m)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Reported Trigger:</span>
              <span className="font-semibold text-on-surface">{alert.reason}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Assigned Ward:</span>
              <span className="font-semibold text-on-surface">{student.hospital}</span>
            </div>
          </div>
        </section>

        {/* Supervisor Endorsement Form */}
        <section
          id="supervisor-action-card"
          className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-xs"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-xl">
              verified
            </span>
            <h3 className="font-bold text-sm text-on-surface">
              Supervisor Clinical Endorsement
            </h3>
          </div>

          {isAlreadyReviewed ? (
            <div className="bg-secondary-container/20 rounded-xl p-3 border border-secondary/30 text-xs space-y-1.5">
              <div className="font-bold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Reviewed and Endorsed by {alert.reviewed_by}
              </div>
              <div className="text-[11px] text-on-surface-variant">
                Reviewed at: {alert.reviewed_at}
              </div>
              <p className="italic text-on-surface bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/30 mt-1">
                "{alert.review_notes}"
              </p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Clinical Exemption Category
                </label>
                <select
                  value={predefinedReason}
                  onChange={(e) => setPredefinedReason(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs text-on-surface focus:border-primary focus:outline-none min-h-[44px]"
                >
                  <option value="Emergency Clinical Dispatch to Blood Bank for Cross-Match">
                    Emergency Dispatch (Blood Bank / Cross-Match)
                  </option>
                  <option value="Stat Specimen Transport to Central Pathology">
                    Stat Specimen Transport (Pathology / Microbiology)
                  </option>
                  <option value="Inter-Departmental Emergency Consult (Trauma / ICU)">
                    Inter-Departmental Consult (Trauma / ICU)
                  </option>
                  <option value="Accidental Perimeter Threshold Breach / GPS Drift">
                    Accidental Perimeter Threshold Breach / GPS Drift
                  </option>
                  <option value="Other Authorized Clinical Activity">
                    Other Authorized Clinical Duty
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Supervisor Justification Notes & Sign-off
                </label>
                <textarea
                  rows={3}
                  required
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Enter clinical rationale and justification for accreditation dossier..."
                  className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div className="pt-1">
                <button
                  id="btn-endorse-incident"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-secondary text-on-secondary rounded-xl py-3.5 font-bold text-sm hover:bg-secondary-container hover:text-on-secondary-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[48px] active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[20px] fill">draw</span>
                  {isSubmitting ? 'Signing Audit Trail...' : 'Endorse Exemption & Resolve Alert'}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Audit Compliance Seal */}
        <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/30 text-center text-[11px] text-on-surface-variant">
          <div className="font-semibold text-primary">Allied Health Science Audit Integrity</div>
          <div>All supervisor endorsements are cryptographically stamped into the immutable hospital activity log.</div>
        </div>
      </main>
    </div>
  );
};
