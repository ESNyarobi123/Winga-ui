/**
 * Skeleton loading state for JobCard — "mavuli ya kijivu yanayocheza"
 */

export function JobCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl border border-border animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-lg bg-muted shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
        <div className="shrink-0 space-y-1 text-right">
          <div className="h-5 bg-muted rounded w-20 ml-auto" />
          <div className="h-3 bg-muted rounded w-14 ml-auto" />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-6 w-20 bg-muted rounded-full" />
        <div className="h-6 w-16 bg-muted rounded-full" />
        <div className="h-6 w-24 bg-muted rounded-full" />
      </div>
      <div className="flex gap-4 mt-4 pt-4 border-t border-border">
        <div className="h-3 w-24 bg-muted rounded" />
        <div className="h-3 w-16 bg-muted rounded" />
      </div>
    </div>
  );
}
