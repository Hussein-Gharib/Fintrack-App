import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppLayout({ title, subtitle, children }) {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-panel">
        <Topbar title={title} subtitle={subtitle} />
        <section className="content-area">{children}</section>
      </main>
    </div>
  );
}

export default AppLayout;