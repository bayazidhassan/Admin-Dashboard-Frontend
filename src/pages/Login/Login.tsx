import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../app/hooks';
import {
  useLazySessionQuery,
  useLoginMutation,
} from '../../features/auth/authApi';
import { setCredentials, setUser } from '../../features/auth/authSlice';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const [getSession] = useLazySessionQuery();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const loginRes = await login({
        email,
        password,
      }).unwrap();

      dispatch(
        setCredentials({
          accessToken: loginRes.data.accessToken,
        }),
      );

      const sessionRes = await getSession().unwrap();

      dispatch(setUser(sessionRes.data));

      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Invalid email or password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 rounded border p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={isLoading}
          className="w-full rounded bg-blue-600 p-2 text-white"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
