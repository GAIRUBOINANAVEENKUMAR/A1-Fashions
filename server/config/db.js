const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed if database is empty
    await seedDatabase();
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Auto-seed function for in-memory mode
async function seedDatabase() {
  try {
    const User = require('../models/User');
    const Product = require('../models/Product');
    const Coupon = require('../models/Coupon');

    // Check if already seeded
    const count = await Product.countDocuments();
    if (count > 0) return;

    console.log('🌱 Auto-seeding database...');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@shopverse.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create demo user
    await User.create({
      name: 'Demo User',
      email: 'user@shopverse.com',
      password: 'user123',
      role: 'user',
    });

    // Sample products with high-quality Unsplash images — 3+ per category
    const sampleProducts = [
      // ── Electronics (6) ──
      { name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and Hi-Res Audio support. Perfect for travel and work.', price: 249.99, comparePrice: 349.99, category: 'Electronics', brand: 'SonicWave', stock: 45, featured: true, ratings: 4.7, numReviews: 128, tags: ['wireless', 'headphones', 'noise-cancelling'], images: [{ public_id: 'headphones_1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop' }] },
      { name: 'Smart Fitness Watch Pro', description: 'Advanced fitness tracker with GPS, heart rate monitor, blood oxygen sensor, sleep tracking, and 14-day battery life. Water-resistant to 50m.', price: 199.99, comparePrice: 279.99, category: 'Electronics', brand: 'FitTech', stock: 60, featured: true, ratings: 4.5, numReviews: 95, tags: ['smartwatch', 'fitness', 'gps'], images: [{ public_id: 'watch_1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop' }] },
      { name: 'Wireless Mechanical Keyboard', description: 'Compact 75% layout mechanical keyboard with hot-swappable switches, RGB per-key backlighting, Bluetooth 5.0 & USB-C connectivity.', price: 149.99, comparePrice: 199.99, category: 'Electronics', brand: 'KeyForge', stock: 35, featured: true, ratings: 4.8, numReviews: 67, tags: ['keyboard', 'mechanical', 'wireless'], images: [{ public_id: 'keyboard_1', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop' }] },
      { name: 'Ultra-Slim Laptop Stand', description: 'Ergonomic aluminum laptop stand with adjustable height and angle. Compatible with all laptops 10-17 inches. Improves posture and airflow.', price: 49.99, comparePrice: 69.99, category: 'Electronics', brand: 'DeskPro', stock: 120, featured: false, ratings: 4.3, numReviews: 42, tags: ['laptop', 'stand', 'ergonomic'], images: [{ public_id: 'stand_1', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop' }] },
      { name: 'Portable Bluetooth Speaker', description: 'Waterproof IPX7 portable speaker with 360° surround sound, 20-hour battery, and built-in microphone for hands-free calls.', price: 79.99, comparePrice: 119.99, category: 'Electronics', brand: 'SonicWave', stock: 80, featured: false, ratings: 4.4, numReviews: 56, tags: ['speaker', 'bluetooth', 'portable'], images: [{ public_id: 'speaker_1', url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop' }] },
      { name: 'USB-C Hub Multiport Adapter', description: '7-in-1 USB-C hub with HDMI 4K, 3 USB 3.0 ports, SD card reader, and 100W power delivery pass-through charging.', price: 39.99, comparePrice: 59.99, category: 'Electronics', brand: 'DeskPro', stock: 150, featured: false, ratings: 4.2, numReviews: 88, tags: ['usb-c', 'hub', 'adapter'], images: [{ public_id: 'usbhub_1', url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&h=600&fit=crop' }] },

      // ── Clothing (4) ──
      { name: 'Premium Cotton Hoodie — Midnight Black', description: 'Ultra-soft organic cotton hoodie with a relaxed fit, kangaroo pocket, and brushed fleece interior. Perfect for layering.', price: 79.99, comparePrice: 99.99, category: 'Clothing', brand: 'UrbanThread', stock: 80, featured: true, ratings: 4.6, numReviews: 112, tags: ['hoodie', 'cotton', 'casual'], images: [{ public_id: 'hoodie_1', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop' }] },
      { name: 'Slim Fit Denim Jeans', description: 'Classic slim-fit denim jeans made from premium Japanese selvedge denim. Medium wash with subtle fading. Comfortable stretch fabric.', price: 89.99, comparePrice: 129.99, category: 'Clothing', brand: 'UrbanThread', stock: 65, featured: false, ratings: 4.4, numReviews: 78, tags: ['jeans', 'denim', 'slim-fit'], images: [{ public_id: 'jeans_1', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop' }] },
      { name: 'Linen Summer Shirt — Sky Blue', description: 'Breathable pure linen shirt perfect for summer. Regular fit with mother-of-pearl buttons and a classic collar.', price: 59.99, comparePrice: 79.99, category: 'Clothing', brand: 'UrbanThread', stock: 90, featured: false, ratings: 4.3, numReviews: 45, tags: ['shirt', 'linen', 'summer'], images: [{ public_id: 'shirt_1', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop' }] },
      { name: 'Graphic Print T-Shirt Pack (3)', description: 'Set of 3 premium cotton graphic t-shirts with unique artistic prints. Relaxed fit, pre-shrunk fabric. Available in S-XXL.', price: 49.99, comparePrice: 74.99, category: 'Clothing', brand: 'UrbanThread', stock: 120, featured: false, ratings: 4.5, numReviews: 156, tags: ['tshirt', 'graphic', 'pack'], images: [{ public_id: 'tshirt_1', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop' }] },

      // ── Footwear (3) ──
      { name: 'Classic Leather Sneakers — White', description: 'Handcrafted leather sneakers with cushioned memory foam insole and flexible rubber outsole. Timeless minimalist design.', price: 129.99, comparePrice: 169.99, category: 'Footwear', brand: 'StepCraft', stock: 55, featured: true, ratings: 4.7, numReviews: 93, tags: ['sneakers', 'leather', 'white'], images: [{ public_id: 'sneakers_1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop' }] },
      { name: 'Running Shoes — Ultra Boost', description: 'High-performance running shoes with responsive cushioning, breathable mesh upper, and Continental rubber outsole for grip.', price: 159.99, comparePrice: 219.99, category: 'Footwear', brand: 'StepCraft', stock: 40, featured: true, ratings: 4.8, numReviews: 201, tags: ['running', 'shoes', 'sport'], images: [{ public_id: 'running_1', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop' }] },
      { name: 'Canvas Slip-On Loafers', description: 'Casual canvas slip-on shoes with elastic side accents, padded collar, and cushioned insole. Perfect for everyday wear.', price: 44.99, comparePrice: 64.99, category: 'Footwear', brand: 'StepCraft', stock: 100, featured: false, ratings: 4.1, numReviews: 34, tags: ['loafers', 'canvas', 'casual'], images: [{ public_id: 'loafer_1', url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop' }] },

      // ── Accessories (4) ──
      { name: 'Polarized Aviator Sunglasses', description: 'Classic aviator sunglasses with polarized lenses for 100% UV protection. Lightweight titanium frame with spring hinges.', price: 89.99, comparePrice: 129.99, category: 'Accessories', brand: 'VisionX', stock: 90, featured: true, ratings: 4.5, numReviews: 77, tags: ['sunglasses', 'aviator', 'polarized'], images: [{ public_id: 'sunglasses_1', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop' }] },
      { name: 'Leather Bifold Wallet', description: 'Full-grain genuine leather wallet with RFID blocking technology, 8 card slots, 2 bill compartments, and ID window.', price: 49.99, comparePrice: 79.99, category: 'Accessories', brand: 'LeatherCo', stock: 110, featured: false, ratings: 4.6, numReviews: 63, tags: ['wallet', 'leather', 'rfid'], images: [{ public_id: 'wallet_1', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop' }] },
      { name: 'Minimalist Analog Watch — Rose Gold', description: 'Elegant minimalist watch with Japanese quartz movement, sapphire crystal glass, genuine leather strap, and 5ATM water resistance.', price: 119.99, comparePrice: 179.99, category: 'Accessories', brand: 'TimeCraft', stock: 45, featured: true, ratings: 4.7, numReviews: 89, tags: ['watch', 'analog', 'minimalist'], images: [{ public_id: 'analogwatch_1', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop' }] },
      { name: 'Canvas Backpack — Vintage Brown', description: 'Durable waxed canvas backpack with genuine leather trim, padded 15" laptop compartment, and multiple organizer pockets.', price: 69.99, comparePrice: 99.99, category: 'Accessories', brand: 'TrekGear', stock: 70, featured: false, ratings: 4.4, numReviews: 52, tags: ['backpack', 'canvas', 'vintage'], images: [{ public_id: 'backpack_1', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop' }] },

      // ── Home & Kitchen (3) ──
      { name: 'Stainless Steel Water Bottle', description: 'Double-walled vacuum insulated bottle. Keeps drinks cold 24h or hot 12h. 750ml capacity, BPA-free, leak-proof lid.', price: 34.99, comparePrice: 44.99, category: 'Home & Kitchen', brand: 'HydroLife', stock: 200, featured: false, ratings: 4.5, numReviews: 134, tags: ['bottle', 'insulated', 'stainless'], images: [{ public_id: 'bottle_1', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop' }] },
      { name: 'Ceramic Pour-Over Coffee Set', description: 'Handcrafted ceramic pour-over dripper with matching mug and bamboo stand. Stainless steel mesh filter for rich, clean coffee.', price: 44.99, comparePrice: 64.99, category: 'Home & Kitchen', brand: 'BrewMaster', stock: 60, featured: false, ratings: 4.6, numReviews: 48, tags: ['coffee', 'pour-over', 'ceramic'], images: [{ public_id: 'coffee_1', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop' }] },
      { name: 'Smart LED Desk Lamp', description: 'Touch-control LED desk lamp with 5 color temperatures, 10 brightness levels, USB charging port, and 1-hour auto-off timer.', price: 54.99, comparePrice: 79.99, category: 'Home & Kitchen', brand: 'LumiPro', stock: 85, featured: false, ratings: 4.3, numReviews: 39, tags: ['lamp', 'led', 'smart'], images: [{ public_id: 'lamp_1', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=600&fit=crop' }] },

      // ── Beauty (3) ──
      { name: 'Organic Face Serum — Vitamin C', description: 'Brightening facial serum with 20% Vitamin C, Hyaluronic Acid, and Vitamin E. Reduces dark spots and boosts radiance.', price: 44.99, comparePrice: 64.99, category: 'Beauty', brand: 'GlowNaturals', stock: 100, featured: true, ratings: 4.6, numReviews: 187, tags: ['serum', 'vitamin-c', 'organic'], images: [{ public_id: 'serum_1', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop' }] },
      { name: 'Luxury Skincare Gift Set', description: '5-piece skincare set: cleanser, toner, serum, moisturizer, and eye cream. Made with natural botanicals. Vegan & cruelty-free.', price: 89.99, comparePrice: 129.99, category: 'Beauty', brand: 'GlowNaturals', stock: 50, featured: false, ratings: 4.7, numReviews: 64, tags: ['skincare', 'gift-set', 'luxury'], images: [{ public_id: 'skincare_1', url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop' }] },
      { name: 'Rose Gold Makeup Brush Set (12pc)', description: 'Professional 12-piece makeup brush set with synthetic vegan bristles. Includes face, eye, lip, and contour brushes with PU case.', price: 34.99, comparePrice: 54.99, category: 'Beauty', brand: 'GlamPro', stock: 130, featured: false, ratings: 4.4, numReviews: 92, tags: ['makeup', 'brushes', 'rose-gold'], images: [{ public_id: 'brushes_1', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop' }] },

      // ── Sports (3) ──
      { name: 'Yoga Mat — Premium Non-Slip', description: 'Extra thick 6mm yoga mat with alignment lines. Eco-friendly TPE material, non-slip texture on both sides. Includes carry strap.', price: 39.99, comparePrice: 59.99, category: 'Sports', brand: 'ZenFit', stock: 150, featured: false, ratings: 4.5, numReviews: 104, tags: ['yoga', 'mat', 'non-slip'], images: [{ public_id: 'yoga_1', url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop' }] },
      { name: 'Resistance Bands Set (5 Levels)', description: 'Set of 5 latex-free resistance bands from extra light to extra heavy. Includes door anchor, ankle straps, and carry bag.', price: 29.99, comparePrice: 44.99, category: 'Sports', brand: 'ZenFit', stock: 180, featured: false, ratings: 4.3, numReviews: 76, tags: ['resistance', 'bands', 'workout'], images: [{ public_id: 'bands_1', url: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop' }] },
      { name: 'Adjustable Dumbbell Set — 25kg', description: 'Space-saving adjustable dumbbell pair. Quick-change mechanism from 2.5kg to 25kg per hand. Replaces 15 pairs of dumbbells.', price: 199.99, comparePrice: 299.99, category: 'Sports', brand: 'IronLift', stock: 25, featured: true, ratings: 4.8, numReviews: 58, tags: ['dumbbell', 'adjustable', 'fitness'], images: [{ public_id: 'dumbbell_1', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop' }] },

      // ── Books (3) ──
      { name: 'The Midnight Library — Matt Haig', description: 'A dazzling novel about all the choices that go into a life well lived. Between life and death there is a library. NYT Bestseller.', price: 14.99, comparePrice: 24.99, category: 'Books', brand: 'Penguin', stock: 200, featured: false, ratings: 4.5, numReviews: 312, tags: ['fiction', 'bestseller', 'novel'], images: [{ public_id: 'book_1', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop' }] },
      { name: 'Atomic Habits — James Clear', description: 'An easy & proven way to build good habits & break bad ones. The #1 New York Times bestseller with over 10 million copies sold.', price: 16.99, comparePrice: 27.99, category: 'Books', brand: 'Penguin', stock: 175, featured: true, ratings: 4.9, numReviews: 450, tags: ['self-help', 'habits', 'bestseller'], images: [{ public_id: 'book_2', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop' }] },
      { name: 'Sapiens — Yuval Noah Harari', description: 'A Brief History of Humankind. Explores how biology and history have defined us and enhanced our understanding of what it means to be human.', price: 18.99, comparePrice: 29.99, category: 'Books', brand: 'Vintage', stock: 140, featured: false, ratings: 4.6, numReviews: 278, tags: ['non-fiction', 'history', 'humanity'], images: [{ public_id: 'book_3', url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=600&fit=crop' }] },

      // ── Toys (3) ──
      { name: 'Building Blocks Creative Set — 500 Pieces', description: 'Colorful building block set compatible with major brands. Includes wheels, doors, windows, and base plates. Ages 4+.', price: 29.99, comparePrice: 39.99, category: 'Toys', brand: 'BrickWorld', stock: 75, featured: false, ratings: 4.4, numReviews: 89, tags: ['building', 'blocks', 'creative'], images: [{ public_id: 'blocks_1', url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=600&fit=crop' }] },
      { name: 'Remote Control Racing Car', description: 'High-speed RC car with 2.4GHz remote, rechargeable battery, 30+ min runtime, and all-terrain rubber tires. Speed up to 25km/h.', price: 49.99, comparePrice: 69.99, category: 'Toys', brand: 'SpeedKids', stock: 60, featured: false, ratings: 4.3, numReviews: 47, tags: ['rc', 'car', 'racing'], images: [{ public_id: 'rccar_1', url: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&h=600&fit=crop' }] },
      { name: 'STEM Robotics Kit for Kids', description: 'Educational robot building kit with 200+ pieces. Program via app with drag-and-drop coding. 12 project guides included. Ages 8+.', price: 59.99, comparePrice: 89.99, category: 'Toys', brand: 'RoboKid', stock: 45, featured: false, ratings: 4.7, numReviews: 63, tags: ['stem', 'robotics', 'education'], images: [{ public_id: 'robot_1', url: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&h=600&fit=crop' }] },

      // ── Other (2) ──
      { name: 'Aromatherapy Essential Oil Diffuser', description: 'Ultrasonic cool mist diffuser with 7 LED color modes, auto shut-off, and 300ml water tank. Runs up to 10 hours.', price: 29.99, comparePrice: 49.99, category: 'Other', brand: 'ZenAroma', stock: 95, featured: false, ratings: 4.3, numReviews: 71, tags: ['diffuser', 'aromatherapy', 'essential-oil'], images: [{ public_id: 'diffuser_1', url: 'https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=600&h=600&fit=crop' }] },
      { name: 'Travel Organizer Bag Set (6 pcs)', description: 'Set of 6 packing cubes in various sizes. Lightweight, durable mesh top, wrinkle-resistant. Fits most carry-on suitcases.', price: 24.99, comparePrice: 39.99, category: 'Other', brand: 'TrekGear', stock: 130, featured: false, ratings: 4.5, numReviews: 94, tags: ['travel', 'organizer', 'packing'], images: [{ public_id: 'organizer_1', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop' }] },
    ].map((p) => ({ ...p, createdBy: admin._id }));

    await Product.insertMany(sampleProducts);

    // Create coupons
    await Coupon.insertMany([
      { code: 'WELCOME10', discount: 10, minPurchase: 50, maxDiscount: 20, expiresAt: new Date('2027-12-31'), isActive: true },
      { code: 'SAVE20', discount: 20, minPurchase: 100, maxDiscount: 50, expiresAt: new Date('2027-06-30'), isActive: true },
    ]);

    console.log('✅ Database seeded: 36 products, 2 users, 2 coupons');
    console.log('   Admin: admin@shopverse.com / admin123');
    console.log('   User:  user@shopverse.com / user123');
  } catch (err) {
    console.error('❌ Auto-seed error:', err.message);
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB error: ${err}`);
});

module.exports = connectDB;
