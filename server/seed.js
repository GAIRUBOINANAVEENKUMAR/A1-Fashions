// Seed script — populate ShopVerse with sample data
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

dotenv.config();

const sampleProducts = [
    {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and Hi-Res Audio. Features memory foam earcups and foldable design for easy portability.',
        price: 249.99,
        comparePrice: 349.99,
        category: 'Electronics',
        brand: 'SonicWave',
        stock: 45,
        featured: true,
        images: [{ public_id: 'headphones_1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' }],
    },
    {
        name: 'Smart Fitness Watch Pro',
        description: 'Advanced fitness tracker with GPS, heart rate monitor, blood oxygen sensor, sleep tracking, and 14-day battery life. Water-resistant to 50m.',
        price: 199.99,
        comparePrice: 279.99,
        category: 'Electronics',
        brand: 'FitTech',
        stock: 60,
        featured: true,
        images: [{ public_id: 'watch_1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' }],
    },
    {
        name: 'Ultra-Slim Laptop Stand',
        description: 'Ergonomic aluminum laptop stand with adjustable height and angle. Compatible with all laptops 10-17 inches. Improves posture and airflow.',
        price: 49.99,
        comparePrice: 69.99,
        category: 'Electronics',
        brand: 'DeskPro',
        stock: 120,
        featured: false,
        images: [{ public_id: 'stand_1', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600' }],
    },
    {
        name: 'Premium Cotton Hoodie — Midnight Black',
        description: 'Ultra-soft organic cotton hoodie with a relaxed fit. Features kangaroo pocket, ribbed cuffs, and a brushed fleece interior for maximum comfort.',
        price: 79.99,
        comparePrice: 99.99,
        category: 'Clothing',
        brand: 'UrbanThread',
        stock: 80,
        featured: true,
        images: [{ public_id: 'hoodie_1', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600' }],
    },
    {
        name: 'Classic Leather Sneakers',
        description: 'Handcrafted leather sneakers with cushioned insole and flexible rubber outsole. Minimalist design that pairs with any outfit.',
        price: 129.99,
        comparePrice: 169.99,
        category: 'Footwear',
        brand: 'StepCraft',
        stock: 55,
        featured: true,
        images: [{ public_id: 'sneakers_1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' }],
    },
    {
        name: 'Polarized Aviator Sunglasses',
        description: 'Classic aviator sunglasses with polarized lenses for 100% UV protection. Lightweight titanium frame with adjustable nose pads.',
        price: 89.99,
        comparePrice: 129.99,
        category: 'Accessories',
        brand: 'VisionX',
        stock: 90,
        featured: true,
        images: [{ public_id: 'sunglasses_1', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600' }],
    },
    {
        name: 'Stainless Steel Water Bottle',
        description: 'Double-walled vacuum insulated bottle that keeps drinks cold for 24h or hot for 12h. BPA-free, leak-proof lid, 750ml capacity.',
        price: 34.99,
        comparePrice: 44.99,
        category: 'Home & Kitchen',
        brand: 'HydroLife',
        stock: 200,
        featured: false,
        images: [{ public_id: 'bottle_1', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600' }],
    },
    {
        name: 'Wireless Mechanical Keyboard',
        description: 'Compact 75% layout mechanical keyboard with hot-swappable switches, RGB backlighting, Bluetooth 5.0, and USB-C charging. Tactile typing experience.',
        price: 149.99,
        comparePrice: 199.99,
        category: 'Electronics',
        brand: 'KeyForge',
        stock: 35,
        featured: true,
        images: [{ public_id: 'keyboard_1', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600' }],
    },
    {
        name: 'Yoga Mat — Premium Non-Slip',
        description: 'Extra thick 6mm yoga mat with alignment lines. Made from eco-friendly TPE material. Non-slip surface on both sides. Includes carry strap.',
        price: 39.99,
        comparePrice: 59.99,
        category: 'Sports',
        brand: 'ZenFit',
        stock: 150,
        featured: false,
        images: [{ public_id: 'yoga_1', url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600' }],
    },
    {
        name: 'Organic Face Serum — Vitamin C',
        description: 'Brightening facial serum with 20% Vitamin C, Hyaluronic Acid, and Vitamin E. Reduces dark spots and fine lines. Suitable for all skin types.',
        price: 44.99,
        comparePrice: 64.99,
        category: 'Beauty',
        brand: 'GlowNaturals',
        stock: 100,
        featured: true,
        images: [{ public_id: 'serum_1', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600' }],
    },
    {
        name: 'Building Blocks Creative Set — 500 Pieces',
        description: 'Colorful building block set compatible with major brands. Includes wheels, doors, windows, and base plates. Perfect for ages 4+.',
        price: 29.99,
        comparePrice: 39.99,
        category: 'Toys',
        brand: 'BrickWorld',
        stock: 75,
        featured: false,
        images: [{ public_id: 'blocks_1', url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600' }],
    },
    {
        name: 'Bestselling Novel — "The Midnight Library"',
        description: 'A dazzling novel about all the choices that go into a life well lived. Between life and death there is a library with infinite books, each telling a story of another reality.',
        price: 14.99,
        comparePrice: 24.99,
        category: 'Books',
        brand: 'Penguin',
        stock: 200,
        featured: false,
        images: [{ public_id: 'book_1', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600' }],
    },
];

const sampleCoupons = [
    { code: 'WELCOME10', discount: 10, minPurchase: 50, maxDiscount: 20, expiresAt: new Date('2027-12-31'), isActive: true },
    { code: 'SAVE20', discount: 20, minPurchase: 100, maxDiscount: 50, expiresAt: new Date('2027-06-30'), isActive: true },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Coupon.deleteMany();

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

        // Create products
        const products = sampleProducts.map((p) => ({ ...p, createdBy: admin._id }));
        await Product.insertMany(products);

        // Create coupons
        await Coupon.insertMany(sampleCoupons);

        console.log('✅ Database seeded successfully!');
        console.log('   Admin: admin@shopverse.com / admin123');
        console.log('   User:  user@shopverse.com / user123');
        console.log('   Coupons: WELCOME10, SAVE20');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedDB();
