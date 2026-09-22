require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/infoverse';

async function testAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    const user = await User.findOne({
      email: 'admin@infoverse.com',
    }).select('+password');

    if (!user) {
      console.log('❌ Admin user NOT found');
      return;
    }

    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Password hash exists:', !!user.password);

    const match = await bcrypt.compare(
      'Admin@123456',
      user.password
    );

    console.log('Password match:', match);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
}

testAdmin();