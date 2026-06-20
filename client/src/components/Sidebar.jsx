import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Home", icon: "⌂" },
  { to: "/transactions", label: "History", icon: "▤" },
  { to: "/categories", label: "Budget", icon: "▣" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="brand-orb">FT</div>
        <div>
          <h2>FinTrack</h2>
          <span>Personal finance</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-card">
        <strong>Stay in control</strong>
        <p>Track every transaction and review your monthly balance.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
