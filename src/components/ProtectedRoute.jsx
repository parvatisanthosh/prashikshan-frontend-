// FILE: src/components/ProtectedRoute.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

/**
 * ProtectedRoute Component
 * 
 * Protects routes from unauthorized access
 * Supports role-based access control
 * 
 * Usage:
 * <Route path="/studentdashboard" element={
 *   <ProtectedRoute allowedRoles={['STUDENT']}>
 *     <StudentDashboard />
 *   </ProtectedRoute>
 * } />
 */

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [] 
}) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/roleselect');

  // Memoize checkAuthorization to prevent unnecessary re-renders
  const checkAuthorization = useCallback(() => {
    console.log('🔍 ProtectedRoute: Starting authorization check...');
    console.log('📍 Current path:', location.pathname);
    console.log('🎭 Allowed roles:', allowedRoles);

    try {
      // Check if user is authenticated
      const isAuth = authService.isAuthenticated();
      console.log('🔐 Is authenticated:', isAuth);

      if (!isAuth) {
        console.log('❌ Not authenticated - redirecting to /roleselect');
        setIsAuthorized(false);
        setRedirectPath('/roleselect');
        setIsChecking(false);
        return;
      }

      // Get current user
      const user = authService.getCurrentUser();
      console.log('👤 Current user:', user);
      
      if (!user || !user.role) {
        console.log('❌ No user or role found - redirecting to /roleselect');
        setIsAuthorized(false);
        setRedirectPath('/roleselect');
        setIsChecking(false);
        return;
      }

      console.log('🎭 User role:', user.role);

      // If no roles specified, just check authentication
      if (allowedRoles.length === 0) {
        console.log('✅ No role restrictions - access granted');
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // Check if user's role is allowed (case-insensitive comparison)
      const userRoleUpper = user.role.toUpperCase();
      const allowedRolesUpper = allowedRoles.map(role => role.toUpperCase());
      
      console.log('🔄 Comparing roles (case-insensitive):');
      console.log('   User role (uppercase):', userRoleUpper);
      console.log('   Allowed roles (uppercase):', allowedRolesUpper);

      if (allowedRolesUpper.includes(userRoleUpper)) {
        console.log('✅ Role match - access granted!');
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // User is authenticated but wrong role
      console.log('❌ Role mismatch - access denied');
      console.log(`   Expected: ${allowedRoles.join(', ')}`);
      console.log(`   Got: ${user.role}`);
      
      setIsAuthorized(false);
      
      // Redirect to appropriate login based on attempted role
      const roleLoginMap = {
        'STUDENT': '/studentlogin',
        'FACULTY': '/facultylogin',
        'MENTOR': '/mentorlogin',
        'COMPANY': '/companylogin',
        'ADMIN': '/adminlogin',
        'INDUSTRY': '/mentorlogin' // Map INDUSTRY to mentor login
      };
      
      const redirect = roleLoginMap[allowedRoles[0]] || '/roleselect';
      console.log('🔀 Redirecting to:', redirect);
      setRedirectPath(redirect);
      setIsChecking(false);

    } catch (error) {
      console.error('💥 Authorization check failed:', error);
      console.error('Error details:', error.message);
      setIsAuthorized(false);
      setRedirectPath('/roleselect');
      setIsChecking(false);
    }
  }, [allowedRoles, location.pathname]); // ✅ FIXED: Added dependencies

  useEffect(() => {
    checkAuthorization();
  }, [checkAuthorization]); // ✅ FIXED: Use checkAuthorization as dependency

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authorized
  if (!isAuthorized) {
    console.log('🚫 Rendering redirect to:', redirectPath);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Render protected content
  console.log('✅ Rendering protected content');
  return children;
}