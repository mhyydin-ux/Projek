import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Settings, 
  Bell, LogOut, Store, ShieldCheck, ChevronRight, CornerDownRight, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data and Types
import { Product, Customer, Activity, Transaction } from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ACTIVITIES, 
  INITIAL_TRANSACTIONS 
} from './data';

// Components
import LoginScreen from './components/LoginScreen';
import DashboardTab from './components/DashboardTab';
import ProductsTab from './components/ProductsTab';
import POSTab from './components/POSTab';
import CustomersTab from './components/CustomersTab';
import ReportsTab from './components/ReportsTab';

// Initial LocalStorage Seeding (runs exactly once on file load)
if (typeof window !== 'undefined' && localStorage.getItem('tokomakmur_initialized') !== 'true') {
  localStorage.setItem('tokomakmur_products', JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem('tokomakmur_customers', JSON.stringify(INITIAL_CUSTOMERS));
  localStorage.setItem('tokomakmur_activities', JSON.stringify(INITIAL_ACTIVITIES));
  localStorage.setItem('tokomakmur_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
  localStorage.setItem('tokomakmur_businessSettings', JSON.stringify({
    shopName: 'Toko Makmur Jaya',
    address: 'Jl. Sudirman No. 45, Jakarta Selatan',
    whatsapp: '+62 812-3456-7890',
    email: 'hello@makmurjaya.id',
    loyaltyRate: 10000,
    sendReceipt: true,
    sendBalance: false
  }));
  localStorage.setItem('tokomakmur_accounts', JSON.stringify([
    { id: 'acc-1', username: 'budi', name: 'Budi Antoro', role: 'Admin', passwordHash: 'budi123' },
    { id: 'acc-2', username: 'staf1', name: 'Hasan Basri', role: 'Staff', passwordHash: 'staf123' }
  ]));
  localStorage.setItem('tokomakmur_notifications', JSON.stringify([
    { id: 'n-1', msg: 'Pembayaran #TRX-8821 Selesai senilai Rp 150.000', read: false },
    { id: 'n-2', msg: 'Peringatan: Stok Roti Bakar Coklat hampir habis (Sisa 3)', read: false },
    { id: 'n-3', msg: 'Siti Aminah telah didaftarkan sebagai Member Baru tier Gold', read: true }
  ]));
  localStorage.setItem('tokomakmur_initialized', 'true');
}

export default function App() {
  // Authentication Role
  const [role, setRole] = useState<'Admin' | 'Staff' | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<string>('Dashboard');

  // Multi-user Registered Staff/Cashier Accounts
  const [accounts, setAccounts] = useState<any[]>(() => {
    const saved = localStorage.getItem('tokomakmur_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  // Current Logged in session user details
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Core Global States
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tokomakmur_products');
    return saved ? JSON.parse(saved) : [];
  });
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('tokomakmur_customers');
    return saved ? JSON.parse(saved) : [];
  });
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('tokomakmur_activities');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('tokomakmur_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Business Configurations state
  const [businessSettings, setBusinessSettings] = useState(() => {
    const saved = localStorage.getItem('tokomakmur_businessSettings');
    return saved ? JSON.parse(saved) : {
      shopName: 'Toko Makmur Jaya',
      address: 'Jl. Sudirman No. 45, Jakarta Selatan',
      whatsapp: '+62 812-3456-7890',
      email: 'hello@makmurjaya.id',
      loyaltyRate: 10000,
      sendReceipt: true,
      sendBalance: false
    };
  });

  // Mobile drawer panel toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notifications Popover Toggle
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('tokomakmur_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-persistence Effects (using serialized primitive strings to satisfy system instructions)
  const productsStr = JSON.stringify(products);
  useEffect(() => {
    localStorage.setItem('tokomakmur_products', productsStr);
  }, [productsStr]);

  const customersStr = JSON.stringify(customers);
  useEffect(() => {
    localStorage.setItem('tokomakmur_customers', customersStr);
  }, [customersStr]);

  const activitiesStr = JSON.stringify(activities);
  useEffect(() => {
    localStorage.setItem('tokomakmur_activities', activitiesStr);
  }, [activitiesStr]);

  const transactionsStr = JSON.stringify(transactions);
  useEffect(() => {
    localStorage.setItem('tokomakmur_transactions', transactionsStr);
  }, [transactionsStr]);

  const accountsStr = JSON.stringify(accounts);
  useEffect(() => {
    localStorage.setItem('tokomakmur_accounts', accountsStr);
  }, [accountsStr]);

  const businessSettingsStr = JSON.stringify(businessSettings);
  useEffect(() => {
    localStorage.setItem('tokomakmur_businessSettings', businessSettingsStr);
  }, [businessSettingsStr]);

  const notificationsStr = JSON.stringify(notifications);
  useEffect(() => {
    localStorage.setItem('tokomakmur_notifications', notificationsStr);
  }, [notificationsStr]);

  const handleLogin = (userRole: 'Admin' | 'Staff', matchedUsername: string) => {
    setRole(userRole);
    // Find the actual chosen account details
    const matched = accounts.find(
      (a) => a.username.toLowerCase() === matchedUsername.toLowerCase() && a.role === userRole
    ) || { id: 'acc-unknown', username: matchedUsername, name: matchedUsername, role: userRole };
    
    setCurrentUser(matched);

    // Dynamic welcome activity log
    const welcomeAct: Activity = {
      id: `act-${Date.now()}`,
      title: 'Sesi Masuk Berhasil',
      description: `${matched.name} masuk sebagai ${userRole} pada sistem`,
      timeAgo: 'Baru saja',
      timestamp: new Date(),
      type: 'customer'
    };
    setActivities(prev => [welcomeAct, ...prev]);
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
    setActiveTab('Dashboard');
  };

  // State Mutators
  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
    const act: Activity = {
      id: `act-${Date.now()}`,
      title: 'Produk Ditambahkan',
      description: `${newProd.name} (${newProd.sku}) didaftarkan ke inventori`,
      timeAgo: 'Baru saja',
      timestamp: new Date(),
      type: 'stock'
    };
    setActivities(prev => [act, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    const act: Activity = {
      id: `act-${Date.now()}`,
      title: 'Stok Diperbarui',
      description: `Informasi stok & kategori ${updated.name} diubah`,
      timeAgo: 'Baru saja',
      timestamp: new Date(),
      type: 'stock'
    };
    setActivities(prev => [act, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    const p = products.find(prod => prod.id === id);
    if (!p) return;
    setProducts(prev => prev.filter(prod => prod.id !== id));
    const act: Activity = {
      id: `act-${Date.now()}`,
      title: 'Produk Dihapus',
      description: `${p.name} disisihkan dari katalog`,
      timeAgo: 'Baru saja',
      timestamp: new Date(),
      type: 'stock'
    };
    setActivities(prev => [act, ...prev]);
  };

  const handleAddCustomer = (newCust: Customer) => {
    setCustomers(prev => [newCust, ...prev]);
    const act: Activity = {
      id: `act-${Date.now()}`,
      title: 'Member Baru Terdaftar',
      description: `${newCust.name} bergabung sebagai member ${newCust.tier}`,
      timeAgo: 'Baru saja',
      timestamp: new Date(),
      type: 'customer'
    };
    setActivities(prev => [act, ...prev]);
  };

  const handleUpdateCustomer = (updatedCust: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCust.id ? updatedCust : c));
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    const act: Activity = {
      id: `act-${Date.now()}`,
      title: 'Member Dihapus',
      description: `Registrasi member telah disinkronisasikan keluar`,
      timeAgo: 'Baru saja',
      timestamp: new Date(),
      type: 'customer'
    };
    setActivities(prev => [act, ...prev]);
  };

  const handleResetApplicationData = () => {
    setProducts([]);
    setCustomers([]);
    setTransactions([]);
    setActivities([]);
    setNotifications([
      { id: `reset-${Date.now()}`, msg: 'Aplikasi berhasil dikosongkan! Seluruh database kembali ke nol.', read: false }
    ]);
  };

  const handleAddAccount = (newAcc: any) => {
    setAccounts(prev => [...prev, newAcc]);
    const act: Activity = {
      id: `act-${Date.now()}`,
      title: 'Staff Baru Terdaftar',
      description: `Kredensial login milik ${newAcc.name} (${newAcc.role}) siap digunakan`,
      timeAgo: 'Baru saja',
      timestamp: new Date(),
      type: 'customer'
    };
    setActivities(prev => [act, ...prev]);
  };

  const handleChangePassword = (accId: string, newPass: string) => {
    setAccounts(prev => prev.map(a => a.id === accId ? { ...a, passwordHash: newPass } : a));
    const acc = accounts.find(a => a.id === accId);
    const act: Activity = {
      id: `act-${Date.now()}`,
      title: 'Kata Sandi Diperbarui',
      description: `Kata sandi milik ${acc?.name || 'Staff'} berhasil diganti`,
      timeAgo: 'Baru saja',
      timestamp: new Date(),
      type: 'customer'
    };
    setActivities(prev => [act, ...prev]);
  };

  const handleDeleteAccount = (accId: string) => {
    const acc = accounts.find(a => a.id === accId);
    setAccounts(prev => prev.filter(a => a.id !== accId));
    const act: Activity = {
      id: `act-${Date.now()}`,
      title: 'Akun Karyawan Dihapus',
      description: `Kredensial login untuk ${acc?.name || 'Staff'} telah dicabut`,
      timeAgo: 'Baru saja',
      timestamp: new Date(),
      type: 'customer'
    };
    setActivities(prev => [act, ...prev]);
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
    
    // Create sales activity log
    const act: Activity = {
      id: `act-${Date.now()}`,
      title: `Order ${newTx.invoiceNumber}`,
      description: `Selesai • Rp ${newTx.total.toLocaleString('id-ID')}`,
      timeAgo: 'Baru saja',
      timestamp: new Date(),
      type: 'sale'
    };
    setActivities(prev => [act, ...prev]);

    // Deduct stock for checkout items dynamically!
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const itemInCart = newTx.items.find(i => i.product.id === p.id);
        if (itemInCart) {
          const nextStock = Math.max(0, p.stock - itemInCart.quantity);
          let nextStatus: 'Aktif' | 'Stok Hampir Habis' | 'Stok Habis' = 'Aktif';
          if (nextStock === 0) {
            nextStatus = 'Stok Habis';
          } else if (nextStock <= 5) {
            nextStatus = 'Stok Hampir Habis';
          }
          return {
            ...p,
            stock: nextStock,
            status: nextStatus
          };
        }
        return p;
      });
    });

    // Award Points with custom multiplier
    if (newTx.customer) {
      setCustomers(prevCustomers => {
        return prevCustomers.map(c => {
          if (c.id === newTx.customer?.id) {
            const nextPoints = c.points + newTx.pointsEarned;
            let nextTier = c.tier;
            if (nextPoints >= 10000) {
              nextTier = 'Platinum';
            } else if (nextPoints >= 3000) {
              nextTier = 'Gold';
            }
            return {
              ...c,
              points: nextPoints,
              tier: nextTier
            };
          }
          return c;
        });
      });
    }

    // Push notification alert
    setNotifications(prev => [
      {
        id: `n-${Date.now()}`,
        msg: `Transaksi ${newTx.invoiceNumber} berhasil diselesaikan senilai Rp ${newTx.total.toLocaleString('id-ID')}`,
        read: false
      },
      ...prev
    ]);
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  if (!role) {
    return <LoginScreen onLogin={handleLogin} accounts={accounts} />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans relative antialiased selection:bg-[#dce9ff]">
      {/* Top Header */}
      <header className="w-full h-18 sticky top-0 bg-white border-b border-[#c5c5d3] shadow-sm z-40 flex justify-between items-center px-4 sm:px-6 md:px-12">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-[#e5eeff] rounded-full text-[#444651] transition-all active:scale-95"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('Dashboard')}>
            <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold">
              UP
            </div>
            <h1 className="text-lg font-black tracking-tight text-[#00236f] hidden sm:block">
              {businessSettings.shopName}
            </h1>
            <h1 className="text-sm font-black tracking-tight text-[#00236f] sm:hidden">UMKM Manager</h1>
          </div>
        </div>

        {/* Header Right menu actions */}
        <div className="flex items-center gap-3">
          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (!isNotifOpen) {
                  // Mark all as read when opening notifications
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                }
              }}
              className="w-10 h-10 hover:bg-gray-150 text-[#00236f] rounded-full flex items-center justify-center transition-all cursor-pointer relative"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-600"></span>
              )}
            </button>

            {/* Notification Popover Drawer */}
            <AnimatePresence>
              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#c5c5d3] p-4 z-50 text-xs"
                  >
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100 font-bold text-[#0b1c30]">
                      <span>Pemberitahuan Sistem</span>
                      <button onClick={() => setNotifications([])} className="text-[#00236f] hover:underline text-[10px] cursor-pointer">Bersihkan</button>
                    </div>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center text-[#757682] py-4">Tidak ada notifikasi baru.</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className="p-2 hover:bg-gray-50 rounded-lg text-left line-clamp-3 leading-normal border-b border-gray-50 font-medium">
                            {n.msg}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Signout trigger */}
          <button 
            onClick={handleLogout}
            className="w-10 h-10 hover:bg-red-50 text-red-600 rounded-full flex items-center justify-center transition-all cursor-pointer"
            title="Keluar Akun"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Body Segment holds Side Nav (desktop) and workspace stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar Panel for Desktops */}
        <aside className="hidden md:flex flex-col h-[calc(100vh-72px)] w-72 bg-white border-r border-[#c5c5d3] p-6 space-y-4 shrink-0 overflow-y-auto">
          {/* Active head user card */}
          <div className="flex items-center gap-3 p-3 bg-[#f8f9ff] rounded-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-lg select-none">
              {currentUser?.name ? currentUser.name.split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase() : 'BD'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0b1c30] truncate max-w-[130px]">{currentUser?.name || 'Budi Antoro'}</h2>
              <p className="text-[10px] text-[#006c49] font-bold">{currentUser?.role === 'Admin' ? 'Pro SME Owner' : 'Kasir / Staff'}</p>
              <p className="text-[10px] text-[#757682] font-mono mt-0.5">ID: {currentUser?.username || 'budi'}</p>
            </div>
          </div>

          {/* Desktop links */}
          <nav className="flex flex-col gap-2 pt-4">
            <button
              onClick={() => setActiveTab('Dashboard')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'Dashboard'
                  ? 'bg-[#00236f] text-white shadow-md'
                  : 'text-[#444651] hover:bg-[#e5eeff] hover:text-[#00236f]'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => setActiveTab('Products')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'Products'
                  ? 'bg-[#00236f] text-white shadow-md'
                  : 'text-[#444651] hover:bg-[#e5eeff] hover:text-[#00236f]'
              }`}
            >
              <Package className="w-5 h-5 shrink-0" />
              <span>Daftar Produk</span>
            </button>

            <button
              onClick={() => setActiveTab('POS')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'POS'
                  ? 'bg-[#00236f] text-white shadow-md'
                  : 'text-[#444651] hover:bg-[#e5eeff] hover:text-[#00236f]'
              }`}
            >
              <ShoppingCart className="w-5 h-5 shrink-0" />
              <span>POS Transaksi</span>
            </button>

            <button
              onClick={() => setActiveTab('Customers')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'Customers'
                  ? 'bg-[#00236f] text-white shadow-md'
                  : 'text-[#444651] hover:bg-[#e5eeff] hover:text-[#00236f]'
              }`}
            >
              <Users className="w-5 h-5 shrink-0" />
              <span>Manajemen Pelanggan</span>
            </button>

            <button
              onClick={() => setActiveTab('Reports')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'Reports'
                  ? 'bg-[#00236f] text-white shadow-md'
                  : 'text-[#444651] hover:bg-[#e5eeff] hover:text-[#00236f]'
              }`}
            >
              <Settings className="w-5 h-5 shrink-0" />
              <span>Laporan & Pengaturan</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Swipe-in Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              ></div>
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="fixed top-0 left-0 h-full w-64 bg-white z-50 p-6 flex flex-col justify-between shadow-2xl md:hidden"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-[#00236f]">UMKM Workspace</span>
                    <button onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>

                  <nav className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setActiveTab('Dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs ${
                        activeTab === 'Dashboard' ? 'bg-[#00236f] text-white' : 'text-[#444651]'
                      }`}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Beranda</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('Products');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs ${
                        activeTab === 'Products' ? 'bg-[#00236f] text-white' : 'text-[#444651]'
                      }`}
                    >
                      <Package className="w-5 h-5" />
                      <span>Produk</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('POS');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs ${
                        activeTab === 'POS' ? 'bg-[#00236f] text-white' : 'text-[#444651]'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>POS</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('Customers');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs ${
                        activeTab === 'Customers' ? 'bg-[#00236f] text-white' : 'text-[#444651]'
                      }`}
                    >
                      <Users className="w-5 h-5" />
                      <span>Pelanggan</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('Reports');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs ${
                        activeTab === 'Reports' ? 'bg-[#00236f] text-white' : 'text-[#444651]'
                      }`}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Laporan & Pengaturan</span>
                    </button>
                  </nav>
                </div>

                <div className="text-xs text-gray-400 font-mono">
                  Sistem V1.0 • {currentUser?.name || 'Budi Antoro'}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Content Workspace Area panel stage */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-12 py-8 bg-[#f8f9ff]">
          <div className="max-w-7xl mx-auto pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === 'Dashboard' && (
                  <DashboardTab 
                    activities={activities}
                    products={products}
                    customers={customers}
                    transactions={transactions}
                    currentUser={currentUser}
                    onNavigateToTab={(tab) => setActiveTab(tab)}
                    onQuickAddSale={() => setActiveTab('POS')}
                  />
                )}

                {activeTab === 'Products' && (
                  <ProductsTab 
                    products={products}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                )}

                {activeTab === 'POS' && (
                  <POSTab 
                    products={products}
                    customers={customers}
                    onAddTransaction={handleAddTransaction}
                  />
                )}

                {activeTab === 'Customers' && (
                  <CustomersTab 
                    customers={customers}
                    onAddCustomer={handleAddCustomer}
                    onUpdateCustomer={handleUpdateCustomer}
                    onDeleteCustomer={handleDeleteCustomer}
                  />
                )}

                {activeTab === 'Reports' && (
                  <ReportsTab 
                    products={products}
                    transactions={transactions}
                    businessSettings={businessSettings}
                    onSaveSettings={(s) => setBusinessSettings(s)}
                    accounts={accounts}
                    onAddAccount={handleAddAccount}
                    onChangePassword={handleChangePassword}
                    onDeleteAccount={handleDeleteAccount}
                    onResetApplicationData={handleResetApplicationData}
                    currentUser={currentUser}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Floating Bottom Nav for Mobile Screens only */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-[76px] bg-white border-t border-[#c5c5d3] flex justify-around items-center px-2 pb-safe shadow-lg z-40">
        <button 
          onClick={() => setActiveTab('Dashboard')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl text-center min-w-12 transition-all active:scale-90 ${
            activeTab === 'Dashboard' ? 'text-[#00236f] bg-[#e5eeff] px-3 font-semibold' : 'text-[#757682]'
          }`}
        >
          <LayoutDashboard className="w-5.5 h-5.5" />
          <span className="text-[10px] mt-1 font-semibold font-sans">Beranda</span>
        </button>

        <button 
          onClick={() => setActiveTab('Products')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl text-center min-w-12 transition-all active:scale-90 ${
            activeTab === 'Products' ? 'text-[#00236f] bg-[#e5eeff] px-3 font-semibold' : 'text-[#757682]'
          }`}
        >
          <Package className="w-5.5 h-5.5" />
          <span className="text-[10px] mt-1 font-semibold font-sans">Produk</span>
        </button>

        <button 
          onClick={() => setActiveTab('POS')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl text-center min-w-12 transition-all active:scale-90 ${
            activeTab === 'POS' ? 'text-[#00236f] bg-[#e5eeff] px-3 font-semibold' : 'text-[#757682]'
          }`}
        >
          <ShoppingCart className="w-5.5 h-5.5" />
          <span className="text-[10px] mt-1 font-semibold font-sans">POS</span>
        </button>

        <button 
          onClick={() => setActiveTab('Customers')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl text-center min-w-12 transition-all active:scale-90 ${
            activeTab === 'Customers' ? 'text-[#00236f] bg-[#e5eeff] px-3 font-semibold' : 'text-[#757682]'
          }`}
        >
          <Users className="w-5.5 h-5.5" />
          <span className="text-[10px] mt-1 font-semibold font-sans">Pelanggan</span>
        </button>

        <button 
          onClick={() => setActiveTab('Reports')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl text-center min-w-12 transition-all active:scale-90 ${
            activeTab === 'Reports' ? 'text-[#00236f] bg-[#e5eeff] px-3 font-semibold' : 'text-[#757682]'
          }`}
        >
          <Settings className="w-5.5 h-5.5" />
          <span className="text-[10px] mt-1 font-semibold font-sans">Laporan</span>
        </button>
      </nav>
    </div>
  );
}
