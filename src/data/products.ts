// ============================================================================
// 2. data/products.ts
// ============================================================================
import { Product } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aura Mohair Cloud Cardigan',
    category: 'wearables',
    price: 240,
    rating: 4.9,
    reviewsCount: 38,
    tag: 'Lookbook Edition 01',
    modelHeight: "5'9\"",
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=900&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop',
    description: 'Chunky bubble stitches knitted using double-spun organic brushed mohair.',
    yarnType: '100% Ethiopian Highland Wool & Mohair',
    handcraftedHours: 24,
    colorway: ['#D4A373', '#EFEBE4', '#2C302E']
  },
  {
    id: 'prod-2',
    name: 'Heirloom Amigurumi "Saba"',
    category: 'dolls',
    price: 95,
    rating: 5.0,
    reviewsCount: 64,
    tag: 'Limited Artisan Drop',
    modelHeight: '14 Inches Tall',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=900&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1558882224-dda166733046?q=80&w=900&auto=format&fit=crop',
    description: 'Hypoallergenic weighted collector doll with custom hand-embroidered floral garments.',
    yarnType: 'Peruvian Pima Cotton Yarn',
    handcraftedHours: 16,
    colorway: ['#E78EA9', '#A3B19B', '#FDFBF7']
  },
  {
    id: 'prod-3',
    name: 'Woven Lattice Bucket Tote',
    category: 'accessories',
    price: 130,
    rating: 4.8,
    reviewsCount: 19,
    tag: 'Best Seller',
    modelHeight: 'Custom Strap Fit',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=900&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop',
    description: 'Architectural structural ribbing with reinforced vegetal tan leather base.',
    yarnType: 'Stiff Spun Raffia & Eco-Twine',
    handcraftedHours: 12,
    colorway: ['#D4A373', '#2C302E', '#C2B8A3']
  },
  {
    id: 'prod-4',
    name: 'Nordic Cable Turtleneck Sweater',
    category: 'wearables',
    price: 285,
    rating: 4.9,
    reviewsCount: 52,
    tag: 'Winter Runway',
    modelHeight: "6'1\"",
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=900&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop',
    description: 'Overlapping honeycomb cable patterns engineered for thermal retention and relaxed drape.',
    yarnType: 'Merino & Alpaca Blend',
    handcraftedHours: 32,
    colorway: ['#FDFBF7', '#2C302E', '#7E8D85']
  },
  {
    id: 'prod-5',
    name: 'Waffle-Weave Ottoman Throw',
    category: 'home',
    price: 180,
    rating: 4.7,
    reviewsCount: 22,
    tag: 'Home Essential',
    modelHeight: '60" x 75"',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=900&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=900&auto=format&fit=crop',
    description: 'Ultra-dense tactile honeycomb weave finished with handmade chunky fringe tassels.',
    yarnType: 'Organic Recycled Cotton Rope',
    handcraftedHours: 18,
    colorway: ['#EFEBE4', '#D4A373', '#A3B19B']
  }
];