import { useState } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Leads from './components/Leads';
import Deals from './components/Deals';
import Activities from './components/Activities';
import Products from './components/Products';
import Inventory from './components/Inventory';
import Quotations from './components/Quotations';
import Invoices from './components/Invoices';
import Payments from './components/Payments';
import Users from './components/Users';
import Reports from './components/Reports';

type Page = 'dashboard' | 'leads' | 'deals' | 'activities' | 'products' | 'inventory' | 'quotations' | 'invoices' | 'payments' | 'users' | 'reports';

function CRMApp() {
  const { currentUser } = useCRM();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'leads' && <Leads />}
        {currentPage === 'deals' && <Deals />}
        {currentPage === 'activities' && <Activities />}
        {currentPage === 'products' && <Products />}
        {currentPage === 'inventory' && <Inventory />}
        {currentPage === 'quotations' && <Quotations />}
        {currentPage === 'invoices' && <Invoices />}
        {currentPage === 'payments' && <Payments />}
        {currentPage === 'users' && <Users />}
        {currentPage === 'reports' && <Reports />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CRMProvider>
      <CRMApp />
    </CRMProvider>
  );
}
