import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  createdAt: string;
}

export interface Deal {
  id: string;
  name: string;
  clientName: string;
  value: number;
  stage: 'prospect' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  assignedManagerId: string;
  expectedClosingDate: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  assignedEmployeeId: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
  relatedDealId?: string;
}

export interface Call {
  id: string;
  title: string;
  relatedLeadId?: string;
  relatedDealId?: string;
  dateTime: string;
  duration: number;
  callType: 'inbound' | 'outbound';
  notes: string;
  outcome: string;
  assignedEmployeeId: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: string[];
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  relatedDealId?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  quantity: number;
  lowStockThreshold: number;
}

export interface QuotationItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Quotation {
  id: string;
  clientName: string;
  items: QuotationItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
  validUntil: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  items: QuotationItem[];
  totalAmount: number;
  tax: number;
  status: 'unpaid' | 'paid' | 'overdue';
  createdAt: string;
  dueDate: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'cash' | 'card' | 'bank-transfer' | 'check';
  date: string;
  notes: string;
}

interface CRMContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
  calls: Call[];
  meetings: Meeting[];
  products: Product[];
  inventory: InventoryItem[];
  quotations: Quotation[];
  invoices: Invoice[];
  payments: Payment[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  convertLeadToDeal: (leadId: string, dealData: Omit<Deal, 'id' | 'createdAt'>) => void;
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addCall: (call: Omit<Call, 'id'>) => void;
  updateCall: (id: string, updates: Partial<Call>) => void;
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateInventory: (productId: string, quantity: number) => void;
  addQuotation: (quotation: Omit<Quotation, 'id' | 'createdAt'>) => void;
  convertQuotationToInvoice: (quotationId: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@crm.com', role: 'admin', createdAt: '2026-01-01' },
  { id: '2', name: 'John Manager', email: 'john@crm.com', role: 'manager', createdAt: '2026-01-05' },
  { id: '3', name: 'Sarah Employee', email: 'sarah@crm.com', role: 'employee', createdAt: '2026-01-10' },
  { id: '4', name: 'Mike Manager', email: 'mike@crm.com', role: 'manager', createdAt: '2026-01-15' },
  { id: '5', name: 'Emma Employee', email: 'emma@crm.com', role: 'employee', createdAt: '2026-01-20' },
];

const mockLeads: Lead[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', company: 'Tech Corp', source: 'Website', status: 'new', createdAt: '2026-02-01' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', phone: '555-0102', company: 'ABC Industries', source: 'Referral', status: 'contacted', createdAt: '2026-02-03' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', phone: '555-0103', company: 'XYZ Ltd', source: 'Social Media', status: 'qualified', createdAt: '2026-02-05' },
];

const mockDeals: Deal[] = [
  { id: '1', name: 'Tech Corp Software License', clientName: 'Alice Johnson', value: 50000, stage: 'proposal', assignedManagerId: '2', expectedClosingDate: '2026-03-01', createdAt: '2026-02-10' },
  { id: '2', name: 'ABC Industries Consulting', clientName: 'Bob Smith', value: 75000, stage: 'negotiation', assignedManagerId: '4', expectedClosingDate: '2026-03-15', createdAt: '2026-02-12' },
];

const mockTasks: Task[] = [
  { id: '1', title: 'Follow up with Tech Corp', assignedEmployeeId: '3', deadline: '2026-02-20', status: 'in-progress', notes: 'Send proposal document', relatedDealId: '1' },
  { id: '2', title: 'Prepare demo for ABC Industries', assignedEmployeeId: '5', deadline: '2026-02-18', status: 'pending', notes: 'Setup demo environment', relatedDealId: '2' },
];

const mockCalls: Call[] = [
  { id: '1', title: 'Initial call with Tech Corp', relatedDealId: '1', dateTime: '2026-02-11T10:00:00', duration: 30, callType: 'outbound', notes: 'Discussed requirements', outcome: 'Positive', assignedEmployeeId: '3' },
];

const mockMeetings: Meeting[] = [
  { id: '1', title: 'Proposal presentation - Tech Corp', date: '2026-02-22', time: '14:00', location: 'Office Conference Room A', participants: ['2', '3'], notes: '', status: 'scheduled', relatedDealId: '1' },
];

const mockProducts: Product[] = [
  { id: '1', name: 'CRM Software Pro', price: 5000, category: 'Software', description: 'Full-featured CRM solution' },
  { id: '2', name: 'Consulting Services', price: 150, category: 'Services', description: 'Per hour consulting' },
  { id: '3', name: 'Training Package', price: 2000, category: 'Services', description: 'Staff training program' },
];

const mockInventory: InventoryItem[] = [
  { id: '1', productId: '1', quantity: 100, lowStockThreshold: 10 },
  { id: '2', productId: '3', quantity: 5, lowStockThreshold: 3 },
];

const mockQuotations: Quotation[] = [
  { id: '1', clientName: 'Alice Johnson', items: [{ productId: '1', quantity: 1, price: 5000 }], totalAmount: 5000, status: 'sent', createdAt: '2026-02-12', validUntil: '2026-03-12' },
];

const mockInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-001', clientName: 'Bob Smith', items: [{ productId: '2', quantity: 10, price: 150 }], totalAmount: 1500, tax: 150, status: 'paid', createdAt: '2026-02-05', dueDate: '2026-03-05' },
];

const mockPayments: Payment[] = [
  { id: '1', invoiceId: '1', amount: 1650, method: 'bank-transfer', date: '2026-02-10', notes: 'Full payment received' },
];

export const CRMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [calls, setCalls] = useState<Call[]>(mockCalls);
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
  };

  const addLead = (lead: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...lead,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads([...leads, newLead]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(leads.map(lead => lead.id === id ? { ...lead, ...updates } : lead));
  };

  const convertLeadToDeal = (leadId: string, dealData: Omit<Deal, 'id' | 'createdAt'>) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      updateLead(leadId, { status: 'converted' });
      addDeal(dealData);
    }
  };

  const addDeal = (deal: Omit<Deal, 'id' | 'createdAt'>) => {
    const newDeal: Deal = {
      ...deal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDeals([...deals, newDeal]);
  };

  const updateDeal = (id: string, updates: Partial<Deal>) => {
    setDeals(deals.map(deal => deal.id === id ? { ...deal, ...updates } : deal));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: Date.now().toString() };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...updates } : task));
  };

  const addCall = (call: Omit<Call, 'id'>) => {
    const newCall: Call = { ...call, id: Date.now().toString() };
    setCalls([...calls, newCall]);
  };

  const updateCall = (id: string, updates: Partial<Call>) => {
    setCalls(calls.map(call => call.id === id ? { ...call, ...updates } : call));
  };

  const addMeeting = (meeting: Omit<Meeting, 'id'>) => {
    const newMeeting: Meeting = { ...meeting, id: Date.now().toString() };
    setMeetings([...meetings, newMeeting]);
  };

  const updateMeeting = (id: string, updates: Partial<Meeting>) => {
    setMeetings(meetings.map(meeting => meeting.id === id ? { ...meeting, ...updates } : meeting));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: Date.now().toString() };
    setProducts([...products, newProduct]);
    // Initialize inventory for new product
    setInventory([...inventory, { id: Date.now().toString(), productId: newProduct.id, quantity: 0, lowStockThreshold: 5 }]);
  };

  const updateInventory = (productId: string, quantity: number) => {
    setInventory(inventory.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const addQuotation = (quotation: Omit<Quotation, 'id' | 'createdAt'>) => {
    const newQuotation: Quotation = {
      ...quotation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setQuotations([...quotations, newQuotation]);
  };

  const convertQuotationToInvoice = (quotationId: string) => {
    const quotation = quotations.find(q => q.id === quotationId);
    if (quotation) {
      const invoiceNumber = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
      const tax = quotation.totalAmount * 0.1; // 10% tax
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber,
        clientName: quotation.clientName,
        items: quotation.items,
        totalAmount: quotation.totalAmount,
        tax,
        status: 'unpaid',
        createdAt: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      setInvoices([...invoices, newInvoice]);
    }
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInvoices([...invoices, newInvoice]);
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(invoices.map(invoice => invoice.id === id ? { ...invoice, ...updates } : invoice));
  };

  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment: Payment = { ...payment, id: Date.now().toString() };
    setPayments([...payments, newPayment]);
    // Update invoice status
    updateInvoice(payment.invoiceId, { status: 'paid' });
  };

  return (
    <CRMContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        leads,
        deals,
        tasks,
        calls,
        meetings,
        products,
        inventory,
        quotations,
        invoices,
        payments,
        addUser,
        addLead,
        updateLead,
        convertLeadToDeal,
        addDeal,
        updateDeal,
        addTask,
        updateTask,
        addCall,
        updateCall,
        addMeeting,
        updateMeeting,
        addProduct,
        updateInventory,
        addQuotation,
        convertQuotationToInvoice,
        addInvoice,
        updateInvoice,
        addPayment,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
