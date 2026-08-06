import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import {
  useLazySessionQuery,
  useRefreshMutation,
} from '../../features/auth/authApi';
import { logout, setCredentials, setUser } from '../../features/auth/authSlice';

interface Props {
  children: ReactNode;
}

/**
 * Runs once when the app loads (including on a hard page refresh).
 * The access token only lives in memory (Redux state), so a reload
 * wipes it — but the HttpOnly refresh cookie survives. This component
 * calls /auth/refresh using that cookie to get a fresh access token
 * BEFORE any route-guard logic runs, so the user isn't bounced to
 * /login just because they hit F5.
 */
const AuthInitializer = ({ children }: Props) => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const hasRun = useRef(false);

  const [refresh] = useRefreshMutation();
  const [fetchSession] = useLazySessionQuery();

  useEffect(() => {
    // Guard against React StrictMode's double effect invocation in dev.
    // Without this, refresh() can fire twice almost simultaneously —
    // since refresh tokens rotate on use, the second call can reuse an
    // already-invalidated cookie and wrongly fail the whole bootstrap.
    if (hasRun.current) return;
    hasRun.current = true;

    const bootstrap = async () => {
      try {
        const result = await refresh().unwrap();
        dispatch(setCredentials({ accessToken: result.data.accessToken }));

        const session = await fetchSession().unwrap();
        dispatch(
          setUser({
            id: session.data.id,
            email: session.data.email,
            active: session.data.active,
            role: session.data.role,
            permissions: session.data.permissions,
          }),
        );
      } catch {
        // No valid refresh cookie (never logged in, or it expired/was
        // revoked) — that's fine, just stay logged out.
        dispatch(logout());
      } finally {
        setIsInitializing(false);
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <svg
          className="h-8 w-8 animate-spin text-indigo-600"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z"
          />
        </svg>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
