import { useAppSelector } from '../../app/hooks';

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);

  const initial = user?.email?.charAt(0).toUpperCase() ?? '?';
  const permissionCount = user?.permissions.length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here's a quick overview of your account.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-semibold text-indigo-700">
          {initial}
        </div>

        <div>
          <p className="text-base font-semibold text-slate-900">
            {user?.email}
          </p>
          <p className="text-sm text-slate-500 capitalize">{user?.role} role</p>
        </div>

        <span
          className={`ml-auto inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            user?.active
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {user?.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Role
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900 capitalize">
            {user?.role ?? '—'}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Permissions
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {permissionCount}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Account status
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {user?.active ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>

      {permissionCount > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">
            Your permissions
          </h2>

          <div className="flex flex-wrap gap-2">
            {user?.permissions.map((permission) => (
              <span
                key={permission}
                className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                {permission}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
