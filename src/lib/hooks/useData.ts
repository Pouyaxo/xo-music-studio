import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

async function fetchData(key: string) {
  // Implement your fetch logic
}

async function updateData(data: unknown) {
  // Implement your update logic
}

export function useData(key: string) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [key],
    queryFn: () => fetchData(key)
  });

  const mutation = useMutation({
    mutationFn: (newData: unknown) => updateData(newData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [key] });
    }
  });

  return {
    data,
    isLoading,
    updateData: mutation.mutate
  };
}