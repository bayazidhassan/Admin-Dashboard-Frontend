import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-5 text-xl font-bold">Admin Dashboard</div>

      <nav className="flex flex-col">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/permissions">Permissions</NavLink>
        <NavLink to="/roles">Roles</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/media">Media</NavLink>
        <NavLink to="/categories">Categories</NavLink>
        <NavLink to="/brands">Brands</NavLink>
        <NavLink to="/attributes">Attributes</NavLink>
        <NavLink to="/products">Products</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
