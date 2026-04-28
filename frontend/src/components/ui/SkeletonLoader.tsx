export function RoadmapSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <div className="skeleton w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-48 rounded-lg" />
          <div className="skeleton h-3 w-32 rounded-lg" />
        </div>
      </div>

      {/* Tree nodes skeleton */}
      <div className="flex flex-col items-center gap-6">
        {/* Root */}
        <div className="skeleton w-40 h-16 rounded-2xl" />
        <div className="skeleton w-0.5 h-8" />

        {/* Branches */}
        <div className="flex gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="skeleton w-32 h-14 rounded-xl" />
              <div className="skeleton w-0.5 h-6" />
              <div className="space-y-3">
                {[1, 2].map((j) => (
                  <div key={j} className="skeleton w-28 h-10 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="skeleton w-8 h-8 rounded-lg" />
              <div className="skeleton h-4 w-24 rounded" />
            </div>
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="skeleton w-20 h-20 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-6 w-48 rounded-lg" />
          <div className="skeleton h-4 w-32 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function AssessmentSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 px-6 py-10 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="skeleton h-8 w-64 mx-auto rounded-lg" />
        <div className="skeleton h-4 w-80 mx-auto rounded" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="skeleton w-9 h-9 rounded-full" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>
          <div className="pl-12 space-y-2">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
