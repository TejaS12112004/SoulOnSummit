import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(10,25,18,0.95) 0%, rgba(31,77,58,0.9) 100%)',
      }}
    >
      {/* Background image slot */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop&auto=format)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-16">
        <Outlet />
      </div>
    </div>
  )
}
