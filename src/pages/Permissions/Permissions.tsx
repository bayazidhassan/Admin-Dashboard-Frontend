import { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import LoadingState, { Spinner } from '../../components/common/LoadingState';
import PermissionModal from '../../components/permissions/PermissionModal';
import {
  useCreatePermissionGroupMutation,
  useDeletePermissionGroupMutation,
  useGetPermissionGroupsQuery,
  useUpdatePermissionGroupMutation,
  type PermissionGroup,
} from '../../features/permission/permissionApi';

const actionOptions = ['watch', 'create', 'read', 'update', 'delete'];

const Permissions = () => {
  const { data, isLoading, error } = useGetPermissionGroupsQuery();

  const [name, setName] = useState('');
  const [actions, setActions] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<PermissionGroup | null>(
    null,
  );
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(
    null,
  );
  const [openModal, setOpenModal] = useState(false);
  const [addActions, setAddActions] = useState<string[]>([]);
  const [removePermissionIds, setRemovePermissionIds] = useState<string[]>([]);

  const [createPermissionGroup, { isLoading: isCreating }] =
    useCreatePermissionGroupMutation();
  const [updatePermissionGroup, { isLoading: isUpdating }] =
    useUpdatePermissionGroupMutation();
  const [deletePermissionGroup] = useDeletePermissionGroupMutation();

  const handleActionChange = (action: string) => {
    setActions((prev) =>
      prev.includes(action)
        ? prev.filter((item) => item !== action)
        : [...prev, action],
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Group name is required');
      return;
    }

    if (actions.length === 0) {
      toast.error('Select at least one action');
      return;
    }

    try {
      await createPermissionGroup({ name, description, actions }).unwrap();
      toast.success('Permission group created');
      setName('');
      setDescription('');
      setActions([]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create permission group');
    }
  };

  const handleEdit = (group: PermissionGroup) => {
    setSelectedGroup(group);
    setDescription(group.description ?? '');
    setAddActions([]);
    setRemovePermissionIds([]);
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedGroup) return;

    try {
      await updatePermissionGroup({
        id: selectedGroup.id,
        description,
        addActions,
        removePermissionIds,
      }).unwrap();

      toast.success('Permission group updated');
      setOpenModal(false);
      setSelectedGroup(null);
      setDescription('');
      setAddActions([]);
      setRemovePermissionIds([]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update permission group');
    }
  };

  const handleDeleteClick = (group: PermissionGroup) => {
    setGroupToDelete(group);
  };

  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;

    try {
      setDeletingId(groupToDelete.id);
      await deletePermissionGroup(groupToDelete.id).unwrap();
      toast.success('Permission group deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete permission group');
    } finally {
      setDeletingId(null);
      setGroupToDelete(null);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const groups = data?.data.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Permission Groups</h1>
        <p className="mt-1 text-sm text-slate-500">
          Group related permissions together, then assign groups to roles.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">
          Create a group
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {actionOptions.map((action) => {
            const checked = actions.includes(action);
            return (
              <button
                key={action}
                type="button"
                onClick={() => handleActionChange(action)}
                className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  checked
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-300 text-slate-600 hover:border-slate-400'
                }`}
              >
                {action}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreating && <Spinner className="h-4 w-4" />}
          {isCreating ? 'Creating...' : 'Create group'}
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Permissions</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {groups.map((group) => (
              <tr
                key={group.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {group.name}
                </td>

                <td className="px-4 py-3 text-slate-500">
                  {group.description || (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {group.permissions.length} permission
                    {group.permissions.length === 1 ? '' : 's'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(group)}
                      className="cursor-pointer rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteClick(group)}
                      disabled={deletingId === group.id}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === group.id && (
                        <Spinner className="h-3 w-3" />
                      )}
                      {deletingId === group.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {groups.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No permission groups yet. Create one above to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PermissionModal
        open={openModal}
        group={selectedGroup}
        description={description}
        setDescription={setDescription}
        addActions={addActions}
        setAddActions={setAddActions}
        removePermissionIds={removePermissionIds}
        setRemovePermissionIds={setRemovePermissionIds}
        isLoading={isUpdating}
        onClose={() => {
          setOpenModal(false);
          setSelectedGroup(null);
          setDescription('');
          setAddActions([]);
          setRemovePermissionIds([]);
        }}
        onSave={handleUpdate}
      />

      <ConfirmModal
        open={groupToDelete !== null}
        title={`Delete "${groupToDelete?.name}"?`}
        description="This will permanently remove the group and its permissions. This cannot be undone."
        isLoading={deletingId === groupToDelete?.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setGroupToDelete(null)}
      />
    </div>
  );
};

export default Permissions;
