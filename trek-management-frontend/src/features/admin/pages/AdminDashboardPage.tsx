import { Link } from 'react-router-dom'
import {
  Users,
  CalendarDays,
  Banknote,
  TrendingUp,
  CreditCard,
  ArrowRight,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { QueryErrorState } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { useDashboardMetrics, useDashboardCharts } from '../hooks/useDashboard'
import { formatCurrency } from '@/utils/formatters/currency'
import { useAuth } from '@/hooks/useAuth'
import type { ChartDataPoint } from '../types'

/**
 * ── Simple Bar Chart ────────────────────────────────────────────────────────
 * Lightweight CSS-only bar chart since no chart library is provided.
 */
function SimpleBarChart({ data, title, colorClass }: { data: ChartDataPoint[]; title: string; colorClass: string }) {
  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col h-full shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center text-sm text-muted-foreground min-h-[120px]">
          No 30-day activity found for this metric.
        </CardContent>
      </Card>
    )
  }

  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <Card className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-end gap-[2px] pt-0 mt-4 min-h-[120px]">
        {data.map((d, i) => (
          <div key={i} className="flex-1 group relative h-full flex items-end">
            <div 
              className={`w-full rounded-t-sm ${colorClass} opacity-60 group-hover:opacity-100 transition-all duration-300`}
              style={{ height: `${Math.max((d.value / max) * 100, 2)}%` }}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
              {d.date ? `${d.date}: ` : ''}{d.value}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

/**
 * ── Dashboard Metric Card ───────────────────────────────────────────────────
 */
interface DashboardMetricCardProps {
  title: string
  icon: React.ReactNode
  value: React.ReactNode
  subtitle: string
  loading: boolean
}

function DashboardMetricCard({ title, icon, value, subtitle, loading }: DashboardMetricCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-8 w-16" /> : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const {
    data: metrics,
    isLoading: loadingMetrics,
    isError: errorMetrics,
    refetch: refetchMetrics
  } = useDashboardMetrics()

  const {
    data: charts,
    isLoading: loadingCharts,
    isError: errorCharts,
    refetch: refetchCharts
  } = useDashboardCharts()

  const handleRefetch = () => {
    void refetchMetrics()
    void refetchCharts()
  }

  // ── Error State ──────────────────────────────────────────────────────────
  if (errorMetrics || errorCharts) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <QueryErrorState error={errorMetrics || errorCharts} onRetry={handleRefetch} />
      </div>
    )
  }

  // ── Header ───────────────────────────────────────────────────────────────
  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date())

  // ── Configuration ────────────────────────────────────────────────────────
  const platformHealthItems = [
    {
      title: 'Conversion Pipeline',
      description: 'Bookings in pending state vs total processed revenue.',
      value: `${metrics?.pendingPayments || 0} Pending`,
      colorClasses: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    },
    {
      title: 'Departure Readiness',
      description: 'Upcoming planned excursions and treks scheduled.',
      value: `${metrics?.upcomingDepartures || 0} Upcoming`,
      colorClasses: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    },
    {
      title: 'User Growth',
      description: 'Total footprint of registered adventurers on the platform.',
      value: `${metrics?.totalUsers || 0} Active`,
      colorClasses: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {user?.firstName ? `Welcome back, ${user.firstName}` : 'Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {currentDate}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefetch} disabled={loadingMetrics || loadingCharts}>
          <RefreshCw className={`w-4 h-4 mr-2 ${(loadingMetrics || loadingCharts) ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardMetricCard
          title="Today's Bookings"
          icon={<CalendarDays className="w-4 h-4 text-primary" />}
          value={metrics?.todayBookings || 0}
          subtitle="Bookings confirmed today"
          loading={loadingMetrics}
        />
        <DashboardMetricCard
          title="Total Revenue"
          icon={<Banknote className="w-4 h-4 text-emerald-500" />}
          value={<span className="text-emerald-600">{formatCurrency(metrics?.totalRevenue || 0)}</span>}
          subtitle="Lifetime processed"
          loading={loadingMetrics}
        />
        <DashboardMetricCard
          title="Upcoming Departures"
          icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
          value={metrics?.upcomingDepartures || 0}
          subtitle="Scheduled in future"
          loading={loadingMetrics}
        />
        <DashboardMetricCard
          title="Total Users"
          icon={<Users className="w-4 h-4 text-purple-500" />}
          value={metrics?.totalUsers || 0}
          subtitle="Registered accounts"
          loading={loadingMetrics}
        />
        <DashboardMetricCard
          title="Pending Payments"
          icon={<CreditCard className="w-4 h-4 text-orange-500" />}
          value={metrics?.pendingPayments || 0}
          subtitle="Awaiting completion"
          loading={loadingMetrics}
        />
      </div>

      {/* ── Charts ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loadingCharts ? (
          <>
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </>
        ) : (
          <>
            <SimpleBarChart 
              data={charts?.bookingsLast30Days || []} 
              title="Bookings (Last 30 Days)" 
              colorClass="bg-primary"
            />
            <SimpleBarChart 
              data={charts?.revenueLast30Days || []} 
              title="Revenue (Last 30 Days)" 
              colorClass="bg-emerald-500"
            />
            <SimpleBarChart 
              data={charts?.usersLast30Days || []} 
              title="Users (Last 30 Days)" 
              colorClass="bg-purple-500"
            />
          </>
        )}
      </div>

      {/* ── Recent Activity & Quick Actions ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Platform Summary */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Platform Health</h2>
          <Card className="shadow-sm overflow-hidden border-border/50">
            <div className="divide-y divide-border/50">
              {platformHealthItems.map((item, index) => (
                <div key={index} className="p-4 sm:p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                  {loadingMetrics ? <Skeleton className="h-6 w-20" /> : (
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.colorClasses}`}>
                        {item.value}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
          <div className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-between h-14 hover:border-primary hover:text-primary transition-colors">
              <Link to={ROUTES.ADMIN_TREKS}>
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  Manage Treks
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-between h-14 hover:border-primary hover:text-primary transition-colors">
              <Link to={ROUTES.ADMIN_DEPARTURES}>
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center mr-3">
                    <CalendarDays className="w-4 h-4" />
                  </span>
                  Manage Departures
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-between h-14 hover:border-primary hover:text-primary transition-colors">
              <Link to={ROUTES.ADMIN_BOOKINGS}>
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center mr-3">
                    <Banknote className="w-4 h-4" />
                  </span>
                  Manage Bookings
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
