import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Eye, EyeOff, Trash2 } from 'lucide-react';
import adminTrekService from '@/services/adminTrekService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/Pagination';
import { QueryErrorState } from '@/components/ui/QueryErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { TrekSummaryResponse } from '@/types/trek';
import { toast } from 'sonner';

export function AdminTreksPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);

  // For destructive actions
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['adminTreks', { page, size: 10 }],
    queryFn: () => adminTrekService.listAdminTreks({ page, size: 10 }),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => adminTrekService.publishTrek(id),
    onSuccess: () => {
      toast.success('Trek published successfully');
      queryClient.invalidateQueries({ queryKey: ['adminTreks'] });
      queryClient.invalidateQueries({ queryKey: ['treks'] }); // Invalidate public lists
    },
    onError: () => toast.error('Failed to publish trek'),
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) => adminTrekService.unpublishTrek(id),
    onSuccess: () => {
      toast.success('Trek unpublished successfully');
      queryClient.invalidateQueries({ queryKey: ['adminTreks'] });
      queryClient.invalidateQueries({ queryKey: ['treks'] });
    },
    onError: () => toast.error('Failed to unpublish trek'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminTrekService.deleteTrek(id),
    onSuccess: () => {
      toast.success('Trek deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['adminTreks'] });
      queryClient.invalidateQueries({ queryKey: ['treks'] });
      setDeleteConfirmId(null);
    },
    onError: () => toast.error('Failed to delete trek'),
  });

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId);
    }
  };

  if (isError) {
    return <QueryErrorState error={error as Error} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Treks</h1>
          <p className="text-gray-500 mt-1">Manage all treks and their publication status.</p>
        </div>
        <Button onClick={() => navigate('/admin/treks/new')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Trek
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Trek</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-20 float-right" /></td>
                  </tr>
                ))
              ) : data?.content.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12">
                    <EmptyState
                      title="No treks found"
                      description="Get started by creating your first trek."
                      primaryAction={<Button onClick={() => navigate('/admin/treks/new')}>Add Trek</Button>}
                    />
                  </td>
                </tr>
              ) : (
                data?.content.map((trek: TrekSummaryResponse) => (
                  <tr key={trek.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{trek.title}</div>
                      {trek.featured && <span className="text-xs text-amber-600 font-medium">Featured</span>}
                    </td>
                    <td className="px-6 py-4">{trek.location}{trek.state ? `, ${trek.state}` : ''}</td>
                    <td className="px-6 py-4">
                      <span className="capitalize">{trek.difficulty.toLowerCase()}</span>
                    </td>
                    <td className="px-6 py-4">{trek.durationDays} Days</td>
                    <td className="px-6 py-4 space-x-2">
                      {trek.published ? (
                        <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/treks/${trek.id}/edit`)}
                        title="Edit Trek"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>

                      {trek.published ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => unpublishMutation.mutate(trek.id)}
                          disabled={unpublishMutation.isPending}
                          title="Unpublish"
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          onClick={() => publishMutation.mutate(trek.id)}
                          disabled={publishMutation.isPending}
                          title="Publish"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteConfirmId(trek.id)}
                        title="Delete Trek"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              currentPage={page + 1}
              totalPages={data.totalPages}
              onPageChange={(p) => setPage(p - 1)}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Delete Trek"
        message="Are you sure you want to delete this trek? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
        isDestructive={true}
      />
    </div>
  );
}
