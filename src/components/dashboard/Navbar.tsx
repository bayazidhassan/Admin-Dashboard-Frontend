import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../app/hooks';
import { useLogoutMutation } from '../../features/auth/authApi';
import { logout } from '../../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>

      <button
        onClick={handleLogout}
        className="rounded bg-red-500 px-4 py-2 text-white cursor-pointer"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
