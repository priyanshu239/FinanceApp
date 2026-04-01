const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

// Load env for database connection
dotenv.config({ path: path.join(__dirname, '.env') });

const recover = async () => {
    try {
        console.log('🔄 Attempting Admin Recovery...');
        await mongoose.connect(process.env.MONGODB_URI);
        
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const adminData = {
            name: 'Priyanshu Admin',
            email: 'admin@zorvyn.com',
            password: hashedPassword,
            role: 'admin',
            status: 'active'
        };

        // Upsert the admin user
        const admin = await User.findOneAndUpdate(
            { email: adminData.email },
            adminData,
            { upsert: true, new: true, runValidators: false }
        );

        console.log('✅ Admin Account Recovered Successfully!');
        console.log(`📧 Email: ${admin.email}`);
        console.log('🔑 Password: password123');
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Recovery Failed:', err.message);
        process.exit(1);
    }
};

recover();
