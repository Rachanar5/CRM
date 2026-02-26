import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, DollarSign, Calendar, User, Search } from 'lucide-react';

export default function Deals() {
  const { currentUser, deals, addDeal, updateDeal, users } = useCRM();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');

  const [newDeal, setNewDeal] = useState({
    name: '',
    clientName: '',
    value: 0,
    stage: 'prospect' as const,
    assignedManagerId: '',
    expectedClosingDate: '',
  });

  const handleAddDeal = () => {
    if (currentUser?.role === 'admin') {
      addDeal(newDeal);
      setNewDeal({
        name: '',
        clientName: '',
        value: 0,
        stage: 'prospect',
        assignedManagerId: '',
        expectedClosingDate: '',
      });
      setIsAddDialogOpen(false);
    }
  };

  const managers = users.filter(u => u.role === 'manager');

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          deal.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || deal.stage === filterStage;
    
    // Role-based filtering
    if (currentUser?.role === 'manager') {
      return matchesSearch && matchesStage && deal.assignedManagerId === currentUser.id;
    }
    if (currentUser?.role === 'employee') {
      return matchesSearch && matchesStage;
    }
    return matchesSearch && matchesStage;
  });

  const stageColors = {
    prospect: 'bg-blue-100 text-blue-700',
    proposal: 'bg-purple-100 text-purple-700',
    negotiation: 'bg-orange-100 text-orange-700',
    'closed-won': 'bg-green-100 text-green-700',
    'closed-lost': 'bg-red-100 text-red-700',
  };

  const dealsByStage = {
    prospect: deals.filter(d => d.stage === 'prospect').length,
    proposal: deals.filter(d => d.stage === 'proposal').length,
    negotiation: deals.filter(d => d.stage === 'negotiation').length,
    'closed-won': deals.filter(d => d.stage === 'closed-won').length,
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-500 mt-1">Track and manage business opportunities</p>
        </div>
        {currentUser?.role === 'admin' && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Deal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dealName">Deal Name</Label>
                  <Input
                    id="dealName"
                    value={newDeal.name}
                    onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                    placeholder="Enter deal name"
                  />
                </div>
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={newDeal.clientName}
                    onChange={(e) => setNewDeal({ ...newDeal, clientName: e.target.value })}
                    placeholder="Client or company name"
                  />
                </div>
                <div>
                  <Label htmlFor="value">Deal Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newDeal.value || ''}
                    onChange={(e) => setNewDeal({ ...newDeal, value: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="manager">Assign to Manager</Label>
                  <Select
                    value={newDeal.assignedManagerId}
                    onValueChange={(value) => setNewDeal({ ...newDeal, assignedManagerId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map(manager => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="closingDate">Expected Closing Date</Label>
                  <Input
                    id="closingDate"
                    type="date"
                    value={newDeal.expectedClosingDate}
                    onChange={(e) => setNewDeal({ ...newDeal, expectedClosingDate: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddDeal} className="w-full">Create Deal</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{dealsByStage.prospect}</div>
            <p className="text-sm text-gray-500">Prospect</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{dealsByStage.proposal}</div>
            <p className="text-sm text-gray-500">Proposal</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{dealsByStage.negotiation}</div>
            <p className="text-sm text-gray-500">Negotiation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{dealsByStage['closed-won']}</div>
            <p className="text-sm text-gray-500">Closed Won</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStage} onValueChange={setFilterStage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
            <SelectItem value="negotiation">Negotiation</SelectItem>
            <SelectItem value="closed-won">Closed Won</SelectItem>
            <SelectItem value="closed-lost">Closed Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map(deal => {
          const manager = users.find(u => u.id === deal.assignedManagerId);
          return (
            <Card key={deal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{deal.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{deal.clientName}</p>
                  </div>
                  <Badge className={stageColors[deal.stage]}>
                    {deal.stage}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">
                      ${deal.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Manager: {manager?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Close: {deal.expectedClosingDate}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-3">Created: {deal.createdAt}</p>
                    {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
                      <Select
                        value={deal.stage}
                        onValueChange={(value) => updateDeal(deal.id, { stage: value as any })}
                      >
                        <SelectTrigger className="text-xs h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prospect">Prospect</SelectItem>
                          <SelectItem value="proposal">Proposal</SelectItem>
                          <SelectItem value="negotiation">Negotiation</SelectItem>
                          <SelectItem value="closed-won">Closed Won</SelectItem>
                          <SelectItem value="closed-lost">Closed Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDeals.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No deals found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
}
