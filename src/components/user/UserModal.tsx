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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-162.5 overflow-y-auto rounded bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold">
          {isEdit ? 'Edit User' : 'Create User'}
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="mb-4 w-full rounded border p-2"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={`mb-4 w-full rounded border p-2 ${
            isEdit ? 'cursor-not-allowed bg-gray-100' : ''
          }`}
          readOnly={isEdit}
        />

        {!isEdit && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-4 w-full rounded border p-2"
          />
        )}

        <select
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          className="mb-4 w-full rounded border p-2 cursor-pointer"
        >
          <option value="">Select Role</option>

          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="mb-4 w-full rounded border p-2"
        />

        <input
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          placeholder="Gender"
          className="mb-4 w-full rounded border p-2"
        />

        {isEdit && (
          <label className="mb-6 flex items-center gap-2">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Active
          </label>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={onSave}
            className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
