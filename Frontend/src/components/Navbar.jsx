import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const active = ({ isActive }) => (isActive ? 'active' : '');

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = useSelector((s) => s.auth.user);
  const unreadNotifications = useSelector((s) => s.notifications.unread);
  const unreadChat = useSelector((s) => Object.values(s.chat.unread).reduce((a, b) => a + b, 0));
  const connected = useSelector((s) => s.chat.connected);

  const isAdmin = user?.role === 'admin';
  const close = () => setOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    close();
    navigate(isAdmin ? '/admin/login' : '/login');
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar" aria-label="Main navigation">
          <div className="logo">
            <Link to={isAdmin ? '/admin/dashboard' : '/'} onClick={close}>
              ACADEXA {isAdmin && <small>(Admin)</small>}
            </Link>
          </div>

          <button className="menu-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? '✕' : '☰'}
          </button>

          <div className={`nav-collapse ${open ? 'open' : ''}`}>
            <ul className="nav-links" onClick={close}>
              {isAdmin ? (
                <>
                  <li><NavLink to="/admin/dashboard" className={active}>Overview</NavLink></li>
                  <li><NavLink to="/admin/courses" className={active}>Manage Courses</NavLink></li>
                  <li><NavLink to="/admin/students" className={active}>Students</NavLink></li>
                  <li>
                    <NavLink to="/chat" className={active}>Chat{unreadChat > 0 && <span className="count">{unreadChat}</span>}</NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li><NavLink to="/" end className={active}>Home</NavLink></li>
                  <li><NavLink to="/courses" className={active}>Courses</NavLink></li>
                  {user && <li><NavLink to="/dashboard" className={active}>Dashboard</NavLink></li>}
                  {user && <li><NavLink to="/learning" className={active}>My Learning</NavLink></li>}
                  {user && (
                    <li>
                      <NavLink to="/chat" className={active}>Chat{unreadChat > 0 && <span className="count">{unreadChat}</span>}</NavLink>
                    </li>
                  )}
                </>
              )}
            </ul>

            <div className="nav-buttons" onClick={close}>
              {user ? (
                <>
                  <Link to="/notifications" className="bell" aria-label="Notifications" title={connected ? 'Live' : 'Offline'}>
                    🔔{unreadNotifications > 0 && <span className="count">{unreadNotifications}</span>}
                    <span className={`dot ${connected ? 'dot-on' : 'dot-off'}`} />
                  </Link>
                  {!isAdmin && <Link to="/profile" className="nav-user">{user.name.split(' ')[0]}</Link>}
                  <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline">Login</Link>
                  <Link to="/register" className="btn btn-primary">Register</Link>
                  <Link to="/admin/login" className="admin-link">Admin</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
