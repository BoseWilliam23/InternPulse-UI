import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface RoleOption {
  role: UserRole;
  title: string;
  subtitle: string;
  idLabel: string;
  defaultId: string;
  defaultPass: string;
  icon: string;
  nameExample: string;
  colorClass: string;
  bgLightClass: string;
  borderClass: string;
  badgeClass: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'STUDENT',
    title: 'Student',
    subtitle: 'Student Login',
    idLabel: 'Register Number',
    defaultId: 'AHS001',
    defaultPass: 'demo123',
    icon: 'school',
    nameExample: 'Arun Kumar (Radiology)',
    colorClass: 'text-primary',
    bgLightClass: 'bg-primary/5',
    borderClass: 'border-primary/30',
    badgeClass: 'bg-primary/10 text-primary',
  },
  {
    role: 'MENTOR',
    title: 'Mentor',
    subtitle: 'Mentor Login',
    idLabel: 'Mentor ID',
    defaultId: 'mentor01',
    defaultPass: 'demo123',
    icon: 'stethoscope',
    nameExample: 'Dr. Anitha (Clinical Supervisor)',
    colorClass: 'text-secondary',
    bgLightClass: 'bg-secondary/5',
    borderClass: 'border-secondary/30',
    badgeClass: 'bg-secondary/10 text-secondary',
  },
  {
    role: 'HOD',
    title: 'HOD',
    subtitle: 'HOD Login',
    idLabel: 'HOD ID',
    defaultId: 'hod01',
    defaultPass: 'demo123',
    icon: 'local_hospital',
    nameExample: 'Dr. Sarah Mitchell (Dept Head)',
    colorClass: 'text-tertiary-container',
    bgLightClass: 'bg-tertiary-container/5',
    borderClass: 'border-tertiary-container/30',
    badgeClass: 'bg-tertiary-container/10 text-tertiary-container',
  },
  {
    role: 'ADMIN',
    title: 'Administrator',
    subtitle: 'Admin Login',
    idLabel: 'Admin ID',
    defaultId: 'admin01',
    defaultPass: 'demo123',
    icon: 'manage_accounts',
    nameExample: 'Hospital Administration',
    colorClass: 'text-primary',
    bgLightClass: 'bg-surface-container-high',
    borderClass: 'border-outline-variant',
    badgeClass: 'bg-surface-container-highest text-on-surface',
  },
];

export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('demo123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const currentRoleConfig = ROLE_OPTIONS.find((r) => r.role === selectedRole);

  const handleSelectRole = (role: UserRole) => {
    const config = ROLE_OPTIONS.find((r) => r.role === role);
    setSelectedRole(role);
    setErrorMsg('');
    if (config) {
      setIdentifier(config.defaultId);
      setPassword(config.defaultPass);
    }
  };

  const handleQuickLogin = (role: UserRole, e: React.MouseEvent) => {
    e.stopPropagation();
    const config = ROLE_OPTIONS.find((r) => r.role === role);
    if (config) {
      login(config.defaultId, config.defaultPass);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier.trim()) {
      setErrorMsg('Please enter your identifier.');
      return;
    }
    const success = login(identifier.trim(), password);
    if (!success) {
      setErrorMsg(`Invalid ${currentRoleConfig?.idLabel || 'Credentials'}. Use demo ID "${currentRoleConfig?.defaultId}".`);
    }
  };

  const handleAutoFill = () => {
    if (currentRoleConfig) {
      setIdentifier(currentRoleConfig.defaultId);
      setPassword(currentRoleConfig.defaultPass);
      setErrorMsg('');
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col justify-between p-4 py-8 max-w-md mx-auto">
      {/* Top Header & Branding */}
      <div className="flex flex-col items-center text-center pt-2">
        <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex flex-col items-center justify-center shadow-md mb-3 border border-primary-container">
          <span className="material-symbols-outlined text-3xl fill text-primary-fixed">local_hospital</span>
        </div>
        <h1 className="font-display-id text-2xl font-bold text-on-surface tracking-tight">InternTrack</h1>
        <p className="text-xs text-on-surface-variant font-medium mt-0.5">
          Allied Health Science Internship Monitoring
        </p>
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-6">
        {!selectedRole ? (
          /* STEP 1: ROLE SELECTION SCREEN */
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="font-headline-md text-base font-bold text-on-surface">Select your role</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Choose your clinical portal to sign in
              </p>
            </div>

            <div className="space-y-2.5">
              {ROLE_OPTIONS.map((opt) => (
                <div
                  key={opt.role}
                  id={`role-card-${opt.role.toLowerCase()}`}
                  onClick={() => handleSelectRole(opt.role)}
                  className={`w-full p-4 rounded-xl border ${opt.borderClass} ${opt.bgLightClass} hover:bg-surface-container-high transition-all cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-between group`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center shadow-xs">
                      <span className={`material-symbols-outlined text-2xl ${opt.colorClass}`}>
                        {opt.icon}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-base text-on-surface flex items-center gap-2">
                        {opt.title}
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${opt.badgeClass}`}>
                          {opt.subtitle}
                        </span>
                      </div>
                      <div className="text-xs text-on-surface-variant mt-0.5">
                        Demo: <span className="font-mono font-medium">{opt.nameExample}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleQuickLogin(opt.role, e)}
                    className="shrink-0 px-3 py-1.5 bg-primary text-on-primary hover:bg-primary-container text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                    title={`Instant login as ${opt.title}`}
                  >
                    1-Tap Demo
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* STEP 2: ROLE-SPECIFIC LOGIN FORM */
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-5 shadow-sm">
            {/* Back to Role Selection Button */}
            <button
              onClick={() => {
                setSelectedRole(null);
                setErrorMsg('');
              }}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline mb-4 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Role Selection
            </button>

            {/* Role Header Banner */}
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 mb-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center">
                <span className={`material-symbols-outlined text-2xl ${currentRoleConfig?.colorClass}`}>
                  {currentRoleConfig?.icon}
                </span>
              </div>
              <div>
                <h2 className="font-headline-md text-base font-bold text-on-surface">
                  {currentRoleConfig?.title} Login
                </h2>
                <p className="text-xs text-on-surface-variant">
                  {selectedRole === 'STUDENT'
                    ? 'Use your college registered number to sign in.'
                    : `Sign in as ${currentRoleConfig?.title}.`}
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1" htmlFor="login-identifier">
                  {currentRoleConfig?.idLabel}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">
                    badge
                  </span>
                  <input
                    id="login-identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={`e.g. ${currentRoleConfig?.defaultId}`}
                    className="w-full pl-10 pr-3 py-3 bg-surface border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors min-h-[48px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1" htmlFor="login-password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">
                    lock
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-surface border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors min-h-[48px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary p-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Demo auto-fill helper button */}
              <button
                type="button"
                onClick={handleAutoFill}
                className="w-full py-2 bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 rounded-lg text-xs font-medium text-primary flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">key</span>
                Auto-fill Demo ID: <span className="font-mono font-bold">{currentRoleConfig?.defaultId}</span>
              </button>

              <button
                id="btn-login-submit"
                type="submit"
                className="w-full bg-primary text-on-primary rounded-xl py-3.5 font-bold text-sm hover:bg-primary-container transition-all min-h-[48px] flex items-center justify-center shadow-xs cursor-pointer active:scale-[0.99]"
              >
                Sign In to {currentRoleConfig?.title} Portal
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer & Hospital Affiliation */}
      <div className="text-center pt-4 border-t border-outline-variant/30 text-on-surface-variant">
        <p className="text-xs font-semibold text-primary">
          InternPulse General Hospital
        </p>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-outline mt-1">
          <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
          <span>AHS Continuous Safety Protocol • Encrypted Telemetry</span>
        </div>
      </div>
    </div>
  );
};
