'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const Cart = require('../src/models/Cart');

const sampleProducts = [
  {
    title: 'Organic Heirloom Tomatoes',
    category: 'produce',
    price: 4.99,
    description: 'Vine-ripened heritage tomatoes grown pesticide-free in mineral-rich soil. Bursting with sweet, rich, old-fashioned tomato flavor. Perfect for caprese salads, fresh bruschetta, or homemade roasted pasta sauce.',
    origin: 'Valley Crest Family Farms, Sonoma',
    unit: '1 lb bag (~3 tomatoes)',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    featured: true,
    isOrganic: true,
    badge: 'Fresh Harvest',
  },
  {
    title: 'Artisan Country Sourdough Loaf',
    category: 'bakery',
    price: 6.50,
    description: 'Naturally leavened over 36 hours using an 8-year-old sourdough mother. Features a blistered, caramelized crust with an airy, custard-like crumb and a mild sour tang.',
    origin: 'Wild Yeast Hearth Breads, Mill Valley',
    unit: '650g boule',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
    featured: true,
    isOrganic: true,
    badge: 'Daily Bake',
  },
  {
    title: 'Grass-Fed Whole Milk',
    category: 'dairy',
    price: 4.89,
    description: 'Non-homogenized, vat-pasteurized cream-top milk from 100% pasture-raised Jersey cows. Rich, sweet, and velvety texture packed with Omega-3 fatty acids and natural vitamins.',
    origin: 'Meadowview Dairy Collective',
    unit: 'Half Gallon (64 fl oz)',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    featured: false,
    isOrganic: true,
    badge: 'Non-GMO',
  },
  {
    title: 'Raw Mountain Wildflower Honey',
    category: 'pantry',
    price: 11.99,
    description: 'Pure, unpasteurized, unfiltered honey harvested from high-elevation wildflower meadows. Retains all natural pollen, enzymes, and delicate floral nectar notes.',
    origin: 'Highland Apiaries, Cascade Foothills',
    unit: '16 oz glass jar',
    stock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    featured: true,
    isOrganic: true,
    badge: 'Staff Pick',
  },
  {
    title: 'Crisp Honeycrisp Apples',
    category: 'produce',
    price: 3.49,
    description: 'Hand-picked crisp apples with a signature honey-sweet flavor and balanced acidity. Exceptionally juicy with a crisp snap in every bite. Ideal for snacking or baking tarts.',
    origin: 'Oakridge Family Orchards, Hood River',
    unit: 'Per lb (~2 apples)',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    featured: false,
    isOrganic: true,
    badge: '',
  },
  {
    title: 'Cold-Pressed Extra Virgin Olive Oil',
    category: 'pantry',
    price: 18.50,
    description: 'First cold-extraction of estate-grown Mission and Arbequina olives within 4 hours of harvesting. Vibrant green color with hints of fresh cut grass, green artichoke, and a peppery finish.',
    origin: 'Canyon Creek Groves, Dry Creek Valley',
    unit: '750 ml bottle',
    stock: 9,
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    featured: true,
    isOrganic: true,
    badge: 'Award Winner',
  },
  {
    title: 'Aged Farmhouse White Cheddar',
    category: 'dairy',
    price: 8.50,
    description: 'Cave-aged for 18 months in small wooden rinds. Dense, crumbly texture dotted with crunchy tyrosine crystals. Sharp, buttery, and deeply savory flavor profile.',
    origin: 'Pine Ridge Creamery, Coastal Range',
    unit: '8 oz block',
    stock: 4, // Low stock test item
    imageUrl: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=800&q=80',
    featured: false,
    isOrganic: false,
    badge: 'Only 4 Left',
  },
  {
    title: 'Flaky French Butter Croissants',
    category: 'bakery',
    price: 7.99,
    description: 'Classic Viennoiserie laminated with 84% butterfat European cultured butter. Baked fresh every morning to a golden crisp honeycomb texture with tender flaky layers.',
    origin: 'Artisan Bakehouse, Downtown',
    unit: 'Pack of 4',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    featured: false,
    isOrganic: false,
    badge: 'Fresh Daily',
  },
  {
    title: 'Organic Baby Tuscan Kale',
    category: 'produce',
    price: 2.99,
    description: 'Tender dark-green Lacinato dinosaur kale leaves harvested young for sweet flavor and delicate texture. Wonderful in raw massaged salads, green smoothies, or braised with garlic.',
    origin: 'Green River Organics, Delta Flats',
    unit: '1 Bunch (approx 250g)',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6fa57?auto=format&fit=crop&w=800&q=80',
    featured: false,
    isOrganic: true,
    badge: '',
  },
  {
    title: 'Nitro Cold Brew Coffee',
    category: 'beverages',
    price: 4.50,
    description: 'Slow-steeped for 20 hours using washed Ethiopian Yirgacheffe beans. Infused with nitrogen for a creamy head, velvety mouthfeel, and notes of blueberry, cocoa, and jasmine.',
    origin: 'Peak Artisan Roasters, West End',
    unit: '12 fl oz can',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    featured: true,
    isOrganic: true,
    badge: 'Popular',
  },
  {
    title: 'Small-Batch Spiced Apple Cider',
    category: 'beverages',
    price: 6.99,
    description: 'Unfiltered, non-alcoholic cider pressed from 5 heritage apple varieties, lightly spiced with Ceylon cinnamon, clove, and whole allspice berries. Serve warm or chilled.',
    origin: 'Misty Hollow Orchards',
    unit: '750 ml bottle',
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80',
    featured: false,
    isOrganic: true,
    badge: 'Seasonal',
  },
  {
    title: 'Seeded Multigrain Sourdough Batard',
    category: 'bakery',
    price: 6.25,
    description: 'Nutty, hearty loaf packed with toasted pumpkin seeds, golden flax, chia seeds, and sunflower kernels inside a slow-fermented whole wheat sourdough base.',
    origin: 'Wild Yeast Hearth Breads, Mill Valley',
    unit: '500g batard',
    stock: 0, // OUT OF STOCK TEST ITEM
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    featured: false,
    isOrganic: true,
    badge: 'Sold Out Today',
  },
];

const seedDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/local_store_db';
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('[Seed] Connected successfully.');

    // Clear existing products and carts
    console.log('[Seed] Clearing existing collections...');
    await Product.deleteMany({});
    await Cart.deleteMany({});

    // Insert new sample products
    console.log('[Seed] Inserting sample artisanal local store items...');
    const created = await Product.insertMany(sampleProducts);
    console.log(`[Seed] ✅ Successfully seeded ${created.length} products!`);

    console.log('\n--- Seeded Catalog Summary ---');
    created.forEach((p) => {
      console.log(` • [${p.category.toUpperCase()}] ${p.title} - $${p.price.toFixed(2)} (Stock: ${p.stock})`);
    });

    console.log('\n[Seed] Complete. Exiting...');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err.message);
    process.exit(1);
  }
};

seedDB();
