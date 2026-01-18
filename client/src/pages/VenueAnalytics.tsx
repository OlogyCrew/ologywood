import React, { useState } from 'react';
import { trpc } from '../lib/trpc';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const VenueAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month');
  
  // Fetch venue bookings for analytics
  const { data: bookings } = trpc.booking.getMyVenueBookings.useQuery();
  
  // Calculate metrics
  const calculateMetrics = () => {
    if (!bookings) return null;
    
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.artistRate || 0), 0);
    
    const genreStats: Record<string, number> = {};
    bookings.forEach(b => {
      if (b.genres) {
        b.genres.forEach((genre: string) => {
          genreStats[genre] = (genreStats[genre] || 0) + 1;
        });
      }
    });
    
    const genreData = Object.entries(genreStats).map(([name, value]) => ({
      name,
      value,
    }));
    
    const monthlyData = Array(12).fill(0).map((_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      bookings: 0,
      revenue: 0,
    }));
    
    bookings.forEach(b => {
      const date = new Date(b.eventDate);
      const monthIndex = date.getMonth();
      if (b.status === 'confirmed') {
        monthlyData[monthIndex].bookings += 1;
        monthlyData[monthIndex].revenue += b.artistRate || 0;
      }
    });
    
    return {
      confirmedBookings,
      totalRevenue,
      genreData,
      monthlyData,
      conversionRate: bookings.length > 0 ? ((confirmedBookings / bookings.length) * 100).toFixed(1) : 0,
      averageArtistRate: confirmedBookings > 0 ? (totalRevenue / confirmedBookings).toFixed(2) : 0,
    };
  };
  
  const metrics = calculateMetrics();
  const COLORS = ['#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#f97316', '#06b6d4'];
  
  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', color: '#1f2937' }}>
          Venue Analytics
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          Track your booking trends, revenue, and artist performance
        </p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {(['month', 'quarter', 'year'] as const).map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: dateRange === range ? '#7c3aed' : '#f3f4f6',
                color: dateRange === range ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {metrics && (
        <>
          {/* Key Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              borderLeft: '4px solid #7c3aed',
            }}>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 10px 0' }}>
                Confirmed Bookings
              </p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
                {metrics.confirmedBookings}
              </p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              borderLeft: '4px solid #ec4899',
            }}>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 10px 0' }}>
                Total Revenue
              </p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
                ${metrics.totalRevenue.toLocaleString()}
              </p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              borderLeft: '4px solid #10b981',
            }}>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 10px 0' }}>
                Conversion Rate
              </p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
                {metrics.conversionRate}%
              </p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              borderLeft: '4px solid #f59e0b',
            }}>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 10px 0' }}>
                Average Artist Rate
              </p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
                ${metrics.averageArtistRate}
              </p>
            </div>
          </div>
          
          {/* Charts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}>
            {/* Monthly Trends */}
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
                Monthly Booking Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                    cursor={{ stroke: '#7c3aed', strokeWidth: 2 }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#7c3aed" 
                    strokeWidth={2}
                    dot={{ fill: '#7c3aed', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Genre Distribution */}
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
                Most Booked Genres
              </h3>
              {metrics.genreData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics.genreData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {metrics.genreData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
                  No booking data available
                </p>
              )}
            </div>
            
            {/* Monthly Revenue */}
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
                Monthly Revenue
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                    formatter={(value) => `$${value}`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Insights */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
              Key Insights
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#6b7280' }}>
              <li style={{ marginBottom: '10px' }}>
                Your conversion rate of {metrics.conversionRate}% shows how many booking requests become confirmed bookings
              </li>
              <li style={{ marginBottom: '10px' }}>
                Average artist rate of ${metrics.averageArtistRate} helps you budget for future events
              </li>
              {metrics.genreData.length > 0 && (
                <li style={{ marginBottom: '10px' }}>
                  {metrics.genreData[0].name} is your most booked genre - consider featuring more artists in this category
                </li>
              )}
              <li>
                Track these metrics monthly to identify trends and optimize your booking strategy
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default VenueAnalytics;
