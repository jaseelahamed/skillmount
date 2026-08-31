const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenHelper');


exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    
    const admin = await Admin.findOne({ username });
    if (admin) {
      const isMatch = await admin.comparePassword(password);
      if (isMatch) {
        const userData = { id: admin._id, username: admin.username, role: 'admin' };
        const accessToken = generateAccessToken(userData);
        const refreshToken = generateRefreshToken(userData);

        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000 
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.json({
          success: true,
          message: 'Admin logged in successfully',
          accessToken,
          refreshToken,
          role: 'admin',
          user: {
            id: admin._id,
            name: admin.name,
            username: admin.username
          }
        });
      }
    }

    const employee = await Employee.findOne({ username });
    if (employee) {
      if (employee.password === password) {
        const userData = { id: employee._id, username: employee.username, role: 'employee' };
        const accessToken = generateAccessToken(userData);
        const refreshToken = generateRefreshToken(userData);

        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000 
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
          success: true,
          message: 'Employee logged in successfully',
          accessToken,
          refreshToken,
          role: 'employee',
          user: {
            id: employee._id,
            name: employee.name,
            username: employee.username
          }
        });
      }
    }

    
    return res.status(401).json({ success: false, error: 'Invalid username or password' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'An error occurred during login' });
  }
};


exports.postRefresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ success: false, error: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
    

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error(error);
    res.status(403).json({ success: false, error: 'Invalid or expired refresh token' });
  }
};


exports.logout = (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ success: true, message: 'Logged out successfully' });
};
