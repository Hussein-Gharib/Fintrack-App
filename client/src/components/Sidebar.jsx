import { NavLink } from "react-router-dom";
import LogoIcon from "./LogoIcon";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <LogoIcon />

        <div>
          <h2>FinTrack</h2>
          <span>Finance OS</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/categories">Categories</NavLink>
      </nav>

      <div className="sidebar-card">
        <strong>Pro tip</strong>
        <p>Review expenses weekly to keep your budget under control.</p>
      </div>
    </aside>
  );
}

export default Sidebar;