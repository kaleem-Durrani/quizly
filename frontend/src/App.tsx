import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Router from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import queryClient from "./api/queryClient";

/**
 * Main App component
 * Sets up providers and global configuration
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1890ff",
            borderRadius: 4,
          },
        }}
      >
        <AntdApp message={{ maxCount: 2 }} notification={{ maxCount: 2 }}>
          <AuthProvider>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </AuthProvider>
        </AntdApp>
      </ConfigProvider>
      {/* Add React Query Devtools - only visible in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
