interface ErrorStateProps {
  error: unknown;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  let message = 'Something went wrong.';

  if (error && typeof error === 'object' && 'status' in error) {
    switch (error.status) {
      case 401:
        message = 'Your session has expired. Please log in again.';
        break;
      case 403:
        message =
          "You don't have permission to view this page. Please contact your administrator if you believe this is a mistake.";
        break;
      case 404:
        message = 'The requested resource was not found.';
        break;
      case 'FETCH_ERROR':
        message =
          'Unable to connect to the server. Please check your internet connection.';
        break;
      default:
        message = 'Something went wrong.';
    }
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {message}
    </div>
  );
};

export default ErrorState;
