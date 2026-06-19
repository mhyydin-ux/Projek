export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'Aktif' | 'Stok Hampir Habis' | 'Stok Habis';
  imageUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  tier: 'Platinum' | 'Gold' | 'Silver';
  points: number;
  joinedDate: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  timestamp: Date;
  type: 'sale' | 'customer' | 'stock';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  customer?: Customer;
  date: string;
  time: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Transfer';
  pointsEarned: number;
  status: 'Pembayaran Berhasil' | 'Gagal';
}
