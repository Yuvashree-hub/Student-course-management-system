import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormField from '../../components/FormField';
import Alert from '../../components/Alert';
import useForm from '../../hooks/useForm';
import { registerUser, clearAuthError } from '../../store/authSlice';
import { validateRegisterForm } from '../../utils/validation';

const initial = { fullName: '', studentId: '', email: '', phone: '', department: '', password: '', confirmPassword: '' };

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [success, setSuccess] = useState('');
  const { values, field, touchAll, isValid } = useForm(initial, validateRegisterForm);

  useEffect(() => () => { dispatch(clearAuthError()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    touchAll();
    if (!isValid) return;
    const res = await dispatch(
      registerUser({
        name: values.fullName,
        studentId: values.studentId,
        email: values.email,
        phone: values.phone,
        department: values.department,
        password: values.password,
      })
    );
    if (registerUser.fulfilled.match(res)) {
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    }
  };

  return (
    <section className="login-section">
      <div className="login-card">
        <h2>Create Student Account</h2>
        <p className="subtitle">Join ACADEXA and start learning today.</p>

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Full Name" autoComplete="name" {...field('fullName')} />
          <FormField label="Student ID" {...field('studentId')} />
          <FormField label="Email Address" type="email" autoComplete="email" {...field('email')} />
          <FormField label="Phone Number" type="tel" autoComplete="tel" {...field('phone')} />
          <FormField label="Department" {...field('department')} />
          <FormField label="Password (min 8 characters)" type="password" autoComplete="new-password" {...field('password')} />
          <FormField label="Confirm Password" type="password" autoComplete="new-password" {...field('confirmPassword')} />
          <button type="submit" className="btn btn-primary btn-full" disabled={loading || !!success}>
            {loading ? 'Creating account...' : 'Register Account'}
          </button>
        </form>

        <Alert type="success">{success}</Alert>
        <Alert type="error">{error}</Alert>

        <p className="form-footer">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}
