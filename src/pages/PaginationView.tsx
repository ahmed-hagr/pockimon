import { useState, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonList } from '../hooks/usePokemonList';
import PokemonCard from '../components/PokemonCard';
import PokemonGrid from '../components/PokemonGrid';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import ErrorMessage from '../components/ErrorMessage';
import { ITEMS_PER_PAGE } from '../constants/pokemon';

const STORAGE_KEY = 'pokemon_pagination_page';

export default function PaginationView() {
    const [currentPage, setCurrentPage] = useState(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? parseInt(saved, 10) : 1;
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, currentPage.toString());
    }, [currentPage]);

    const offset = useMemo(
        () => (currentPage - 1) * ITEMS_PER_PAGE,
        [currentPage]
    );

    const { data, isLoading, error, refetch } = usePokemonList(ITEMS_PER_PAGE, offset);

    const totalPages = useMemo(
        () => (data ? Math.ceil(data.count / ITEMS_PER_PAGE) : 0),
        [data]
    );

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    const skeletonCards = useMemo(
        () => Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />),
        []
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-lavender-100 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-3">
                        ✨ Pokédex
                    </h1>
                    <p className="text-gray-600 text-lg mb-6">
                        Discover and explore Pokémon with page controls
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button className="px-6 py-2 bg-gray-900 text-white font-medium rounded-full">
                            Page Controls
                        </button>
                        <Link
                            to="/pokemons/infinite"
                            className="px-6 py-2 bg-white text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                        >
                            Infinite Scroll
                        </Link>
                    </div>
                </header>

                {error ? (
                    <ErrorMessage
                        message={error instanceof Error ? error.message : 'Failed to load Pokémon'}
                        onRetry={handleRetry}
                    />
                ) : isLoading ? (
                    <PokemonGrid>{skeletonCards}</PokemonGrid>
                ) : data ? (
                    <>
                        <PokemonGrid>
                            {data.pokemon.map((pokemon) => (
                                <PokemonCard key={pokemon.id} pokemon={pokemon} />
                            ))}
                        </PokemonGrid>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : null}
            </div>
        </div>
    );
}
