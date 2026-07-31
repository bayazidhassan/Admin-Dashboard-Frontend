import { useState } from 'react';
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

  const { data, isLoading, error } = useGetUsersQuery();
  const { data: rolesData } = useGetRolesQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (isLoading) return <h2>Loading...</h2>;
  if (error) return <h2>Something went wrong.</h2>;

  const handleCreate = async () => {
    if (!name || !email || !password || !roleId) return;

    try {
      await createUser({
        name,
        email,
        password,
        roleId,
      }).unwrap();

      setOpenModal(false);

      setName('');
      setEmail('');
      setPassword('');
      setRoleId('');
      setPhone('');
      setGender('');
      setActive(true);
    } catch (error) {
      console.error(error);
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

      setOpenModal(false);

      setSelectedUser(null);

      setIsEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm('Delete this user?');

    if (!ok) return;

    setDeletingId(id);

    try {
      await deleteUser(id).unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>

        <button
          onClick={() => {
            setSelectedUser(null);
            setIsEdit(false);

            setName('');
            setEmail('');
            setPassword('');
            setRoleId('');
            setPhone('');
            setGender('');
            setActive(true);

            setOpenModal(true);
          }}
          className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
        >
          Create User
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.data.items.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-3">{user.name}</td>

              <td className="p-3">{user.email}</td>

              <td className="p-3">{user.role.name}</td>

              <td className="p-3">{user.active ? 'Active' : 'Inactive'}</td>

              <td className="space-x-2 p-3">
                <button
                  onClick={() => handleEdit(user)}
                  className="cursor-pointer rounded bg-yellow-500 px-3 py-1 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={deletingId === user.id}
                  className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white disabled:opacity-50"
                >
                  {deletingId === user.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        onClose={() => setOpenModal(false)}
        isLoading={isEdit ? isUpdating : isCreating}
        onSave={isEdit ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default Users;
