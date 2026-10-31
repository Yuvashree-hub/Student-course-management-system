import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import { fetchNotifications, readNotification, readAllNotifications } from '../../store/notificationSlice';
import { formatDate, formatTime } from '../../utils/format';

export default function Notifications() {
  const dispatch = useDispatch();
  const { list, unread, loading, error } = useSelector((s) => s.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  if (loading && list.length === 0) return <Loader text="Loading notifications..." />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchNotifications())} />;

  return (
    <section className="container page">
      <div className="row-between">
        <h1>Notifications {unread > 0 && <span className="count static">{unread}</span>}</h1>
        {unread > 0 && <button className="btn btn-primary" onClick={() => dispatch(readAllNotifications())}>Mark all as read</button>}
      </div>
      <p className="muted">New notifications appear here instantly - no page refresh needed.</p>

      {list.length === 0 ? (
        <div className="state-box"><p>You&apos;re all caught up. No notifications yet.</p></div>
      ) : (
        <ul className="notif-list">
          {list.map((n) => (
            <li key={n.id} className={n.read ? '' : 'unread'} onClick={() => !n.read && dispatch(readNotification(n.id))}>
              <strong>{n.title}</strong>
              <span>{n.message}</span>
              <small>{formatDate(n.createdAt)} · {formatTime(n.createdAt)}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
