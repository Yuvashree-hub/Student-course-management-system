import { useMemo, useState } from 'react';
import { hasErrors } from '../utils/validation';

// Reusable form-state hook: values + live validation + touched tracking.
export default function useForm(initialValues, validator) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});

  const errors = useMemo(() => validator(values), [values, validator]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));
  const touchAll = () => setTouched(Object.fromEntries(Object.keys(initialValues).map((k) => [k, true])));
  const reset = (next = initialValues) => { setValues(next); setTouched({}); };

  // props to spread onto <FormField />
  const field = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
    touched: touched[name],
  });

  return { values, errors, touched, field, touchAll, reset, setValues, isValid: !hasErrors(errors) };
}
