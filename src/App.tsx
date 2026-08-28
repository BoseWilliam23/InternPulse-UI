import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './components/screens/LoginScreen';
import { StudentDashboard } from './components/screens/StudentDashboard';
import { ActiveShiftScreen } from './components/screens/ActiveShiftScreen';
import { VerificationRequestModal } from './components/screens/VerificationRequestModal';
import { VerificationResultScreen } from './components/screens/VerificationResultScreen';
import { GpsHistoryScreen } from './components/screens/GpsHistoryScreen';
import { MentorDashboard } from './components/screens/MentorDashboard';
import { MentorReviewScreen } from './components/screens/MentorReviewScreen';
import { HodDashboard } from './components/screens/HodDashboard';
import { DepartmentAlertsScreen } from './components/screens/DepartmentAlertsScreen';
import { DepartmentStudentsScreen } from './components/screens/DepartmentStudentsScreen';
import { HodAnalyticsScreen } from './components/screens/HodAnalyticsScreen';
import { AdminDashboard } from './components/screens/AdminDashboard';
import { AdminActivityLogScreen } from './components/screens/AdminActivityLogScreen';
import { BottomNav } from './components/common/BottomNav';
import { SimulationBar } from './components/common/SimulationBar';

const AppRouter: React.FC = () => {
  const { currentScreen, currentUser } = useApp();

  if (!currentUser || currentScreen === 'login') {
    return <LoginScreen />;
  }

  return (
    <div className="w-full min-h-screen bg-surface-dim/30 flex justify-center">
      {/* Target Mobile Shell (390px-440px max width on desktop, 100% on mobile) */}
      <div className="w-full max-w-md min-h-screen bg-background text-on-surface flex flex-col font-body-md antialiased relative shadow-2xl">
        {/* Dynamic Screen Routing */}
        {currentScreen === 'student_dashboard' && <StudentDashboard />}
        {currentScreen === 'active_shift' && <ActiveShiftScreen />}
        {currentScreen === 'verification_result' && <VerificationResultScreen />}
        {currentScreen === 'verification_result_needs_attention' && (
          <VerificationResultScreen forceAttention={true} />
        )}
        {currentScreen === 'gps_history' && <GpsHistoryScreen />}
        
        {/* Mentor Screens */}
        {currentScreen === 'mentor_dashboard' && <MentorDashboard />}
        {currentScreen === 'mentor_review_arun_kumar' && <MentorReviewScreen />}
        
        {/* HOD Screens */}
        {currentScreen === 'hod_dashboard' && <HodDashboard />}
        {currentScreen === 'department_alerts' && <DepartmentAlertsScreen />}
        {currentScreen === 'department_students' && <DepartmentStudentsScreen />}
        {currentScreen === 'hod_analytics_dashboard' && <HodAnalyticsScreen />}
        
        {/* Admin Screens */}
        {(currentScreen === 'admin_dashboard' ||
          currentScreen === 'admin_change_shift' ||
          currentScreen === 'admin_change_mentor') && <AdminDashboard />}
        {currentScreen === 'admin_activity_log' && <AdminActivityLogScreen />}

        {/* Global Modals & Fixed Overlays */}
        <VerificationRequestModal />
        <SimulationBar />
        <BottomNav />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
