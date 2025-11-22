import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { PokemonCard } from '../types/pokemon';

interface PokemonCardProps {
    pokemon: PokemonCard;
}

function PokemonCardComponent({ pokemon }: PokemonCardProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;
    const formattedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    return (
        <Link to={`/pokemon/${pokemon.id}`} className="pokemon-card p-6 flex flex-col items-center">
            <div className="w-full aspect-square flex items-center justify-center mb-4 relative">
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">
                        <span className="text-3xl">✨</span>
                    </div>
                )}
                {imageError ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                        <span className="text-4xl">❓</span>
                    </div>
                ) : (
                    <img
                        src={pokemon.sprite}
                        alt={pokemon.name}
                        className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 capitalize text-center">
                {formattedName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{formattedId}</p>
        </Link>
    );
}

export default React.memo(PokemonCardComponent);
