import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { message } from "antd";
import { User, AuthContextType, UserRole } from "../constants/types";
import { useAuthQuery } from "../hooks/useAuthQuery";

/**
 * Default context values
 */
const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  checkAuthStatus: async () => false,
};

/**
 * Create the auth context
 */
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

/**
 * Custom hook to use the auth context
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Auth provider component
 * Manages authentication state and provides auth-related functions
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Use the auth query hook
  const { authStatusQuery } = useAuthQuery();

  /**
   * Check authentication status
   * Called on initial load and when needed
   */
  const checkUserAuthStatus = async (): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Refetch to ensure we have the latest data
      await authStatusQuery.refetch();
      const response = authStatusQuery.data;

      if (response?.success && response.isAuthenticated && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        // Store role for future API calls
        localStorage.setItem("userRole", response.user.role);
        setIsLoading(false);
        return true;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("userRole");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("userRole");
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Login function
   * @param email User email
   * @param password User password
   * @param role User role (student, teacher, admin)
   */
  const loginUser = async (
    email: string,
    password: string,
    role: string
  ): Promise<void> => {
    setIsLoading(true);

    try {
      // Use the login mutation from useAuthQuery
      const { loginMutation } = useAuthQuery();
      const response = await loginMutation.mutateAsync({
        email,
        password,
        role: role as UserRole,
      });

      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        localStorage.setItem("userRole", response.data.role);
        message.success("Login successful!");
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      message.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logoutUser = async (): Promise<void> => {
    try {
      // Use the logout mutation from useAuthQuery
      const { logoutMutation } = useAuthQuery();
      const role = user?.role || localStorage.getItem("userRole") || "student";
      await logoutMutation.mutateAsync(role as UserRole);

      // Clear auth state regardless of API response
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("userRole");
      message.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear auth state even if API call fails
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("userRole");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check authentication status on mount and when authStatusQuery changes
   */
  useEffect(() => {
    // If we have data from the query, update the auth state
    if (authStatusQuery.data) {
      const response = authStatusQuery.data;

      if (response.success && response.isAuthenticated && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem("userRole", response.user.role);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("userRole");
      }

      setIsLoading(false);
    } else if (authStatusQuery.isError) {
      // Handle error state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("userRole");
      setIsLoading(false);
    } else if (authStatusQuery.isLoading) {
      // Set loading state
      setIsLoading(true);
    }
  }, [
    authStatusQuery.data,
    authStatusQuery.isError,
    authStatusQuery.isLoading,
  ]);

  /**
   * Context value
   */
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login: loginUser,
    logout: logoutUser,
    checkAuthStatus: checkUserAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

/*
USAGE EXAMPLES:

1. Wrap your app with the AuthProvider:

   import { AuthProvider } from './contexts/AuthContext';

   function App() {
     return (
       <AuthProvider>
         <Router />
       </AuthProvider>
     );
   }

2. Use the auth context in components:

   import { useAuth } from './contexts/AuthContext';

   function ProfilePage() {
     const { user, logout } = useAuth();

     return (
       <div>
         <h1>Welcome, {user?.firstName}!</h1>
         <button onClick={logout}>Logout</button>
       </div>
     );
   }

3. Check authentication status:

   import { useAuth } from './contexts/AuthContext';

   function SomeComponent() {
     const { isAuthenticated, isLoading } = useAuth();

     if (isLoading) {
       return <div>Loading...</div>;
     }

     return isAuthenticated ? <AuthenticatedContent /> : <PublicContent />;
   }
*/
