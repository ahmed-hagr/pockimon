// TypeScript interfaces for Pokemon data

export interface PokemonListItem {
    name: string;
    url: string;
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
}

export interface PokemonType {
    slot: number;
    type: {
        name: string;
        url: string;
    };
}

export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    };
}

export interface PokemonAbility {
    ability: {
        name: string;
        url: string;
    };
    is_hidden: boolean;
    slot: number;
}

export interface PokemonSprites {
    front_default: string;
    other: {
        'official-artwork': {
            front_default: string;
        };
        dream_world: {
            front_default: string;
        };
    };
}

export interface PokemonDetail {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: PokemonType[];
    sprites: PokemonSprites;
    stats: PokemonStat[];
    abilities: PokemonAbility[];
    base_experience: number;
}

// Helper type for processed Pokemon card data
export interface PokemonCard {
    id: number;
    name: string;
    sprite: string;
}
