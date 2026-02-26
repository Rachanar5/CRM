import { useCRM } from '../context/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, DollarSign, Users, Handshake, Phone, Calendar as CalendarIcon } from 'lucide-react';

export default function Reports() {
  const { currentUser, deals, leads, tasks, calls, meetings, payments, users, invoices } = useCRM();

  // Sales Performance Data
  const dealsByStage = [
    { name: 'Prospect', value: deals.filter(d => d.stage === 'prospect').length, color: '#3b82f6' },
    { name: 'Proposal', value: deals.filter(d => d.stage === 'proposal').length, color: '#8b5cf6' },
    { name: 'Negotiation', value: deals.filter(d => d.stage === 'negotiation').length, color: '#f59e0b' },
    { name: 'Closed Won', value: deals.filter(d => d.stage === 'closed-won').length, color: '#10b981' },
    { name: 'Closed Lost', value: deals.filter(d => d.stage === 'closed-lost').length, color: '#ef4444' },
  ];

  // Revenue by Month (Mock data with some real data)
  const revenueByMonth = [
    { month: 'Jan', revenue: 45000, deals: 8 },
    { month: 'Feb', revenue: payments.length > 0 ? payments.reduce((sum, p) => sum + p.amount, 0) : 52000, deals: 10 },
    { month: 'Mar', revenue: 48000, deals: 9 },
    { month: 'Apr', revenue: 61000, deals: 12 },
    { month: 'May', revenue: 55000, deals: 11 },
    { month: 'Jun', revenue: 67000, deals: 14 },
  ];

  // Lead Conversion
  const leadsByStatus = [
    { status: 'New', count: leads.filter(l => l.status === 'new').length },
    { status: 'Contacted', count: leads.filter(l => l.status === 'contacted').length },
    { status: 'Qualified', count: leads.filter(l => l.status === 'qualified').length },
    { status: 'Converted', count: leads.filter(l => l.status === 'converted').length },
  ];

  // Team Performance
  const managers = users.filter(u => u.role === 'manager');
  const managerPerformance = managers.map(manager => {
    const managerDeals = deals.filter(d => d.assignedManagerId === manager.id);
    return {
      name: manager.name.split(' ')[0],
      deals: managerDeals.length,
      closed: managerDeals.filter(d => d.stage === 'closed-won').length,
      value: managerDeals.filter(d => d.stage === 'closed-won').reduce((sum, d) => sum + d.value, 0),
    };
  });

  // Activity Stats
  const activityStats = [
    { name: 'Tasks', total: tasks.length, completed: tasks.filter(t => t.status === 'completed').length },
    { name: 'Calls', total: calls.length, completed: calls.length },
    { name: 'Meetings', total: meetings.length, completed: meetings.filter(m => m.status === 'completed').length },
  ];

  // Key Metrics
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalDeals = deals.length;
  const closedDeals = deals.filter(d => d.stage === 'closed-won').length;
  const conversionRate = totalDeals > 0 ? Math.round((closedDeals / totalDeals) * 100) : 0;
  const avgDealValue = closedDeals > 0 ? Math.round(deals.filter(d => d.stage === 'closed-won').reduce((sum, d) => sum + d.value, 0) / closedDeals) : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 mt-1">Comprehensive business insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Deals</CardTitle>
            <Handshake className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <p className="text-xs text-gray-500 mt-1">{closedDeals} closed won</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Lead to deal conversion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Deal Value</CardTitle>
            <DollarSign className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgDealValue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Per closed deal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Leads</CardTitle>
            <Users className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter(l => l.status !== 'converted').length}</div>
            <p className="text-xs text-gray-500 mt-1">Out of {leads.length} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Deals Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" />
                <Line yAxisId="right" type="monotone" dataKey="deals" stroke="#3b82f6" strokeWidth={2} name="Deals" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deal Pipeline Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dealsByStage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dealsByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadsByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manager Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={managerPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="deals" fill="#3b82f6" name="Total Deals" />
                <Bar dataKey="closed" fill="#10b981" name="Closed Deals" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Activity Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activityStats.map(activity => {
              const completionRate = activity.total > 0 ? Math.round((activity.completed / activity.total) * 100) : 0;
              return (
                <div key={activity.name} className="text-center">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {activity.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {completionRate}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      <div
                        style={{ width: `${completionRate}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {activity.completed} of {activity.total} completed
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {managerPerformance
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map((manager, index) => (
                  <div key={manager.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{manager.name}</p>
                        <p className="text-sm text-gray-500">{manager.closed} deals closed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${manager.value.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Calls Made</p>
                    <p className="text-sm text-gray-500">Last 30 days</p>
                  </div>
                </div>
                <span className="text-2xl font-bold">{calls.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Meetings Scheduled</p>
                    <p className="text-sm text-gray-500">Total meetings</p>
                  </div>
                </div>
                <span className="text-2xl font-bold">{meetings.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Handshake className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Win Rate</p>
                    <p className="text-sm text-gray-500">Deals won vs total</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">{conversionRate}%</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Outstanding Invoices</p>
                    <p className="text-sm text-gray-500">Unpaid amount</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-orange-600">
                  ${invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + i.totalAmount + i.tax, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
