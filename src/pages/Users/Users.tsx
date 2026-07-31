import { useGetUsersQuery } from '../../features/user/userApi';

const Users = () => {
  const { data, isLoading, error } = useGetUsersQuery();

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Something went wrong.</h2>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>

        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          Create User
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.data.items.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-3">{user.name}</td>

              <td className="p-3">{user.email}</td>

              <td className="p-3">{user.role.name}</td>

              <td className="p-3">{user.active ? 'Active' : 'Inactive'}</td>

              <td className="space-x-2 p-3">
                <button className="rounded bg-yellow-500 px-3 py-1 text-white">
                  Edit
                </button>

                <button className="rounded bg-red-500 px-3 py-1 text-white">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
