import React, { type ReactNode } from 'react';

interface PokemonGridProps {
    children: ReactNode;
}

function PokemonGrid({ children }: PokemonGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4">
            {children}
        </div>
    );
}

export default React.memo(PokemonGrid);
