import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Plus, Phone, Calendar, CheckSquare, Clock, Users as UsersIcon } from 'lucide-react';

export default function Activities() {
  const { currentUser, tasks, calls, meetings, addTask, updateTask, addCall, updateCall, addMeeting, updateMeeting, users, deals, leads } = useCRM();
  const [activeTab, setActiveTab] = useState('tasks');
  
  // Task state
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    assignedEmployeeId: '',
    deadline: '',
    status: 'pending' as const,
    notes: '',
    relatedDealId: '',
  });

  // Call state
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [newCall, setNewCall] = useState({
    title: '',
    relatedLeadId: '',
    relatedDealId: '',
    dateTime: '',
    duration: 0,
    callType: 'outbound' as const,
    notes: '',
    outcome: '',
    assignedEmployeeId: '',
  });

  // Meeting state
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    participants: [] as string[],
    notes: '',
    status: 'scheduled' as const,
    relatedDealId: '',
  });

  const employees = users.filter(u => u.role === 'employee');
  const allUsers = users;

  const handleAddTask = () => {
    if (currentUser?.role === 'manager' || currentUser?.role === 'admin') {
      addTask(newTask);
      setNewTask({ title: '', assignedEmployeeId: '', deadline: '', status: 'pending', notes: '', relatedDealId: '' });
      setIsTaskDialogOpen(false);
    }
  };

  const handleAddCall = () => {
    const employeeId = currentUser?.role === 'employee' ? currentUser.id : newCall.assignedEmployeeId;
    addCall({ ...newCall, assignedEmployeeId: employeeId });
    setNewCall({ title: '', relatedLeadId: '', relatedDealId: '', dateTime: '', duration: 0, callType: 'outbound', notes: '', outcome: '', assignedEmployeeId: '' });
    setIsCallDialogOpen(false);
  };

  const handleAddMeeting = () => {
    if (currentUser?.role === 'manager' || currentUser?.role === 'admin') {
      addMeeting(newMeeting);
      setNewMeeting({ title: '', date: '', time: '', location: '', participants: [], notes: '', status: 'scheduled', relatedDealId: '' });
      setIsMeetingDialogOpen(false);
    }
  };

  // Filter tasks based on role
  const visibleTasks = currentUser?.role === 'employee'
    ? tasks.filter(t => t.assignedEmployeeId === currentUser.id)
    : tasks;

  const visibleCalls = currentUser?.role === 'employee'
    ? calls.filter(c => c.assignedEmployeeId === currentUser.id)
    : calls;

  const visibleMeetings = currentUser?.role === 'employee'
    ? meetings.filter(m => m.participants.includes(currentUser.id))
    : meetings;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
        <p className="text-gray-500 mt-1">Manage tasks, calls, and meetings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="tasks">
            <CheckSquare className="w-4 h-4 mr-2" />
            Tasks ({visibleTasks.length})
          </TabsTrigger>
          <TabsTrigger value="calls">
            <Phone className="w-4 h-4 mr-2" />
            Calls ({visibleCalls.length})
          </TabsTrigger>
          <TabsTrigger value="meetings">
            <Calendar className="w-4 h-4 mr-2" />
            Meetings ({visibleMeetings.length})
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Card className="w-32">
                <CardContent className="pt-4 pb-3 text-center">
                  <div className="text-2xl font-bold">{visibleTasks.filter(t => t.status === 'pending').length}</div>
                  <p className="text-xs text-gray-500">Pending</p>
                </CardContent>
              </Card>
              <Card className="w-32">
                <CardContent className="pt-4 pb-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{visibleTasks.filter(t => t.status === 'in-progress').length}</div>
                  <p className="text-xs text-gray-500">In Progress</p>
                </CardContent>
              </Card>
              <Card className="w-32">
                <CardContent className="pt-4 pb-3 text-center">
                  <div className="text-2xl font-bold text-green-600">{visibleTasks.filter(t => t.status === 'completed').length}</div>
                  <p className="text-xs text-gray-500">Completed</p>
                </CardContent>
              </Card>
            </div>
            {(currentUser?.role === 'manager' || currentUser?.role === 'admin') && (
              <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="taskTitle">Task Title</Label>
                      <Input
                        id="taskTitle"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="employee">Assign to Employee</Label>
                      <Select value={newTask.assignedEmployeeId} onValueChange={(value) => setNewTask({ ...newTask, assignedEmployeeId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="relatedDeal">Related Deal (Optional)</Label>
                      <Select value={newTask.relatedDealId} onValueChange={(value) => setNewTask({ ...newTask, relatedDealId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select deal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {deals.map(deal => (
                            <SelectItem key={deal.id} value={deal.id}>{deal.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newTask.notes}
                        onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                        placeholder="Task details..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleAddTask} className="w-full">Create Task</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleTasks.map(task => {
              const employee = users.find(u => u.id === task.assignedEmployeeId);
              const deal = deals.find(d => d.id === task.relatedDealId);
              return (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{task.title}</CardTitle>
                      <Badge className={
                        task.status === 'completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {task.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-600">{task.notes}</p>
                    <div className="text-xs text-gray-500">
                      <p>Assigned: {employee?.name}</p>
                      <p>Deadline: {task.deadline}</p>
                      {deal && <p>Deal: {deal.name}</p>}
                    </div>
                    {currentUser?.role === 'employee' && task.assignedEmployeeId === currentUser.id && (
                      <Select value={task.status} onValueChange={(value) => updateTask(task.id, { status: value as any })}>
                        <SelectTrigger className="text-xs h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Calls Tab */}
        <TabsContent value="calls" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Log Call
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Log Call</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="callTitle">Call Title</Label>
                    <Input
                      id="callTitle"
                      value={newCall.title}
                      onChange={(e) => setNewCall({ ...newCall, title: e.target.value })}
                      placeholder="Enter call subject"
                    />
                  </div>
                  <div>
                    <Label htmlFor="callType">Call Type</Label>
                    <Select value={newCall.callType} onValueChange={(value: 'inbound' | 'outbound') => setNewCall({ ...newCall, callType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inbound">Inbound</SelectItem>
                        <SelectItem value="outbound">Outbound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="callDateTime">Date & Time</Label>
                    <Input
                      id="callDateTime"
                      type="datetime-local"
                      value={newCall.dateTime}
                      onChange={(e) => setNewCall({ ...newCall, dateTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newCall.duration || ''}
                      onChange={(e) => setNewCall({ ...newCall, duration: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  {currentUser?.role !== 'employee' && (
                    <div>
                      <Label htmlFor="callEmployee">Assign to Employee</Label>
                      <Select value={newCall.assignedEmployeeId} onValueChange={(value) => setNewCall({ ...newCall, assignedEmployeeId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="callNotes">Notes</Label>
                    <Textarea
                      id="callNotes"
                      value={newCall.notes}
                      onChange={(e) => setNewCall({ ...newCall, notes: e.target.value })}
                      placeholder="Call details..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="outcome">Outcome</Label>
                    <Input
                      id="outcome"
                      value={newCall.outcome}
                      onChange={(e) => setNewCall({ ...newCall, outcome: e.target.value })}
                      placeholder="Call outcome"
                    />
                  </div>
                  <Button onClick={handleAddCall} className="w-full">Log Call</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCalls.map(call => {
              const employee = users.find(u => u.id === call.assignedEmployeeId);
              return (
                <Card key={call.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <CardTitle className="text-base">{call.title}</CardTitle>
                      </div>
                      <Badge className={call.callType === 'inbound' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                        {call.callType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-600">{call.notes}</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Employee: {employee?.name}</p>
                      <p>Date: {new Date(call.dateTime).toLocaleString()}</p>
                      <p>Duration: {call.duration} min</p>
                      <p className="font-medium">Outcome: {call.outcome}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Meetings Tab */}
        <TabsContent value="meetings" className="space-y-6">
          <div className="flex justify-end">
            {(currentUser?.role === 'manager' || currentUser?.role === 'admin') && (
              <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Schedule Meeting</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="meetingTitle">Meeting Title</Label>
                      <Input
                        id="meetingTitle"
                        value={newMeeting.title}
                        onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                        placeholder="Enter meeting subject"
                      />
                    </div>
                    <div>
                      <Label htmlFor="meetingDate">Date</Label>
                      <Input
                        id="meetingDate"
                        type="date"
                        value={newMeeting.date}
                        onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="meetingTime">Time</Label>
                      <Input
                        id="meetingTime"
                        type="time"
                        value={newMeeting.time}
                        onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location / Link</Label>
                      <Input
                        id="location"
                        value={newMeeting.location}
                        onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                        placeholder="Office or online link"
                      />
                    </div>
                    <div>
                      <Label htmlFor="meetingNotes">Notes</Label>
                      <Textarea
                        id="meetingNotes"
                        value={newMeeting.notes}
                        onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                        placeholder="Meeting agenda..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleAddMeeting} className="w-full">Schedule Meeting</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleMeetings.map(meeting => (
              <Card key={meeting.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <CardTitle className="text-base">{meeting.title}</CardTitle>
                    </div>
                    <Badge className={
                      meeting.status === 'completed' ? 'bg-green-100 text-green-700' :
                      meeting.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }>
                      {meeting.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600">{meeting.notes}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Date: {meeting.date}</p>
                    <p>Time: {meeting.time}</p>
                    <p>Location: {meeting.location}</p>
                    <p>Participants: {meeting.participants.length}</p>
                  </div>
                  {(currentUser?.role === 'manager' || currentUser?.role === 'admin') && (
                    <Select value={meeting.status} onValueChange={(value) => updateMeeting(meeting.id, { status: value as any })}>
                      <SelectTrigger className="text-xs h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
