import { useState } from 'react';
import RoleModal from '../../components/role/RoleModal';
import { useGetPermissionGroupsQuery } from '../../features/permission/permissionApi';
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetRolesQuery,
  useUpdateRoleMutation,
  type Role,
} from '../../features/role/roleApi';

const Roles = () => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [permissionIds, setPermissionIds] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteRole] = useDeleteRoleMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, error } = useGetRolesQuery();
  const { data: permissionData } = useGetPermissionGroupsQuery();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

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

  const handleEdit = (role: Role) => {
    setSelectedRole(role);

    setName(role.name);
    setDescription(role.description);
    setStatus(role.status);

    setPermissionIds(role.permissions.map((p) => p.id));

    setIsEdit(true);
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedRole) return;

    const currentPermissionIds = selectedRole.permissions.map((p) => p.id);

    const addPermissionIds = permissionIds.filter(
      (id) => !currentPermissionIds.includes(id),
    );

    const removePermissionIds = currentPermissionIds.filter(
      (id) => !permissionIds.includes(id),
    );

    try {
      await updateRole({
        id: selectedRole.id,
        description,
        addPermissionIds,
        removePermissionIds,
      }).unwrap();

      setOpenModal(false);
      setSelectedRole(null);
      setIsEdit(false);

      setName('');
      setDescription('');
      setStatus(true);
      setPermissionIds([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm('Delete this role?');

    if (!ok) return;

    setDeletingId(id);

    try {
      await deleteRole(id).unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="mb-6 text-3xl font-bold">Roles</h1>
        <button
          onClick={() => {
            setIsEdit(false);
            setSelectedRole(null);

            setName('');
            setDescription('');
            setStatus(true);
            setPermissionIds([]);

            setOpenModal(true);
          }}
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

              <td className="p-3 space-x-2">
                <button
                  onClick={() => handleEdit(role)}
                  className="rounded cursor-pointer bg-yellow-500 px-3 py-1 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(role.id)}
                  disabled={deletingId === role.id}
                  className="rounded cursor-pointer bg-red-500 px-3 py-1 text-white disabled:opacity-50 disabled:cursor-none"
                >
                  {deletingId === role.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
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
        onClose={() => setOpenModal(false)}
        isLoading={isEdit ? isUpdating : isCreating}
        onSave={isEdit ? handleUpdate : handleCreate}
        isEdit={isEdit}
      />
    </div>
  );
};

export default Roles;
