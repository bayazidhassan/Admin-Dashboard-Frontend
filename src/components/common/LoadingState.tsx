export const Spinner = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z"
    />
  </svg>
);

interface LoadingStateProps {
  message?: string;
  className?: string;
}

const LoadingState = ({
  message = 'Loading...',
  className = 'h-64',
}: LoadingStateProps) => {
  return (
    <div
      className={`flex ${className} flex-col items-center justify-center gap-3 text-slate-400`}
    >
      <Spinner className="h-8 w-8" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default LoadingState;
