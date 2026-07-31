import type { PermissionGroup } from '../../features/permission/permissionApi';

interface Props {
  open: boolean;
  group: PermissionGroup | null;

  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;

  addActions: string[];
  setAddActions: React.Dispatch<React.SetStateAction<string[]>>;

  removePermissionIds: string[];
  setRemovePermissionIds: React.Dispatch<React.SetStateAction<string[]>>;

  isLoading: boolean;

  onClose: () => void;
  onSave: () => void;
}

const actionOptions = ['watch', 'create', 'read', 'update', 'delete'];

const PermissionModal = ({
  open,
  group,

  description,
  setDescription,

  addActions,
  setAddActions,

  removePermissionIds,
  setRemovePermissionIds,

  isLoading,

  onClose,
  onSave,
}: Props) => {
  if (!open || !group) return null;

  const toggleAddAction = (action: string) => {
    setAddActions((prev) =>
      prev.includes(action)
        ? prev.filter((item) => item !== action)
        : [...prev, action],
    );
  };

  const toggleRemovePermission = (permissionId: string) => {
    setRemovePermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((item) => item !== permissionId)
        : [...prev, permissionId],
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-162.5 rounded bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold">Edit Permission Group</h2>

        <div className="space-y-4">
          <input
            readOnly
            value={group.name}
            className="w-full rounded border bg-gray-100 p-2"
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full rounded border p-2"
          />

          <div>
            <h3 className="mb-2 font-semibold">Add Actions</h3>

            <div className="flex flex-wrap gap-4">
              {actionOptions.map((action) => (
                <label key={action} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addActions.includes(action)}
                    onChange={() => toggleAddAction(action)}
                  />

                  {action}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Existing Permissions</h3>

            <div className="space-y-2">
              {group.permissions.map((permission) => (
                <label key={permission.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!removePermissionIds.includes(permission.id)}
                    onChange={() => toggleRemovePermission(permission.id)}
                  />

                  {permission.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="rounded border px-4 py-2">
              Cancel
            </button>

            <button
              onClick={onSave}
              disabled={isLoading}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
