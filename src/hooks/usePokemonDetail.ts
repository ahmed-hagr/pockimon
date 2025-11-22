import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetail, isApiError } from '../api/pokemon';

export function usePokemonDetail(id: string) {
    return useQuery({
        queryKey: ['pokemon', 'detail', id],
        queryFn: () => fetchPokemonDetail(id),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
        retry: (failureCount, error) => {
            if (isApiError(error) && error.status === 404) {
                return false;
            }
            return failureCount < 2;
        },
        enabled: !!id,
    });
}
