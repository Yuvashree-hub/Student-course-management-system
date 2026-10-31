import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import Alert from '../../components/Alert';
import FormField from '../../components/FormField';
import useForm from '../../hooks/useForm';
import { getAdminStats } from '../../api/chatApi';
import { broadcastNotification } from '../../api/notificationApi';
import { errorMessage } from '../../utils/format';
import { validateRequired } from '../../utils/validation';

const validateAnnouncement = (v) => ({
  title: validateRequired(v.title, 'Title'),
  message: validateRequired(v.message, 'Message'),
});

export default function AdminDashboard() {
  const user = useSelector((s) => s.auth.user);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState({ type: '', text: '' });
  const { field, values, touchAll, reset, isValid } = useForm({ title: '', message: '' }, validateAnnouncement);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setStats(await getAdminStats());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    touchAll();
    if (!isValid) return;
    setSending(true);
    setResult({ type: '', text: '' });
    try {
      const res = await broadcastNotification(values);
      setResult({ type: 'success', text: res.message });
      reset();
    } catch (err) {
      setResult({ type: 'error', text: errorMessage(err) });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader text="Loading admin console..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <section className="container page">
      <h1>Admin Control Console</h1>
      <p className="muted">Signed in as {user.email}</p>

      <div className="dashboard-grid">
        <div className="dashboard-card"><h3>Total Students</h3><h2 className="stat">{stats.students}</h2></div>
        <div className="dashboard-card"><h3>Active Courses</h3><h2 className="stat">{stats.courses}</h2></div>
        <div className="dashboard-card"><h3>Enrollments</h3><h2 className="stat">{stats.enrollments}</h2></div>
        <div className="dashboard-card"><h3>Completed</h3><h2 className="stat">{stats.completed}</h2></div>
        <div className="dashboard-card"><h3>Users Online</h3><h2 className="stat">{stats.onlineUsers}</h2></div>
      </div>

      <div className="panel">
        <h3>📢 Send announcement to all students</h3>
        <p className="muted">Delivered instantly to everyone who is online, and saved for everyone else.</p>
        <form onSubmit={handleBroadcast} noValidate>
          <FormField label="Title" {...field('title')} />
          <FormField label="Message" as="textarea" rows={3} {...field('message')} />
          <button className="btn btn-primary" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send Announcement'}</button>
        </form>
        <Alert type={result.type || 'info'}>{result.text}</Alert>
      </div>
    </section>
  );
}
