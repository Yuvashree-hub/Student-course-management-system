import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CourseCard from '../../components/CourseCard';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import Alert from '../../components/Alert';
import { fetchCourses } from '../../store/courseSlice';
import { fetchMyEnrollments, enrollCourse, clearActionError } from '../../store/enrollmentSlice';

export default function Courses() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [enrollingId, setEnrollingId] = useState(null);
  const [notice, setNotice] = useState('');

  const user = useSelector((s) => s.auth.user);
  const { list: courses, loading, error } = useSelector((s) => s.courses);
  const { list: enrollments, actionError } = useSelector((s) => s.enrollments);

  const isStudent = user?.role === 'student';

  useEffect(() => {
    dispatch(fetchCourses());
    if (isStudent) dispatch(fetchMyEnrollments());
    return () => dispatch(clearActionError());
  }, [dispatch, isStudent]);

  const enrollmentFor = (courseId) => enrollments.find((e) => (e.courseId?.id ?? e.courseId?._id) === courseId);

  const handleEnroll = async (course) => {
    setNotice('');
    setEnrollingId(course.id);
    const res = await dispatch(enrollCourse(course.id));
    setEnrollingId(null);
    if (enrollCourse.fulfilled.match(res)) setNotice(`Enrolled in "${course.title}" successfully!`);
  };

  const filtered = courses.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="container page">
      <div className="section-title"><h2>Available Course Catalog</h2></div>

      <div className="search-box">
        <input type="search" placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search courses" />
      </div>

      <Alert type="success">{notice}</Alert>
      <Alert type="error">{actionError}</Alert>

      {loading && courses.length === 0 ? (
        <Loader text="Loading courses..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => dispatch(fetchCourses())} />
      ) : (
        <div className="course-grid">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              user={user}
              enrollment={isStudent ? enrollmentFor(course.id) : undefined}
              onEnroll={handleEnroll}
              enrolling={enrollingId === course.id}
            />
          ))}
          {filtered.length === 0 && <p className="muted center">No courses match your search.</p>}
        </div>
      )}
    </section>
  );
}
