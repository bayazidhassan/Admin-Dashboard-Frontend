import { useGetMediaQuery } from '../../features/media/mediaApi';
import { getMediaUrl } from '../../lib/media';

const Media = () => {
  const { data, isLoading, error } = useGetMediaQuery();

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Something went wrong.</h2>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media Library</h1>

        <button className="cursor-pointer rounded bg-black px-4 py-2 text-white">
          Upload
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {data?.data.items.map((media) => (
          <div
            key={media.id}
            className="overflow-hidden rounded-lg border bg-white shadow"
          >
            <img
              src={getMediaUrl(media.thumbnail ?? media.publicUrl)}
              alt={media.altText ?? media.fileName}
              className="h-40 w-full object-cover"
            />

            <div className="space-y-2 p-3">
              <p className="truncate font-medium">
                {media.title ?? media.fileName}
              </p>

              <p className="text-xs text-gray-500">
                {(media.size / 1024 / 1024).toFixed(2)} MB
              </p>

              <p className="text-xs text-gray-500">
                {media.width} × {media.height}
              </p>

              <div className="flex gap-2">
                <button className="cursor-pointer rounded bg-blue-500 px-3 py-1 text-white">
                  Edit
                </button>

                <button className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Media;
