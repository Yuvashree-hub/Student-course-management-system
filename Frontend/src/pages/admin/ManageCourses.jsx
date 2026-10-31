import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormField from '../../components/FormField';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import Alert from '../../components/Alert';
import useForm from '../../hooks/useForm';
import { fetchCourses, addCourse, editCourse, removeCourse } from '../../store/courseSlice';
import { validateCourseForm } from '../../utils/validation';

const blank = { title: '', duration: '', instructor: '', description: '' };

export default function ManageCourses() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.courses);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const { values, field, touchAll, reset, isValid } = useForm(blank, validateCourseForm);

  useEffect(() => { dispatch(fetchCourses()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    touchAll();
    if (!isValid) return;
    setSaving(true);
    const action = editingId ? editCourse({ id: editingId, data: values }) : addCourse(values);
    const res = await dispatch(action);
    setSaving(false);
    if (res.error) {
      setMessage({ type: 'error', text: res.payload || 'Could not save course' });
    } else {
      setMessage({ type: 'success', text: editingId ? 'Course updated.' : 'Course added. Students were notified in real time.' });
      setEditingId(null);
      reset(blank);
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    reset({ title: c.title, duration: c.duration, instructor: c.instructor || '', description: c.description });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditingId(null); reset(blank); };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete "${c.title}"? All enrollments for this course will be removed too.`)) return;
    const res = await dispatch(removeCourse(c.id));
    setMessage(res.error ? { type: 'error', text: res.payload } : { type: 'success', text: 'Course deleted.' });
  };

  return (
    <section className="container page">
      <h1>Manage Platform Courses</h1>

      <form onSubmit={handleSubmit} noValidate className="panel">
        <h3>{editingId ? 'Edit Course' : 'Add New Course'}</h3>
        <div className="form-grid">
          <FormField label="Course Title" {...field('title')} />
          <FormField label="Duration (e.g. 6 Weeks)" {...field('duration')} />
          <FormField label="Instructor" {...field('instructor')} />
        </div>
        <FormField label="Description" as="textarea" rows={3} {...field('description')} />
        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Course'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>}
        </div>
        <Alert type={message.type || 'info'}>{message.text}</Alert>
      </form>

      {loading && list.length === 0 ? (
        <Loader text="Loading courses..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => dispatch(fetchCourses())} />
      ) : (
        <div className="course-grid">
          {list.map((c) => (
            <article key={c.id} className="course-card">
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <p className="course-info"><span><strong>Duration:</strong> {c.duration}</span><span><strong>Instructor:</strong> {c.instructor}</span></p>
              <div className="btn-row">
                <button className="btn btn-primary" onClick={() => startEdit(c)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(c)}>Delete</button>
              </div>
            </article>
          ))}
          {list.length === 0 && <p className="muted center">No courses yet. Add your first one above.</p>}
        </div>
      )}
    </section>
  );
}
