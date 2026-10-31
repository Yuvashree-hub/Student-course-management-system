import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearToast } from '../store/notificationSlice';

// Pop-up shown when a real-time notification arrives
export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((s) => s.notifications.toast);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => dispatch(clearToast()), 5000);
    return () => clearTimeout(t);
  }, [toast, dispatch]);

  if (!toast) return null;
  return (
    <div className="toast" role="status" onClick={() => dispatch(clearToast())}>
      <strong>🔔 {toast.title}</strong>
      <span>{toast.message}</span>
    </div>
  );
}
