import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const icons: Record<string, ReactNode> = {
  dashboard: (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <rect
        x="2.5"
        y="2.5"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="11.5"
        y="2.5"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="2.5"
        y="11.5"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="11.5"
        y="11.5"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  permissions: (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path
        d="M10 2.5 4 5v4.5c0 4 2.5 6.7 6 8 3.5-1.3 6-4 6-8V5l-6-2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10 9 11.5l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  roles: (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <circle cx="10" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 17c0-3 3-5 6.5-5s6.5 2 6.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <circle cx="7" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.5 17c0-2.8 2-4.5 4.5-4.5s4.5 1.7 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12.5 12.8c2 .2 3.5 1.7 3.5 4.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  media: (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <rect
        x="2.5"
        y="3.5"
        width="15"
        height="13"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="7" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.5 14 7 10l3 3 3-3.5 4.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  categories: (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path
        d="M3 4.5h5l1.5 2H17v9a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  brands: (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path
        d="M10 2.5 17.5 10 10 17.5 2.5 10 10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  attributes: (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path
        d="M3 6h14M3 10h14M3 14h9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  products: (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path
        d="M3 6.5 10 3l7 3.5v7L10 17l-7-3.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M3 6.5 10 10l7-3.5M10 10v7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const linkBase =
  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors';
const linkInactive = 'text-slate-400 hover:bg-slate-800 hover:text-white';
const linkActive = 'bg-indigo-500/15 text-indigo-400';

const navGroups: {
  label: string;
  items: { to: string; label: string; icon: string; end?: boolean }[];
}[] = [
  {
    label: 'Overview',
    items: [{ to: '/', label: 'Dashboard', icon: 'dashboard', end: true }],
  },
  {
    label: 'Access Control',
    items: [
      { to: '/permissions', label: 'Permissions', icon: 'permissions' },
      { to: '/roles', label: 'Roles', icon: 'roles' },
      { to: '/users', label: 'Users', icon: 'users' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/media', label: 'Media', icon: 'media' },
      { to: '/categories', label: 'Categories', icon: 'categories' },
      { to: '/brands', label: 'Brands', icon: 'brands' },
      { to: '/attributes', label: 'Attributes', icon: 'attributes' },
      { to: '/products', label: 'Products', icon: 'products' },
    ],
  },
];

const Sidebar = () => {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 text-white">
      <div className="flex items-center gap-2.5 border-b border-slate-800 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500 text-sm font-bold text-white">
          A
        </div>
        <span className="text-lg font-semibold tracking-tight">
          Admin Dashboard
        </span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              {group.label}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  {icons[item.icon]}
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
