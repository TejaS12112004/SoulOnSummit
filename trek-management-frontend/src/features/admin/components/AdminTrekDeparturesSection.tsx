import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import adminTrekService from '@/services/adminTrekService';
import type { DepartureResponse } from '@/types/trek';
import { useQueryClient } from '@tanstack/react-query';
import { DepartureFormModal } from './DepartureFormModal';

interface AdminTrekDeparturesSectionProps {
  trekId: string;
  departures: DepartureResponse[];
}

export function AdminTrekDeparturesSection({ trekId, departures }: AdminTrekDeparturesSectionProps) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeparture, setEditingDeparture] = useState<DepartureResponse | null>(null);

  const handleAddClick = () => {
    setEditingDeparture(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (departure: DepartureResponse) => {
    setEditingDeparture(departure);
    setIsModalOpen(true);
  };

  const handleDelete = async (departureId: string) => {
    if (!window.confirm('Are you sure you want to delete this departure?')) return;
    
    try {
      await adminTrekService.deleteDeparture(trekId, departureId);
      toast.success('Departure deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['adminTreks', trekId] });
      queryClient.invalidateQueries({ queryKey: ['adminTreks'] });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to delete departure');
    }
  };

  const handleStatusChange = async (departureId: string, newStatus: string) => {
    try {
      await adminTrekService.changeDepartureStatus(trekId, departureId, newStatus);
      toast.success('Departure status updated');
      queryClient.invalidateQueries({ queryKey: ['adminTreks', trekId] });
      queryClient.invalidateQueries({ queryKey: ['adminTreks'] });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Departures (Batches)</h2>
          <p className="text-sm text-gray-500">Manage upcoming dates and prices for this trek.</p>
        </div>
        <Button type="button" onClick={handleAddClick} size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add Departure
        </Button>
      </div>

      <div className="mt-4">
        {departures.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50">
            No departures scheduled yet. Add an OPEN departure to publish this trek.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Dates</th>
                  <th className="px-4 py-3 font-medium">Reg. Deadline</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Seats (Avail/Total)</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departures.map((dep) => (
                  <tr key={dep.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {new Date(dep.startDate).toLocaleDateString()} - <br/>
                      {new Date(dep.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{new Date(dep.registrationDeadline).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {dep.discountPrice ? (
                        <div>
                          <span className="line-through text-gray-400 mr-2">₹{dep.price}</span>
                          <span className="font-semibold text-green-600">₹{dep.discountPrice}</span>
                        </div>
                      ) : (
                        <span>₹{dep.price}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {dep.availableSeats} / {dep.totalSeats}
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        value={dep.status} 
                        onChange={(e) => handleStatusChange(dep.id, e.target.value)}
                        className={`text-xs rounded-full px-2 py-1 font-semibold border ${
                          dep.status === 'OPEN' ? 'bg-green-100 text-green-800 border-green-200' : 
                          dep.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleEditClick(dep)}>
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleDelete(dep.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DepartureFormModal 
        trekId={trekId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        departure={editingDeparture}
      />
    </div>
  );
}
