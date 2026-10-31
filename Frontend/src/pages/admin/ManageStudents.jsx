import { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import Alert from '../../components/Alert';
import { getStudents, deleteStudent } from '../../api/studentApi';
import { errorMessage, formatDate } from '../../utils/format';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = async (q = '') => {
    setLoading(true);
    setError('');
    try {
      setStudents((await getStudents(q)).students);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // debounce server-side search
  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete student "${s.name}"? This also removes their enrollments and messages.`)) return;
    try {
      await deleteStudent(s.id);
      setStudents((list) => list.filter((x) => x.id !== s.id));
      setMessage({ type: 'success', text: `${s.name} was deleted.` });
    } catch (err) {
      setMessage({ type: 'error', text: errorMessage(err) });
    }
  };

  return (
    <section className="container page">
      <h1>Manage Students</h1>
      <div className="search-box">
        <input type="search" placeholder="Search by name, email or department..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search students" />
      </div>
      <Alert type={message.type || 'info'}>{message.text}</Alert>

      {loading && students.length === 0 ? (
        <Loader text="Loading students..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load(search)} />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Student ID</th><th>Department</th><th>Phone</th><th>Joined</th><th>Action</th></tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td data-label="Name">{s.name}</td>
                  <td data-label="Email">{s.email}</td>
                  <td data-label="Student ID">{s.studentId || '—'}</td>
                  <td data-label="Department">{s.department || '—'}</td>
                  <td data-label="Phone">{s.phone || '—'}</td>
                  <td data-label="Joined">{formatDate(s.createdAt)}</td>
                  <td data-label="Action"><button className="btn btn-danger btn-sm" onClick={() => handleDelete(s)}>Delete</button></td>
                </tr>
              ))}
              {students.length === 0 && <tr><td colSpan="7" className="center muted">No students found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
