import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchPokemonList, getPokemonIdFromUrl, getPokemonSpriteUrl, isApiError } from '../api/pokemon';
import type { PokemonCard } from '../types/pokemon';

export async function fetchAndTransformPokemonList(limit: number, offset: number) {
    try {
        const data = await fetchPokemonList(limit, offset);

        const pokemonCards: PokemonCard[] = data.results.map((pokemon) => {
            const id = getPokemonIdFromUrl(pokemon.url);
            return {
                id,
                name: pokemon.name,
                sprite: getPokemonSpriteUrl(id),
            };
        });

        return {
            pokemon: pokemonCards,
            count: data.count,
            next: data.next,
            previous: data.previous,
        };
    } catch (error) {
        if (isApiError(error)) {
            throw error;
        }
        throw new Error('Failed to load Pokémon list');
    }
}

export function usePokemonList(limit: number = 16, offset: number = 0) {
    return useQuery({
        queryKey: ['pokemon', 'list', limit, offset],
        queryFn: () => fetchAndTransformPokemonList(limit, offset),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        placeholderData: keepPreviousData,
        retry: (failureCount, error) => {
            if (isApiError(error) && error.status && error.status >= 400 && error.status < 500) {
                return false;
            }
            return failureCount < 2;
        },
    });
}
