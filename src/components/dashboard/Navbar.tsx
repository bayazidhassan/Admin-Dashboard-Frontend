import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useLogoutMutation } from '../../features/auth/authApi';
import { logout } from '../../features/auth/authSlice';
import ConfirmModal from '../common/ConfirmModal';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const [logoutApi, { isLoading }] = useLogoutMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error(error);
      toast.error('Logout failed, but your session has been cleared');
    } finally {
      dispatch(logout());
      setConfirmOpen(false);
      navigate('/login', { replace: true });
    }
  };

  const initial = user?.email?.charAt(0).toUpperCase() ?? '?';

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h2 className="text-lg font-semibold text-slate-900">Admin Dashboard</h2>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {initial}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-800">{user.email}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setConfirmOpen(true)}
          className="cursor-pointer rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Logout
        </button>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Log out?"
        description="You will need to sign in again to access the dashboard."
        confirmLabel="Log out"
        loadingLabel="Logging out..."
        isLoading={isLoading}
        onConfirm={handleLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </header>
  );
};

export default Navbar;
