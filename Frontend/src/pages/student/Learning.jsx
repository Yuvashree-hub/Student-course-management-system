import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import Alert from '../../components/Alert';
import { fetchMyEnrollments, updateEnrollmentProgress, unenrollCourse, clearActionError } from '../../store/enrollmentSlice';

export default function Learning() {
  const dispatch = useDispatch();
  const { list, loading, error, actionError } = useSelector((s) => s.enrollments);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyEnrollments());
    return () => dispatch(clearActionError());
  }, [dispatch]);

  const setProgress = async (id, progress) => {
    setBusyId(id);
    await dispatch(updateEnrollmentProgress({ id, progress: Math.min(100, Math.max(0, progress)) }));
    setBusyId(null);
  };

  const handleUnenroll = async (e) => {
    if (!window.confirm(`Unenroll from "${e.courseId.title}"? Your progress will be lost.`)) return;
    setBusyId(e.id);
    await dispatch(unenrollCourse(e.id));
    setBusyId(null);
  };

  if (loading && list.length === 0) return <Loader text="Loading your courses..." />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchMyEnrollments())} />;

  return (
    <section className="container page">
      <h1>Learning Workspace</h1>
      <p className="muted">Track and update your progress in each enrolled course.</p>
      <Alert type="error">{actionError}</Alert>

      {list.length === 0 ? (
        <div className="state-box">
          <p>No enrolled courses yet.</p>
          <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="learning-list">
          {list.map((e) => (
            <article key={e.id} className="learning-item">
              <div className="learning-head">
                <h3>{e.courseId.title}</h3>
                <span className={`badge badge-${e.status.replace(/\s/g, '').toLowerCase()}`}>{e.status}</span>
              </div>
              <p>{e.courseId.description}</p>
              <progress value={e.progress} max="100" />
              <p className="muted">{e.progress}% complete · {e.courseId.duration}</p>
              <div className="btn-row">
                <button className="btn btn-primary" disabled={busyId === e.id || e.progress >= 100} onClick={() => setProgress(e.id, e.progress + 25)}>+25% Progress</button>
                <button className="btn btn-primary" disabled={busyId === e.id || e.progress >= 100} onClick={() => setProgress(e.id, 100)}>Mark as Complete</button>
                <button className="btn btn-danger" disabled={busyId === e.id} onClick={() => handleUnenroll(e)}>Unenroll</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
