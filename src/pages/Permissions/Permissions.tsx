import { useGetPermissionGroupsQuery } from '../../features/permission/permissionApi';

const Permissions = () => {
  const { data, isLoading, error } = useGetPermissionGroupsQuery();

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Something went wrong.</h2>;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Permission Groups</h1>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Permissions</th>
          </tr>
        </thead>

        <tbody>
          {data?.data.items.map((group) => (
            <tr key={group.id} className="border-b">
              <td className="p-3">{group.name}</td>

              <td className="p-3">{group.description}</td>

              <td className="p-3">{group.permissions.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Permissions;
