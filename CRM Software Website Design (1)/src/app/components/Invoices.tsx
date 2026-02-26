import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, Receipt, DollarSign, Trash2 } from 'lucide-react';

export default function Invoices() {
  const { invoices, products, addInvoice, updateInvoice } = useCRM();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ productId: string; quantity: number; price: number }>>([]);
  const [clientName, setClientName] = useState('');
  const [dueDate, setDueDate] = useState('');

  const addProductToInvoice = () => {
    if (products.length > 0) {
      const product = products[0];
      setSelectedProducts([...selectedProducts, { productId: product.id, quantity: 1, price: product.price }]);
    }
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateProductQuantity = (index: number, quantity: number) => {
    const updated = [...selectedProducts];
    updated[index].quantity = quantity;
    setSelectedProducts(updated);
  };

  const updateProductSelection = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const updated = [...selectedProducts];
      updated[index].productId = productId;
      updated[index].price = product.price;
      setSelectedProducts(updated);
    }
  };

  const handleCreateInvoice = () => {
    const totalAmount = selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = totalAmount * 0.1; // 10% tax
    const invoiceNumber = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
    
    addInvoice({
      invoiceNumber,
      clientName,
      items: selectedProducts,
      totalAmount,
      tax,
      status: 'unpaid',
      dueDate,
    });
    
    setClientName('');
    setSelectedProducts([]);
    setDueDate('');
    setIsAddDialogOpen(false);
  };

  const statusColors = {
    unpaid: 'bg-orange-100 text-orange-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-1">Manage customer invoices</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client">Client Name</Label>
                <Input
                  id="client"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Products</Label>
                  <Button type="button" size="sm" onClick={addProductToInvoice}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Product
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedProducts.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center p-3 border rounded-lg">
                      <Select
                        value={item.productId}
                        onValueChange={(value) => updateProductSelection(index, value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} - ${p.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateProductQuantity(index, parseInt(e.target.value) || 1)}
                        className="w-20"
                        placeholder="Qty"
                      />
                      <div className="w-24 text-right font-medium">
                        ${(item.price * item.quantity).toLocaleString()}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeProduct(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProducts.length > 0 && (
                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (10%):</span>
                    <span>${(selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${(selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <Button onClick={handleCreateInvoice} className="w-full" disabled={selectedProducts.length === 0}>
                Create Invoice
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{invoices.filter(i => i.status === 'unpaid').length}</div>
            <p className="text-sm text-gray-500">Unpaid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{invoices.filter(i => i.status === 'paid').length}</div>
            <p className="text-sm text-gray-500">Paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{invoices.filter(i => i.status === 'overdue').length}</div>
            <p className="text-sm text-gray-500">Overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              ${invoices.reduce((sum, i) => sum + i.totalAmount + i.tax, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">Total Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {invoices.map(invoice => (
          <Card key={invoice.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-blue-600" />
                    {invoice.invoiceNumber} - {invoice.clientName}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {invoice.createdAt} | Due: {invoice.dueDate}
                  </p>
                </div>
                <Badge className={statusColors[invoice.status]}>
                  {invoice.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Items:</p>
                  {invoice.items.map((item, index) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div key={index} className="flex justify-between text-sm text-gray-600 py-1">
                        <span>{product?.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-3 border-t space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${invoice.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${invoice.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${(invoice.totalAmount + invoice.tax).toLocaleString()}
                    </span>
                  </div>
                </div>
                {invoice.status === 'unpaid' && (
                  <div className="pt-3">
                    <Select
                      value={invoice.status}
                      onValueChange={(value) => updateInvoice(invoice.id, { status: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {invoices.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No invoices created yet.</p>
        </Card>
      )}
    </div>
  );
}
