import React, { useState, useEffect, cloneElement, isValidElement } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  IndianRupee
} from 'lucide-react'
import WatermarkBackground from '../../components/admin/WatermarkBackground'
import { pillClass, getStatusColor } from './themeHelpers'
import toast from 'react-hot-toast'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

  // ChartJS global defaults for dark admin theme
ChartJS.defaults.color = '#E5E5E5'
ChartJS.defaults.font.family = "Poppins, sans-serif"
ChartJS.defaults.plugins.tooltip.titleColor = '#FFFFFF'
ChartJS.defaults.plugins.tooltip.bodyColor = '#E5E5E5'
ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(0,0,0,0.8)'

  // Visual variant presets - pick 'A', 'B', 'C' or 'W' (W = white admin theme)
  // A: balanced charcoal panels, moderate lines (default)
  // B: lighter panels, stronger lines (higher contrast)
  // C: darker panels, bolder lines (dramatic look)
  const VARIANT = 'W'

  const VARIANTS = {
    A: {
      pageBg: '#0b0f10',
      panelBg: '#0f1112',
      panelInnerBg: '#0f1112',
      gridColor: 'rgba(255,255,255,0.12)',
      iconBg: '#111827',
      iconColor: '#E5E5E5',
      revenueLineWidth: 3,
      ordersLineWidth: 3,
      revenuePointRadius: 4,
      ordersPointRadius: 4
    },
    B: {
      pageBg: '#0e1415',
      panelBg: '#141718',
      panelInnerBg: '#121516',
      gridColor: 'rgba(255,255,255,0.16)',
      iconBg: '#111827',
      iconColor: '#E5E5E5',
      revenueLineWidth: 4,
      ordersLineWidth: 4,
      revenuePointRadius: 5,
      ordersPointRadius: 5
    },
    C: {
      pageBg: '#060708',
      panelBg: '#0b0b0b',
      panelInnerBg: '#0a0a0a',
      gridColor: 'rgba(255,255,255,0.10)',
      iconBg: '#0b0b0b',
      iconColor: '#FFFFFF',
      revenueLineWidth: 5,
      ordersLineWidth: 5,
      revenuePointRadius: 6,
      ordersPointRadius: 6
    }
    ,
    W: {
      pageBg: '#ffffff',
      panelBg: '#ffffff',
      panelInnerBg: '#ffffff',
      gridColor: 'rgba(0,0,0,0.06)',
      iconBg: '#d4af37',
      iconColor: '#0b0f10',
      revenueLineWidth: 6,
      ordersLineWidth: 6,
      revenuePointRadius: 6,
      ordersPointRadius: 6,
      textColor: '#0b0f10',
      cardText: '#0b0f10'
    }
  }

  const VIS = VARIANTS[VARIANT]
  // Default text color (dark for white theme, light for dark themes)
  VIS.textColor = VIS.textColor || '#E5E5E5'

  // Apply VIS to ChartJS defaults so chart text/tooltips match the theme
  try {
    ChartJS.defaults.color = VIS.textColor
    ChartJS.defaults.plugins.tooltip.titleColor = VIS.textColor
    ChartJS.defaults.plugins.tooltip.bodyColor = VIS.textColor
    ChartJS.defaults.plugins.tooltip.backgroundColor = VIS.pageBg === '#ffffff' ? '#ffffff' : 'rgba(0,0,0,0.8)'
    ChartJS.defaults.plugins.tooltip.borderColor = VIS.pageBg === '#ffffff' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
    ChartJS.defaults.plugins.tooltip.borderWidth = 1
  } catch (e) {
    // ignore
  }

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null)
  const [revenueData, setRevenueData] = useState(null)
  const [loading, setLoading] = useState(true)
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Only fetch dashboard data if authenticated. If not, try to load user, then fetch.
    const init = async () => {
      try {
        if (!auth?.isAuthenticated) {
          await auth.loadUser()
        }
      } catch (e) {}

      if (!auth?.isAuthenticated) {
        // not authenticated - redirect to admin login
        navigate('/admin/login')
        return
      }

      fetchDashboardData()
    }

    init()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsResponse, revenueResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getRevenueAnalytics({ period: 'monthly' })
      ])
      
      setDashboardStats(statsResponse.data.data)
      setRevenueData(revenueResponse.data.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // If unauthorized, attempt to reload user and redirect to admin login
      if (error?.response?.status === 401) {
        toast.error('Unauthorized. Please sign in as an admin.')
        try { await auth.loadUser() } catch (e) {}
        navigate('/admin/login')
        return
      }

      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  // currency formatter for INR
  const formatINR = (val) => {
    if (val == null) return '₹0.00'
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val)
    } catch (e) {
      return `₹${Number(val).toFixed(2)}`
    }
  }

  // Chart data
  const revenueChartData = {
    labels: revenueData?.revenueData?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Revenue',
        data: revenueData?.revenueData?.map(item => item.totalRevenue) || [],
  backgroundColor: VIS.pageBg === '#ffffff' ? 'rgba(212,175,55,0.08)' : 'rgba(212,175,55,0.15)', // subtle gold fill
        fill: false,
  borderColor: VIS.pageBg === '#ffffff' ? '#b3872f' : '#d4af37',
        borderWidth: VIS.revenueLineWidth,
        tension: 0.4,
        pointRadius: VIS.revenuePointRadius,
        pointBackgroundColor: '#d4af37'
      }
    ]
  }

  const ordersChartData = {
    labels: revenueData?.revenueData?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Orders',
        data: revenueData?.revenueData?.map(item => item.orderCount) || [],
        backgroundColor: VIS.pageBg === '#ffffff' ? 'rgba(0,0,0,0.04)' : 'rgba(26,26,26,0.16)',
        borderColor: VIS.pageBg === '#ffffff' ? 'rgba(0,0,0,0.6)' : '#FFFFFF',
        borderWidth: VIS.ordersLineWidth,
        tension: 0.4,
        pointRadius: VIS.ordersPointRadius,
        pointBackgroundColor: VIS.pageBg === '#ffffff' ? 'rgba(0,0,0,0.6)' : '#FFFFFF'
      }
    ]
  }

  const categoryData = {
    labels: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Shoes'],
    datasets: [
      {
        data: [25, 20, 30, 15, 5, 5],
        backgroundColor: [
              '#111111',
              '#1a1a1a',
              '#d4af37',
              '#0f0f0f',
              '#202020',
              '#0f0f0f'
            ],
        borderWidth: 0
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: VIS.textColor
        }
      },
      title: {
        display: true,
        text: 'Revenue Analytics',
        color: VIS.textColor,
        font: { family: 'Playfair Display, serif', size: 16 }
      }
    },
    scales: {
      x: {
        ticks: { color: VIS.textColor },
        grid: { color: VIS.gridColor, borderColor: VIS.gridColor }
      },
      y: {
        beginAtZero: true,
        ticks: { color: VIS.textColor },
        grid: { color: VIS.gridColor, borderColor: VIS.gridColor }
      }
    }
  }

  return (
  // Use a very-dark charcoal page background so panel blacks read as separate layers
  <div className={`min-h-screen relative`} style={{ backgroundColor: VIS.pageBg, color: VIS.textColor }}>
      {/* Watermark */}
      <WatermarkBackground theme="default" />
      <div className="container-max section-padding py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 p-6 rounded-lg border border-white/10" style={{ backgroundColor: VIS.panelBg }}>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold mb-4" style={{ color: VIS.textColor }}>
            Admin Dashboard
          </h1>
          <p className="text-lg" style={{ color: VIS.cardText || VIS.textColor }}>
            Welcome back — here’s a curated snapshot of your store.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatINR(dashboardStats?.totalRevenue || 0)}
            icon={<IndianRupee className="w-6 h-6" style={{ color: '#d4af37' }} />}
            trend="+12.5%"
            trendUp={true}
          />
          <StatCard
            title="Total Orders"
            value={dashboardStats?.totalOrders || '0'}
            icon={<ShoppingBag className="w-6 h-6" style={{ color: VIS.cardText || VIS.textColor }} />}
            trend="+8.2%"
            trendUp={true}
          />
          <StatCard
            title="Total Users"
            value={dashboardStats?.totalUsers || '0'}
            icon={<Users className="w-6 h-6" style={{ color: VIS.cardText || VIS.textColor }} />}
            trend="+15.3%"
            trendUp={true}
          />
          <StatCard
            title="Total Products"
            value={dashboardStats?.totalProducts || '0'}
            icon={<Package className="w-6 h-6" style={{ color: VIS.cardText || VIS.textColor }} />}
            trend="+5.1%"
            trendUp={true}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="rounded-lg shadow-sm border border-white/10 p-6" style={{ backgroundColor: VIS.panelBg }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: VIS.textColor }}>Revenue Trend</h3>
                <div className="h-64 p-2 rounded" style={{ backgroundColor: VIS.panelInnerBg, border: VIS.pageBg === '#ffffff' ? '1px solid rgba(0,0,0,0.06)' : 'none', boxShadow: VIS.pageBg === '#ffffff' ? '0 1px 0 rgba(0,0,0,0.02) inset' : 'none' }}>
                  <Line data={revenueChartData} options={chartOptions} />
                </div>
          </div>

          {/* Orders Chart */}
          <div className="rounded-lg shadow-sm border border-white/10 p-6" style={{ backgroundColor: VIS.panelBg }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: VIS.textColor }}>Orders Trend</h3>
            <div className="h-64 p-2 rounded" style={{ backgroundColor: VIS.panelInnerBg, border: VIS.pageBg === '#ffffff' ? '1px solid rgba(0,0,0,0.06)' : 'none', boxShadow: VIS.pageBg === '#ffffff' ? '0 1px 0 rgba(0,0,0,0.02) inset' : 'none' }}>
              <Bar data={ordersChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Distribution */}
          <div className="rounded-lg shadow-sm border border-white/10 p-6" style={{ backgroundColor: VIS.panelBg }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: VIS.textColor }}>Category Distribution</h3>
            <div className="h-64 p-2 rounded" style={{ backgroundColor: VIS.panelInnerBg }}>
              <Doughnut data={categoryData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: VIS.textColor }
                  }
                }
              }} />
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2 rounded-lg shadow-sm border border-white/10 p-6" style={{ backgroundColor: VIS.panelBg }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: VIS.textColor }}>Recent Orders</h3>
              <button className="text-sm font-medium transition-colors duration-200" style={{ color: VIS.cardText || VIS.textColor }}>
                View All
              </button>
            </div>
            <div className="space-y-4">
              {revenueData?.recentOrders?.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" style={{ color: VIS.cardText || VIS.textColor }} />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: VIS.cardText || VIS.textColor }}>Order #{order._id.slice(-6)}</p>
                      <p className="text-sm" style={{ color: VIS.cardText || VIS.textColor }}>{order.userId?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: VIS.cardText || VIS.textColor }}>{formatINR(order.totalAmount)}</p>
                    <div className="mt-1">
                      <span className={`${pillClass()} ${getStatusColor(order.orderStatus)}`} style={{ fontSize: 12 }}>{order.orderStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-lg shadow-sm border border-white/10 p-6" style={{ backgroundColor: VIS.panelBg }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: VIS.textColor }}>Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className={`flex items-center justify-center p-4 border border-white/20 rounded-lg transition-colors ${VIS.pageBg === '#ffffff' ? 'hover:bg-black/5' : 'hover:bg-white/5'}`} style={{ color: VIS.cardText || VIS.textColor }}>
              <Plus className="w-5 h-5 mr-2" style={{ color: VIS.cardText || VIS.textColor }} />
              <span className="font-medium">Add Product</span>
            </button>
            <button className={`flex items-center justify-center p-4 border border-white/20 rounded-lg transition-colors ${VIS.pageBg === '#ffffff' ? 'hover:bg-black/5' : 'hover:bg-white/5'}`} style={{ color: VIS.cardText || VIS.textColor }}>
              <Eye className="w-5 h-5 mr-2" style={{ color: VIS.cardText || VIS.textColor }} />
              <span className="font-medium">View Orders</span>
            </button>
            <button className={`flex items-center justify-center p-4 border border-white/20 rounded-lg transition-colors ${VIS.pageBg === '#ffffff' ? 'hover:bg-black/5' : 'hover:bg-white/5'}`} style={{ color: VIS.cardText || VIS.textColor }}>
              <Edit className="w-5 h-5 mr-2" style={{ color: VIS.cardText || VIS.textColor }} />
              <span className="font-medium">Manage Products</span>
            </button>
            <button className={`flex items-center justify-center p-4 border border-white/20 rounded-lg transition-colors ${VIS.pageBg === '#ffffff' ? 'hover:bg-black/5' : 'hover:bg-white/5'}`} style={{ color: VIS.cardText || VIS.textColor }}>
              <Trash2 className="w-5 h-5 mr-2" style={{ color: VIS.cardText || VIS.textColor }} />
              <span className="font-medium">Delete Items</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ title, value, icon, trend, trendUp }) => (
  <div className="bg-white rounded-lg shadow-sm border border-white/10 p-6 transition-shadow hover:shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: VIS.cardText || VIS.textColor }}>{title}</p>
        <p className="text-2xl font-bold" style={{ color: VIS.cardText || VIS.textColor }}>{value}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center`}
        style={{ backgroundColor: VIS.iconBg, color: VIS.iconColor }}
      >
        {
          isValidElement(icon)
            ? cloneElement(icon, { style: { ...(icon.props?.style || {}), color: VIS.iconColor } })
            : icon
        }
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {trendUp ? (
        <TrendingUp className="w-4 h-4 text-gold-500 mr-1" />
      ) : (
        <TrendingDown className="w-4 h-4 text-charcoal-900 mr-1" />
      )}
      <span className={`text-sm font-medium`} style={{ color: trendUp ? '#d4af37' : (VIS.cardText || VIS.textColor) }}>
        {trend}
      </span>
      <span className="text-sm ml-1" style={{ color: VIS.cardText || VIS.textColor }}>vs last month</span>
    </div>
  </div>
)

export default AdminDashboard
