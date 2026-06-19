import React, { useState } from 'react';
import { 
  Search, Plus, Minus, Trash, ShoppingCart, UserCheck, 
  UserMinus, UserPlus, Sparkles, CheckCircle2, AlertTriangle,
  Send, FileText, Printer, Check, CreditCard, ChevronRight, X, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Customer, CartItem, Transaction } from '../types';

interface POSTabProps {
  products: Product[];
  customers: Customer[];
  onAddTransaction: (tx: Transaction) => void;
}

export default function POSTab({
  products,
  customers,
  onAddTransaction
}: POSTabProps) {
  // POS States
  const [cart, setCart] = useState<CartItem[]>([
    { product: products[2] || products[0], quantity: 2 },
    { product: products[3] || products[1], quantity: 1 }
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Transfer'>('Tunai');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Success Checkout Screen
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  // Subtotal calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.1); // PB1 10%
  const discountVal = usePoints ? 12500 : 0;
  const total = subtotal + tax - discountVal;

  const handleUpdateQty = (prodId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product.id === prodId) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : item;
        }
        return item;
      }).filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveItem = (prodId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== prodId));
  };

  // Add Item From Catalog Overlay
  const handleAddItemToCart = (p: Product) => {
    if (p.stock === 0) return;
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.product.id === p.id);
      if (exists) {
        return prevCart.map((item) => 
          item.product.id === p.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { product: p, quantity: 1 }];
    });
    setIsCatalogOpen(false);
  };

  // Checkout submit
  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Build the invoice number
    const randomNum = Math.floor(8000 + Math.random() * 999);
    const invoiceNumber = `#TRX-${randomNum}`;

    // Earn points: 1 point for every Rp 10,000 spent
    const pointsEarned = Math.round(subtotal / 10000);

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      invoiceNumber,
      customer: selectedCustomer || undefined,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      items: [...cart],
      subtotal,
      tax,
      discount: discountVal,
      total,
      paymentMethod,
      pointsEarned,
      status: 'Pembayaran Berhasil'
    };

    onAddTransaction(tx);
    setCompletedTx(tx);
  };

  const handleResetCheckout = () => {
    setCompletedTx(null);
    setCart([]);
    setUsePoints(false);
    setSelectedCustomer(null);
  };

  // Customer options filtration
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.phone.includes(customerSearch)
  );

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!completedTx ? (
          <motion.div 
            key="checkout-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Column: Customer & Cart */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Customer Selector Section */}
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#c5c5d3] flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-[#00236f]" />
                    Pilih Pelanggan
                  </h3>
                  {selectedCustomer && (
                    <button 
                      onClick={() => setSelectedCustomer(null)}
                      className="text-red-600 p-1 rounded hover:bg-red-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <UserMinus className="w-4 h-4" />
                      Hapus
                    </button>
                  )}
                </div>

                {!selectedCustomer ? (
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#757682] w-5 h-5" />
                    <input
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setIsCustomerDropdownOpen(true);
                      }}
                      onFocus={() => setIsCustomerDropdownOpen(true)}
                      className="w-full pl-10 pr-4 py-3 bg-[#f8f9ff] border border-[#c5c5d3] rounded-xl text-xs text-[#0b1c30] placeholder-[#757682] focus:outline-none focus:border-[#00236f]"
                      placeholder="Cari nama atau WhatsApp (Contoh: Budi, 0812...)"
                    />

                    {/* Auto Dropdown results */}
                    {isCustomerDropdownOpen && (
                      <div className="absolute top-13 left-0 w-full bg-white rounded-xl border border-[#c5c5d3] shadow-lg max-h-48 overflow-y-auto z-30">
                        {filteredCustomers.length === 0 ? (
                          <div className="p-3 text-xs text-[#757682] text-center">Pelanggan tidak ditemukan.</div>
                        ) : (
                          filteredCustomers.map((cust) => (
                            <button
                              key={cust.id}
                              type="button"
                              onClick={() => {
                                setSelectedCustomer(cust);
                                setIsCustomerDropdownOpen(false);
                                setCustomerSearch('');
                              }}
                              className="w-full text-left p-3 hover:bg-[#e5eeff] text-xs text-[#0b1c30] border-b border-gray-100 flex justify-between items-center transition-colors"
                            >
                              <div>
                                <span className="font-bold">{cust.name}</span>
                                <span className="text-[10px] text-[#757682] ml-2 font-mono">{cust.phone}</span>
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded border border-yellow-200">{cust.tier}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-[#eff4ff] p-4 rounded-xl border border-[#dce9ff]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#dce1ff] text-[#00236f] rounded-full flex items-center justify-center font-bold text-sm">
                        {selectedCustomer.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#0b1c30]">{selectedCustomer.name}</span>
                        <span className="text-xs text-[#444651] font-medium">{selectedCustomer.phone}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-[#00236f] text-white px-2.5 py-1 rounded-full shadow-sm">
                      {selectedCustomer.tier}
                    </span>
                  </div>
                )}
              </section>

              {/* Shopping Cart Section */}
              <section className="bg-white rounded-2xl shadow-sm border border-[#c5c5d3] flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f8f9ff]">
                  <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-[#00236f]" />
                    Keranjang Belanja
                    <span className="bg-[#e5eeff] text-[#00236f] text-[11px] font-bold px-2.5 py-0.5 rounded-full ml-2">
                      {cart.length} Item
                    </span>
                  </h3>
                  <button 
                    onClick={() => setIsCatalogOpen(true)}
                    className="flex items-center gap-1 bg-[#00236f] text-white hover:bg-[#1e3a8a] px-3 py-2 rounded-xl text-xs font-semibold shadow-sm cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Barang
                  </button>
                </div>

                {/* Cart list */}
                <div className="divide-y divide-gray-100">
                  {cart.length === 0 ? (
                    <div className="p-12 text-center text-xs text-[#757682]">
                      Keranjang belanja Anda masih kosong. Silakan tambahkan beberapa produk untuk melakukan transaksi.
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div 
                        key={item.product.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-[#f8f9ff] transition-colors"
                      >
                        <div className="flex gap-3 items-center min-w-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-blue-50 flex items-center justify-center">
                            {item.product.imageUrl ? (
                              <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Sparkles className="w-5 h-5 text-[#757682]" />
                            )}
                          </div>
                          <div className="truncate">
                            <span className="block text-sm font-bold text-[#00236f] truncate">{item.product.name}</span>
                            <span className="text-xs text-[#757682] font-semibold mt-0.5">Rp {item.product.price.toLocaleString('id-ID')} / pcs</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          {/* Qty count */}
                          <div className="flex items-center bg-gray-50 rounded-lg border border-[#c5c5d3] overflow-hidden">
                            <button 
                              onClick={() => handleUpdateQty(item.product.id, -1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 text-gray-700 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-xs">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQty(item.product.id, 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 text-gray-700 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-sm font-bold text-[#00236f] w-24 text-right">
                            Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                          </div>

                          <button 
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Sticky Summary & Pay */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
              {/* Member Point Benefit */}
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#c5c5d3] relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-[#6cf8bb]/20 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      Poin Member
                    </h3>
                    <span className="text-xs text-[#444651]">
                      Tersedia:{' '}
                      <strong className="text-[#00236f]">
                        {selectedCustomer ? selectedCustomer.points.toLocaleString('id-ID') : '0'} pts
                      </strong>
                    </span>
                  </div>

                  {/* Toggle reward switch */}
                  <div className="relative inline-block w-12 shrink-0 select-none">
                    <input
                      id="rewardToggle"
                      type="checkbox"
                      disabled={!selectedCustomer}
                      checked={usePoints}
                      onChange={(e) => setUsePoints(e.target.checked)}
                      className="sr-only peer"
                    />
                    <label
                      htmlFor="rewardToggle"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors relative before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:bg-white before:border before:rounded-full before:h-5 before:w-5 before:transition-all ${
                        usePoints ? 'bg-[#00236f] before:translate-x-6' : 'bg-[#c5c5d3]'
                      } ${!selectedCustomer ? 'opacity-50 cursor-not-allowed' : ''}`}
                    ></label>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-[#006c49] font-medium flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 fill-[#006c49]/10" />
                  <span>Potongan Rp 12.500 jika digunakan.</span>
                </div>
              </section>

              {/* Payment details and summary */}
              <section className="bg-white rounded-2xl shadow-sm border border-[#c5c5d3] flex flex-col overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-[#0b1c30] mb-3">Metode Pembayaran</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Tunai */}
                    <label className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'Tunai'}
                        onChange={() => setPaymentMethod('Tunai')}
                        className="peer sr-only" 
                      />
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl border-2 border-[#c5c5d3] peer-checked:border-[#00236f] peer-checked:bg-[#e5eeff] peer-checked:text-[#00236f] text-[#444651] hover:bg-[#f8f9ff] transition-all text-xs font-semibold gap-1">
                        <span>Tunai</span>
                      </div>
                    </label>

                    {/* QRIS */}
                    <label className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="payment"
                        checked={paymentMethod === 'QRIS'}
                        onChange={() => setPaymentMethod('QRIS')}
                        className="peer sr-only" 
                      />
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl border-2 border-[#c5c5d3] peer-checked:border-[#00236f] peer-checked:bg-[#e5eeff] peer-checked:text-[#00236f] text-[#444651] hover:bg-[#f8f9ff] transition-all text-xs font-semibold gap-1">
                        <span>QRIS</span>
                      </div>
                    </label>

                    {/* Transfer */}
                    <label className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="payment"
                        checked={paymentMethod === 'Transfer'}
                        onChange={() => setPaymentMethod('Transfer')}
                        className="peer sr-only" 
                      />
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl border-2 border-[#c5c5d3] peer-checked:border-[#00236f] peer-checked:bg-[#e5eeff] peer-checked:text-[#00236f] text-[#444651] hover:bg-[#f8f9ff] transition-all text-xs font-semibold gap-1">
                        <span>Transfer</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Calculations info */}
                <div className="p-5 bg-[#f8f9ff] border-b border-gray-100 flex flex-col gap-2.5">
                  <div className="flex justify-between text-xs text-[#444651]">
                    <span>Subtotal</span>
                    <span className="font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#444651]">
                    <span>Pajak (PB1 10%)</span>
                    <span className="font-bold">Rp {tax.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#006c49]">
                    <span>Diskon (Poin)</span>
                    <span className="font-bold">- Rp {discountVal.toLocaleString('id-ID')}</span>
                  </div>

                  <div className="my-1 border-t border-dashed border-gray-300"></div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-[#0b1c30]">Total</span>
                    <span className="text-2xl font-black text-[#00236f]">
                      <span className="text-xs font-normal mr-1 text-[#444651]">Rp</span>
                      {total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Submits */}
                <div className="p-5 bg-white flex flex-col gap-2">
                  <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className={`w-full bg-[#006c49] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all active:scale-[0.98] ${
                      cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Bayar & Cetak Struk</span>
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        ) : (
          /* Receipt detail screen TRX-8821 */
          <motion.div 
            key="receipt-flow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-xl mx-auto"
          >
            {/* Action navigation toolbar */}
            <div className="flex justify-between items-center mb-4 bg-white/70 p-2.5 rounded-xl border border-gray-200">
              <button 
                onClick={handleResetCheckout}
                className="text-[#00236f] text-xs font-bold hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                Kembali ke POS
              </button>
              <h4 className="text-sm font-bold text-[#0b1c30]">Rincian Checkout Sukses</h4>
              <div className="w-12"></div>
            </div>

            {/* Receipt container card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#c5c5d3] relative overflow-hidden">
              {/* Receipt edge zig zag visual simulations (Tailwind card border) */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-[#00236f]"></div>

              {/* Transaction status icon */}
              <div className="text-center mt-4 mb-6 pb-6 border-b border-dashed border-gray-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#6cf8bb] text-[#00714d] mb-3">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h2 className="text-base font-bold text-[#00714d]">Pembayaran Berhasil</h2>
                <p className="text-xs text-[#757682] mt-1 font-mono">
                  {completedTx.invoiceNumber} • {completedTx.date}, {completedTx.time}
                </p>
              </div>

              {/* Brand Store */}
              <div className="text-center mb-6">
                <h3 className="text-base font-bold text-[#00236f]">Toko Makmur Jaya</h3>
                <p className="text-xs text-[#444651] mt-1 leading-relaxed">
                  Jl. Sudirman No. 45, Jakarta Selatan<br />
                  Call Center / CS: +62 812-3456-7890
                </p>
              </div>

              {/* Itemized breakdown table */}
              <div className="mb-6 pb-6 border-b border-dashed border-gray-300 space-y-4">
                {completedTx.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-start text-xs">
                    <div>
                      <p className="font-bold text-[#0b1c30]">{item.product.name}</p>
                      <p className="text-[#757682] mt-0.5">{item.quantity} x Rp {item.product.price.toLocaleString('id-ID')}</p>
                    </div>
                    <p className="font-bold text-[#00236f]">Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>

              {/* Mathematical additions */}
              <div className="mb-6 pb-6 border-b border-dashed border-gray-300 space-y-2.5 text-xs">
                <div className="flex justify-between text-[#444651]">
                  <span>Subtotal</span>
                  <span>Rp {completedTx.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[#444651]">
                  <span>Pajak (PB1 10%)</span>
                  <span>Rp {completedTx.tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[#006c49]">
                  <span>Poin Digunakan ({completedTx.discount > 0 ? '100' : '0'} Pts)</span>
                  <span>- Rp {completedTx.discount.toLocaleString('id-ID')}</span>
                </div>

                <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline font-bold text-[#0b1c30]">
                  <span className="text-sm">Total Bayar</span>
                  <span className="text-lg text-[#00236f]">Rp {completedTx.total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* System Metadata bottom summary */}
              <div className="p-4 bg-[#f8f9ff] rounded-xl flex flex-col gap-2.5 text-xs border border-gray-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4.5 h-4.5 text-[#757682]" />
                  <p className="text-[#444651]">Metode Pembayaran: <strong className="text-[#00236f]">{completedTx.paymentMethod}</strong></p>
                </div>
                {completedTx.customer && (
                  <div className="flex items-start gap-2 border-t border-gray-200/60 pt-2.5">
                    <Sparkles className="w-4.5 h-4.5 text-yellow-500 fill-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#006c49] font-bold">Poin Didapat: +{completedTx.pointsEarned} Pts</p>
                      <p className="text-[10px] text-[#757682] mt-0.5">Total Saldo Poin: {(completedTx.customer.points + completedTx.pointsEarned).toLocaleString('id-ID')} pts</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Receipt Actions Bottom Buttons */}
            <div className="mt-5 space-y-2 pb-12">
              <button
                onClick={() => {
                  alert(`Kwitansi transaksi ${completedTx.invoiceNumber} dikirim melalui WhatsApp ke pelanggan!`);
                }}
                className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5 fill-white text-[#25D366]" />
                <span>Kirim WhatsApp</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => alert('Mengekspor berkas PDF kwitansi...')}
                  className="bg-white border border-[#00236f] text-[#00236f] font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 text-xs hover:bg-[#f8f9ff] cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ekspor PDF</span>
                </button>
                <button
                  onClick={() => alert('Mengirim perintah cetak kwitansi ke mesin printer thermal...')}
                  className="bg-white border border-[#00236f] text-[#00236f] font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 text-xs hover:bg-[#f8f9ff] cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Struk</span>
                </button>
              </div>

              <button
                onClick={handleResetCheckout}
                className="w-full bg-[#00236f] text-white font-bold py-3.5 rounded-xl text-center shadow-md hover:bg-[#1e3a8a] cursor-pointer"
              >
                Selesai / Transaksi Baru
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Choose Product overlay dialog */}
      {isCatalogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-5 border border-[#c5c5d3] max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col justify-between shadow-xl"
          >
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-[#0b1c30]">Pilih Item Tambahan</h3>
              <button 
                onClick={() => setIsCatalogOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List products */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 my-4 pr-1">
              {products.map((item) => {
                const isOutOfStock = item.stock <= 0;
                return (
                  <div 
                    key={item.id} 
                    className={`flex justify-between items-center py-3 ${isOutOfStock ? 'opacity-50' : ''}`}
                  >
                    <div className="flex gap-2 items-center">
                      <div className="w-10 h-10 rounded bg-[#eff4ff] overflow-hidden border border-gray-100 flex items-center justify-center text-xs">
                        {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : 'Cafe'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0b1c30]">{item.name}</p>
                        <p className="text-[10px] text-[#757682] mt-0.5">Sisa: {item.stock} • Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => handleAddItemToCart(item)}
                      className={`px-3 py-1 bg-[#e5eeff] text-[#00236f] text-[10px] font-bold rounded-lg ${
                        isOutOfStock ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-500' : 'hover:bg-[#dce1ff]'
                      }`}
                    >
                      {isOutOfStock ? 'Habis' : 'Pilih'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="text-right pt-2 border-t border-gray-100">
              <button 
                onClick={() => setIsCatalogOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
