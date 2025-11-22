import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonList } from '../hooks/usePokemonList';
import PokemonCard from '../components/PokemonCard';
import PokemonGrid from '../components/PokemonGrid';
import LoadMoreButton from '../components/LoadMoreButton';
import SkeletonCard from '../components/SkeletonCard';
import ErrorMessage from '../components/ErrorMessage';
import type { PokemonCard as PokemonCardType } from '../types/pokemon';
import { ITEMS_PER_LOAD } from '../constants/pokemon';

export default function LoadMoreView() {
    const [allPokemon, setAllPokemon] = useState<PokemonCardType[]>([]);
    const [offset, setOffset] = useState(0);
    const [loadedIds, setLoadedIds] = useState<Set<number>>(new Set());

    const { data, isLoading, error, refetch } = usePokemonList(ITEMS_PER_LOAD, offset);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (data?.pokemon) {
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
    }, [data, loadedIds]);

    const handleLoadMore = useCallback(() => {
        setOffset(prev => prev + ITEMS_PER_LOAD);
    }, []);

    const handleRetry = useCallback(() => {
        setOffset(0);
        setAllPokemon([]);
        setLoadedIds(new Set());
        refetch();
    }, [refetch]);

    const hasMore = useMemo(
        () => (data ? offset + ITEMS_PER_LOAD < data.count : true),
        [data, offset]
    );

    const isInitialLoading = useMemo(
        () => isLoading && allPokemon.length === 0,
        [isLoading, allPokemon.length]
    );

    const skeletonCards = useMemo(
        () => Array.from({ length: ITEMS_PER_LOAD }).map((_, i) => <SkeletonCard key={i} />),
        []
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-mint-50 to-green-100 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-3">
                        ✨ Pokédex
                    </h1>
                    <p className="text-gray-600 text-lg mb-6">
                        Discover and explore Pokémon with infinite scroll
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link
                            to="/pokemons"
                            className="px-6 py-2 bg-white text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                        >
                            Page Controls
                        </Link>
                        <button className="px-6 py-2 bg-gray-900 text-white font-medium rounded-full">
                            Infinite Scroll
                        </button>
                    </div>
                </header>

                {error ? (
                    <ErrorMessage
                        message={error instanceof Error ? error.message : 'Failed to load Pokémon'}
                        onRetry={handleRetry}
                    />
                ) : (
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
                )}
            </div>
        </div>
    );
}
