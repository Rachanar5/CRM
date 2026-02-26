import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, CreditCard, DollarSign, Calendar, FileText } from 'lucide-react';

export default function Payments() {
  const { payments, invoices, addPayment } = useCRM();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    invoiceId: '',
    amount: 0,
    method: 'bank-transfer' as const,
    date: '',
    notes: '',
  });

  const unpaidInvoices = invoices.filter(i => i.status === 'unpaid' || i.status === 'overdue');

  const handleAddPayment = () => {
    addPayment(newPayment);
    setNewPayment({ invoiceId: '', amount: 0, method: 'bank-transfer', date: '', notes: '' });
    setIsAddDialogOpen(false);
  };

  const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = unpaidInvoices.reduce((sum, i) => sum + i.totalAmount + i.tax, 0);

  const methodIcons = {
    cash: DollarSign,
    card: CreditCard,
    'bank-transfer': FileText,
    check: FileText,
  };

  const methodColors = {
    cash: 'bg-green-100 text-green-700',
    card: 'bg-blue-100 text-blue-700',
    'bank-transfer': 'bg-purple-100 text-purple-700',
    check: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1">Track and record payments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="invoice">Select Invoice</Label>
                <Select value={newPayment.invoiceId} onValueChange={(value) => {
                  const invoice = invoices.find(i => i.id === value);
                  setNewPayment({ 
                    ...newPayment, 
                    invoiceId: value,
                    amount: invoice ? invoice.totalAmount + invoice.tax : 0
                  });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select invoice" />
                  </SelectTrigger>
                  <SelectContent>
                    {unpaidInvoices.map(invoice => (
                      <SelectItem key={invoice.id} value={invoice.id}>
                        {invoice.invoiceNumber} - {invoice.clientName} (${(invoice.totalAmount + invoice.tax).toLocaleString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Payment Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newPayment.amount || ''}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select value={newPayment.method} onValueChange={(value: any) => setNewPayment({ ...newPayment, method: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Payment Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newPayment.date}
                  onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  placeholder="Payment details..."
                  rows={3}
                />
              </div>

              <Button onClick={handleAddPayment} className="w-full" disabled={!newPayment.invoiceId}>
                Record Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">${totalReceived.toLocaleString()}</div>
            <p className="text-sm text-gray-500">Total Received</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">${totalPending.toLocaleString()}</div>
            <p className="text-sm text-gray-500">Pending Payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-sm text-gray-500">Total Transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{unpaidInvoices.length}</div>
            <p className="text-sm text-gray-500">Unpaid Invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['cash', 'card', 'bank-transfer', 'check'] as const).map(method => {
              const count = payments.filter(p => p.method === method).length;
              const total = payments.filter(p => p.method === method).reduce((sum, p) => sum + p.amount, 0);
              const Icon = methodIcons[method];
              return (
                <div key={method} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium capitalize">{method.replace('-', ' ')}</span>
                  </div>
                  <div className="text-xl font-bold">{count}</div>
                  <div className="text-sm text-gray-500">${total.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payments.map(payment => {
              const invoice = invoices.find(i => i.id === payment.invoiceId);
              const Icon = methodIcons[payment.method];
              return (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice?.invoiceNumber} - {invoice?.clientName}</p>
                      <p className="text-sm text-gray-500">{payment.notes}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-bold text-green-600">
                        ${payment.amount.toLocaleString()}
                      </span>
                    </div>
                    <Badge className={methodColors[payment.method]}>
                      {payment.method.replace('-', ' ')}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {payment.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {payments.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No payments recorded yet.</p>
        </Card>
      )}
    </div>
  );
}
