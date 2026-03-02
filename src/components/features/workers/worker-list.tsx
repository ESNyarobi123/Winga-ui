import { WorkerCard } from "./worker-card";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkerListProps {
    workers: any[];
    isLoading: boolean;
    skeletonCount?: number;
    onWorkerSelect?: (worker: any) => void;
    onActionClick?: (worker: any, e: React.MouseEvent) => void;
}

export function WorkerList({
    workers,
    isLoading,
    skeletonCount = 4,
    onWorkerSelect,
    onActionClick,
}: WorkerListProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl border bg-card"
                    >
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="flex-1 space-y-4 py-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-24 rounded-full" />
                                <Skeleton className="h-6 w-32 rounded-full" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-4 md:pt-0">
                            <Skeleton className="h-10 w-full md:w-32 rounded-full" />
                            <Skeleton className="h-10 w-full md:w-32 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (workers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-lg font-semibold text-gray-900 mt-4">
                    No workers found
                </p>
                <p className="text-gray-500 mt-2">
                    Try adjusting your search or filters to find what you're looking for.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mb-20">
            {workers.map((worker) => (
                <WorkerCard
                    key={worker.id}
                    {...worker}
                    onClick={() => onWorkerSelect?.(worker)}
                    onActionClick={(e) => onActionClick?.(worker, e)}
                />
            ))}
        </div>
    );
}
