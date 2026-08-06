import type { Role } from '../../features/role/roleApi';

interface Props {
  open: boolean;
  isEdit: boolean;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  roleId: string;
  setRoleId: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  roles: Role[];
  isLoading: boolean;
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

const inputClass =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none';
const labelClass = 'mb-1 block text-xs font-medium text-slate-500';

const UserModal = ({
  open,
  isEdit,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  roleId,
  setRoleId,
  phone,
  setPhone,
  gender,
  setGender,
  active,
  setActive,
  roles,
  isLoading,
  onClose,
  onSave,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-lg">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEdit ? 'Edit user' : 'Create user'}
          </h2>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className={labelClass}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              readOnly={isEdit}
              className={`${inputClass} ${
                isEdit
                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500'
                  : ''
              }`}
            />
          </div>

          {!isEdit && (
            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Role</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Not specified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {isEdit && (
            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="accent-indigo-600"
              />
              Active account
            </label>
          )}
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

export default UserModal;
