import { useCRM } from '../context/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DollarSign, TrendingUp, Users, Handshake, CheckCircle, Clock, Phone, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const { currentUser, deals, tasks, calls, meetings, payments, users, leads } = useCRM();

  if (!currentUser) return null;

  // Admin Dashboard
  if (currentUser.role === 'admin') {
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalDeals = deals.length;
    const closedDeals = deals.filter(d => d.stage === 'closed-won').length;
    const conversionRate = totalDeals > 0 ? Math.round((closedDeals / totalDeals) * 100) : 0;

    const dealsByStage = [
      { name: 'Prospect', value: deals.filter(d => d.stage === 'prospect').length, color: '#3b82f6' },
      { name: 'Proposal', value: deals.filter(d => d.stage === 'proposal').length, color: '#8b5cf6' },
      { name: 'Negotiation', value: deals.filter(d => d.stage === 'negotiation').length, color: '#f59e0b' },
      { name: 'Closed Won', value: deals.filter(d => d.stage === 'closed-won').length, color: '#10b981' },
      { name: 'Closed Lost', value: deals.filter(d => d.stage === 'closed-lost').length, color: '#ef4444' },
    ];

    const revenueByMonth = [
      { month: 'Jan', revenue: 45000 },
      { month: 'Feb', revenue: 52000 },
      { month: 'Mar', revenue: 48000 },
      { month: 'Apr', revenue: 61000 },
      { month: 'May', revenue: 55000 },
      { month: 'Jun', revenue: 67000 },
    ];

    const managers = users.filter(u => u.role === 'manager');
    const managerPerformance = managers.map(manager => ({
      name: manager.name.split(' ')[0],
      deals: deals.filter(d => d.assignedManagerId === manager.id).length,
      closed: deals.filter(d => d.assignedManagerId === manager.id && d.stage === 'closed-won').length,
    }));

    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {currentUser.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Deals</CardTitle>
              <Handshake className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalDeals}</div>
              <p className="text-xs text-blue-600 mt-1">{closedDeals} closed won</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Leads</CardTitle>
              <Users className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{leads.filter(l => l.status !== 'converted').length}</div>
              <p className="text-xs text-purple-600 mt-1">{leads.length} total leads</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{conversionRate}%</div>
              <p className="text-xs text-orange-600 mt-1">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deals by Stage</CardTitle>
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

        {/* Manager Performance */}
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
                <Bar dataKey="deals" fill="#3b82f6" name="Total Deals" />
                <Bar dataKey="closed" fill="#10b981" name="Closed Deals" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Manager Dashboard
  if (currentUser.role === 'manager') {
    const myDeals = deals.filter(d => d.assignedManagerId === currentUser.id);
    const myTasks = tasks.filter(t => {
      const relatedDeal = deals.find(d => d.id === t.relatedDealId);
      return relatedDeal?.assignedManagerId === currentUser.id;
    });
    const upcomingMeetings = meetings.filter(m => m.status === 'scheduled' && m.participants.includes(currentUser.id));
    const pendingTasks = myTasks.filter(t => t.status === 'pending' || t.status === 'in-progress');

    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {currentUser.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">My Deals</CardTitle>
              <Handshake className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myDeals.length}</div>
              <p className="text-xs text-gray-500 mt-1">Total assigned deals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Tasks</CardTitle>
              <Clock className="w-5 h-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingTasks.length}</div>
              <p className="text-xs text-gray-500 mt-1">Tasks in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming Meetings</CardTitle>
              <Calendar className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{upcomingMeetings.length}</div>
              <p className="text-xs text-gray-500 mt-1">Scheduled meetings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Team Calls</CardTitle>
              <Phone className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{calls.length}</div>
              <p className="text-xs text-gray-500 mt-1">Total calls logged</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Deals */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>My Recent Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myDeals.slice(0, 5).map(deal => (
                <div key={deal.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium">{deal.name}</h4>
                    <p className="text-sm text-gray-500">{deal.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${deal.value.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      deal.stage === 'closed-won' ? 'bg-green-100 text-green-700' :
                      deal.stage === 'negotiation' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {deal.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Team Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myTasks.slice(0, 5).map(task => {
                const employee = users.find(u => u.id === task.assignedEmployeeId);
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange-600" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-gray-500">Assigned to: {employee?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{task.deadline}</p>
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                        task.status === 'completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Employee Dashboard
  const myTasks = tasks.filter(t => t.assignedEmployeeId === currentUser.id);
  const myCalls = calls.filter(c => c.assignedEmployeeId === currentUser.id);
  const myMeetings = meetings.filter(m => m.participants.includes(currentUser.id));
  const pendingTasks = myTasks.filter(t => t.status !== 'completed');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {currentUser.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">My Tasks</CardTitle>
            <CheckCircle className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myTasks.length}</div>
            <p className="text-xs text-orange-600 mt-1">{pendingTasks.length} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">My Calls</CardTitle>
            <Phone className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myCalls.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total calls logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">My Meetings</CardTitle>
            <Calendar className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myMeetings.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total meetings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {myTasks.length > 0 ? Math.round((myTasks.filter(t => t.status === 'completed').length / myTasks.length) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Task completion</p>
          </CardContent>
        </Card>
      </div>

      {/* My Tasks */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myTasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-orange-600" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.notes}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Due: {task.deadline}</p>
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Calls */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myCalls.slice(0, 5).map(call => (
              <div key={call.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">{call.title}</p>
                    <p className="text-xs text-gray-500">{call.notes}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{new Date(call.dateTime).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">{call.duration} min</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
