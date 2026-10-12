const ShimmerCard = () => {
  return (
    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
      <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );
};

export const ShimmerGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {Array.from({ length: 16 }).map((_, i) => (
        <ShimmerCard key={i} />
      ))}
    </div>
  );
};
