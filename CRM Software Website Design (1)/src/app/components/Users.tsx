import { useState } from 'react';
import { useCRM, UserRole } from '../context/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, UserCog, Mail, Shield, Search } from 'lucide-react';

export default function Users() {
  const { currentUser, users, addUser } = useCRM();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'employee' as UserRole,
  });

  const handleAddUser = () => {
    if (currentUser?.role === 'admin') {
      addUser(newUser);
      setNewUser({ name: '', email: '', role: 'employee' });
      setIsAddDialogOpen(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleColors = {
    admin: 'bg-red-100 text-red-700',
    manager: 'bg-blue-100 text-blue-700',
    employee: 'bg-green-100 text-green-700',
  };

  const roleIcons = {
    admin: '👑',
    manager: '📊',
    employee: '👤',
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-8">
        <Card className="p-12 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
          <p className="text-gray-500">Only administrators can access user management.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage system users and roles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="userName">Name</Label>
                <Input
                  id="userName"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter user name"
                />
              </div>
              <div>
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <Label htmlFor="userRole">Role</Label>
                <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddUser} className="w-full">Add User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-sm text-gray-500">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{users.filter(u => u.role === 'admin').length}</div>
            <p className="text-sm text-gray-500">Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'manager').length}</div>
            <p className="text-sm text-gray-500">Managers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'employee').length}</div>
            <p className="text-sm text-gray-500">Employees</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterRole} onValueChange={(value: any) => setFilterRole(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg">
                    {roleIcons[user.role]}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <Badge className={roleColors[user.role]} variant="outline">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserCog className="w-4 h-4" />
                  <span>Created: {user.createdAt}</span>
                </div>
                
                {/* Role Permissions */}
                <div className="pt-3 border-t">
                  <p className="text-xs font-medium text-gray-500 mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {user.role === 'admin' && (
                      <>
                        <Badge variant="outline" className="text-xs">All Access</Badge>
                        <Badge variant="outline" className="text-xs">User Management</Badge>
                        <Badge variant="outline" className="text-xs">Reports</Badge>
                      </>
                    )}
                    {user.role === 'manager' && (
                      <>
                        <Badge variant="outline" className="text-xs">Manage Deals</Badge>
                        <Badge variant="outline" className="text-xs">Assign Tasks</Badge>
                        <Badge variant="outline" className="text-xs">View Reports</Badge>
                      </>
                    )}
                    {user.role === 'employee' && (
                      <>
                        <Badge variant="outline" className="text-xs">Update Tasks</Badge>
                        <Badge variant="outline" className="text-xs">Log Calls</Badge>
                        <Badge variant="outline" className="text-xs">View Deals</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No users found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
}
