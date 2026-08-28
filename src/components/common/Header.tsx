import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title = 'InternTrack', showBack = false, onBack }) => {
  const { currentUser, currentScreen, setCurrentScreen, switchRoleQuickly, logout } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      if (currentUser?.role === 'STUDENT') {
        setCurrentScreen('student_dashboard');
      } else if (currentUser?.role === 'MENTOR') {
        setCurrentScreen('mentor_dashboard');
      } else if (currentUser?.role === 'HOD') {
        setCurrentScreen('hod_dashboard');
      } else if (currentUser?.role === 'ADMIN') {
        setCurrentScreen('admin_dashboard');
      }
    }
  };

  const handleSwitchRole = (role: UserRole) => {
    switchRoleQuickly(role);
    setShowRoleMenu(false);
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-outline-variant/50 px-3.5 h-14 flex items-center justify-between shadow-2xs"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack && (
          <button
            id="header-back-button"
            onClick={handleBack}
            className="p-1.5 -ml-1 text-on-surface hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Go Back"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
        )}

        <div
          className="flex items-center gap-2 cursor-pointer truncate"
          onClick={() => {
            if (currentUser?.role === 'STUDENT') setCurrentScreen('student_dashboard');
            else if (currentUser?.role === 'MENTOR') setCurrentScreen('mentor_dashboard');
            else if (currentUser?.role === 'HOD') setCurrentScreen('hod_dashboard');
            else if (currentUser?.role === 'ADMIN') setCurrentScreen('admin_dashboard');
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-[18px] fill">local_hospital</span>
          </div>
          <div className="min-w-0 truncate">
            <h1 className="text-sm font-bold text-on-surface leading-tight truncate">
              {title}
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-wider text-secondary leading-none mt-0.5">
              InternPulse • {currentUser?.role || 'AHS'}
            </p>
          </div>
        </div>
      </div>

      {/* Right User & Role Switcher */}
      <div className="relative shrink-0 flex items-center gap-2">
        <button
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          className="flex items-center gap-1.5 p-1 pl-2 bg-surface-container-low hover:bg-surface-container rounded-full border border-outline-variant/40 transition-colors cursor-pointer"
        >
          <span className="text-[11px] font-bold text-primary max-w-[80px] truncate hidden sm:inline">
            {currentUser?.name?.split(' ')[0] || currentUser?.role}
          </span>
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-outline-variant"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[11px]">
              {currentUser?.role?.substring(0, 2) || 'IT'}
            </div>
          )}
          <span className="material-symbols-outlined text-[16px] text-outline">
            {showRoleMenu ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {/* Role Switcher & Logout Dropdown Menu */}
        {showRoleMenu && (
          <div className="absolute right-0 top-12 w-56 bg-surface-container-lowest border border-outline-variant/60 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1.5 border-b border-outline-variant/30 mb-1">
              <div className="text-xs font-bold text-on-surface truncate">{currentUser?.name}</div>
              <div className="text-[10px] text-on-surface-variant font-mono">
                {currentUser?.role === 'STUDENT' ? `ID: ${currentUser.registerNumber}` : currentUser?.department}
              </div>
            </div>

            <div className="text-[10px] uppercase font-bold text-outline-variant px-2.5 py-1">
              Switch Active Role
            </div>

            <div className="space-y-0.5">
              {(['STUDENT', 'MENTOR', 'HOD', 'ADMIN'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleSwitchRole(role)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    currentUser?.role === role
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span className="capitalize">{role.toLowerCase()} Portal</span>
                  {currentUser?.role === role && (
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-outline-variant/30 mt-1.5 pt-1">
              <button
                onClick={() => {
                  setShowRoleMenu(false);
                  logout();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-error hover:bg-error-container/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
