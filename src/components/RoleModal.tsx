import type { PermissionGroup } from '../features/permission/permissionApi';

interface Props {
  open: boolean;

  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;

  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;

  status: boolean;
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;

  permissionIds: string[];
  setPermissionIds: React.Dispatch<React.SetStateAction<string[]>>;

  permissionGroups: PermissionGroup[];

  isLoading: boolean;

  isEdit: boolean;

  onClose: () => void;
  onSave: () => void;
}

const RoleModal = ({
  open,

  name,
  setName,

  description,
  setDescription,

  status,
  setStatus,

  permissionIds,
  setPermissionIds,

  permissionGroups,

  isLoading,

  isEdit,

  onClose,
  onSave,
}: Props) => {
  const togglePermission = (permissionId: string) => {
    setPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-187.5 overflow-y-auto rounded bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold">Role</h2>

        <input
          value={name}
          readOnly={isEdit}
          onChange={(e) => setName(e.target.value)}
          placeholder="Role Name"
          className={`mb-4 w-full rounded border p-2 ${
            isEdit ? 'cursor-not-allowed bg-gray-100' : ''
          }`}
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="mb-4 w-full rounded border p-2"
        />

        <label className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
          Active
        </label>

        {permissionGroups.map((group) => (
          <div key={group.id} className="mb-5 rounded border p-3">
            <h3 className="mb-3 font-semibold">{group.name}</h3>

            <div className="grid grid-cols-2 gap-2">
              {group.permissions.map((permission) => (
                <label key={permission.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permissionIds.includes(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                  />

                  {permission.name}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded border px-4 py-2">
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={onSave}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
