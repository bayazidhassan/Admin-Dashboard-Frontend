import { Outlet } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import Sidebar from '../components/dashboard/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
