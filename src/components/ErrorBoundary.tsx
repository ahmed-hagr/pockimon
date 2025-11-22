export function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="text-6xl mb-4">💥</div>
                <h1 className="text-2xl font-bold text-red-600 mb-3">
                    Oops! Something went wrong
                </h1>
                <p className="text-gray-600 mb-6">
                    The application encountered an unexpected error. Please try reloading the page.
                </p>
                {error.message && (
                    <details className="mb-6 text-left">
                        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                            Error details
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs text-red-600 overflow-auto">
                            {error.message}
                        </pre>
                    </details>
                )}
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={resetErrorBoundary}
                        className="px-6 py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-300 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        </div>
    );
}
