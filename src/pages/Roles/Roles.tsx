import { useState } from 'react';
import RoleModal from '../../components/RoleModal';
import { useGetPermissionGroupsQuery } from '../../features/permission/permissionApi';
import {
  useCreateRoleMutation,
  useGetRolesQuery,
} from '../../features/role/roleApi';

const Roles = () => {
  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState('');

  const [description, setDescription] = useState('');

  const [status, setStatus] = useState(true);

  const [permissionIds, setPermissionIds] = useState<string[]>([]);
  const { data, isLoading, error } = useGetRolesQuery();

  const { data: permissionData } = useGetPermissionGroupsQuery();

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Something went wrong.</h2>;

  const handleCreate = async () => {
    if (!name.trim()) return;

    if (permissionIds.length === 0) {
      alert('Select at least one permission');
      return;
    }

    try {
      await createRole({
        name,
        description,
        status,
        permissionIds,
      }).unwrap();

      setOpenModal(false);

      setName('');
      setDescription('');
      setStatus(true);
      setPermissionIds([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Roles</h1>

      <div className="mb-6">
        <button
          onClick={() => setOpenModal(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Create Role
        </button>
      </div>

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

      <RoleModal
        open={openModal}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        status={status}
        setStatus={setStatus}
        permissionIds={permissionIds}
        setPermissionIds={setPermissionIds}
        permissionGroups={permissionData?.data.items ?? []}
        isLoading={isCreating}
        onClose={() => setOpenModal(false)}
        onSave={handleCreate}
      />
    </div>
  );
};

export default Roles;
