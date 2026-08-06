import { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import LoadingState, { Spinner } from '../../components/common/LoadingState';
import UserModal from '../../components/user/UserModal';
import { useGetRolesQuery } from '../../features/role/roleApi';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  type User,
} from '../../features/user/userApi';

const Users = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [active, setActive] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data, isLoading, error } = useGetUsersQuery();
  const { data: rolesData } = useGetRolesQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRoleId('');
    setPhone('');
    setGender('');
    setActive(true);
  };

  const handleCreate = async () => {
    if (!name || !email || !password || !roleId) {
      toast.error('Name, email, password and role are required');
      return;
    }

    try {
      await createUser({ name, email, password, roleId }).unwrap();
      toast.success('User created');
      setOpenModal(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create user');
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setRoleId(user.roleId);
    setPhone(user.phone ?? '');
    setGender(user.gender ?? '');
    setActive(user.active);
    setIsEdit(true);
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    try {
      await updateUser({
        id: selectedUser.id,
        name,
        email,
        phone,
        gender,
        active,
        roleId,
      }).unwrap();

      toast.success('User updated');
      setOpenModal(false);
      setSelectedUser(null);
      setIsEdit(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update user');
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeletingId(userToDelete.id);
      await deleteUser(userToDelete.id).unwrap();
      toast.success('User deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete user');
    } finally {
      setDeletingId(null);
      setUserToDelete(null);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const users = data?.data.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage dashboard accounts and their assigned roles.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedUser(null);
            setIsEdit(false);
            resetForm();
            setOpenModal(true);
          }}
          className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Create user
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {user.role.name}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="cursor-pointer rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setUserToDelete(user)}
                      disabled={deletingId === user.id}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === user.id && (
                        <Spinner className="h-3 w-3" />
                      )}
                      {deletingId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No users yet. Create one above to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        open={openModal}
        isEdit={isEdit}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        roleId={roleId}
        setRoleId={setRoleId}
        phone={phone}
        setPhone={setPhone}
        gender={gender}
        setGender={setGender}
        active={active}
        setActive={setActive}
        roles={rolesData?.data.items ?? []}
        onClose={() => {
          setOpenModal(false);
          setSelectedUser(null);
          setIsEdit(false);
          resetForm();
        }}
        isLoading={isEdit ? isUpdating : isCreating}
        onSave={isEdit ? handleUpdate : handleCreate}
      />

      <ConfirmModal
        open={userToDelete !== null}
        title={`Delete "${userToDelete?.name}"?`}
        description="This will permanently remove the user account. This cannot be undone."
        isLoading={deletingId === userToDelete?.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
};

export default Users;
