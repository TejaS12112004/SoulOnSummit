import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@/services/wishlistService';
import { useAuth } from '@/hooks/useAuth';

export function useWishlist() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data: wishlistIds = [], isLoading } = useQuery({
    queryKey: ['wishlist-ids'],
    queryFn: wishlistService.getWishlistTrekIds,
    enabled: isAuthenticated,
  });

  const { data: wishlistTreks = [], isLoading: isLoadingTreks } = useQuery({
    queryKey: ['wishlist-treks'],
    queryFn: wishlistService.getMyWishlist,
    enabled: isAuthenticated,
  });

  const addToWishlist = useMutation({
    mutationFn: wishlistService.addToWishlist,
    onMutate: async (trekId) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist-ids'] });
      const previousIds = queryClient.getQueryData<string[]>(['wishlist-ids']);
      queryClient.setQueryData<string[]>(['wishlist-ids'], old => old ? [...old, trekId] : [trekId]);
      return { previousIds };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(['wishlist-ids'], context?.previousIds);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist-ids'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-treks'] });
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: wishlistService.removeFromWishlist,
    onMutate: async (trekId) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist-ids'] });
      const previousIds = queryClient.getQueryData<string[]>(['wishlist-ids']);
      queryClient.setQueryData<string[]>(['wishlist-ids'], old => old ? old.filter(id => id !== trekId) : []);
      return { previousIds };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(['wishlist-ids'], context?.previousIds);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist-ids'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-treks'] });
    },
  });

  const toggleWishlist = (trekId: string) => {
    if (wishlistIds.includes(trekId)) {
      removeFromWishlist.mutate(trekId);
    } else {
      addToWishlist.mutate(trekId);
    }
  };

  const isInWishlist = (trekId: string) => wishlistIds.includes(trekId);

  return {
    wishlistIds,
    wishlistTreks,
    isLoading,
    isLoadingTreks,
    toggleWishlist,
    isInWishlist,
    isMutating: addToWishlist.isPending || removeFromWishlist.isPending,
  };
}
