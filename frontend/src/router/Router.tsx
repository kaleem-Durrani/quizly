import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import ProtectedRoute from "./ProtectedRoute";
import { Spin } from "antd";
import { AuthLayout, AppLayout, MinimalLayout } from "../layouts";

/**
 * Loading component for Suspense
 * Displayed while lazy-loaded components are being loaded
 */
const Loading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <Spin size="large" />
    <div className="mt-4">Loading...</div>
  </div>
);

/**
 * Main Router component
 * Handles all application routing based on the routes defined in routes.ts
 * Groups routes by layout for consistent UI
 */
const Router = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Auth layout routes */}
        <Route element={<AuthLayout />}>
          {routes
            .filter((route) => route.layout === "auth")
            .map((route) => {
              const element = route.protected ? (
                <ProtectedRoute
                  userType={route.userType}
                  requiresVerification={route.requiresVerification}
                >
                  <route.component />
                </ProtectedRoute>
              ) : (
                <route.component />
              );

              return (
                <Route key={route.path} path={route.path} element={element} />
              );
            })}
        </Route>

        {/* App layout routes */}
        <Route element={<AppLayout />}>
          {routes
            .filter((route) => route.layout === "app")
            .map((route) => {
              const element = route.protected ? (
                <ProtectedRoute
                  userType={route.userType}
                  requiresVerification={route.requiresVerification}
                >
                  <route.component />
                </ProtectedRoute>
              ) : (
                <route.component />
              );

              return (
                <Route key={route.path} path={route.path} element={element} />
              );
            })}
        </Route>

        {/* Minimal layout routes */}
        <Route element={<MinimalLayout />}>
          {routes
            .filter((route) => route.layout === "minimal")
            .map((route) => {
              const element = route.protected ? (
                <ProtectedRoute
                  userType={route.userType}
                  requiresVerification={route.requiresVerification}
                >
                  <route.component />
                </ProtectedRoute>
              ) : (
                <route.component />
              );

              return (
                <Route key={route.path} path={route.path} element={element} />
              );
            })}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default Router;
