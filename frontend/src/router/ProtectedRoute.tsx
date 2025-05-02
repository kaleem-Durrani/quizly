import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { UserRole } from "../constants/types";
import { useAuth } from "../contexts";
import { Spin } from "antd";

interface ProtectedRouteProps {
  children: ReactNode;
  userType?: UserRole;
  requiresVerification?: boolean;
}

/**
 * ProtectedRoute component
 *
 * This component handles route protection based on authentication status and user role.
 * It also handles verification requirements for routes.
 *
 * @param children - The components to render if all checks pass
 * @param userType - The required user role for this route (optional)
 * @param requiresVerification - Whether this route is specifically for verification (optional)
 */
const ProtectedRoute = ({
  children,
  userType,
  requiresVerification = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If still loading, don't do anything yet
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true, state: { from: location } });
      return;
    }

    // Handle verification routes
    if (requiresVerification) {
      // If user is already verified, redirect to appropriate dashboard
      if (user?.isVerified) {
        const dashboardRoute =
          user?.role === "admin"
            ? ROUTES.ADMIN.DASHBOARD
            : user?.role === "teacher"
            ? ROUTES.TEACHER.DASHBOARD
            : ROUTES.STUDENT.DASHBOARD;
        navigate(dashboardRoute, { replace: true });
        return;
      }
    } else {
      // For non-verification routes, if user is not verified, redirect to verify email
      if (user && !user.isVerified) {
        navigate(ROUTES.VERIFY_EMAIL, { replace: true });
        return;
      }

      // If userType is specified and doesn't match the user's role, redirect to unauthorized
      if (userType && user?.role !== userType) {
        navigate(ROUTES.ERROR.UNAUTHORIZED, { replace: true });
        return;
      }

      // Special case for teachers with first login
      if (
        user?.role === "teacher" &&
        user?.isFirstLogin &&
        location.pathname !== ROUTES.TEACHER.FIRST_LOGIN
      ) {
        navigate(ROUTES.TEACHER.FIRST_LOGIN, { replace: true });
        return;
      }
    }
  }, [
    isAuthenticated,
    user,
    userType,
    requiresVerification,
    location,
    navigate,
    isLoading,
  ]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // If not authenticated or not meeting verification requirements, render nothing while redirect happens
  if (
    !isAuthenticated ||
    (requiresVerification && user?.isVerified) ||
    (!requiresVerification && user && !user.isVerified) ||
    (userType && user?.role !== userType)
  ) {
    return null;
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;

/* 
USAGE EXAMPLES:

1. Basic protected route (requires authentication):
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

2. Role-specific route:
<ProtectedRoute userType="teacher">
  <TeacherDashboard />
</ProtectedRoute>

3. Verification route (only for unverified users):
<ProtectedRoute requiresVerification={true}>
  <VerifyEmail />
</ProtectedRoute>
*/
