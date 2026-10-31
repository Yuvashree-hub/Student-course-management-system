import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import CourseCard from '../../components/CourseCard';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import { fetchMyEnrollments, selectEnrollmentStats } from '../../store/enrollmentSlice';
import { fetchNotifications } from '../../store/notificationSlice';
import { formatDate } from '../../utils/format';

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { list: enrollments, loading, error } = useSelector((s) => s.enrollments);
  const stats = useSelector(selectEnrollmentStats, shallowEqual);
  const allNotifications = useSelector((s) => s.notifications.list);
  const notifications = allNotifications.slice(0, 3);

  const load = () => {
    dispatch(fetchMyEnrollments());
    dispatch(fetchNotifications());
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [dispatch]);

  if (loading && enrollments.length === 0) return <Loader text="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <section className="container page">
      <div className="welcome-banner">
        <h1>Welcome Back, {user.name}!</h1>
        <p>
          <strong>Department:</strong> {user.department || '—'} &nbsp;|&nbsp; <strong>Email:</strong> {user.email}
          {user.studentId && <> &nbsp;|&nbsp; <strong>ID:</strong> {user.studentId}</>}
        </p>
        <p className="muted">Member since {formatDate(user.createdAt)} · <Link to="/profile">Edit profile</Link></p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card"><h3>Enrolled Courses</h3><h2 className="stat">{stats.enrolledCount}</h2></div>
        <div className="dashboard-card"><h3>Completed Courses</h3><h2 className="stat">{stats.completedCount}</h2></div>
        <div className="dashboard-card"><h3>Overall Progress</h3><h2 className="stat">{stats.overallProgress}%</h2></div>
      </div>

      <h2 className="subheading">Enrolled Course Status</h2>
      {enrollments.length === 0 ? (
        <div className="state-box">
          <p>You haven&apos;t enrolled in any course yet.</p>
          <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="course-grid">
          {enrollments.map((e) => <CourseCard key={e.id} course={e.courseId} enrollment={e} user={user} />)}
        </div>
      )}

      <h2 className="subheading">Recent Notifications</h2>
      {notifications.length === 0 ? (
        <p className="muted">No notifications yet.</p>
      ) : (
        <ul className="notif-list">
          {notifications.map((n) => (
            <li key={n.id} className={n.read ? '' : 'unread'}>
              <strong>{n.title}</strong><span>{n.message}</span>
            </li>
          ))}
        </ul>
      )}
      <p><Link to="/notifications">View all notifications →</Link></p>
    </section>
  );
}
