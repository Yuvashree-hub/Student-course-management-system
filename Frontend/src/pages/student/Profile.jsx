import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormField from '../../components/FormField';
import Alert from '../../components/Alert';
import useForm from '../../hooks/useForm';
import { updateProfile, deleteAccount, logout } from '../../store/authSlice';
import { validateProfileForm } from '../../utils/validation';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [success, setSuccess] = useState('');

  const { values, field, touchAll, isValid, setValues } = useForm(
    { name: user.name, studentId: user.studentId || '', department: user.department || '', phone: user.phone || '', password: '' },
    validateProfileForm
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    touchAll();
    if (!isValid) return;
    const data = { name: values.name, studentId: values.studentId, department: values.department, phone: values.phone };
    if (values.password) data.password = values.password;
    const res = await dispatch(updateProfile({ id: user.id, data }));
    if (updateProfile.fulfilled.match(res)) {
      setSuccess('Profile updated successfully.');
      setValues((v) => ({ ...v, password: '' }));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your account permanently? This removes your enrollments, notifications and messages.')) return;
    const res = await dispatch(deleteAccount(user.id));
    if (deleteAccount.fulfilled.match(res)) {
      dispatch(logout());
      navigate('/');
    }
  };

  return (
    <section className="login-section">
      <div className="login-card wide">
        <h2>My Profile</h2>
        <p className="subtitle">Email: <strong>{user.email}</strong></p>
        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Full Name" {...field('name')} />
          <FormField label="Student ID" {...field('studentId')} />
          <FormField label="Department" {...field('department')} />
          <FormField label="Phone Number" type="tel" {...field('phone')} />
          <FormField label="New Password (leave blank to keep current)" type="password" autoComplete="new-password" {...field('password')} />
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Saving...' : 'Update Profile'}</button>
        </form>
        <Alert type="success">{success}</Alert>
        <Alert type="error">{error}</Alert>
        <hr className="divider" />
        <button className="btn btn-danger btn-full" onClick={handleDelete}>Delete My Account</button>
      </div>
    </section>
  );
}
