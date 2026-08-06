import type { PermissionGroup } from '../../features/permission/permissionApi';

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

const Spinner = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z"
    />
  </svg>
);

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

  const toggleGroup = (group: PermissionGroup) => {
    const groupIds = group.permissions.map((p) => p.id);
    const allSelected = groupIds.every((id) => permissionIds.includes(id));

    setPermissionIds((prev) =>
      allSelected
        ? prev.filter((id) => !groupIds.includes(id))
        : [...new Set([...prev, ...groupIds])],
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-lg">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEdit ? 'Edit role' : 'Create role'}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <div className="flex flex-col justify-between gap-3 sm:w-1/3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Role name
                </label>
                <input
                  value={name}
                  readOnly={isEdit}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Manager"
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${
                    isEdit
                      ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="accent-indigo-600"
                />
                Active role
              </label>
            </div>

            <div className="flex flex-1 flex-col">
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this role for?"
                className="w-full flex-1 resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <h3 className="mt-6 mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Permissions
            <span className="ml-1 font-normal normal-case text-slate-400">
              ({permissionIds.length} selected)
            </span>
          </h3>

          <div className="space-y-3">
            {permissionGroups.map((group) => {
              const groupIds = group.permissions.map((p) => p.id);
              const allSelected =
                groupIds.length > 0 &&
                groupIds.every((id) => permissionIds.includes(id));

              return (
                <div
                  key={group.id}
                  className="rounded-md border border-slate-200 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-800">
                      {group.name}
                    </h4>

                    <button
                      type="button"
                      onClick={() => toggleGroup(group)}
                      className="text-xs font-medium text-indigo-600 hover:underline"
                    >
                      {allSelected ? 'Deselect all' : 'Select all'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {group.permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
                      >
                        <input
                          type="checkbox"
                          checked={permissionIds.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="accent-indigo-600"
                        />
                        {permission.name}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={onSave}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
