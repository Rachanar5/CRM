import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, FileText, ArrowRight, Trash2 } from 'lucide-react';

export default function Quotations() {
  const { quotations, products, addQuotation, convertQuotationToInvoice } = useCRM();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ productId: string; quantity: number; price: number }>>([]);
  const [clientName, setClientName] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const addProductToQuotation = () => {
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

  const handleCreateQuotation = () => {
    const totalAmount = selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    addQuotation({
      clientName,
      items: selectedProducts,
      totalAmount,
      status: 'draft',
      validUntil,
    });
    setClientName('');
    setSelectedProducts([]);
    setValidUntil('');
    setIsAddDialogOpen(false);
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotations</h1>
          <p className="text-gray-500 mt-1">Create and manage quotations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Quotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quotation</DialogTitle>
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
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Products</Label>
                  <Button type="button" size="sm" onClick={addProductToQuotation}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Product
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedProducts.map((item, index) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
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
                    );
                  })}
                </div>
              </div>

              {selectedProducts.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <Button onClick={handleCreateQuotation} className="w-full" disabled={selectedProducts.length === 0}>
                Create Quotation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{quotations.filter(q => q.status === 'draft').length}</div>
            <p className="text-sm text-gray-500">Draft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{quotations.filter(q => q.status === 'sent').length}</div>
            <p className="text-sm text-gray-500">Sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{quotations.filter(q => q.status === 'accepted').length}</div>
            <p className="text-sm text-gray-500">Accepted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              ${quotations.reduce((sum, q) => sum + q.totalAmount, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">Total Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Quotations List */}
      <div className="space-y-4">
        {quotations.map(quotation => (
          <Card key={quotation.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Quotation for {quotation.clientName}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {quotation.createdAt} | Valid Until: {quotation.validUntil}
                  </p>
                </div>
                <Badge className={statusColors[quotation.status]}>
                  {quotation.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Items:</p>
                  {quotation.items.map((item, index) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div key={index} className="flex justify-between text-sm text-gray-600 py-1">
                        <span>{product?.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <span className="text-lg font-bold text-green-600">
                      Total: ${quotation.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  {quotation.status === 'accepted' && (
                    <Button
                      size="sm"
                      onClick={() => convertQuotationToInvoice(quotation.id)}
                    >
                      <ArrowRight className="w-4 h-4 mr-1" />
                      Convert to Invoice
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quotations.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No quotations created yet.</p>
        </Card>
      )}
    </div>
  );
}
