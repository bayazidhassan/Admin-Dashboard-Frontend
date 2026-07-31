import { useGetRolesQuery } from '../../features/role/roleApi';

const Roles = () => {
  const { data, isLoading, error } = useGetRolesQuery();

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Something went wrong.</h2>;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Roles</h1>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Permissions</th>
            <th className="p-3 text-left">Users</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.data.items.map((role) => (
            <tr key={role.id} className="border-b">
              <td className="p-3">{role.name}</td>

              <td className="p-3">{role.description}</td>

              <td className="p-3">{role.status ? 'Active' : 'Inactive'}</td>

              <td className="p-3">{role.permissions.length}</td>

              <td className="p-3">{role._count.users}</td>

              <td className="p-3">Edit | Delete</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Roles;
