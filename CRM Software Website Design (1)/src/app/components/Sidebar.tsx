import { useCRM } from '../context/CRMContext';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Handshake, 
  Activity, 
  Package, 
  Warehouse, 
  FileText, 
  Receipt, 
  CreditCard, 
  UserCog, 
  BarChart3,
  LogOut,
  Building2
} from 'lucide-react';
import { cn } from './ui/utils';

type Page = 'dashboard' | 'leads' | 'deals' | 'activities' | 'products' | 'inventory' | 'quotations' | 'invoices' | 'payments' | 'users' | 'reports';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { currentUser, setCurrentUser } = useCRM();

  if (!currentUser) return null;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'employee'] },
    { id: 'leads', label: 'Leads', icon: Users, roles: ['admin', 'manager'] },
    { id: 'deals', label: 'Deals', icon: Handshake, roles: ['admin', 'manager', 'employee'] },
    { id: 'activities', label: 'Activities', icon: Activity, roles: ['admin', 'manager', 'employee'] },
    { id: 'products', label: 'Products', icon: Package, roles: ['admin', 'manager'] },
    { id: 'inventory', label: 'Inventory', icon: Warehouse, roles: ['admin', 'manager'] },
    { id: 'quotations', label: 'Quotations', icon: FileText, roles: ['admin', 'manager'] },
    { id: 'invoices', label: 'Invoices', icon: Receipt, roles: ['admin', 'manager'] },
    { id: 'payments', label: 'Payments', icon: CreditCard, roles: ['admin', 'manager'] },
    { id: 'users', label: 'Users', icon: UserCog, roles: ['admin'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'manager'] },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">CRM System</h1>
            <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="font-medium text-blue-600">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id as Page)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                  isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
