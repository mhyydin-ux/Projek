import { Product, Customer, Activity, Transaction } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Kopi Susu Aren',
    sku: 'SKU-001',
    category: 'Minuman',
    price: 18000,
    stock: 45,
    status: 'Aktif',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2TeQjngRJBd6cFFa4vohHIAAAGN0-PU-I7zPO0FsdIhiA9jN517xoGfOmxcq1yo4ugx9Ap4pftjs7QLvsrOHJpwrryPx-t7oZVXbkQYJzzzxIzwrlG2pZzdMWXaYz-22hyy-d64vIvHao1DTYmSGCZMDRCkNgvLAL7ppKoXXrp8Dx36n4IQCjN5HIsYC4yr_1DMvyFaMfhrwwWgI6Of3NW2ucjfkYgkU2gmpnA6bRyq6LgA-wXaSQRik_-Nf6zOGIAQsIrwli6FU'
  },
  {
    id: 'prod-002',
    name: 'Roti Bakar Coklat',
    sku: 'SKU-002',
    category: 'Makanan',
    price: 25000,
    stock: 3,
    status: 'Stok Hampir Habis',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCl3TXmv9tljY9H1XQVT5VVaYzyXn0kQH3IJ6UJ4l4k2k87V4OhVt41Wh3bF9ztyB3pAuU-UH7BcjBmKZuUlZt6eCey3hM_BiYmzyYOt3MMflnV8-V0ynB2-l5l86SgDtl92bXJ9HIOSawN70SlX8nePjpkY4-6CdM4fSEV6zUuamCLhWmJA0cD-PHoPDdlIksz_MkaOATFOVPSv8LSii4HrZYaPIvTRrA5T0wr8xWsGg8Y9QHE9BxHXhrAKAjPjCZJDi705zKzyA'
  },
  {
    id: 'prod-003',
    name: 'Kopi Arabica Blend 250g',
    sku: 'SKU-003',
    category: 'Minuman',
    price: 85000,
    stock: 12,
    status: 'Aktif',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi7yAsJ_JjleGMI-ddmsCp9tojvhZ3fN_woeNSTbqiwqSxfmvElmFrGU4c97IHwR81oqCVyX1ClmYSL2Nwx7i1yQnom4ikpG91lykg57e9abtef8ph5PPleAkZdmg5JZDGzKlIBxSuEJjSnOajV2B8xJpdGVRxKPjT-Wd9OwTr9VmuoW1-KijioHCLn8V3EY2_2npgmOG5WsL4TewE8VQZEVe6YKFsuk5YOAji6sHku6b-p65iTj2wgwLWZi3iiWAlovYqfsuwbSc'
  },
  {
    id: 'prod-004',
    name: 'Croissant Butter Premium',
    sku: 'SKU-004',
    category: 'Makanan',
    price: 32000,
    stock: 8,
    status: 'Aktif',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDID6zc_rAGhL-hVpQhjXUqv8M4USKx0NjWkalpzLUTopXsM3YCrmeQgdQSwAW-QopTyUtmvSw8QL5ZQY2qQ-LzE011QzCXsTWNt0BhAEGlwhs465k9sUCMv_u5z2OotKO-JWCzivUSaKglwwK11V2px06UWAetDcBnGAIUP-0Z2Jn8KH-B2IRfzPq1PkpLFsOjaQq1cosye4ZDTFtShXpWcPQHgEz2y5faWtXwSicoYQHWDBntyTZK7_9b1ume6g0-_V0zf1ERmVw'
  },
  {
    id: 'prod-005',
    name: 'Keripik Kentang Pedas',
    sku: 'SKU-008',
    category: 'Makanan',
    price: 12000,
    stock: 0,
    status: 'Stok Habis'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    name: 'Budi Santoso',
    phone: '+62 812-3456-7890',
    tier: 'Platinum',
    points: 12450,
    joinedDate: '12 Jan 2022'
  },
  {
    id: 'cust-002',
    name: 'Siti Rahma',
    phone: '+62 899-1234-5678',
    tier: 'Gold',
    points: 4200,
    joinedDate: '05 Mar 2023'
  },
  {
    id: 'cust-003',
    name: 'Andi Wijaya',
    phone: '+62 811-9876-5432',
    tier: 'Silver',
    points: 850,
    joinedDate: '20 Agu 2023'
  },
  {
    id: 'cust-004',
    name: 'Dewi Lestari',
    phone: '+62 852-1122-3344',
    tier: 'Silver',
    points: 120,
    joinedDate: '02 Nov 2023'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Order #TRX-8821',
    description: 'Selesai • Rp 150.000',
    timeAgo: '2m lalu',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: 'sale'
  },
  {
    id: 'act-2',
    title: 'Member Baru',
    description: 'Siti Aminah bergabung',
    timeAgo: '15m lalu',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'customer'
  },
  {
    id: 'act-3',
    title: 'Order #TRX-8820',
    description: 'Selesai • Rp 320.000',
    timeAgo: '45m lalu',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    type: 'sale'
  },
  {
    id: 'act-4',
    title: 'Stok Menipis',
    description: 'Kopi Arabika (Sisa 2)',
    timeAgo: '1j lalu',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    type: 'stock'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    invoiceNumber: '#TRX-8821',
    customer: INITIAL_CUSTOMERS[0],
    date: '24 Okt 2023',
    time: '14:30',
    items: [
      { product: INITIAL_PRODUCTS[2], quantity: 2 },
      { product: INITIAL_PRODUCTS[3], quantity: 1 }
    ],
    subtotal: 202000,
    tax: 20200,
    discount: 0,
    total: 222200,
    paymentMethod: 'QRIS',
    pointsEarned: 20,
    status: 'Pembayaran Berhasil'
  }
];
