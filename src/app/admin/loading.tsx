export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1C1C1E] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-10 w-32 bg-gray-200 dark:bg-[#252528] rounded animate-pulse mb-8"></div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-[#252528] rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
