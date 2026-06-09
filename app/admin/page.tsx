'use client';

import { FormEvent, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock,
  CreditCard,
  FileText,
  Globe2,
  Headphones,
  LayoutDashboard,
  ListChecks,
  Package,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Ticket,
  Users,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';

type SectionId = 'overview' | 'products' | 'orders' | 'analytics' | 'support' | 'billing';
type Role = 'vendor-admin' | 'vendor-sales' | 'vendor-support' | 'zoftware-admin' | 'partner-admin';
type Currency = 'USD' | 'AED';
type OrderStatus = 'New' | 'Activating' | 'Active' | 'Renewal Due' | 'Churn Risk';
type ProductState = 'Live' | 'Edit pending' | 'Pricing review';
type TicketState = 'Vendor action' | 'Investigating' | 'Scheduled' | 'Vendor replied' | 'Resolved';
type DrawerType = 'activation' | 'product' | 'bulk' | 'ticket' | 'payout' | 'keywords' | 'partner' | null;

type Order = {
  id: string;
  customer: string;
  partner: string;
  product: string;
  vendor: string;
  plan: string;
  licenses: number;
  boughtOn: string;
  value: number;
  payout: number;
  status: OrderStatus;
  activation: string;
  owner: string;
};

type ManagedProduct = {
  name: string;
  category: string;
  tagline: string;
  planCount: number;
  discount: number;
  activationDays: number;
  state: ProductState;
};

type LicenseBatch = {
  account: string;
  product: string;
  assigned: number;
  total: number;
  state: 'Provisioning' | 'Complete' | 'Invite pending';
};

type TicketRow = {
  id: string;
  customer: string;
  issue: string;
  sla: string;
  status: TicketState;
  priority: 'High' | 'Medium' | 'Normal';
};

type PayoutRow = {
  id: string;
  vendor: string;
  period: string;
  gross: number;
  fee: number;
  net: number;
  status: 'Scheduled Jun 30' | 'Pending invoice' | 'Paid Jun 3' | 'Invoice uploaded';
};

const AED_RATE = 3.67;

const sections: { id: SectionId; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders & Licenses', icon: ListChecks },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'support', label: 'Support & Services', icon: Headphones },
  { id: 'billing', label: 'Billing & Payouts', icon: CreditCard },
];

const roles: { id: Role; label: string; caption: string; permissions: string[] }[] = [
  { id: 'vendor-admin', label: 'Vendor Admin', caption: 'Full portfolio access', permissions: ['Edit products', 'Provision licenses', 'Respond to tickets', 'Upload invoices'] },
  { id: 'vendor-sales', label: 'Vendor Sales', caption: 'Commercial read access', permissions: ['View orders', 'View analytics', 'Export partner performance'] },
  { id: 'vendor-support', label: 'Vendor Support', caption: 'Activation and ticket access', permissions: ['Provision licenses', 'Respond to tickets', 'Confirm go-live'] },
  { id: 'zoftware-admin', label: 'Zoftware Super Admin', caption: 'Cross-vendor control', permissions: ['Approve pricing', 'View all partners', 'Reconcile payouts'] },
  { id: 'partner-admin', label: 'Partner Admin', caption: 'Own member purchase history', permissions: ['View member orders', 'Track renewals', 'Escalate tickets'] },
];

const initialOrders: Order[] = [
  { id: 'DD-2406-1048', customer: 'Gulf Enterprises LLC', partner: 'Dubai Chamber', product: 'Freshsales', vendor: 'Freshworks', plan: 'Pro', licenses: 25, boughtOn: 'Jun 4, 2026', value: 1800, payout: 1350, status: 'Activating', activation: '2 days left', owner: 'Noura Al Fahim' },
  { id: 'DD-2406-1047', customer: 'Al Noor Clinics', partner: 'Dubai Chamber', product: 'Growth Bundle', vendor: 'Multi-vendor', plan: 'Annual', licenses: 1, boughtOn: 'Jun 4, 2026', value: 5748, payout: 3880, status: 'New', activation: 'Needs assignment', owner: 'Unassigned' },
  { id: 'DD-2406-1039', customer: 'Desert Line Trading', partner: 'Dubai Chamber', product: 'Freshdesk', vendor: 'Data Direct Group', plan: 'Enterprise', licenses: 15, boughtOn: 'Jun 2, 2026', value: 1185, payout: 890, status: 'Active', activation: 'Live Jun 5', owner: 'Faisal Khan' },
  { id: 'TB-2406-0211', customer: 'Riyadh Retail Co.', partner: 'TeleBank SME', product: 'Zoho Mail', vendor: 'Zoho', plan: 'Premium', licenses: 40, boughtOn: 'Jun 1, 2026', value: 784, payout: 610, status: 'Renewal Due', activation: 'Renews Jun 28', owner: 'Samira Nasser' },
  { id: 'DD-2405-0995', customer: 'Blue Dhow Logistics', partner: 'Dubai Chamber', product: 'Freshchat', vendor: 'Freshworks Inc.', plan: 'Pro', licenses: 20, boughtOn: 'May 30, 2026', value: 982, payout: 736, status: 'Churn Risk', activation: 'Usage dropped', owner: 'Priya Menon' },
];

const initialProducts: ManagedProduct[] = [
  { name: 'Freshsales', category: 'CRM & Sales', tagline: 'AI-powered CRM that helps your team close more deals.', planCount: 4, discount: 10, activationDays: 7, state: 'Live' },
  { name: 'Freshdesk', category: 'Customer Service', tagline: 'Omnichannel customer support in one powerful inbox.', planCount: 4, discount: 5, activationDays: 7, state: 'Edit pending' },
  { name: 'Freshchat', category: 'Customer Messaging', tagline: 'AI-powered customer messaging across every channel.', planCount: 4, discount: 5, activationDays: 7, state: 'Live' },
  { name: 'Zoho Mail', category: 'Business Email', tagline: 'Business email with custom domain and admin controls.', planCount: 3, discount: 2, activationDays: 3, state: 'Pricing review' },
];

const initialLicenseBatches: LicenseBatch[] = [
  { account: 'Gulf Enterprises LLC', product: 'Freshsales Pro', assigned: 18, total: 25, state: 'Provisioning' },
  { account: 'Desert Line Trading', product: 'Freshdesk Enterprise', assigned: 15, total: 15, state: 'Complete' },
  { account: 'Riyadh Retail Co.', product: 'Zoho Mail Premium', assigned: 31, total: 40, state: 'Invite pending' },
];

const initialTickets: TicketRow[] = [
  { id: 'TCK-8129', customer: 'Gulf Enterprises LLC', issue: 'Provision 25 Freshsales Pro seats', sla: '3h 20m', status: 'Vendor action', priority: 'High' },
  { id: 'TCK-8124', customer: 'Blue Dhow Logistics', issue: 'WhatsApp channel disconnected', sla: '6h 45m', status: 'Investigating', priority: 'Medium' },
  { id: 'TCK-8118', customer: 'Al Noor Clinics', issue: 'Bundle onboarding call request', sla: '1d 4h', status: 'Scheduled', priority: 'Normal' },
];

const initialPayouts: PayoutRow[] = [
  { id: 'PO-0626-FW', vendor: 'Freshworks', period: 'Jun 2026', gross: 48200, fee: 9640, net: 38560, status: 'Scheduled Jun 30' },
  { id: 'PO-0626-ZH', vendor: 'Zoho', period: 'Jun 2026', gross: 18340, fee: 3668, net: 14672, status: 'Pending invoice' },
  { id: 'PO-0526-DD', vendor: 'Data Direct Group', period: 'May 2026', gross: 21990, fee: 4398, net: 17592, status: 'Paid Jun 3' },
];

const partnerRows = [
  { name: 'Dubai Chamber', country: 'UAE', orders: 214, mrr: 84200, conversion: 7.8, satisfaction: 4.7, trend: '+18%' },
  { name: 'TeleBank SME', country: 'Saudi Arabia', orders: 82, mrr: 31100, conversion: 5.1, satisfaction: 4.3, trend: '+9%' },
  { name: 'Qatar Business Hub', country: 'Qatar', orders: 41, mrr: 14950, conversion: 4.4, satisfaction: 4.5, trend: '+6%' },
  { name: 'Kuwait Enterprise Gate', country: 'Kuwait', orders: 27, mrr: 9200, conversion: 3.2, satisfaction: 4.1, trend: '-2%' },
];

const rfpRows = [
  { product: 'Freshsales', appearances: 428, excellent: 68, competitors: 'Salesforce, HubSpot', triggers: 'CRM, pipeline, lead scoring' },
  { product: 'Freshdesk', appearances: 371, excellent: 61, competitors: 'Zendesk, Zoho Desk', triggers: 'ticketing, SLA, omnichannel' },
  { product: 'Freshchat', appearances: 289, excellent: 57, competitors: 'Intercom, Tidio', triggers: 'WhatsApp, chatbot, support' },
  { product: 'Zoho Mail', appearances: 244, excellent: 49, competitors: 'Google Workspace, Microsoft 365', triggers: 'email, domain, low cost' },
];

const pipeline = [
  { label: 'Product views', value: 18420, pct: 100 },
  { label: 'Buy clicks', value: 1824, pct: 9.9 },
  { label: 'Checkout starts', value: 931, pct: 5.1 },
  { label: 'Paid orders', value: 326, pct: 1.8 },
];

function money(value: number, currency: Currency) {
  const amount = currency === 'AED' ? value * AED_RATE : value;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

function statusStyle(status: string) {
  if (status === 'Active' || status === 'Live' || status === 'Complete' || status === 'Resolved' || status === 'Paid Jun 3') {
    return 'bg-[#ECFDF3] text-[#067647] border-[#12B76A]/20';
  }
  if (status === 'New' || status === 'Vendor replied' || status === 'Invoice uploaded') {
    return 'bg-[#EFF6FF] text-accent border-accent/20';
  }
  if (status === 'Churn Risk') {
    return 'bg-[#FEF3F2] text-[#B42318] border-[#F04438]/20';
  }
  if (status === 'Renewal Due' || status === 'Investigating') {
    return 'bg-[#F5F3FF] text-[#5856D6] border-[#5856D6]/20';
  }
  return 'bg-[#FFF8E7] text-[#9A6A00] border-[#F5C518]/30';
}

function Field({
  label,
  name,
  value,
  type = 'text',
}: {
  label: string;
  name: string;
  value: string | number;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-muted">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={value}
        className="h-10 w-full rounded-sm border border-black/10 bg-white px-3 text-[13px] text-black outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
      />
    </label>
  );
}

function StatusBadge({ label }: { label: string }) {
  return <span className={`inline-flex rounded-sm border px-2 py-1 text-[10px] font-bold ${statusStyle(label as OrderStatus)}`}>{label}</span>;
}

function Drawer({
  title,
  caption,
  children,
  onClose,
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose}>
      <div
        className="ml-auto flex h-full w-full max-w-[440px] flex-col border-l border-black/8 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-black/8 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[17px] font-semibold tracking-tight text-black">{title}</p>
              <p className="mt-1 text-[12px] leading-[1.5] text-muted">{caption}</p>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-sm text-muted hover:bg-surface hover:text-black" aria-label="Close panel">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [role, setRole] = useState<Role>('vendor-admin');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [partner, setPartner] = useState('All partners');
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [products, setProducts] = useState<ManagedProduct[]>(initialProducts);
  const [licenseBatches, setLicenseBatches] = useState<LicenseBatch[]>(initialLicenseBatches);
  const [tickets, setTickets] = useState<TicketRow[]>(initialTickets);
  const [payouts, setPayouts] = useState<PayoutRow[]>(initialPayouts);
  const [drawer, setDrawer] = useState<DrawerType>(null);
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrders[0].id);
  const [selectedProductName, setSelectedProductName] = useState(initialProducts[0].name);
  const [selectedTicketId, setSelectedTicketId] = useState(initialTickets[0].id);
  const [selectedPayoutId, setSelectedPayoutId] = useState(initialPayouts[0].id);
  const [toast, setToast] = useState('Dashboard ready');

  const selectedRole = roles.find((item) => item.id === role) ?? roles[0];
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0];
  const selectedProduct = products.find((product) => product.name === selectedProductName) ?? products[0];
  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) ?? tickets[0];
  const selectedPayout = payouts.find((payout) => payout.id === selectedPayoutId) ?? payouts[0];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const partnerMatch = partner === 'All partners' || order.partner === partner;
      const queryMatch = [order.id, order.customer, order.product, order.vendor, order.plan, order.status]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase());
      return partnerMatch && queryMatch;
    });
  }, [orders, partner, query]);

  const mrr = orders.reduce((sum, order) => sum + order.value, 0) * 13.2;
  const totalValue = filteredOrders.reduce((sum, order) => sum + order.value, 0);
  const pendingActivations = orders.filter((order) => order.status === 'New' || order.status === 'Activating').length;
  const openTickets = tickets.filter((ticket) => ticket.status !== 'Resolved').length;
  const approvalCount = products.filter((product) => product.state !== 'Live').length + payouts.filter((payout) => payout.status === 'Pending invoice').length;

  const openDrawer = (type: DrawerType, target?: string) => {
    if (type === 'activation' && target) setSelectedOrderId(target);
    if (type === 'product' && target) setSelectedProductName(target);
    if (type === 'ticket' && target) setSelectedTicketId(target);
    if (type === 'payout' && target) setSelectedPayoutId(target);
    setDrawer(type);
  };

  const closeDrawer = () => setDrawer(null);

  const completeActivation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const owner = String(form.get('owner') || selectedOrder.owner);
    setOrders((current) =>
      current.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, owner, status: 'Active', activation: 'Live Jun 5' }
          : order
      )
    );
    setLicenseBatches((current) =>
      current.map((batch) =>
        batch.account === selectedOrder.customer ? { ...batch, assigned: batch.total, state: 'Complete' } : batch
      )
    );
    setToast(`${selectedOrder.customer} activation confirmed`);
    closeDrawer();
  };

  const submitProductUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setProducts((current) =>
      current.map((product) =>
        product.name === selectedProduct.name
          ? {
              ...product,
              tagline: String(form.get('tagline') || product.tagline),
              discount: Number(form.get('discount') || product.discount),
              activationDays: Number(form.get('activationDays') || product.activationDays),
              state: 'Edit pending',
            }
          : product
      )
    );
    setToast(`${selectedProduct.name} update submitted for Zoftware approval`);
    closeDrawer();
  };

  const provisionLicenses = () => {
    setLicenseBatches((current) => current.map((batch) => ({ ...batch, assigned: batch.total, state: 'Complete' })));
    setOrders((current) =>
      current.map((order) => (order.status === 'New' || order.status === 'Activating' ? { ...order, status: 'Active', activation: 'Live Jun 5' } : order))
    );
    setToast('All pending licenses provisioned');
    closeDrawer();
  };

  const respondToTicket = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTickets((current) =>
      current.map((ticket) => (ticket.id === selectedTicket.id ? { ...ticket, status: 'Vendor replied', sla: 'Waiting customer' } : ticket))
    );
    setToast(`${selectedTicket.id} response sent`);
    closeDrawer();
  };

  const uploadInvoice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPayouts((current) =>
      current.map((payout) => (payout.id === selectedPayout.id ? { ...payout, status: 'Invoice uploaded' } : payout))
    );
    setToast(`${selectedPayout.vendor} invoice uploaded`);
    closeDrawer();
  };

  const saveKeywordRules = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast('RFP keyword rules saved');
    closeDrawer();
  };

  const actionForSection = {
    overview: { label: 'Approve activation', icon: CheckCircle2, action: () => openDrawer('activation', selectedOrder.id) },
    products: { label: 'Submit product update', icon: Package, action: () => openDrawer('product', selectedProduct.name) },
    orders: { label: 'Bulk provision', icon: Users, action: () => openDrawer('bulk') },
    analytics: { label: 'Edit keyword rules', icon: SlidersHorizontal, action: () => openDrawer('keywords') },
    support: { label: 'Respond to ticket', icon: Ticket, action: () => openDrawer('ticket', selectedTicket.id) },
    billing: { label: 'Upload invoice', icon: FileText, action: () => openDrawer('payout', selectedPayout.id) },
  }[activeSection];
  const ActionIcon = actionForSection.icon;

  return (
    <div className="min-h-screen bg-surface text-black">
      <header className="sticky top-0 z-40 border-b border-black/8 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-4 sm:px-6">
          <Link href="/dubai-chamber" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center">
              <div className="grid grid-cols-2 gap-[2px]">
                {[0,1,2,3].map(i => <div key={i} className="w-[5px] h-[5px] bg-white rounded-[1px]" />)}
              </div>
            </div>
            <span className="text-[14px] font-bold text-black tracking-tight">LOGO</span>
          </Link>
          <div className="hidden h-4 w-px bg-black/12 sm:block" />
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-black text-white">
              <ShieldCheck size={13} strokeWidth={1.7} />
            </span>
            <div className="leading-none">
              <p className="text-[12px] font-semibold text-black">Vendor Command Center</p>
              <p className="mt-1 hidden text-[10px] text-muted sm:block">Zoftware supply-side operations</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/software"
              className="hidden items-center gap-1.5 rounded-sm border border-black/10 bg-white px-3 py-2 text-[12px] font-semibold text-black transition-colors hover:bg-surface sm:flex"
            >
              <Package size={12} /> Gateway
            </Link>
            <button onClick={() => setToast('3 admin notifications reviewed')} className="relative flex h-9 w-9 items-center justify-center rounded-sm border border-black/10 bg-white text-[#555] hover:bg-surface" aria-label="Notifications">
              <Bell size={15} />
              {approvalCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ea580c]" />}
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-[12px] font-bold text-white" aria-label="Admin profile">
              VA
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[248px_1fr]">
        <aside className="border-b border-black/8 bg-white px-4 py-4 lg:sticky lg:top-14 lg:h-[calc(100vh-56px)] lg:border-b-0 lg:border-r lg:px-3">
          <div className="mb-4 rounded-sm border border-black/8 bg-[#f9fafb] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">Current role</p>
            <div className="relative mt-2">
              <select
                value={role}
                onChange={(event) => {
                  setRole(event.target.value as Role);
                  setToast('Role permissions updated');
                }}
                className="h-10 w-full appearance-none rounded-sm border border-black/10 bg-white px-3 pr-8 text-[12px] font-semibold text-black outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
              >
                {roles.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
            </div>
            <p className="mt-2 text-[11px] leading-snug text-muted">{selectedRole.caption}</p>
          </div>

          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {sections.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-sm px-3 py-2.5 text-left text-[12px] font-semibold transition-colors lg:w-full ${
                    active ? 'bg-black text-white' : 'text-[#555] hover:bg-surface hover:text-black'
                  }`}
                >
                  <Icon size={14} strokeWidth={1.6} />
                  {section.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-5 hidden rounded-sm border border-accent/20 bg-[#EFF6FF] p-3 lg:block">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-accent" />
              <p className="text-[12px] font-semibold text-black">Live workflow state</p>
            </div>
            <p className="mt-1 text-[11px] leading-snug text-[#555]">{pendingActivations} activations, {approvalCount} approvals, {openTickets} support items.</p>
            <button onClick={() => setActiveSection('overview')} className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-accent">
              Open queue <ArrowRight size={12} />
            </button>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <section className="mb-5 flex flex-col gap-4 border-b border-black/8 pb-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-sm border border-accent/20 bg-accent/8 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-accent">Dubai Chamber pilot</span>
                <span className="rounded-sm border border-black/8 bg-white px-2 py-1 text-[10px] font-semibold text-[#555]">End-to-end admin flow</span>
              </div>
              <h1 className="text-[26px] font-semibold tracking-tight text-black sm:text-[34px]">Vendor dashboard</h1>
              <p className="mt-1 max-w-[760px] text-[13px] leading-[1.6] text-[#555] sm:text-[14px]">
                Manage listings, purchases, licenses, partner performance, recommendation intelligence, support, services, and payout reconciliation from one operational workspace.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-sm bg-white p-0.5 shadow-sm ring-1 ring-black/8">
                {(['USD', 'AED'] as Currency[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => setCurrency(item)}
                    className={`h-8 rounded-sm px-3 text-[11px] font-semibold transition-colors ${currency === item ? 'bg-black text-white' : 'text-muted hover:text-black'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button onClick={actionForSection.action} className="flex h-9 items-center justify-center gap-1.5 rounded-sm bg-accent px-4 text-[12px] font-semibold text-white shadow-lg shadow-accent/20 hover:bg-accent-hover">
                <ActionIcon size={13} /> {actionForSection.label}
              </button>
            </div>
          </section>

          <section className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[
              { label: 'Marketplace MRR', value: money(mrr, currency), delta: '+14.8%', icon: CircleDollarSign },
              { label: 'Orders this month', value: '326', delta: `${filteredOrders.length} visible`, icon: Package },
              { label: 'Active licenses', value: licenseBatches.reduce((sum, batch) => sum + batch.assigned, 0).toLocaleString(), delta: `${licenseBatches.length} batches`, icon: Users },
              { label: 'Open work', value: String(pendingActivations + openTickets + approvalCount), delta: 'actionable items', icon: Clock },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="rounded-sm border border-black/8 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold text-muted">{metric.label}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-surface text-[#555]"><Icon size={15} strokeWidth={1.5} /></span>
                  </div>
                  <p className="text-[22px] font-semibold tracking-tight text-black">{metric.value}</p>
                  <p className="mt-1 text-[11px] font-semibold text-[#16a34a]">{metric.delta}</p>
                </div>
              );
            })}
          </section>

          {activeSection === 'overview' && (
            <section className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-sm border border-black/8 bg-white">
                <div className="border-b border-black/8 p-4">
                  <p className="text-[15px] font-semibold text-black">Today&apos;s command queue</p>
                  <p className="mt-1 text-[11px] text-muted">Each row routes into the tab and drawer needed to complete the work.</p>
                </div>
                <div className="divide-y divide-black/8">
                  {[
                    { title: 'Confirm Gulf Enterprises activation', meta: 'Freshsales Pro · 25 licenses', section: 'orders' as SectionId, drawerType: 'activation' as DrawerType, target: 'DD-2406-1048', badge: selectedOrder.status },
                    { title: 'Approve Freshdesk content update', meta: 'Listing copy and screenshots pending', section: 'products' as SectionId, drawerType: 'product' as DrawerType, target: 'Freshdesk', badge: products.find((item) => item.name === 'Freshdesk')?.state ?? 'Live' },
                    { title: 'Respond to high-priority support escalation', meta: 'Gulf Enterprises LLC · Zain chat escalation', section: 'support' as SectionId, drawerType: 'ticket' as DrawerType, target: 'TCK-8129', badge: tickets.find((item) => item.id === 'TCK-8129')?.status ?? 'Resolved' },
                    { title: 'Upload Zoho payout invoice', meta: 'June payout waiting documentation', section: 'billing' as SectionId, drawerType: 'payout' as DrawerType, target: 'PO-0626-ZH', badge: payouts.find((item) => item.id === 'PO-0626-ZH')?.status ?? 'Paid Jun 3' },
                  ].map((item) => (
                    <button
                      key={item.title}
                      onClick={() => {
                        setActiveSection(item.section);
                        openDrawer(item.drawerType, item.target);
                      }}
                      className="grid w-full gap-3 p-4 text-left hover:bg-[#f9fafb] sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div>
                        <p className="text-[13px] font-semibold text-black">{item.title}</p>
                        <p className="mt-1 text-[11px] text-muted">{item.meta}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge label={item.badge} />
                        <ArrowRight size={13} className="text-muted" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-sm border border-black/8 bg-white p-4">
                <p className="text-[15px] font-semibold text-black">Role permissions</p>
                <p className="mt-1 text-[11px] text-muted">{selectedRole.label} · {selectedRole.caption}</p>
                <div className="mt-4 space-y-2">
                  {selectedRole.permissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-2 rounded-sm border border-black/8 bg-[#f9fafb] px-3 py-2 text-[12px] font-semibold text-black">
                      <CheckCircle2 size={13} className="text-[#16a34a]" />
                      {permission}
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-sm border border-accent/20 bg-[#EFF6FF] p-3">
                  <p className="text-[12px] font-semibold text-black">GCC controls</p>
                  <p className="mt-1 text-[11px] leading-snug text-[#555]">AED/USD toggle, Arabic RTL readiness, VAT documentation, and 5-seat license minimum are represented in the flows.</p>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'products' && (
            <section className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-sm border border-black/8 bg-white">
                <div className="flex flex-col gap-3 border-b border-black/8 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[15px] font-semibold text-black">Product listing management</p>
                    <p className="mt-1 text-[11px] text-muted">Edit listing copy, plans, GCC discounts, activation timelines, and SLA commitments.</p>
                  </div>
                  <button onClick={() => openDrawer('product', selectedProduct.name)} className="flex h-9 items-center justify-center gap-1.5 rounded-sm bg-black px-3 text-[11px] font-semibold text-white">
                    <Package size={12} /> Edit selected
                  </button>
                </div>
                <div className="divide-y divide-black/8">
                  {products.map((product) => (
                    <button
                      key={product.name}
                      onClick={() => {
                        setSelectedProductName(product.name);
                        openDrawer('product', product.name);
                      }}
                      className="grid w-full gap-3 p-4 text-left hover:bg-[#f9fafb] sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-surface text-[12px] font-bold text-black">{product.name.slice(0, 2).toUpperCase()}</span>
                        <div>
                          <p className="text-[13px] font-semibold text-black">{product.name}</p>
                          <p className="mt-1 text-[11px] text-muted">{product.category} · {product.planCount} plans · GCC discount {product.discount}% · {product.activationDays} day activation</p>
                          <p className="mt-1 line-clamp-1 text-[11px] text-[#555]">{product.tagline}</p>
                        </div>
                      </div>
                      <StatusBadge label={product.state} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-sm border border-black/8 bg-white p-4">
                <p className="text-[15px] font-semibold text-black">Approval workflow</p>
                <p className="mt-1 text-[11px] text-muted">Submitted changes remain staged until Zoftware approves them.</p>
                <div className="mt-4 space-y-2">
                  {[
                    ['Live listings', products.filter((item) => item.state === 'Live').length],
                    ['Content edits waiting', products.filter((item) => item.state === 'Edit pending').length],
                    ['Pricing proposals waiting', products.filter((item) => item.state === 'Pricing review').length],
                    ['Average activation SLA', `${Math.round(products.reduce((sum, item) => sum + item.activationDays, 0) / products.length)} days`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-sm border border-black/8 bg-[#f9fafb] px-3 py-2">
                      <span className="text-[12px] font-semibold text-black">{label}</span>
                      <span className="text-[11px] text-muted">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeSection === 'orders' && (
            <section className="grid gap-3">
              <div className="rounded-sm border border-black/8 bg-white">
                <div className="flex flex-col gap-3 border-b border-black/8 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[15px] font-semibold text-black">Order entry points</p>
                    <p className="mt-1 text-[11px] text-muted">Who bought what, through which partner, at what value, and where activation stands.</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative">
                      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders..." className="h-9 w-full rounded-sm border border-black/10 bg-white pl-9 pr-3 text-[12px] outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 sm:w-[220px]" />
                    </div>
                    <div className="relative">
                      <select value={partner} onChange={(event) => setPartner(event.target.value)} className="h-9 w-full appearance-none rounded-sm border border-black/10 bg-white px-3 pr-8 text-[12px] font-semibold text-black outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 sm:w-[170px]">
                        <option>All partners</option>
                        {partnerRows.map((item) => <option key={item.name}>{item.name}</option>)}
                      </select>
                      <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse">
                    <thead>
                      <tr className="border-b border-black/8 bg-[#f9fafb] text-left text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                        <th className="px-4 py-3">Buyer</th>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Partner</th>
                        <th className="px-4 py-3">Value</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Activation</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-black/8 last:border-0 hover:bg-[#f9fafb]">
                          <td className="px-4 py-3">
                            <p className="text-[12px] font-semibold text-black">{order.customer}</p>
                            <p className="mt-1 text-[10px] text-muted">{order.id} · {order.boughtOn}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[12px] font-semibold text-black">{order.product}</p>
                            <p className="mt-1 text-[10px] text-muted">{order.plan} · {order.licenses} licenses</p>
                          </td>
                          <td className="px-4 py-3 text-[12px] text-[#555]">{order.partner}</td>
                          <td className="px-4 py-3">
                            <p className="text-[12px] font-semibold text-black">{money(order.value, currency)}</p>
                            <p className="mt-1 text-[10px] text-muted">Payout {money(order.payout, currency)}</p>
                          </td>
                          <td className="px-4 py-3"><StatusBadge label={order.status} /></td>
                          <td className="px-4 py-3 text-[12px] text-[#555]">{order.activation}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => openDrawer('activation', order.id)} className="rounded-sm border border-black/10 px-3 py-2 text-[11px] font-semibold text-black hover:bg-surface">
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid gap-3 xl:grid-cols-[1fr_0.8fr]">
                <div className="rounded-sm border border-accent/20 bg-[#EFF6FF] p-4">
                  <p className="text-[13px] font-semibold text-black">Filtered order value: {money(totalValue, currency)}</p>
                  <p className="mt-1 text-[12px] leading-[1.6] text-[#555]">Use the partner filter and search to isolate an entry point, then manage activation or license allocation from the row action.</p>
                </div>
                <div className="rounded-sm border border-black/8 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold text-black">License provisioning</p>
                      <p className="mt-1 text-[11px] text-muted">Bulk allocation and seat activation tracking.</p>
                    </div>
                    <button onClick={() => openDrawer('bulk')} className="rounded-sm bg-black px-3 py-2 text-[11px] font-semibold text-white">Bulk upload</button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {licenseBatches.map((batch) => (
                      <div key={`${batch.account}-${batch.product}`} className="rounded-sm border border-black/8 bg-[#f9fafb] p-3">
                        <div className="mb-2 flex items-center justify-between gap-3 text-[11px]">
                          <span className="font-semibold text-black">{batch.account}</span>
                          <span className="text-muted">{batch.assigned}/{batch.total} seats</span>
                        </div>
                        <p className="mb-2 text-[10px] text-muted">{batch.product} · {batch.state}</p>
                        <div className="h-2 bg-white"><div className="h-2 bg-accent" style={{ width: `${(batch.assigned / batch.total) * 100}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'analytics' && (
            <section className="grid gap-3">
              <div className="grid gap-3 xl:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-sm border border-black/8 bg-white p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[15px] font-semibold text-black">Revenue funnel</p>
                      <p className="mt-1 text-[11px] text-muted">Product views to paid orders.</p>
                    </div>
                    <BarChart3 size={17} className="text-accent" />
                  </div>
                  <div className="space-y-3">
                    {pipeline.map((step) => (
                      <div key={step.label}>
                        <div className="mb-1.5 flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-black">{step.label}</span>
                          <span className="text-muted">{step.value.toLocaleString()}</span>
                        </div>
                        <div className="h-2 rounded-sm bg-surface"><div className="h-2 rounded-sm bg-accent" style={{ width: `${Math.max(step.pct, 5)}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-sm border border-black/8 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold text-black">Partner performance</p>
                      <p className="mt-1 text-[11px] text-muted">Volume, conversion, satisfaction, and regional growth.</p>
                    </div>
                    <button onClick={() => openDrawer('partner')} className="rounded-sm border border-black/10 px-3 py-2 text-[11px] font-semibold text-black hover:bg-surface">Export</button>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {partnerRows.map((item) => (
                      <div key={item.name} className="rounded-sm border border-black/8 bg-[#f9fafb] p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[12px] font-semibold text-black">{item.name}</p>
                            <p className="mt-1 flex items-center gap-1 text-[10px] text-muted"><Globe2 size={10} /> {item.country}</p>
                          </div>
                          <span className={`rounded-sm px-2 py-1 text-[10px] font-bold ${item.trend.startsWith('+') ? 'bg-[#ECFDF3] text-[#067647]' : 'bg-[#FEF3F2] text-[#B42318]'}`}>{item.trend}</span>
                        </div>
                        <p className="mt-3 text-[17px] font-semibold text-black">{money(item.mrr, currency)}</p>
                        <p className="mt-1 text-[10px] text-muted">{item.orders} orders · {item.conversion}% conversion · {item.satisfaction}/5 rating</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-black/8 bg-white">
                <div className="flex flex-col gap-3 border-b border-black/8 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[15px] font-semibold text-black">RFP and recommendation intelligence</p>
                    <p className="mt-1 text-[11px] text-muted">How AI builders surface products against competitors.</p>
                  </div>
                  <button onClick={() => openDrawer('keywords')} className="flex items-center gap-1.5 rounded-sm border border-black/10 px-3 py-2 text-[11px] font-semibold text-black hover:bg-surface">
                    <SlidersHorizontal size={12} /> Keyword rules
                  </button>
                </div>
                <div className="grid gap-3 p-4 lg:grid-cols-4">
                  {rfpRows.map((item) => (
                    <div key={item.product} className="rounded-sm border border-black/8 bg-[#f9fafb] p-4">
                      <Sparkles size={15} className="text-accent" />
                      <p className="mt-3 text-[13px] font-semibold text-black">{item.product}</p>
                      <p className="mt-1 text-[11px] text-muted">{item.appearances} appearances</p>
                      <div className="mt-3 h-2 bg-white"><div className="h-2 bg-accent" style={{ width: `${item.excellent}%` }} /></div>
                      <p className="mt-2 text-[10px] font-semibold text-accent">{item.excellent}% excellent matches</p>
                      <p className="mt-3 text-[10px] leading-snug text-[#555]">Alongside: {item.competitors}</p>
                      <p className="mt-2 text-[10px] leading-snug text-muted">Triggers: {item.triggers}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeSection === 'support' && (
            <section className="grid gap-3 xl:grid-cols-[1fr_0.8fr]">
              <div className="rounded-sm border border-black/8 bg-white">
                <div className="border-b border-black/8 p-4">
                  <p className="text-[15px] font-semibold text-black">Escalated support tickets</p>
                  <p className="mt-1 text-[11px] text-muted">Zain chat and activation issues routed to vendors.</p>
                </div>
                <div className="divide-y divide-black/8">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-sm bg-surface text-[#555]"><Ticket size={15} /></span>
                        <div>
                          <p className="text-[12px] font-semibold text-black">{ticket.issue}</p>
                          <p className="mt-1 text-[11px] text-muted">{ticket.id} · {ticket.customer} · {ticket.priority}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge label={ticket.status} />
                        <button onClick={() => openDrawer('ticket', ticket.id)} className="rounded-sm bg-black px-3 py-2 text-[11px] font-semibold text-white">Respond</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-sm border border-black/8 bg-white p-4">
                <p className="text-[15px] font-semibold text-black">Professional services</p>
                <p className="mt-1 text-[11px] text-muted">Implementation, training, custom integration, and sign-off.</p>
                <div className="mt-4 space-y-2">
                  {[
                    ['Implementation requests', '12 open'],
                    ['Training sessions', '7 scheduled'],
                    ['Managed service subscriptions', '34 active'],
                    ['Customer sign-offs', '5 pending'],
                  ].map(([label, value]) => (
                    <button key={label} onClick={() => setToast(`${label} queue opened`)} className="flex w-full items-center justify-between rounded-sm border border-black/8 bg-[#f9fafb] px-3 py-2 text-left hover:bg-white">
                      <span className="text-[12px] font-semibold text-black">{label}</span>
                      <span className="text-[11px] text-muted">{value}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeSection === 'billing' && (
            <section className="rounded-sm border border-black/8 bg-white">
              <div className="border-b border-black/8 p-4">
                <p className="text-[15px] font-semibold text-black">Billing and payout reconciliation</p>
                <p className="mt-1 text-[11px] text-muted">Orders placed vs revenue received after platform fee deduction.</p>
              </div>
              <div className="grid gap-3 p-4 lg:grid-cols-3">
                {payouts.map((payout) => (
                  <div key={payout.id} className="rounded-sm border border-black/8 bg-[#f9fafb] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[13px] font-semibold text-black">{payout.vendor}</p>
                        <p className="mt-1 text-[11px] text-muted">{payout.id} · {payout.period}</p>
                      </div>
                      <FileText size={15} className="text-accent" />
                    </div>
                    <div className="mt-4 space-y-2 text-[11px]">
                      <div className="flex justify-between"><span className="text-muted">Gross</span><span className="font-semibold text-black">{money(payout.gross, currency)}</span></div>
                      <div className="flex justify-between"><span className="text-muted">Platform fee</span><span className="font-semibold text-black">{money(payout.fee, currency)}</span></div>
                      <div className="flex justify-between border-t border-black/8 pt-2"><span className="text-muted">Net payout</span><span className="font-semibold text-black">{money(payout.net, currency)}</span></div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <StatusBadge label={payout.status} />
                      <button onClick={() => openDrawer('payout', payout.id)} className="rounded-sm border border-black/10 bg-white px-3 py-2 text-[11px] font-semibold text-black hover:bg-surface">
                        Reconcile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <div className="fixed bottom-4 left-4 z-40 max-w-[360px] rounded-sm border border-black/8 bg-white px-4 py-3 text-[12px] font-semibold text-black shadow-xl">
        {toast}
      </div>

      {drawer === 'activation' && (
        <Drawer title="Manage activation" caption={`${selectedOrder.customer} · ${selectedOrder.product}`} onClose={closeDrawer}>
          <form onSubmit={completeActivation} className="space-y-4">
            <div className="rounded-sm border border-black/8 bg-[#f9fafb] p-3">
              <p className="text-[12px] font-semibold text-black">{selectedOrder.id}</p>
              <p className="mt-1 text-[11px] text-muted">{selectedOrder.partner} · {selectedOrder.licenses} licenses · {money(selectedOrder.value, currency)}</p>
              <div className="mt-3"><StatusBadge label={selectedOrder.status} /></div>
            </div>
            <Field label="Activation owner" name="owner" value={selectedOrder.owner === 'Unassigned' ? 'Noura Al Fahim' : selectedOrder.owner} />
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-muted">Go-live note</span>
              <textarea name="note" defaultValue="Customer admin invited, seats provisioned, welcome email scheduled." className="min-h-[96px] w-full rounded-sm border border-black/10 bg-white p-3 text-[13px] text-black outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10" />
            </label>
            <button className="flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-accent text-[12px] font-semibold text-white hover:bg-accent-hover">
              <CheckCircle2 size={14} /> Confirm activation
            </button>
          </form>
        </Drawer>
      )}

      {drawer === 'product' && (
        <Drawer title="Edit product listing" caption={`${selectedProduct.name} · staged for Zoftware approval`} onClose={closeDrawer}>
          <form onSubmit={submitProductUpdate} className="space-y-4">
            <Field label="Product name" name="name" value={selectedProduct.name} />
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-muted">Tagline</span>
              <textarea name="tagline" defaultValue={selectedProduct.tagline} className="min-h-[96px] w-full rounded-sm border border-black/10 bg-white p-3 text-[13px] text-black outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Field label="GCC discount %" name="discount" value={selectedProduct.discount} type="number" />
              <Field label="Activation days" name="activationDays" value={selectedProduct.activationDays} type="number" />
            </div>
            <button className="flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-accent text-[12px] font-semibold text-white hover:bg-accent-hover">
              <Package size={14} /> Submit for approval
            </button>
          </form>
        </Drawer>
      )}

      {drawer === 'bulk' && (
        <Drawer title="Bulk license provisioning" caption="Complete pending seat allocation for all open batches." onClose={closeDrawer}>
          <div className="space-y-3">
            {licenseBatches.map((batch) => (
              <div key={batch.account} className="rounded-sm border border-black/8 bg-[#f9fafb] p-3">
                <div className="mb-2 flex justify-between text-[11px]">
                  <span className="font-semibold text-black">{batch.account}</span>
                  <span className="text-muted">{batch.assigned}/{batch.total}</span>
                </div>
                <p className="mb-2 text-[10px] text-muted">{batch.product} · {batch.state}</p>
                <div className="h-2 bg-white"><div className="h-2 bg-accent" style={{ width: `${(batch.assigned / batch.total) * 100}%` }} /></div>
              </div>
            ))}
            <button onClick={provisionLicenses} className="flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-accent text-[12px] font-semibold text-white hover:bg-accent-hover">
              <Users size={14} /> Provision all pending seats
            </button>
          </div>
        </Drawer>
      )}

      {drawer === 'ticket' && (
        <Drawer title="Respond to support ticket" caption={`${selectedTicket.id} · ${selectedTicket.customer}`} onClose={closeDrawer}>
          <form onSubmit={respondToTicket} className="space-y-4">
            <div className="rounded-sm border border-black/8 bg-[#f9fafb] p-3">
              <p className="text-[12px] font-semibold text-black">{selectedTicket.issue}</p>
              <p className="mt-1 text-[11px] text-muted">Priority {selectedTicket.priority} · SLA {selectedTicket.sla}</p>
              <div className="mt-3"><StatusBadge label={selectedTicket.status} /></div>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-muted">Vendor response</span>
              <textarea name="response" defaultValue="We have checked the provisioning state and updated the customer admin. Next sync is scheduled within the SLA window." className="min-h-[120px] w-full rounded-sm border border-black/10 bg-white p-3 text-[13px] text-black outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10" />
            </label>
            <button className="flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-accent text-[12px] font-semibold text-white hover:bg-accent-hover">
              <Ticket size={14} /> Send response
            </button>
          </form>
        </Drawer>
      )}

      {drawer === 'payout' && (
        <Drawer title="Reconcile payout" caption={`${selectedPayout.vendor} · ${selectedPayout.period}`} onClose={closeDrawer}>
          <form onSubmit={uploadInvoice} className="space-y-4">
            <div className="rounded-sm border border-black/8 bg-[#f9fafb] p-3 text-[12px]">
              <div className="flex justify-between"><span className="text-muted">Gross</span><span className="font-semibold text-black">{money(selectedPayout.gross, currency)}</span></div>
              <div className="mt-2 flex justify-between"><span className="text-muted">Platform fee</span><span className="font-semibold text-black">{money(selectedPayout.fee, currency)}</span></div>
              <div className="mt-2 flex justify-between border-t border-black/8 pt-2"><span className="text-muted">Net payout</span><span className="font-semibold text-black">{money(selectedPayout.net, currency)}</span></div>
            </div>
            <Field label="Invoice reference" name="invoice" value={`${selectedPayout.id}-INV`} />
            <Field label="VAT registration" name="vat" value="100245889300003" />
            <button className="flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-accent text-[12px] font-semibold text-white hover:bg-accent-hover">
              <FileText size={14} /> Upload invoice
            </button>
          </form>
        </Drawer>
      )}

      {drawer === 'keywords' && (
        <Drawer title="RFP keyword rules" caption="Tune how AI builders surface vendor products." onClose={closeDrawer}>
          <form onSubmit={saveKeywordRules} className="space-y-4">
            {rfpRows.map((row) => (
              <label key={row.product} className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-muted">{row.product}</span>
                <input name={row.product} defaultValue={row.triggers} className="h-10 w-full rounded-sm border border-black/10 bg-white px-3 text-[13px] text-black outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10" />
              </label>
            ))}
            <button className="flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-accent text-[12px] font-semibold text-white hover:bg-accent-hover">
              <Sparkles size={14} /> Save keyword rules
            </button>
          </form>
        </Drawer>
      )}

      {drawer === 'partner' && (
        <Drawer title="Partner performance export" caption="Prepare a partner readout for stakeholders." onClose={closeDrawer}>
          <div className="space-y-3">
            {partnerRows.map((row) => (
              <div key={row.name} className="rounded-sm border border-black/8 bg-[#f9fafb] p-3">
                <p className="text-[12px] font-semibold text-black">{row.name}</p>
                <p className="mt-1 text-[11px] text-muted">{row.country} · {money(row.mrr, currency)} MRR · {row.orders} orders</p>
              </div>
            ))}
            <button onClick={() => { setToast('Partner performance report exported'); closeDrawer(); }} className="flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-accent text-[12px] font-semibold text-white hover:bg-accent-hover">
              <FileText size={14} /> Export report
            </button>
          </div>
        </Drawer>
      )}
    </div>
  );
}
