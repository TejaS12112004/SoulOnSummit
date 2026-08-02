import apiClient from '@/api/apiClient';
import type { ApiResponse, PageResponse, AdminBlogResponse, BlogRequest, AdminBlogFilterParams } from '@/types/api';

const adminBlogService = {
  searchBlogs: (params: AdminBlogFilterParams): Promise<PageResponse<AdminBlogResponse>> => {
    return apiClient
      .get<ApiResponse<PageResponse<AdminBlogResponse>>>('/admin/blogs', { params })
      .then((res) => res.data.data);
  },

  getBlog: (id: string): Promise<AdminBlogResponse> => {
    return apiClient
      .get<ApiResponse<AdminBlogResponse>>(`/admin/blogs/${id}`)
      .then((res) => res.data.data);
  },

  createBlog: (request: BlogRequest): Promise<AdminBlogResponse> => {
    return apiClient
      .post<ApiResponse<AdminBlogResponse>>('/admin/blogs', request)
      .then((res) => res.data.data);
  },

  updateBlog: (id: string, request: BlogRequest): Promise<AdminBlogResponse> => {
    return apiClient
      .put<ApiResponse<AdminBlogResponse>>(`/admin/blogs/${id}`, request)
      .then((res) => res.data.data);
  },

  deleteBlog: (id: string): Promise<void> => {
    return apiClient
      .delete<ApiResponse<void>>(`/admin/blogs/${id}`)
      .then(() => {});
  },

  setPublicationStatus: (id: string, published: boolean): Promise<void> => {
    return apiClient
      .patch<ApiResponse<void>>(`/admin/blogs/${id}/publication`, { published })
      .then(() => {});
  },

  uploadImage: (file: File): Promise<{ publicUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<ApiResponse<{ publicUrl: string }>>('/admin/storage/blogs/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data.data);
  },
};

export default adminBlogService;
