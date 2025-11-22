export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center py-12">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
        </div>
    );
}
