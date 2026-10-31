// Reusable form input with validation feedback (error message / success tick)
export default function FormField({ label, name, type = 'text', value, onChange, onBlur, error, touched, as = 'input', ...rest }) {
  const showError = touched && error;
  const showOk = touched && !error && String(value ?? '').length > 0;
  const Tag = as;
  return (
    <div className={`form-group ${showError ? 'has-error' : ''} ${showOk ? 'has-success' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <Tag id={name} name={name} type={as === 'input' ? type : undefined} value={value} onChange={onChange} onBlur={onBlur} {...rest} />
      {showError && <small className="field-error" role="alert">{error}</small>}
      {showOk && <small className="field-ok">Looks good ✓</small>}
    </div>
  );
}
