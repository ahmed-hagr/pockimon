import React from 'react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md w-full text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-600 mb-6">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="btn-primary"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}

export default React.memo(ErrorMessage);
