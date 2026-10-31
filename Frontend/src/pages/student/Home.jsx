import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FeatureCard from '../../components/FeatureCard';
import CourseCard from '../../components/CourseCard';
import { fetchCourses } from '../../store/courseSlice';

const features = [
  { title: 'Course Enrollment', description: 'Browse available courses and enroll in subjects matching your academic goals.' },
  { title: 'Learning Modules', description: 'Access structured learning materials designed for effective understanding.' },
  { title: 'Progress Tracking', description: 'Monitor your completion rates with visual progress indicators.' },
  { title: 'Student Dashboard', description: 'Manage enrolled courses and learning statistics from a unified hub.' },
  { title: 'Real-time Notifications', description: 'Get instant alerts about new courses and announcements - no refresh needed.' },
  { title: 'Live Chat', description: 'Message other students and admins instantly with Socket.IO powered chat.' },
];

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { list, loaded } = useSelector((s) => s.courses);

  useEffect(() => {
    if (!loaded) dispatch(fetchCourses());
  }, [dispatch, loaded]);

  return (
    <div className="container">
      <section className="hero">
        <h1>Master Your Learning Journey</h1>
        <p>ACADEXA provides a modern, seamless platform to enroll, track, and complete your courses efficiently.</p>
        <div className="hero-actions">
          {user ? (
            <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-outline-dark">Login</Link>
            </>
          )}
        </div>
      </section>

      <section>
        <div className="section-title"><h2>Platform Features</h2></div>
        <div className="features-grid">
          {features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      <section>
        <div className="section-title"><h2>Popular Courses</h2></div>
        <div className="course-grid">
          {list.slice(0, 3).map((c) => <CourseCard key={c.id} course={c} user={user} />)}
        </div>
        {loaded && list.length === 0 && <p className="muted center">No courses yet.</p>}
        <p className="center"><Link to="/courses" className="btn btn-primary">View all courses</Link></p>
      </section>
    </div>
  );
}
