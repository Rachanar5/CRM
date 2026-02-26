import { useCRM } from '../context/CRMContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

export default function Inventory() {
  const { products, inventory, updateInventory } = useCRM();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(0);

  const handleUpdateStock = (productId: string) => {
    updateInventory(productId, tempQuantity);
    setEditingId(null);
  };

  const startEdit = (item: any) => {
    setEditingId(item.productId);
    setTempQuantity(item.quantity);
  };

  const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockThreshold);
  const totalValue = inventory.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        <p className="text-gray-500 mt-1">Track and manage stock levels</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-sm text-gray-500">Total Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
            <p className="text-sm text-gray-500">Low Stock Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {inventory.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
            <p className="text-sm text-gray-500">Total Units</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              ${totalValue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">Inventory Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium">{product?.name}</p>
                      <p className="text-sm text-gray-500">
                        Current: {item.quantity} units | Threshold: {item.lowStockThreshold}
                      </p>
                    </div>
                    <Badge variant="destructive">Low Stock</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map(item => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;

              const isLowStock = item.quantity <= item.lowStockThreshold;
              const isEditing = editingId === item.productId;

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    isLowStock ? 'border-red-200 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${isLowStock ? 'bg-red-100' : 'bg-blue-100'}`}>
                      <Package className={`w-5 h-5 ${isLowStock ? 'text-red-600' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Unit Price</p>
                      <p className="font-medium">${product.price.toLocaleString()}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Stock Level</p>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={tempQuantity}
                            onChange={(e) => setTempQuantity(parseInt(e.target.value) || 0)}
                            className="w-20 h-8"
                          />
                          <Button size="sm" onClick={() => handleUpdateStock(item.productId)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${isLowStock ? 'text-red-600' : ''}`}>
                            {item.quantity} units
                          </p>
                          <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Value</p>
                      <p className="font-medium text-green-600">
                        ${(product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <p className="text-sm text-gray-500">Status</p>
                      {isLowStock ? (
                        <Badge variant="destructive" className="mt-1">
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 mt-1">
                          In Stock
                        </Badge>
                      )}
                    </div>
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
