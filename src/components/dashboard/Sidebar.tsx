import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-5 text-xl font-bold">Admin Dashboard</div>

      <nav className="flex flex-col">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/dashboard/permissions">Permissions</NavLink>
        <NavLink to="/dashboard/roles">Roles</NavLink>
        <NavLink to="/dashboard/users">Users</NavLink>
        <NavLink to="/dashboard/media">Media</NavLink>
        <NavLink to="/dashboard/categories">Categories</NavLink>
        <NavLink to="/dashboard/brands">Brands</NavLink>
        <NavLink to="/dashboard/attributes">Attributes</NavLink>
        <NavLink to="/dashboard/products">Products</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
