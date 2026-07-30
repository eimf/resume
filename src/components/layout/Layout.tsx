import { Outlet } from 'react-router-dom';
import { DotGrid } from './DotGrid';
import { Nav } from './Nav';

export function Layout() {
  return (
    <div className="relative min-h-screen bg-surface">
      {/* Background dot grid */}
      <DotGrid />

      {/* Navigation */}
      <Nav />

      {/* Main content */}
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
