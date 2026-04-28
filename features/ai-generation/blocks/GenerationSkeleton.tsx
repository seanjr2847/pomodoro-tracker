import { Skeleton } from "@/shared/ui";

interface GenerationSkeletonProps {
  lines?: number;
}

export function GenerationSkeleton({ lines = 4 }: GenerationSkeletonProps) {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}
