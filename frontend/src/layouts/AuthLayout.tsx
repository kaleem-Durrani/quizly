import { Outlet } from 'react-router-dom';

/**
 * Layout for authentication pages (login, register, etc.)
 * Provides a simple, centered layout with a logo and footer
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header with logo */}
      <header className="py-6 flex justify-center">
        <div className="text-2xl font-bold text-blue-600">Quizly</div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Quizly. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;

/* 
NOTE: This is a placeholder implementation. You'll need to customize it with your actual design.
Consider adding:
- Your logo
- Background images or patterns
- Proper styling to match your brand
- Any additional elements like language switchers, help links, etc.
*/
