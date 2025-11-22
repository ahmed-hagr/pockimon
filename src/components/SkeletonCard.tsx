export default function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <div className="w-full aspect-square skeleton rounded-lg mb-4"></div>
            <div className="skeleton h-6 w-3/4 rounded mb-2"></div>
            <div className="skeleton h-4 w-1/2 rounded"></div>
        </div>
    );
}
