const Loader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-gray-200 rounded-full animate-spin border-t-primary-400"></div>
    </div>
);

const Skeleton = ({ className = '' }) => (
    <div className={`skeleton ${className}`}>&nbsp;</div>
);

const ProductSkeleton = () => (
    <div className="card overflow-hidden p-0">
        <Skeleton className="aspect-square" />
        <div className="p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-20 mt-2" />
        </div>
    </div>
);

export { Loader, Skeleton, ProductSkeleton };
