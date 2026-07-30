export default function MerchLoading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-12 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
