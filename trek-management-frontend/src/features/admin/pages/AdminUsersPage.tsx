import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, Users as UsersIcon, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useDebounce } from '@/hooks/useDebounce';
import adminUserService from '@/services/adminUserService';
import { Badge } from '@/components/ui/badge';
import { QueryErrorState } from '@/components/ui/QueryErrorState';
import type { AdminUserFilterParams, SortDir } from '@/types/api';

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse URL params
  const initialPage = parseInt(searchParams.get('page') || '0', 10);
  const initialSearch = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDir = (searchParams.get('sortDir') as SortDir) || 'desc';

  // Local state
  const [page, setPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 0) params.set('page', page.toString());
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (sortBy !== 'createdAt') params.set('sortBy', sortBy);
    if (sortDir !== 'desc') params.set('sortDir', sortDir);
    setSearchParams(params, { replace: true });
  }, [page, debouncedSearch, sortBy, sortDir, setSearchParams]);

  // Reset page when search changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  const queryParams: AdminUserFilterParams = {
    page,
    size: 20,
    search: debouncedSearch || undefined,
    sortBy,
    sortDir,
  };

  const { data: usersPage, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['adminUsers', queryParams],
    queryFn: () => adminUserService.searchUsers(queryParams),
    staleTime: 60 * 1000, // 1 minute
  });

  const handleSort = (field: string) => {
    const newDir = sortBy === field && sortDir === 'asc' ? 'desc' : 'asc';
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', field);
    params.set('sortDir', newDir);
    setSearchParams(params);
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-indigo-600 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  if (isError) {
    return <QueryErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-display">Users</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage registered SoulOnSummit users.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
              <tr>
                <th 
                  className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('firstName')}
                >
                  User {renderSortIcon('firstName')}
                </th>
                <th 
                  className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('email')}
                >
                  Email {renderSortIcon('email')}
                </th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th 
                  className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  Joined {renderSortIcon('createdAt')}
                </th>
                <th className="px-6 py-4 font-semibold text-right">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                // Skeletons
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="w-40 h-4 bg-gray-200 rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="w-24 h-4 bg-gray-200 rounded animate-pulse" /></td>
                    <td className="px-6 py-4 text-right"><div className="w-24 h-4 bg-gray-200 rounded animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : usersPage?.content.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <UsersIcon className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-base font-medium text-gray-900">No users found</p>
                      <p className="text-sm mt-1">Try adjusting your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                usersPage?.content.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                          {user.firstName[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          {user.phone && <div className="text-xs text-gray-500 mt-0.5">{user.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{user.email}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        {user.authMethod}
                        {user.emailVerified ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500 inline" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className={user.role === 'ROLE_ADMIN' ? 'bg-indigo-100 text-indigo-700' : ''}>
                        {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {user.active ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-none">Active</Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 shadow-none">Inactive</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {format(new Date(user.createdAt), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {user.lastLogin ? format(new Date(user.lastLogin), 'MMM d, yyyy HH:mm') : 'Never'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && usersPage && usersPage.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-sm text-gray-600 font-medium">
              Page {usersPage.number + 1} of {usersPage.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={usersPage.first}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setPage((p) => p + 1)}
                disabled={usersPage.last}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
