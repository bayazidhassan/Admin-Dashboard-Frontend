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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white shadow-lg">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Edit permission group
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">{group.name}</p>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Group name
            </label>
            <input
              readOnly
              value={group.name}
              className="w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this group for?"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Add actions
            </h3>

            <div className="flex flex-wrap gap-2">
              {actionOptions.map((action) => {
                const checked = addActions.includes(action);
                return (
                  <button
                    key={action}
                    type="button"
                    onClick={() => toggleAddAction(action)}
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
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Existing permissions
            </h3>

            {group.permissions.length === 0 ? (
              <p className="text-sm text-slate-400">
                No permissions in this group yet.
              </p>
            ) : (
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-slate-200 p-2">
                {group.permissions.map((permission) => {
                  const willRemove = removePermissionIds.includes(
                    permission.id,
                  );
                  return (
                    <label
                      key={permission.id}
                      className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                        willRemove
                          ? 'bg-red-50 text-red-600 line-through'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!willRemove}
                        onChange={() => toggleRemovePermission(permission.id)}
                        className="accent-indigo-600"
                      />
                      {permission.name}
                    </label>
                  );
                })}
              </div>
            )}

            {removePermissionIds.length > 0 && (
              <p className="mt-2 text-xs text-red-500">
                {removePermissionIds.length} permission
                {removePermissionIds.length === 1 ? '' : 's'} will be removed on
                save.
              </p>
            )}
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
            onClick={onSave}
            disabled={isLoading}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
