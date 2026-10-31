export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state-box error-box" role="alert">
      <h3>⚠️ Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>Retry</button>
      )}
    </div>
  );
}
