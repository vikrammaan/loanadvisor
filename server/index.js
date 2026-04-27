const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Models
const Loan = require('./models/Loan');
const Chat = require('./models/Chat');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// OpenAI Configuration
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Nodemailer Setup (Using Ethereal for testing or console log if no creds)
let transporter;
nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error('Failed to create a testing account. ' + err.message);
  } else {
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- Routes ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FinAdvisor API is running' });
});

// Register API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

    if (user && !user.isVerified) {
      user.password = password;
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      user = await User.create({ 
        email, 
        password, 
        name: email.split('@')[0],
        otp,
        otpExpires,
        isVerified: false
      });
    }

    console.log(`\n\n--- OTP for ${email}: ${otp} ---\n\n`); // Log to console for easy testing

    if (transporter) {
      await transporter.sendMail({
        from: '"FinAdvisor" <noreply@finadvisor.com>',
        to: email,
        subject: "Your Registration OTP",
        text: `Your OTP is: ${otp}`,
      });
    }
    
    res.json({ message: 'OTP sent to email', requiresOTP: true, email });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

// Verify OTP API
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ token: 'mock_jwt_token', user: { id: user._id, name: user.name, email: user.email, twoFactorEnabled: user.twoFactorEnabled } });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Login API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    if (!user.isVerified) {
      return res.status(400).json({ error: 'Please complete registration first' });
    }

    if (user.twoFactorEnabled) {
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60000);
      await user.save();

      console.log(`\n\n--- 2FA OTP for ${email}: ${otp} ---\n\n`);

      if (transporter) {
        await transporter.sendMail({
          from: '"FinAdvisor" <noreply@finadvisor.com>',
          to: email,
          subject: "Your 2FA Login OTP",
          text: `Your login OTP is: ${otp}`,
        });
      }
      return res.json({ requiresOTP: true, email });
    }
    
    res.json({ token: 'mock_jwt_token', user: { id: user._id, name: user.name, email: user.email, twoFactorEnabled: user.twoFactorEnabled } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Toggle Settings API
app.post('/api/user/settings', async (req, res) => {
  try {
    const { email, twoFactorEnabled } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    
    if (twoFactorEnabled !== undefined) {
      user.twoFactorEnabled = twoFactorEnabled;
    }
    
    await user.save();
    res.json({ success: true, twoFactorEnabled: user.twoFactorEnabled });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Chatbot API
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;
    await Chat.create({ sessionId, role: 'user', content: message });
    let botResponse = "";

    if (openai) {
      const history = await Chat.find({ sessionId }).sort('createdAt').limit(10);
      const messages = history.map(h => ({ role: h.role, content: h.content }));
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: 'You are a helpful AI financial advisor.' }, ...messages],
        model: 'gpt-3.5-turbo',
      });
      botResponse = completion.choices[0].message.content;
    } else {
      botResponse = `This is a simulated response (OpenAI key not found). You said: "${message}".`;
    }

    await Chat.create({ sessionId, role: 'assistant', content: botResponse });
    res.json({ reply: botResponse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Loan Eligibility API
app.post('/api/eligibility', async (req, res) => {
  try {
    const { name, email, income, employmentStatus, requestedAmount, purpose } = req.body;
    const isEligible = income > (requestedAmount * 0.3);
    const approvedAmount = isEligible ? income * 3 : 0;
    const interestRate = isEligible ? 5.5 : null;

    const loanApp = new Loan({ name, email, income, employmentStatus, requestedAmount, purpose, isEligible, approvedAmount, interestRate });
    await loanApp.save();

    res.json({ eligible: isEligible, maxAmount: approvedAmount, rate: interestRate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process loan application' });
  }
});

// AI Recommendation API
app.post('/api/ai-recommendation', async (req, res) => {
  try {
    const { amount, purpose, providers } = req.body;
    let recommendation = "";

    if (openai) {
      const prompt = `You are an expert financial advisor. A user is looking for a loan of $${amount} for the purpose of "${purpose}". 
      Here are the available providers: ${JSON.stringify(providers)}. 
      Which provider is the absolute best match based on lowest interest rates and suitable limits? Respond with a short, 2-3 sentence recommendation explaining your choice.`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: prompt }],
        model: 'gpt-3.5-turbo',
      });
      recommendation = completion.choices[0].message.content;
    } else {
      // Mock AI response if no key is provided
      const bestProvider = providers.sort((a, b) => a.interestRate - b.interestRate)[0];
      recommendation = `(Simulated AI) Based on your need for $${amount}, I recommend ${bestProvider.name} because they offer the lowest starting interest rate of ${bestProvider.interestRate}%.`;
    }

    res.json({ recommendation });
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    res.status(500).json({ error: 'Failed to fetch recommendation' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
