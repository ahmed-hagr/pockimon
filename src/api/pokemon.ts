import type { PokemonListResponse, PokemonDetail } from '../types/pokemon';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pokeapi.co/api/v2';

export class ApiError extends Error {
    status?: number;
    statusText?: string;

    constructor(message: string, status?: number, statusText?: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.statusText = statusText;
    }
}

async function fetchApi<T>(endpoint: string): Promise<T> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);

        if (!response.ok) {
            throw new ApiError(
                `API request failed: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        if (error instanceof TypeError) {
            throw new ApiError('Network error: Please check your internet connection');
        }

        throw new ApiError(
            error instanceof Error ? error.message : 'An unexpected error occurred'
        );
    }
}

export async function fetchPokemonList(
    limit: number = 16,
    offset: number = 0
): Promise<PokemonListResponse> {
    return fetchApi<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`);
}

export async function fetchPokemonDetail(
    idOrName: string | number
): Promise<PokemonDetail> {
    return fetchApi<PokemonDetail>(`/pokemon/${idOrName}`);
}

export function getPokemonIdFromUrl(url: string): number {
    const matches = url.match(/\/pokemon\/(\d+)\/?$/);
    return matches ? parseInt(matches[1], 10) : 0;
}

export function getPokemonSpriteUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}
