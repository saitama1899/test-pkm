import { NavLink, Outlet } from "react-router-dom";
// import { useAppStore } from "../../stores/useAppStore";
import styles from "./RootLayout.module.css";

export default function RootLayout() {
  // const appName = useAppStore((s) => s.appName);

  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
        <header className={styles.topBar}>
        <div className={styles.logo} aria-label="Home" />
          <nav className={styles.nav}>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
              style={{backgroundColor: '#fff242', color: 'black'}}
            >
              CREAR
            </NavLink>
            <NavLink
              to="/teams"
              className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
              style={{backgroundColor: '#37b24d', color: 'black'}}
            >
              LUCHAR
            </NavLink>
          </nav>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
