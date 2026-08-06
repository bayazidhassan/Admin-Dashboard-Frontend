import { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import LoadingState, { Spinner } from '../../components/common/LoadingState';
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const { data, isLoading, error } = useGetRolesQuery();
  const { data: permissionData } = useGetPermissionGroupsQuery();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const resetForm = () => {
    setName('');
    setDescription('');
    setStatus(true);
    setPermissionIds([]);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Role name is required');
      return;
    }

    if (permissionIds.length === 0) {
      toast.error('Select at least one permission');
      return;
    }

    try {
      await createRole({ name, description, status, permissionIds }).unwrap();
      toast.success('Role created');
      setOpenModal(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create role');
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

      toast.success('Role updated');
      setOpenModal(false);
      setSelectedRole(null);
      setIsEdit(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update role');
    }
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      setDeletingId(roleToDelete.id);
      await deleteRole(roleToDelete.id).unwrap();
      toast.success('Role deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete role');
    } finally {
      setDeletingId(null);
      setRoleToDelete(null);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const roles = data?.data.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Roles</h1>
          <p className="mt-1 text-sm text-slate-500">
            Define what each role can access across the dashboard.
          </p>
        </div>

        <button
          onClick={() => {
            setIsEdit(false);
            setSelectedRole(null);
            resetForm();
            setOpenModal(true);
          }}
          className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Create role
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Permissions</th>
              <th className="px-4 py-3">Users</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {roles.map((role) => (
              <tr key={role.id} className="transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {role.name}
                </td>

                <td className="px-4 py-3 text-slate-500">
                  {role.description || (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      role.status
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {role.status ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {role.permissions.length}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {role._count.users}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(role)}
                      className="cursor-pointer rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setRoleToDelete(role)}
                      disabled={deletingId === role.id}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === role.id && (
                        <Spinner className="h-3 w-3" />
                      )}
                      {deletingId === role.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {roles.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No roles yet. Create one above to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
        onClose={() => {
          setOpenModal(false);
          setSelectedRole(null);
          setIsEdit(false);
          resetForm();
        }}
        isLoading={isEdit ? isUpdating : isCreating}
        onSave={isEdit ? handleUpdate : handleCreate}
        isEdit={isEdit}
      />

      <ConfirmModal
        open={roleToDelete !== null}
        title={`Delete "${roleToDelete?.name}"?`}
        description={
          roleToDelete && roleToDelete._count.users > 0
            ? `${roleToDelete._count.users} user(s) currently have this role. Deletion may be blocked until they are reassigned.`
            : 'This will permanently remove the role. This cannot be undone.'
        }
        isLoading={deletingId === roleToDelete?.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setRoleToDelete(null)}
      />
    </div>
  );
};

export default Roles;
