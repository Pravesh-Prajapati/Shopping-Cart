import { Skeleton } from "./ui/skeleton";

export default function SkeletonLoader() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8 space-y-10">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-6 bg-white p-6 rounded-xl shadow-md">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-4 w-14" />
          </div>
        ))}
      </div>

      <div>
        <Skeleton className="h-6 w-64 mb-6" />
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <Skeleton className="w-full h-52" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
              <div className="p-4 pt-0">
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
