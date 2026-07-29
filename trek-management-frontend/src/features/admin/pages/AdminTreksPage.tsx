import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search,
  Edit,
  CheckCircle,
  XCircle,
  Star,
  Trash2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { QueryErrorState, ConfirmDialog, EmptyState } from '@/components/ui'
import { toAdminTrekDetail } from '@/constants/routes'
import { useAdminTreks, usePublishTrek, useUnpublishTrek, useFeatureTrek, useDeleteTrek } from '../hooks/useAdminTreks'
import { useDebounce } from '@/hooks/useDebounce'
import { formatCurrency } from '@/utils/formatters/currency'
import type { AdminFilters } from '../types'

export default function AdminTreksPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)

  const [filters, setFilters] = useState<AdminFilters>({
    page: 0,
    size: 10,
    search: '',
  })

  const [deleteDialog, setDeleteDialog] = useState<{isOpen: boolean, trekId?: string, trekTitle?: string}>({ isOpen: false })

  // Sync debounced search to filters
  useEffect(() => {
    setFilters(prev => {
      if (prev.search === debouncedSearch) return prev
      return { ...prev, search: debouncedSearch, page: 0 }
    })
  }, [debouncedSearch])

  const { data: pageData, isLoading, isError, refetch } = useAdminTreks(filters)

  const publishMutation = usePublishTrek()
  const unpublishMutation = useUnpublishTrek()
  const featureMutation = useFeatureTrek()
  const deleteMutation = useDeleteTrek()

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto pb-10">
        <QueryErrorState error={isError} onRetry={refetch} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <ConfirmDialog 
        isOpen={deleteDialog.isOpen}
        title="Delete Trek"
        message={`Are you sure you want to delete "${deleteDialog.trekTitle}"? This action cannot be undone.`}
        isDestructive={true}
        onCancel={() => setDeleteDialog({ isOpen: false })}
        onConfirm={() => {
          if (deleteDialog.trekId) {
            deleteMutation.mutate(deleteDialog.trekId)
          }
          setDeleteDialog({ isOpen: false })
        }}
      />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Manage Treks</h1>
          <p className="text-muted-foreground text-sm mt-1">View, edit, and publish platform treks.</p>
        </div>
        <Button asChild>
          <Link to={toAdminTrekDetail('new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Trek
          </Link>
        </Button>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search treks..."
            className="pl-9 bg-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* We can add difficulty/status selects here if needed, keeping it simple for now as backend might only support search */}
      </div>

      {/* Content */}
      <Card className="shadow-sm border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" aria-label="Treks">
            <caption className="sr-only">List of all treks in the platform</caption>
            <thead className="bg-muted/50 text-muted-foreground border-b border-border whitespace-nowrap">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Trek</th>
                <th scope="col" className="px-4 py-3 font-medium">Location</th>
                <th scope="col" className="px-4 py-3 font-medium">Duration & Difficulty</th>
                <th scope="col" className="px-4 py-3 font-medium">Price (from)</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-10 w-48" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : pageData?.content.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-0 py-16">
                    <EmptyState
                      icon={<Search />}
                      title="No treks found"
                      description="No treks match your current filter criteria."
                      primaryAction={searchTerm ? (
                        <Button variant="outline" onClick={() => setSearchTerm('')}>
                          Clear Search
                        </Button>
                      ) : undefined}
                    />
                  </td>
                </tr>
              ) : (
                pageData?.content.map((trek) => (
                  <tr key={trek.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-muted overflow-hidden shrink-0">
                          {trek.coverImageUrl ? (
                            <img src={trek.coverImageUrl} alt={trek.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted-foreground/10 text-xs">No img</div>
                          )}
                        </div>
                        <div className="font-medium text-foreground line-clamp-2 leading-tight">
                          {trek.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {trek.location}, {trek.state}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      <Badge variant="outline" className="mr-2 capitalize">{trek.difficulty.toLowerCase()}</Badge>
                      {trek.durationDays} Days
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                      {trek.lowestPrice ? formatCurrency(trek.lowestPrice) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {trek.published ? (
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300">Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                        {trek.featured && (
                          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                            <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" asChild title="Edit Trek" aria-label="Edit Trek">
                          <Link to={toAdminTrekDetail(trek.id)}>
                            <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </Link>
                        </Button>
                        
                        {trek.published ? (
                          <Button variant="ghost" size="icon" title="Unpublish" aria-label="Unpublish Trek"
                            disabled={unpublishMutation.isPending}
                            onClick={() => unpublishMutation.mutate(trek.id)}>
                            <XCircle className="w-4 h-4 text-orange-500 hover:text-orange-600" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" title="Publish" aria-label="Publish Trek"
                            disabled={publishMutation.isPending}
                            onClick={() => publishMutation.mutate(trek.id)}>
                            <CheckCircle className="w-4 h-4 text-emerald-500 hover:text-emerald-600" />
                          </Button>
                        )}

                        <Button variant="ghost" size="icon" title={trek.featured ? 'Unfeature' : 'Feature'} aria-label={trek.featured ? 'Unfeature Trek' : 'Feature Trek'}
                          disabled={featureMutation.isPending}
                          onClick={() => featureMutation.mutate(trek.id)}>
                          <Star className={`w-4 h-4 ${trek.featured ? 'text-purple-500 fill-purple-500' : 'text-muted-foreground hover:text-purple-500'}`} />
                        </Button>

                        <Button variant="ghost" size="icon" title="Delete" aria-label="Delete Trek"
                          disabled={deleteMutation.isPending}
                          onClick={() => setDeleteDialog({ isOpen: true, trekId: trek.id, trekTitle: trek.title })}>
                          <Trash2 className="w-4 h-4 text-destructive hover:text-destructive/80" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && pageData && pageData.totalPages > 1 && (
          <div className="p-4 border-t border-border/50">
            <Pagination
              currentPage={pageData.number}
              totalPages={pageData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>
    </div>
  )
}
