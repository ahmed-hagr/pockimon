import React from 'react';

interface LoadMoreButtonProps {
    onClick: () => void;
    loading: boolean;
    hasMore: boolean;
}

function LoadMoreButton({ onClick, loading, hasMore }: LoadMoreButtonProps) {
    if (!hasMore) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 font-medium">You've caught them all! 🎉</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center py-8">
            <button
                onClick={onClick}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Loading...
                    </span>
                ) : (
                    'Load More Pokémon'
                )}
            </button>
        </div>
    );
}

export default React.memo(LoadMoreButton);
