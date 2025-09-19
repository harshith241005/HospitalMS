import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, age, medicalHistory } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      specialization,
      age,
      medicalHistory: medicalHistory || []
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check if user exists (for Firebase integration)
export const checkUser = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email }).select('-password');
    if (user) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Check user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register Firebase user
export const registerFirebaseUser = async (req, res) => {
  try {
    const { name, email, role, firebaseUid, age, specialization } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user object based on role
    const userData = {
      name,
      email,
      password: firebaseUid, // Use Firebase UID as password placeholder
      role,
      firebaseUid,
      isActive: true
    };

    // Add role-specific fields
    if (role === 'patient' && age) {
      userData.age = age;
      userData.gender = 'Not specified'; // Default value
    } else if (role === 'doctor' && specialization) {
      userData.specialization = specialization;
      userData.experience = 1; // Default value
      userData.qualification = 'Not specified'; // Default value
      userData.consultationFee = 500; // Default value
    } else if (role === 'admin') {
      userData.employeeId = `EMP${Date.now()}`;
      userData.designation = 'Staff';
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Firebase registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
