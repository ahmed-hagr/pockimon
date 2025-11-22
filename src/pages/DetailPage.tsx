import { useMemo, useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import { TYPE_COLORS } from '../constants/pokemon';
import { isApiError } from '../api/pokemon';

export default function DetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: pokemon, isLoading, error, refetch } = usePokemonDetail(id!);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (pokemon) {
            const spriteUrl = pokemon.sprites.other['official-artwork'].front_default;

            if (!spriteUrl) {
                setImageError(true);
                return;
            }

            const img = new Image();
            img.src = spriteUrl;
            img.onload = () => setImageLoaded(true);
            img.onerror = () => setImageError(true);
        }
    }, [pokemon]);

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    const formattedId = useMemo(
        () => pokemon ? `#${String(pokemon.id).padStart(4, '0')}` : '',
        [pokemon]
    );

    const formattedName = useMemo(
        () => pokemon ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) : '',
        [pokemon]
    );

    const sprite = useMemo(
        () => pokemon?.sprites.other['official-artwork'].front_default,
        [pokemon]
    );

    const heightInMeters = useMemo(
        () => pokemon ? (pokemon.height / 10).toFixed(1) : '0',
        [pokemon]
    );

    const weightInKg = useMemo(
        () => pokemon ? (pokemon.weight / 10).toFixed(1) : '0',
        [pokemon]
    );

    const is404Error = useMemo(
        () => isApiError(error) && error.status === 404,
        [error]
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-pink-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !pokemon) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-pink-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-red-600 mb-3">
                        {is404Error ? 'Pokémon Not Found' : 'Oops! Something went wrong'}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {is404Error
                            ? `Pokémon with ID "${id}" does not exist. Please check the ID and try again.`
                            : error instanceof Error ? error.message : 'Failed to load Pokémon details'
                        }
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link
                            to="/pokemons"
                            className="px-6 py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors"
                        >
                            Back to Home
                        </Link>
                        {!is404Error && (
                            <button
                                onClick={handleRetry}
                                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-300 transition-colors"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-pink-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Link
                    to="/pokemons"
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 font-medium transition-colors"
                >
                    ← Back to List
                </Link>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center text-white">
                        <h1 className="text-3xl font-bold">✨ {formattedName}</h1>
                        <p className="text-lg opacity-90 mt-1">{formattedId}</p>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col items-center">
                                <div className="w-64 h-64 flex items-center justify-center relative bg-gray-50 rounded-2xl">
                                    {!imageLoaded && !imageError && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                                        </div>
                                    )}
                                    {imageError ? (
                                        <div className="text-6xl">❓</div>
                                    ) : (
                                        <img
                                            src={sprite}
                                            alt={pokemon.name}
                                            className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                                }`}
                                        />
                                    )}
                                </div>

                                <div className="flex gap-2 mt-4">
                                    {pokemon.types.map((type) => (
                                        <span
                                            key={type.type.name}
                                            className="px-4 py-1 rounded-full text-white text-sm font-medium capitalize"
                                            style={{ backgroundColor: TYPE_COLORS[type.type.name] || TYPE_COLORS.default }}
                                        >
                                            {type.type.name}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-8 mt-6">
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">📏</div>
                                        <p className="text-xs text-gray-500">Height</p>
                                        <p className="text-sm font-semibold">{heightInMeters} m</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">⚖️</div>
                                        <p className="text-xs text-gray-500">Weight</p>
                                        <p className="text-sm font-semibold">{weightInKg} kg</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Base Stats</h2>
                                    <div className="space-y-3">
                                        {pokemon.stats.map((stat) => {
                                            const statName = stat.stat.name
                                                .split('-')
                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(' ');
                                            const percentage = (stat.base_stat / 255) * 100;

                                            return (
                                                <div key={stat.stat.name}>
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-xs font-medium text-gray-600 uppercase">{statName}</span>
                                                        <span className="text-sm font-semibold text-gray-900">{stat.base_stat}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">Abilities</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {pokemon.abilities.map((ability) => (
                                            <span
                                                key={ability.ability.name}
                                                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize"
                                            >
                                                {ability.ability.name.replace('-', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Base Experience</h3>
                                    <p className="text-2xl font-bold text-purple-600">{pokemon.base_experience} XP</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
