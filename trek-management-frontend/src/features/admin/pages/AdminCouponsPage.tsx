import { Tag } from 'lucide-react';

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4">
        <Tag className="w-10 h-10 text-primary-500" />
      </div>
      <h1 className="text-3xl font-heading font-bold text-gray-900">Coupons</h1>
      <p className="text-gray-500 text-center max-w-md">
        The coupon management system is currently under development. Coming soon!
      </p>
    </div>
  );
}
