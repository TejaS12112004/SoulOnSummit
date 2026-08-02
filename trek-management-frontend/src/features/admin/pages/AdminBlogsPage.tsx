import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import adminBlogService from '@/services/adminBlogService';
import type { AdminBlogFilterParams } from '@/types/api';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminBlogsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED'>('ALL');
  const [page, setPage] = useState(0);
  const size = 20;

  const debouncedSearch = useDebounce(searchTerm, 300);

  const filters: AdminBlogFilterParams = {
    page,
    size,
    sortBy: 'createdAt',
    sortDir: 'desc',
    search: debouncedSearch,
    published: statusFilter === 'ALL' ? undefined : statusFilter === 'PUBLISHED',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['adminBlogs', filters],
    queryFn: () => adminBlogService.searchBlogs(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminBlogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      adminBlogService.setPublicationStatus(id, published),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
    },
  });

  const blogs = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const handlePublishToggle = (id: string, currentlyPublished: boolean) => {
    const action = currentlyPublished ? 'unpublish' : 'publish';
    if (!currentlyPublished || window.confirm(`Are you sure you want to ${action} this blog?`)) {
      publishMutation.mutate({ id, published: !currentlyPublished });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your content marketing and editorial articles.
          </p>
        </div>
        <Link to="/admin/blogs/new">
          <Button className="w-full sm:w-auto gap-2">
            <Plus className="w-4 h-4" />
            Create Blog
          </Button>
        </Link>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, slug, or author..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(0);
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 w-16">Image</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Blog</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Author</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Dates</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                      Loading blogs...
                    </div>
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-900 font-medium">No blogs found</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {searchTerm || statusFilter !== 'ALL'
                          ? 'Try adjusting your search or filters.'
                          : 'You haven\'t created any blogs yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 align-top">
                      {blog.featuredImage ? (
                        <img
                          src={blog.featuredImage}
                          alt=""
                          className="w-12 h-12 rounded object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center border border-gray-200">
                          <FileText className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-gray-900 max-w-sm truncate">
                        {blog.title}
                      </div>
                      <div className="text-xs text-gray-500 font-mono mt-1 max-w-sm truncate">
                        /{blog.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-medium text-gray-900">{blog.author.name}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      {blog.published ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          <Clock className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top text-sm">
                      <div className="text-gray-900">
                        Created: {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                      {blog.publishedAt && (
                        <div className="text-gray-500 text-xs mt-1">
                          Pub: {new Date(blog.publishedAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 p-0 ${blog.published ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
                          onClick={() => handlePublishToggle(blog.id, blog.published)}
                          disabled={publishMutation.isPending}
                          title={blog.published ? "Unpublish" : "Publish"}
                        >
                          {blog.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Link to={`/admin/blogs/${blog.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(blog.id)}
                          disabled={deleteMutation.isPending}
                        >
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
