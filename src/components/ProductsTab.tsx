import React, { useState } from 'react';
import { Search, Plus, Coffee, Info, AlertTriangle, Archive, Save, X, Edit, Delete, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface ProductsTabProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductsTab({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}: ProductsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [price, setPrice] = useState(20000);
  const [stock, setStock] = useState(15);
  const [imageUrl, setImageUrl] = useState('');

  const resetForm = () => {
    setName('');
    setSku(`SKU-${Math.floor(100 + Math.random() * 900)}`);
    setCategory('Makanan');
    setPrice(20000);
    setStock(15);
    setImageUrl('');
    setEditingProduct(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setPrice(p.price);
    setStock(p.stock);
    setImageUrl(p.imageUrl || '');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    let status: 'Aktif' | 'Stok Hampir Habis' | 'Stok Habis' = 'Aktif';
    if (stock === 0) {
      status = 'Stok Habis';
    } else if (stock <= 5) {
      status = 'Stok Hampir Habis';
    }

    const compiled: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name,
      sku,
      category,
      price: Number(price),
      stock: Number(stock),
      status,
      imageUrl: imageUrl.trim() || undefined
    };

    if (editingProduct) {
      onUpdateProduct(compiled);
    } else {
      onAddProduct(compiled);
    }

    setModalOpen(false);
    resetForm();
  };

  // Categories list
  const categories = ['Semua', 'Makanan', 'Minuman', 'Jasa'];

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (skuStatus: string) => {
    switch (skuStatus) {
      case 'Aktif':
        return (
          <span className="inline-flex h-6 px-2 rounded-full items-center justify-center bg-[#6cf8bb] text-[#00714d] text-xs font-semibold">
            Aktif
          </span>
        );
      case 'Stok Hampir Habis':
        return (
          <span className="inline-flex h-6 px-2 rounded-full items-center justify-center bg-red-100 text-red-700 text-xs font-semibold gap-1">
            <AlertTriangle className="w-3 h-3" />
            Sisa
          </span>
        );
      case 'Stok Habis':
        return (
          <span className="inline-flex h-6 px-2 rounded-full items-center justify-center bg-gray-200 text-gray-700 text-xs font-semibold">
            Stok Habis
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative w-full group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#757682] group-focus-within:text-[#00236f] w-5 h-5 transition-colors" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-white rounded-xl border border-[#c5c5d3] text-[#0b1c30] placeholder-[#757682] focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all shadow-sm text-sm"
          placeholder="Cari Produk atau SKU..."
          type="text"
        />
      </div>

      {/* Filter Chips */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex gap-2 w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`h-8 px-4 rounded-full font-semibold text-xs transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#00236f] text-white shadow-sm'
                  : 'bg-white border border-[#c5c5d3] text-[#444651] hover:bg-[#f8f9ff]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Header and counter */}
      <div className="flex justify-between items-end border-b border-gray-100 pb-2">
        <h2 className="text-base font-bold text-[#0b1c30]">Data Produk</h2>
        <span className="text-xs text-[#757682] font-semibold">{filteredProducts.length} Total</span>
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#c5c5d3] p-12 text-center">
            <Archive className="w-12 h-12 text-[#757682] mx-auto mb-3" />
            <p className="text-[#0b1c30] font-bold text-sm">Produk tidak ditemukan</p>
            <p className="text-[#757682] text-xs mt-1">Coba sesuaikan kata kunci pencarian atau kategori filter Anda.</p>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isOutOfStock = p.status === 'Stok Habis';
            const isLowStock = p.status === 'Stok Hampir Habis';

            return (
              <motion.article
                layout
                key={p.id}
                className={`bg-white rounded-2xl p-4 border transition-all flex gap-4 items-center relative overflow-hidden group hover:shadow-md ${
                  isLowStock ? 'border-red-300' : 'border-[#c5c5d3]'
                } ${isOutOfStock ? 'opacity-80 grayscale-[15%]' : ''}`}
              >
                {/* Visual red line indicator for low stock */}
                {isLowStock && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"></div>}

                {/* Product Image */}
                <div className="w-16 h-16 rounded-xl bg-[#eff4ff] overflow-hidden shrink-0 border border-[#e5eeff] flex items-center justify-center">
                  {p.imageUrl ? (
                    <img 
                      alt={p.name} 
                      src={p.imageUrl} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Coffee className="w-6 h-6 text-[#757682]" />
                  )}
                </div>

                {/* Info Container */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-bold text-[#0b1c30] truncate">{p.name}</h3>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      {isLowStock && (
                        <span className="text-red-600 text-xs font-bold mr-1">Sisa {p.stock}</span>
                      )}
                      {getStatusBadge(p.status)}
                    </div>
                  </div>

                  <div className="text-xs text-[#757682] mt-1 flex gap-2 items-center font-medium">
                    <span>{p.sku}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                    <span className={isLowStock ? 'text-red-700 font-bold' : isOutOfStock ? 'text-gray-500' : 'text-[#006c49]'}>
                      Stok: {p.stock}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2.5">
                    <div className="text-sm font-bold text-[#00236f]">
                      Rp {p.price.toLocaleString('id-ID')}
                    </div>

                    {/* Action Tools */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-[#00236f] transition-all cursor-pointer"
                        title="Edit Produk"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-all cursor-pointer"
                        title="Hapus Produk"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })
        )}
      </div>

      {/* FAB to Add Product */}
      <button
        onClick={handleOpenAdd}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#00236f] text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-[#1e3a8a] hover:shadow-xl active:scale-95 transition-all z-40 cursor-pointer"
        aria-label="Tambah Produk"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-[#c5c5d3] max-w-md w-full p-6 shadow-xl relative"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#0b1c30] mb-4">
              {editingProduct ? 'Ubah Informasi Produk' : 'Tambah Produk Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-[#f8f9ff] border border-[#c5c5d3] rounded-lg text-xs"
                  placeholder="Contoh: Es Teh Leci"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full p-2.5 bg-[#f8f9ff] border border-[#c5c5d3] rounded-lg text-xs"
                    placeholder="Contoh: SKU-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#f8f9ff] border border-[#c5c5d3] rounded-lg text-xs"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Jasa">Jasa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#f8f9ff] border border-[#c5c5d3] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">Jumlah Stok</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#f8f9ff] border border-[#c5c5d3] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1" htmlFor="imageUrl">
                  URL Hotlink Gambar (Opsional)
                </label>
                <input
                  id="imageUrl"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 bg-[#f8f9ff] border border-[#c5c5d3] rounded-lg text-xs"
                  placeholder="https://lh3.googleusercontent.com/..."
                />
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
                  <span>Simpan</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
