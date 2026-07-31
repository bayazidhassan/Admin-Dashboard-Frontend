import { useAppSelector } from '../../app/hooks';

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="space-y-2 rounded border bg-white p-6">
        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <p>
          <strong>Role:</strong> {user?.role}
        </p>

        <p>
          <strong>Status:</strong> {user?.active ? 'Active' : 'Inactive'}
        </p>

        <p>
          <strong>Total Permissions:</strong> {user?.permissions.length ?? 0}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
