import { Outlet } from "react-router-dom";

/**
 * Minimal layout for error pages and simple public pages
 * Provides a basic layout with minimal styling
 */
const MinimalLayout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Simple header */}
      <header className="py-4 px-6 bg-white shadow-sm">
        <div className="text-xl font-bold text-blue-600">Quizly</div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center">
        <Outlet />
      </main>

      {/* Simple footer */}
      <footer className="py-4 px-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Quizly. All rights reserved.
      </footer>
    </div>
  );
};

export default MinimalLayout;

/* 
NOTE: This is a placeholder implementation. You'll need to customize it with your actual design.
This layout is intended for error pages (404, 500, etc.) and simple public pages that don't need
the full authentication layout.
*/
