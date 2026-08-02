import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm as useRHForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import adminBlogService from '@/services/adminBlogService';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Tiptap imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  summary: z.string().max(500, 'Summary cannot exceed 500 characters').optional(),
  body: z.string().min(1, 'Content is required'),
  featuredImage: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

// Simple TipTap Toolbar
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 font-bold' : ''}`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 italic' : ''}`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 font-bold' : ''}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 font-bold' : ''}`}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
      >
        Numbered List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
      >
        Quote
      </button>
      <button
        type="button"
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('URL', previousUrl);
          if (url === null) {
            return;
          }
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
        className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
      >
        Link
      </button>
      <div className="flex-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="px-2 py-1 text-sm rounded hover:bg-gray-200"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="px-2 py-1 text-sm rounded hover:bg-gray-200"
      >
        Redo
      </button>
    </div>
  );
};

export default function AdminBlogFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useRHForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      body: '',
      featuredImage: '',
    },
  });

  const featuredImage = watch('featuredImage');
  const bodyContent = watch('body');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: bodyContent || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      setValue('body', editor.getHTML(), { shouldValidate: true, shouldDirty: true });
    },
  });

  const { data: blog, isLoading: isLoadingBlog } = useQuery({
    queryKey: ['adminBlog', id],
    queryFn: () => adminBlogService.getBlog(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (blog && isEditMode) {
      reset({
        title: blog.title,
        slug: blog.slug,
        summary: blog.summary || '',
        body: blog.body,
        featuredImage: blog.featuredImage || '',
      });
      if (editor) {
        editor.commands.setContent(blog.body);
      }
    }
  }, [blog, isEditMode, reset, editor]);

  const mutation = useMutation({
    mutationFn: (data: BlogFormValues) => {
      if (isEditMode) {
        return adminBlogService.updateBlog(id!, data);
      } else {
        return adminBlogService.createBlog(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
      toast.success(`Blog ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/blogs');
    },
    onError: (error) => {
      toast.error('Failed to save blog');
      console.error(error);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      const res = await adminBlogService.uploadImage(file);
      setValue('featuredImage', res.publicUrl, { shouldDirty: true });
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = (data: BlogFormValues) => {
    if (isEditMode && blog?.published && data.slug !== blog.slug) {
      if (!window.confirm('Warning: You are changing the slug of a published blog. This may break existing links and SEO. Are you sure you want to proceed?')) {
        return;
      }
    }
    mutation.mutate(data);
  };

  if (isEditMode && isLoadingBlog) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/blogs')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-gray-900">
          {isEditMode ? 'Edit Blog' : 'Create Blog'}
        </h1>
        {isEditMode && (
          <div className="text-sm px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
            Status: <span className="font-semibold text-gray-700">{blog?.published ? 'Published' : 'Draft'}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basic Info</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              {...register('title')}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="e.g. Kedarkantha Trek: Complete Guide"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-gray-400 bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm">/blog/</span>
              <input
                {...register('slug')}
                className="flex-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
                placeholder="Leave empty to auto-generate from title"
              />
            </div>
            <p className="text-gray-500 text-xs mt-1">Changing a published slug can break SEO links.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
            <textarea
              {...register('summary')}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none min-h-[80px]"
              placeholder="A brief excerpt to show on the blog listing page..."
            />
            {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary.message}</p>}
          </div>
        </div>

        {/* Media */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Featured Image</h2>
          
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            {featuredImage ? (
              <div className="relative inline-block">
                <img src={featuredImage} alt="Featured" className="max-h-64 rounded-lg shadow-sm" />
                <button
                  type="button"
                  onClick={() => setValue('featuredImage', '', { shouldDirty: true })}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-gray-600 mb-2">Upload a high-quality featured image</p>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <Button type="button" variant="outline" disabled={uploadingImage}>
                    {uploadingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {uploadingImage ? 'Uploading...' : 'Select Image'}
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Max 5MB (JPEG, PNG, WebP)</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Content *</h2>
          </div>
          
          <div className="border border-gray-200 m-4 rounded-lg overflow-hidden">
            <MenuBar editor={editor} />
            <div className="bg-white prose-container">
              <EditorContent editor={editor} />
            </div>
          </div>
          {errors.body && <p className="text-red-500 text-sm px-6 pb-4">{errors.body.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/blogs')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || uploadingImage}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEditMode ? 'Save Changes' : 'Save as Draft'}
          </Button>
        </div>

      </form>
    </div>
  );
}
