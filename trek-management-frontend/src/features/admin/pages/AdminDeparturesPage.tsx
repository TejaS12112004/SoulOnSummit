import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Edit2, Copy, Trash2, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState, QueryErrorState, ConfirmDialog } from '@/components/ui'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { formatCurrency } from '@/utils/formatters/currency'
import { formatDate } from '@/utils/formatters/formatDate'
import { useAdminTreks } from '../hooks/useAdminTreks'
import { 
  useAdminDepartures, 
  useCreateDeparture, 
  useUpdateDeparture, 
  useDeleteDeparture, 
  useDuplicateDeparture, 
  useChangeDepartureStatus 
} from '../hooks/useAdminDepartures'
import { createDepartureSchema, type CreateDepartureFormValues } from '../schemas/departureSchema'
import type { AdminDeparture } from '../types'


function DepartureStatusBadge({ status }: { status: AdminDeparture['status'] }) {
  const styles = {
    OPEN: 'bg-emerald-100 text-emerald-800',
    COMPLETED: 'bg-secondary text-secondary-foreground',
    CANCELLED: 'bg-destructive/10 text-destructive',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  )
}

export default function AdminDeparturesPage() {
  const [selectedTrekId, setSelectedTrekId] = useState<string>('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingDeparture, setEditingDeparture] = useState<AdminDeparture | null>(null)
  
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, depId?: string, action?: 'delete' | 'duplicate'}>({ isOpen: false })

  // Hooks
  const { data: treksPage, isLoading: treksLoading } = useAdminTreks({ page: 0, size: 100 })
  const { data: departures, isLoading: depsLoading, isError, refetch } = useAdminDepartures(selectedTrekId || undefined)
  
  const createMutation = useCreateDeparture()
  const updateMutation = useUpdateDeparture()
  const deleteMutation = useDeleteDeparture()
  const duplicateMutation = useDuplicateDeparture()
  const statusMutation = useChangeDepartureStatus()

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateDepartureFormValues>({
    resolver: zodResolver(createDepartureSchema),
    defaultValues: {
      status: 'OPEN'
    }
  })

  // Handlers
  const handleCreate = () => {
    setEditingDeparture(null)
    reset({
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      price: 0,
      discountPrice: null,
      totalSeats: 10,
      status: 'OPEN'
    })
    setIsSheetOpen(true)
  }

  const handleEdit = (dep: AdminDeparture) => {
    setEditingDeparture(dep)
    reset({
      startDate: dep.startDate.split('T')[0],
      endDate: dep.endDate.split('T')[0],
      registrationDeadline: dep.registrationDeadline.split('T')[0],
      price: dep.price,
      discountPrice: dep.discountPrice,
      totalSeats: dep.totalSeats,
      status: dep.status
    })
    setIsSheetOpen(true)
  }

  const onSubmitForm = (data: CreateDepartureFormValues) => {
    if (!selectedTrekId) return
    
    const payload = {
      ...data,
      discountPrice: data.discountPrice === 0 && !data.discountPrice ? null : data.discountPrice
    }

    if (editingDeparture) {
      updateMutation.mutate({ trekId: selectedTrekId, depId: editingDeparture.id, data: payload }, {
        onSuccess: () => setIsSheetOpen(false)
      })
    } else {
      createMutation.mutate({ trekId: selectedTrekId, data: payload }, {
        onSuccess: () => setIsSheetOpen(false)
      })
    }
  }

  const handleConfirmAction = () => {
    if (!selectedTrekId || !confirmDialog.depId) return
    if (confirmDialog.action === 'delete') {
      deleteMutation.mutate({ trekId: selectedTrekId, depId: confirmDialog.depId })
    } else if (confirmDialog.action === 'duplicate') {
      duplicateMutation.mutate({ trekId: selectedTrekId, depId: confirmDialog.depId })
    }
    setConfirmDialog({ isOpen: false })
  }

  const handleStatusChange = (depId: string, newStatus: string) => {
    if (!selectedTrekId) return
    statusMutation.mutate({ trekId: selectedTrekId, depId, status: newStatus })
  }

  const selectedTrek = treksPage?.content.find(t => t.id === selectedTrekId)

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.action === 'delete' ? 'Delete Departure' : 'Duplicate Departure'}
        message={confirmDialog.action === 'delete' ? 'Are you sure you want to delete this departure? This action cannot be undone.' : 'Are you sure you want to duplicate this departure?'}
        isDestructive={confirmDialog.action === 'delete'}
        onCancel={() => setConfirmDialog({ isOpen: false })}
        onConfirm={handleConfirmAction}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Departure Management</h1>
          <p className="text-muted-foreground mt-1">Manage departures for individual treks.</p>
        </div>
      </div>

      {/* Trek Selector Area */}
      <Card>
        <CardContent className="p-6">
          <div className="max-w-md space-y-4">
            <label className="text-sm font-medium">Select a Trek</label>
            {treksLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <Select value={selectedTrekId} onValueChange={(val) => setSelectedTrekId(val || '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a trek to begin..." />
                </SelectTrigger>
                <SelectContent>
                  {treksPage?.content.map(trek => (
                    <SelectItem key={trek.id} value={trek.id}>{trek.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {!selectedTrekId ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-lg bg-muted/10">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No Trek Selected</h3>
          <p className="text-sm text-muted-foreground mt-2">Choose a trek from the dropdown above to manage its departures.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Trek Summary & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div>
              <h2 className="font-semibold text-lg">{selectedTrek?.title}</h2>
              <p className="text-sm text-muted-foreground">{departures?.length || 0} Departures total</p>
            </div>
            <Button onClick={handleCreate} disabled={depsLoading || isError}>
              <Plus className="w-4 h-4 mr-2" /> Create Departure
            </Button>
          </div>

          {/* Error State */}
          {isError && (
            <QueryErrorState error={isError} onRetry={refetch} className="my-6" />
          )}

          {/* Table */}
          {!isError && (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left" aria-label="Departures">
                    <caption className="sr-only">List of departures for the selected trek</caption>
                    <thead className="bg-muted/50 text-muted-foreground border-b border-border whitespace-nowrap">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-medium">Schedule</th>
                        <th scope="col" className="px-4 py-3 font-medium">Deadline</th>
                        <th scope="col" className="px-4 py-3 font-medium">Price</th>
                        <th scope="col" className="px-4 py-3 font-medium">Seats</th>
                        <th scope="col" className="px-4 py-3 font-medium">Status</th>
                        <th scope="col" className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {depsLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <tr key={i}>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-6 w-20 rounded-full" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-8 w-24 ml-auto" /></td>
                          </tr>
                        ))
                      ) : departures?.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-0 py-12">
                            <EmptyState 
                              icon={<Calendar />}
                              title="No departures found" 
                              description="There are no departures found for this trek." 
                            />
                          </td>
                        </tr>
                      ) : (
                        departures?.map(dep => (
                          <tr key={dep.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-medium">{formatDate(dep.startDate)}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">to {formatDate(dep.endDate)}</div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                              {formatDate(dep.registrationDeadline)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {dep.discountPrice ? (
                                <>
                                  <div className="font-medium text-emerald-600">{formatCurrency(dep.discountPrice)}</div>
                                  <div className="text-xs text-muted-foreground font-medium line-through">{formatCurrency(dep.price)}</div>
                                </>
                              ) : (
                                <div className="font-medium text-foreground">{formatCurrency(dep.price)}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`font-medium ${dep.availableSeats <= 5 ? 'text-orange-500' : 'text-foreground'}`}>
                                {dep.availableSeats}
                              </span>
                              <span className="text-muted-foreground"> / {dep.totalSeats}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Select value={dep.status} onValueChange={(val) => val && handleStatusChange(dep.id, val)} disabled={statusMutation.isPending}>
                                <SelectTrigger className="h-8 text-xs border-0 w-[120px] bg-transparent">
                                  <div className="flex w-full justify-start items-center">
                                    <DepartureStatusBadge status={dep.status as AdminDeparture['status']} />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="OPEN">OPEN</SelectItem>
                                  <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                                  <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(dep)} title="Edit" aria-label="Edit Departure">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setConfirmDialog({ isOpen: true, depId: dep.id, action: 'duplicate' })} title="Duplicate" aria-label="Duplicate Departure">
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setConfirmDialog({ isOpen: true, depId: dep.id, action: 'delete' })} title="Delete" aria-label="Delete Departure">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Create/Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingDeparture ? 'Edit Departure' : 'Create Departure'}</SheetTitle>
            <SheetDescription>
              {editingDeparture ? 'Update the details for this departure.' : 'Add a new departure schedule for this trek.'}
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit(onSubmitForm)} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date *</label>
                <Input type="date" {...register('startDate')} />
                {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date *</label>
                <Input type="date" {...register('endDate')} />
                {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Registration Deadline *</label>
              <Input type="date" {...register('registrationDeadline')} />
              {errors.registrationDeadline && <p className="text-xs text-destructive">{errors.registrationDeadline.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (Base) *</label>
                <Input type="number" {...register('price', { valueAsNumber: true })} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Price</label>
                <Input type="number" {...register('discountPrice', { valueAsNumber: true })} />
                {errors.discountPrice && <p className="text-xs text-destructive">{errors.discountPrice.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Total Seats *</label>
                <Input type="number" {...register('totalSeats', { valueAsNumber: true })} />
                {errors.totalSeats && <p className="text-xs text-destructive">{errors.totalSeats.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status *</label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">OPEN</SelectItem>
                        <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                        <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Departure'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
