import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TenantRepository } from '../services/tenantStorage';

const AuthContext = createContext(null);

// Role & Permission Matrix (Section 2)
export const ROLE_PERMISSIONS = {
  platform_owner: ['all_schools', 'manage_plans', 'support_mode', 'audit_logs'],
  school_superadmin: ['cms', 'teachers', 'students', 'admissions', 'results', 'notices', 'fees', 'settings', 'users', 'factory_reset'],
  headmaster: ['cms', 'teachers', 'students', 'admissions', 'results', 'notices', 'fees_view', 'settings_view'],
  asst_headmaster: ['teachers_view', 'students', 'admissions_verify', 'results', 'notices'],
  teacher: ['results_entry', 'notices_academic'],
  office_assistant: ['students_edit', 'admissions_approve', 'fees_collect', 'fees_void', 'id_cards_print']
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('sp_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentSchool, setCurrentSchool] = useState(() => {
    try {
      const saved = sessionStorage.getItem('sp_active_school');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [supportMode, setSupportMode] = useState(() => {
    try {
      return sessionStorage.getItem('sp_support_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Login method
  const login = useCallback((username, password, schoolSlug = null) => {
    const { user, school } = TenantRepository.authenticate(username, password, schoolSlug);
    setCurrentUser(user);
    setCurrentSchool(school);
    setSupportMode(false);
    sessionStorage.setItem('sp_active_user', JSON.stringify(user));
    if (school) {
      sessionStorage.setItem('sp_active_school', JSON.stringify(school));
    } else {
      sessionStorage.removeItem('sp_active_school');
    }
    sessionStorage.removeItem('sp_support_mode');
    return { user, school };
  }, []);

  // Logout method
  const logout = useCallback(() => {
    if (currentUser) {
      TenantRepository.addAuditLog(
        currentSchool?.id || null,
        currentUser.username,
        currentUser.role,
        'লগআউট সম্পন্ন',
        'Logout',
        'auth',
        'ব্যবহারকারী লগআউট করেছেন।'
      );
    }
    setCurrentUser(null);
    setCurrentSchool(null);
    setSupportMode(false);
    sessionStorage.removeItem('sp_active_user');
    sessionStorage.removeItem('sp_active_school');
    sessionStorage.removeItem('sp_support_mode');
  }, [currentUser, currentSchool]);

  // Support mode enter (Only for platform_owner to view a school)
  const enterSupportMode = useCallback((school) => {
    if (currentUser?.role !== 'platform_owner') {
      throw new Error('শুধুমাত্র Platform Owner সাপোর্ট মোড চালু করতে পারেন।');
    }
    setCurrentSchool(school);
    setSupportMode(true);
    sessionStorage.setItem('sp_active_school', JSON.stringify(school));
    sessionStorage.setItem('sp_support_mode', 'true');
    TenantRepository.addAuditLog(
      school.id,
      currentUser.username,
      'platform_owner',
      'সাপোর্ট মোড সক্রিয়',
      'Support Mode Activated',
      'owner',
      `Owner ${currentUser.username} স্কুল ${school.name_bn} ভিউ-অনলি সাপোর্ট মোডে প্রবেশ করেছেন।`
    );
  }, [currentUser]);

  const exitSupportMode = useCallback(() => {
    setSupportMode(false);
    sessionStorage.removeItem('sp_support_mode');
    if (currentUser?.role === 'platform_owner') {
      setCurrentSchool(null);
      sessionStorage.removeItem('sp_active_school');
    }
  }, [currentUser]);

  // Check permission helper
  const canAccess = useCallback((requiredPerm) => {
    if (!currentUser) return false;
    if (supportMode) {
      // In support mode, only viewing is allowed
      return requiredPerm.endsWith('_view') || requiredPerm === 'view';
    }
    const perms = ROLE_PERMISSIONS[currentUser.role] || [];
    return perms.includes(requiredPerm) || perms.includes('all_schools');
  }, [currentUser, supportMode]);

  // Idle timeout: 30 minutes auto-logout
  useEffect(() => {
    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (currentUser) {
        timeoutId = setTimeout(() => {
          sessionStorage.setItem('sp_session_timeout', 'true');
          logout();
        }, 30 * 60 * 1000);
      }
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [currentUser, logout]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentSchool,
        supportMode,
        login,
        logout,
        enterSupportMode,
        exitSupportMode,
        canAccess,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

