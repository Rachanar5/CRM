import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, Phone, Mail, Building, ArrowRight, Search } from 'lucide-react';

export default function Leads() {
  const { currentUser, leads, addLead, updateLead, convertLeadToDeal, users, deals } = useCRM();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    status: 'new' as const,
  });

  const handleAddLead = () => {
    addLead(newLead);
    setNewLead({ name: '', email: '', phone: '', company: '', source: '', status: 'new' });
    setIsAddDialogOpen(false);
  };

  const handleConvertToDeal = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead && currentUser) {
      const managerId = currentUser.role === 'admin' ? users.find(u => u.role === 'manager')?.id || currentUser.id : currentUser.id;
      convertLeadToDeal(leadId, {
        name: `${lead.company} Deal`,
        clientName: lead.name,
        value: 10000,
        stage: 'prospect',
        assignedManagerId: managerId,
        expectedClosingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-purple-100 text-purple-700',
    converted: 'bg-green-100 text-green-700',
  };

  const leadsByStatus = {
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">Manage your potential customers</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  placeholder="Enter lead name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  placeholder="555-0000"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label htmlFor="source">Lead Source</Label>
                <Select value={newLead.source} onValueChange={(value) => setNewLead({ ...newLead, source: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddLead} className="w-full">Add Lead</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{leadsByStatus.new}</div>
            <p className="text-sm text-gray-500">New Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{leadsByStatus.contacted}</div>
            <p className="text-sm text-gray-500">Contacted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{leadsByStatus.qualified}</div>
            <p className="text-sm text-gray-500">Qualified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{leadsByStatus.converted}</div>
            <p className="text-sm text-gray-500">Converted</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map(lead => (
          <Card key={lead.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{lead.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{lead.company}</p>
                </div>
                <Badge className={statusColors[lead.status]}>
                  {lead.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>Source: {lead.source}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-3">Created: {lead.createdAt}</p>
                  <div className="flex gap-2">
                    <Select
                      value={lead.status}
                      onValueChange={(value) => updateLead(lead.id, { status: value as any })}
                    >
                      <SelectTrigger className="text-xs h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                      </SelectContent>
                    </Select>
                    {lead.status !== 'converted' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConvertToDeal(lead.id)}
                        className="text-xs h-8"
                      >
                        <ArrowRight className="w-3 h-3 mr-1" />
                        Deal
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No leads found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
}
