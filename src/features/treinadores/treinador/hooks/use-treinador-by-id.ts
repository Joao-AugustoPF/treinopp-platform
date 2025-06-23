import useSWR from 'swr';


const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTreinadorById(id: string) {
  const { data, error, isLoading } = useSWR<any>(`/api/treinadores/${id}`, fetcher);

  return {
    treinador: data,
    isLoading,
    isError: error,
  };
}
