const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model');

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new UserModel({
            email,
            password: hashedPassword,
            name
        });

        await user.save();
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, email, name } });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, email, name: user.name } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

const generateGuestToken = () => {
  const guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
  const token = jwt.sign(
    {
      userId: guestId,
      isGuest: true,
      name: 'Guest User'
    },
    process.env.JWT_SECRET || 'Brijesh0707',
    { expiresIn: '24h' }
  );
  
  return { token, guestId };
};


const guestLogin = async (req, res) => {
  try {
    const { token, guestId } = generateGuestToken();
    
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: guestId,
        name: 'Guest User',
        isGuest: true,
        permissions: ['read_events']
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating guest session'
    });
  }
};




module.exports = { register, login,guestLogin };
