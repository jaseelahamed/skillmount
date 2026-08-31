require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB().then(async () => {
  try {
    const adminExists = await Admin.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
    if (!adminExists) {
      const superAdmin = new Admin({
        name: process.env.ADMIN_NAME || 'Super Admin',
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'adminpassword123'
      });
      await superAdmin.save();
      console.log('Super Admin user seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding admin:', err.message);
  }
});

app.use(cors({
  origin: true, 
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', employeeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Employee Management System API' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});