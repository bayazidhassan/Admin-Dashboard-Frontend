import { useState } from 'react';
import PermissionModal from '../../components/permissions/PermissionModal';
import {
  useCreatePermissionGroupMutation,
  useDeletePermissionGroupMutation,
  useGetPermissionGroupsQuery,
  useUpdatePermissionGroupMutation,
  type PermissionGroup,
} from '../../features/permission/permissionApi';

const Permissions = () => {
  const { data, isLoading, error } = useGetPermissionGroupsQuery();

  const [name, setName] = useState('');
  const [actions, setActions] = useState<string[]>([]);
  const [deletePermissionGroup] = useDeletePermissionGroupMutation();
  const [createPermissionGroup, { isLoading: isCreating }] =
    useCreatePermissionGroupMutation();
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(
    null,
  );
  const [openModal, setOpenModal] = useState(false);
  const [description, setDescription] = useState('');
  const [addActions, setAddActions] = useState<string[]>([]);
  const [removePermissionIds, setRemovePermissionIds] = useState<string[]>([]);

  const [updatePermissionGroup, { isLoading: isUpdating }] =
    useUpdatePermissionGroupMutation();

  const actionOptions = ['watch', 'create', 'read', 'update', 'delete'];

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Something went wrong.</h2>;

  const handleActionChange = (action: string) => {
    setActions((prev) =>
      prev.includes(action)
        ? prev.filter((item) => item !== action)
        : [...prev, action],
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    if (actions.length === 0) {
      alert('Select at least one action');
      return;
    }

    try {
      await createPermissionGroup({
        name,
        description,
        actions,
      }).unwrap();

      setName('');
      setDescription('');
      setActions([]);
    } catch (error) {
      console.error(error);
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

      setOpenModal(false);
      setSelectedGroup(null);

      setDescription('');
      setAddActions([]);
      setRemovePermissionIds([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm('Delete this permission group?');

    if (!ok) return;

    try {
      await deletePermissionGroup(id).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Permission Groups</h1>

      <div className="mb-6 rounded border p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-4">
          {actionOptions.map((action) => (
            <label key={action} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={actions.includes(action)}
                onChange={() => handleActionChange(action)}
              />
              {action}
            </label>
          ))}
        </div>

        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          {isCreating ? 'Creating...' : 'Create Group'}
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Permissions</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.data.items.map((group) => (
            <tr key={group.id} className="border-b">
              <td className="p-3">{group.name}</td>

              <td className="p-3">{group.description}</td>

              <td className="p-3">{group.permissions.length}</td>

              <td className="p-3 space-x-2">
                <button
                  onClick={() => handleEdit(group)}
                  className="rounded cursor-pointer bg-yellow-500 px-3 py-1 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(group.id)}
                  className="rounded cursor-pointer bg-red-500 px-3 py-1 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        }}
        onSave={handleUpdate}
      />
    </div>
  );
};

export default Permissions;
