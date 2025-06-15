import React, { useEffect, useState } from "react";
import { Bar } from "recharts";
import { 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  MapPin, 
  Calendar,
  Package,
  Globe,
  Activity,
  AlertCircle
} from "lucide-react";

const colors = {
  primary: "#3B82F6",
  secondary: "#10B981",
  accent: "#F59E0B",
  purple: "#8B5CF6",
  pink: "#EC4899",
  indigo: "#6366F1"
};

const colorPalette = [colors.primary, colors.secondary, colors.accent, colors.purple, colors.pink, colors.indigo];

export default function Dashboard() {
  const [countryData, setCountryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = 50;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchWithParams = async (url, params = {}) => {
        const urlObj = new URL(url);
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            urlObj.searchParams.append(key, params[key]);
          }
        });
        
        console.log('Fetching URL:', urlObj.toString());
        const response = await fetch(urlObj.toString());
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        return data;
      };

      // Fetch country data with pagination
      const countryRes = await fetchWithParams("http://localhost:8090/api/insights/getcountrylevelrevenue", { 
        page: page.toString(), 
        limit: limit.toString() 
      });
      
      console.log('Country data response:', countryRes);
      
      if (!countryRes.data || !Array.isArray(countryRes.data)) {
        throw new Error('Invalid country data response format');
      }

      // Check if we have more data
      setHasMore(countryRes.data.length === limit);

      // Fetch other data
      const [productRes, monthlyRes, regionRes] = await Promise.all([
        fetch("http://localhost:8090/api/insights/getfrequentlypurchasedproducts").then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        }),
        fetch("http://localhost:8090/api/insights/getmonthlysalessummary").then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        }),
        fetch("http://localhost:8090/api/insights/getregionrevenyesummary").then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        }),
      ]);

      // Set data with proper fallbacks
      setCountryData(countryRes.data || []);
      setProductData(productRes.data || []);
      setMonthlySalesData(monthlyRes.data || []);
      setRegionData(regionRes.data || []);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Page changed to:', page);
    fetchData();
  }, [page]);

  const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-50`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats from actual data
  const totalRevenue = countryData.reduce((sum, item) => sum + (item.total_revenue || 0), 0);
  const totalTransactions = countryData.reduce((sum, item) => sum + (item.transaction_count || 0), 0);
  const totalProducts = productData.length;
  const totalRegions = regionData.length;

  // Handle empty data states
  const hasData = countryData.length > 0 || productData.length > 0 || monthlySalesData.length > 0 || regionData.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Revenue Dashboard</h1>
              <p className="text-gray-600 mt-1">Comprehensive analytics and insights</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Country-Level Revenue Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <Globe className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Country-Level Revenue</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">Sorted by total revenue (highest to lowest)</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transactions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {countryData.length > 0 ? (
                  countryData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{row.country || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{row.product_name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-green-600">
                          {formatCurrency(row.total_revenue || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {formatNumber(row.transaction_count || 0)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No country data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page <span className="font-medium">{page}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => {
                    console.log('Previous clicked, current page:', page);
                    if (page > 1) {
                      setPage(page - 1);
                    }
                  }}
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => {
                    console.log('Next clicked, current page:', page);
                    if (hasMore) {
                      setPage(page + 1);
                    }
                  }}
                  disabled={!hasMore}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 20 Frequently Purchased Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <Package className="w-5 h-5 text-gray-600 mr-2" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Top Products</h2>
                <p className="text-sm text-gray-600">Purchase count vs stock quantity</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              {productData.length > 0 ? (
                <BarChart data={productData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="product_name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="purchase_count" fill={colors.primary} name="Purchase Count" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="stock_quantity" fill={colors.secondary} name="Stock Quantity" radius={[2, 2, 0, 0]} />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No product data available</p>
                  </div>
                </div>
              )}
            </ResponsiveContainer>
          </div>

          {/* Monthly Sales Volume */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <Activity className="w-5 h-5 text-gray-600 mr-2" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Monthly Sales Volume</h2>
                <p className="text-sm text-gray-600">Quantity sold by month</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              {monthlySalesData.length > 0 ? (
                <BarChart data={monthlySalesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name) => [formatNumber(value), name]}
                  />
                  <Bar dataKey="total_quantity" fill={colors.accent} name="Total Quantity" radius={[4, 4, 0, 0]}>
                    {monthlySalesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No monthly sales data available</p>
                  </div>
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 30 Regions by Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <MapPin className="w-5 h-5 text-gray-600 mr-2" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Top Regions by Revenue</h2>
              <p className="text-sm text-gray-600">Revenue and items sold by region</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            {regionData.length > 0 ? (
              <BarChart
              data={regionData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <YAxis
                dataKey="region"
                type="category"
                fontSize={12}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value, name) => [
                  name === 'total_revenue' ? formatCurrency(value) : formatNumber(value),
                  name === 'total_revenue' ? 'Revenue' : 'Items Sold'
                ]}
              />
              <Legend />
              <Bar
                dataKey="total_revenue"
                name="Total Revenue"
                fill="#6366F1"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="total_quantity"
                name="Items Sold"
                fill="#10B981"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
            
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No region data available</p>
                </div>
              </div>
            )}
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}