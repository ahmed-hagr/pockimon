import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { usePokemonList, fetchAndTransformPokemonList } from '../hooks/usePokemonList';
import PokemonCard from '../components/PokemonCard';
import PokemonGrid from '../components/PokemonGrid';
import Pagination from '../components/Pagination';
import LoadMoreButton from '../components/LoadMoreButton';
import SkeletonCard from '../components/SkeletonCard';
import ErrorMessage from '../components/ErrorMessage';
import type { PokemonCard as PokemonCardType } from '../types/pokemon';
import { ITEMS_PER_PAGE, ITEMS_PER_LOAD } from '../constants/pokemon';

const STORAGE_KEY = 'pokemon_pagination_page';

export default function PokemonsView() {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const viewMode = searchParams.get('view') || 'pagination';

    const [allPokemon, setAllPokemon] = useState<PokemonCardType[]>([]);
    const [offset, setOffset] = useState(0);
    const [loadedIds, setLoadedIds] = useState<Set<number>>(new Set());

    const [currentPage, setCurrentPage] = useState(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? parseInt(saved, 10) : 1;
    });

    const itemsPerRequest = viewMode === 'infinite' ? ITEMS_PER_LOAD : ITEMS_PER_PAGE;
    const requestOffset = viewMode === 'infinite' ? offset : (currentPage - 1) * ITEMS_PER_PAGE;

    const { data, isLoading, error, refetch } = usePokemonList(itemsPerRequest, requestOffset);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);



    useEffect(() => {
        if (viewMode === 'infinite' && data?.pokemon) {
            const newPokemon = data.pokemon.filter(p => !loadedIds.has(p.id));

            if (newPokemon.length > 0) {
                setAllPokemon(prev => [...prev, ...newPokemon]);
                setLoadedIds(prev => {
                    const newSet = new Set(prev);
                    newPokemon.forEach(p => newSet.add(p.id));
                    return newSet;
                });
            }
        }
    }, [data, loadedIds, viewMode]);

    useEffect(() => {
        if (viewMode === 'pagination') {
            setAllPokemon([]);
            setOffset(0);
            setLoadedIds(new Set());
        }
    }, [viewMode]);

    const handleLoadMore = useCallback(() => {
        setOffset(prev => prev + ITEMS_PER_LOAD);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleRetry = useCallback(() => {
        if (viewMode === 'infinite') {
            setOffset(0);
            setAllPokemon([]);
            setLoadedIds(new Set());
        }
        refetch();
    }, [refetch, viewMode]);

    const totalPages = useMemo(
        () => (data ? Math.ceil(data.count / ITEMS_PER_PAGE) : 0),
        [data]
    );

    const hasMore = useMemo(
        () => (data ? offset + ITEMS_PER_LOAD < data.count : true),
        [data, offset]
    );

    useEffect(() => {
        if (viewMode === 'pagination') {
            sessionStorage.setItem(STORAGE_KEY, currentPage.toString());

            // Prefetch next page
            const nextPage = currentPage + 1;
            if (data && nextPage <= totalPages) {
                const nextPageOffset = currentPage * ITEMS_PER_PAGE;
                queryClient.prefetchQuery({
                    queryKey: ['pokemon', 'list', ITEMS_PER_PAGE, nextPageOffset],
                    queryFn: () => fetchAndTransformPokemonList(ITEMS_PER_PAGE, nextPageOffset),
                });
            }
        }
    }, [currentPage, viewMode, data, totalPages, queryClient]);



    const isInitialLoading = useMemo(
        () => isLoading && (viewMode === 'pagination' || allPokemon.length === 0),
        [isLoading, allPokemon.length, viewMode]
    );

    const skeletonCards = useMemo(
        () => Array.from({ length: itemsPerRequest }).map((_, i) => <SkeletonCard key={i} />),
        [itemsPerRequest]
    );

    const switchToInfinite = useCallback(() => {
        setSearchParams({ view: 'infinite' });
    }, [setSearchParams]);

    const switchToPagination = useCallback(() => {
        setSearchParams({});
    }, [setSearchParams]);

    const bgGradient = viewMode === 'infinite'
        ? 'from-mint-50 to-green-100'
        : 'from-blue-50 to-lavender-100';

    return (
        <div className={`min-h-screen bg-gradient-to-br ${bgGradient} py-12`}>
            <div className="max-w-7xl mx-auto px-4">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-3">
                        ✨ Pokédex
                    </h1>
                    <p className="text-gray-600 text-lg mb-6">
                        {viewMode === 'infinite'
                            ? 'Discover and explore Pokémon with infinite scroll'
                            : 'Discover and explore Pokémon with page controls'
                        }
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={switchToPagination}
                            className={`px-6 py-2 font-medium rounded-full transition-colors ${viewMode === 'pagination'
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Page Controls
                        </button>
                        <button
                            onClick={switchToInfinite}
                            className={`px-6 py-2 font-medium rounded-full transition-colors ${viewMode === 'infinite'
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Infinite Scroll
                        </button>
                    </div>
                </header>

                {error ? (
                    <ErrorMessage
                        message={error instanceof Error ? error.message : 'Failed to load Pokémon'}
                        onRetry={handleRetry}
                    />
                ) : viewMode === 'infinite' ? (
                    <>
                        {isInitialLoading ? (
                            <PokemonGrid>{skeletonCards}</PokemonGrid>
                        ) : (
                            <>
                                <PokemonGrid>
                                    {allPokemon.map((pokemon) => (
                                        <PokemonCard key={pokemon.id} pokemon={pokemon} />
                                    ))}
                                </PokemonGrid>

                                <LoadMoreButton
                                    onClick={handleLoadMore}
                                    loading={isLoading}
                                    hasMore={hasMore}
                                />
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {isLoading ? (
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
                    </>
                )}
            </div>
        </div>
    );
}
