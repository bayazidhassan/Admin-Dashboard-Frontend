export const getMediaUrl = (path?: string | null) => {
  if (!path) return '';

  return `${import.meta.env.VITE_SERVER_URL}${path}`;
};
