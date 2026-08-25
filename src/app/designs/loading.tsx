export default function DesignsLoading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1C1C1E] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-12 w-48 bg-gray-200 dark:bg-[#252528] rounded animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-gray-200 dark:bg-[#252528] rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
