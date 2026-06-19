import React, { useState } from 'react';
import { Search, UserPlus, Gift, Award, Check, AlertCircle, Sparkles, X, Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Customer } from '../types';

interface CustomersTabProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export default function CustomersTab({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer
}: CustomersTabProps) {
  const [activeCust, setActiveCust] = useState<Customer>(customers[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custTier, setCustTier] = useState<'Platinum' | 'Gold' | 'Silver'>('Silver');

  // Custom dialog state for Member deletion
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // Custom alert / toast states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Compute active target with a zero-length array defensive check
  const isCustInList = activeCust && customers.some(c => c.id === activeCust.id);
  const displayCust = isCustInList ? (customers.find(c => c.id === activeCust.id) || null) : (customers.length > 0 ? customers[0] : null);

  // Filter customers
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleSelectCustomer = (c: Customer) => {
    setActiveCust(c);
  };

  const handleRedeemPoints = (pointsRequired: number, discountText: string) => {
    if (!displayCust) return;
    if (displayCust.points < pointsRequired) {
      showToast(`Poin ${displayCust.name} tidak mencukupi untuk ditukarkan dengan ${discountText}. (Poin saat ini: ${displayCust.points})`, 'error');
      return;
    }

    const updated: Customer = {
      ...displayCust,
      points: displayCust.points - pointsRequired
    };

    onUpdateCustomer(updated);
    setActiveCust(updated);
    showToast(`Berhasil menukarkan ${pointsRequired} Poin ${displayCust.name} untuk voucher ${discountText}!`, 'success');
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custPhone.trim()) return;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: custName,
      phone: custPhone,
      tier: custTier,
      points: 0,
      joinedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    onAddCustomer(newCust);
    setActiveCust(newCust);
    setModalOpen(false);

    setCustName('');
    setCustPhone('');
    setCustTier('Silver');
  };

  return (
    <div className="space-y-6">
      {/* Search and customer action section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0b1c30]">Manajemen Pelanggan</h2>
          <p className="text-xs text-[#757682]">Kelola data loyalitas, akumulasi poin, dan tingkatan member Anda.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Custom Search bar */}
          <div className="relative w-full md:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#757682] w-4.5 h-4.5" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#c5c5d3] rounded-xl text-xs text-[#0b1c30] placeholder-[#757682] focus:outline-none focus:border-[#00236f]"
              placeholder="Cari nama atau WA..."
            />
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-3 py-2.5 bg-[#00236f] text-white rounded-xl text-xs font-bold hover:bg-[#1e3a8a] flex items-center gap-1 shrink-0 cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Member</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer Directory List */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCustomers.length === 0 ? (
              <div className="sm:col-span-2 bg-white rounded-2xl border border-[#c5c5d3] p-10 text-center text-xs text-[#757682]">
                Tidak ada data member member.
              </div>
            ) : (
              filteredCustomers.map((cust) => {
                const isActive = displayCust?.id === cust.id;
                return (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleSelectCustomer(cust)}
                    key={cust.id}
                    className={`rounded-2xl p-5 shadow-sm relative overflow-hidden cursor-pointer transition-all border ${
                      isActive 
                        ? 'bg-[#1e3a8a] text-white border-[#00236f] ring-2 ring-[#00236f]' 
                        : 'bg-white text-[#0b1c30] border-[#c5c5d3] hover:bg-gray-50'
                    }`}
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <Award className={`w-14 h-14 ${isActive ? 'text-white' : 'text-[#00236f]'}`} />
                    </div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                        <h3 className="text-sm font-bold truncate">{cust.name}</h3>
                        <p className={`text-xs mt-0.5 font-medium ${isActive ? 'text-blue-100' : 'text-[#757682]'}`}>{cust.phone}</p>
                      </div>
                      <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full border ${
                        isActive
                          ? 'bg-white text-[#00236f] border-white'
                          : 'bg-[#e5eeff] text-[#00236f] border-[#dce1ff]'
                      }`}>
                        {cust.tier}
                      </span>
                    </div>

                    <div className="flex gap-6 mt-2 relative z-10">
                      <div>
                        <p className={`text-[10px] font-bold ${isActive ? 'text-blue-200' : 'text-[#757682]'}`}>Total Poin</p>
                        <p className="text-sm font-bold font-mono">{cust.points.toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className={`text-[10px] font-bold ${isActive ? 'text-blue-200' : 'text-[#757682]'}`}>Bergabung</p>
                        <p className="text-sm font-semibold">{cust.joinedDate}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* Right Column: Selected Digital Member details & point redemption */}
        <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          {displayCust ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={displayCust.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Digital Card "Kartu Digital UMKM Pro" */}
                <div className="bg-[#213145] rounded-2xl p-5 shadow-lg text-white relative overflow-hidden aspect-[1.58/1] flex flex-col justify-between">
                  {/* Backdrop lights */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]"></div>

                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h4 className="text-[10px] text-gray-300 uppercase tracking-widest font-black">Kartu Digital</h4>
                      <p className="text-sm font-black mt-1 text-[#6cf8bb]">UMKM Pro Member</p>
                    </div>
                    <Award className="w-8 h-8 text-yellow-500 fill-yellow-500 opacity-80" />
                  </div>

                  <div className="flex items-end justify-between relative z-10">
                    <div>
                      <p className="text-base font-bold truncate max-w-[160px]">{displayCust.name}</p>
                      <p className="text-xs text-yellow-400 font-bold mt-1.5 uppercase">Level Member: {displayCust.tier}</p>
                    </div>

                    {/* QR Code Placeholder URL */}
                    <div className="w-16 h-16 bg-white rounded-xl p-1.5 shadow-sm flex-shrink-0">
                      <img 
                        className="w-full h-full object-contain mix-blend-multiply" 
                        alt="QR Code" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGmeuOpAfGsBlf-HIKj3z_UewoaTWHjeCv1cAaWE3L3s6R3G1Wbmc5-RQUR-I8PMkjG7bcGeqC1UABhEVntfTAnyW8jBffD37fK58etRgR1isPUG7cOVrX326xQBhTpTPcCS9PmmTpE7MXVnWPoX-FSSn7iG5qOC0SH0MH416IonvpayaRwDPs1A_vPDxN5OvG75khB5TC4oIHiwdt0AkPBQHxLaAN6FgrFYfjWgXIm5EhE8uAG1z1N8833-9Bz35kIIrStYmUbkU" 
                      />
                    </div>
                  </div>
                </div>

                {/* Tukar Poin redeem actions panel */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c5c5d3]">
                  <h3 className="text-sm font-bold text-[#00236f] mb-1.5 flex items-center gap-1">
                    <Gift className="w-5 h-5 text-yellow-600 shrink-0" />
                    Penukaran Poin Loyalitas
                  </h3>
                  <p className="text-xs text-[#757682] mb-4">Pilih penawaran voucher belanja untuk memotong total poin {displayCust.name} saat ini.</p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleRedeemPoints(100, 'Diskon Rp 10.000')}
                      className="w-full bg-[#006c49] text-white rounded-xl py-3 px-4 font-bold text-xs flex items-center justify-between hover:bg-[#00714d] transition-all shadow-sm active:scale-95 duration-200 cursor-pointer"
                    >
                      <div className="flex flex-col items-start font-sans">
                        <span className="text-xs">Potongan Rp 10.000</span>
                        <span className="text-[10px] opacity-90 font-normal mt-0.5">Tukar 100 Poin</span>
                      </div>
                      <Gift className="w-5 h-5 stroke-2" />
                    </button>

                    <button
                      onClick={() => handleRedeemPoints(200, 'Diskon Rp 25.000')}
                      className="w-full bg-[#eff4ff] text-[#00236f] border border-[#dce1ff] rounded-xl py-3 px-4 font-bold text-xs flex items-center justify-between hover:bg-[#e5eeff] transition-all active:scale-95 duration-200 cursor-pointer"
                    >
                      <div className="flex flex-col items-start font-sans">
                        <span className="text-xs text-[#00236f]">Potongan Rp 25.000</span>
                        <span className="text-[10px] text-[#757682] font-normal mt-0.5">Tukar 200 Poin</span>
                      </div>
                      <Gift className="w-5 h-5 stroke-2" />
                    </button>
                  </div>
                </div>

                {/* Hapus Member Area */}
                <div className="bg-red-50/40 rounded-2xl p-5 border border-red-100/70 space-y-2">
                  <h4 className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    Manajemen Keanggotaan Pelanggan
                  </h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed">Gunakan fitur ini untuk menghapus data member yang sudah tidak aktif atau selesai program loyalty.</p>
                  
                  <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="w-full mt-1 bg-white hover:bg-red-50 text-red-650 hover:text-red-750 border border-red-200 rounded-xl py-2.5 px-4 font-bold text-xs flex items-center justify-between transition-all active:scale-95 duration-200 cursor-pointer text-left"
                  >
                    <span>Hapus Member Keanggotaan</span>
                    <Trash2 className="w-4 h-4 text-red-500 stroke-2" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center border border-[#c5c5d3] text-xs text-[#757682]">
              Silakan pilih pelanggan dari silsilah daftar di sebelah kiri untuk mengulas detail kartu digital loyalti poin.
            </div>
          )}
        </aside>
      </div>

      {/* Create Member Modal overlay */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 border border-[#c5c5d3] max-w-sm w-full shadow-xl relative"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-[#0b1c30] mb-4">Daftarkan Member Baru</h3>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full p-2.5 bg-[#f8f9ff] border border-[#c5c5d3] rounded-lg text-xs"
                  placeholder="Contoh: Siti Aminah"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1">No. WhatsApp / HP</label>
                <input
                  type="text"
                  required
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full p-2.5 bg-[#f8f9ff] border border-[#c5c5d3] rounded-lg text-xs font-mono"
                  placeholder="Contoh: +62 812..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1">Tingkatan Awal</label>
                <select
                  value={custTier}
                  onChange={(e) => setCustTier(e.target.value as any)}
                  className="w-full p-2.5 bg-[#f8f9ff] border border-[#c5c5d3] rounded-lg text-xs"
                >
                  <option value="Silver">Silver (Member Reguler)</option>
                  <option value="Gold">Gold Member</option>
                  <option value="Platinum">Platinum Premium</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00236f] text-white rounded-lg hover:bg-[#1e3a8a] flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Daftarkan</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Custom Confirmation Modal for Deleting Customer */}
      <AnimatePresence>
        {deleteConfirmOpen && displayCust && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl p-6 border border-red-200 max-w-sm w-full shadow-2xl relative space-y-4"
            >
              <div className="flex items-center gap-3 text-red-600">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Konfirmasi Hapus Member</h3>
                  <p className="text-[10px] text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-650 leading-relaxed">
                Apakah Anda yakin ingin menghapus keanggotaan pelanggan <strong className="text-gray-900">"{displayCust.name}"</strong>? Seluruh poin loyalitas ({displayCust.points} Poin) dan status tier member akan dinonaktifkan secara permanen.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="flex-1 py-12 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-95 text-center"
                  style={{ paddingTop: '10px', paddingBottom: '10px' }}
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const deletedName = displayCust.name;
                    onDeleteCustomer(displayCust.id);
                    setDeleteConfirmOpen(false);
                    showToast(`Berhasil menghapus keanggotaan member "${deletedName}".`, 'success');
                  }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs cursor-pointer transition-all active:scale-95 text-center"
                >
                  Hapus Permanen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Alert Component */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3.5 rounded-xl border text-xs font-bold bg-white text-gray-900 max-w-sm shadow-xl"
            style={{
              borderColor: toastType === 'success' ? '#10b981' : toastType === 'error' ? '#ef4444' : '#3b82f6',
            }}
          >
            {toastType === 'success' && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
            {toastType === 'error' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
            {toastType === 'info' && <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
