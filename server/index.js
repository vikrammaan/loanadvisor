const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Models
const Loan = require(path.join(__dirname, 'models/Loan'));
const Chat = require(path.join(__dirname, 'models/Chat'));
const User = require(path.join(__dirname, 'models/User'));

// Connect to MongoDB
const dbUri = process.env.MONGODB_URI || 'mongodb+srv://maanvikram617_db_user:GJwaZm47.pj-hPi@cluster0.wfhvwat.mongodb.net/loanadvisor';
mongoose.connect(dbUri)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Manual update for user
    try {
      const user = await User.findOne({ email: 'maanvikram617@gmail.com' });
      if (user) {
        user.password = '12345678';
        user.isVerified = true;
        await user.save();
        console.log('Admin account password updated to 12345678');
      }
    } catch (e) {
      console.error('Failed to update admin password:', e);
    }
  })
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

const generateOTP = () => "123456";

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
        isVerified: false,
        role: email === 'maanvikram617@gmail.com' ? 'admin' : 'user'
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
    res.status(500).json({ error: 'Failed to register', details: error.message });
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

    const token = 'mock_jwt_token_' + Math.random().toString(36).substring(7);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, twoFactorEnabled: user.twoFactorEnabled, role: user.role } });
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

    if (user.email === 'maanvikram617@gmail.com' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
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
    
    const token = 'mock_jwt_token_' + Math.random().toString(36).substring(7);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, twoFactorEnabled: user.twoFactorEnabled, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Forgot Password API
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60000);
    await user.save();

    console.log(`\n\n--- Forgot Password OTP for ${email}: ${otp} ---\n\n`);
    
    if (transporter) {
      await transporter.sendMail({
        from: '"FinAdvisor" <noreply@finadvisor.com>',
        to: email,
        subject: "Password Reset OTP",
        text: `Your password reset OTP is: ${otp}`,
      });
    }

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process forgot password' });
  }
});

// Reset Password API
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password' });
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
      // Fallback: Use free public AI API (Pollinations text model) if no OpenAI key is set
      try {
        const prompt = `You are an AI financial advisor. Answer this: ${message}`;
        const response = await fetch(`https://text.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
        botResponse = await response.text();
      } catch (err) {
        console.error("Free AI API failed:", err);
        botResponse = `This is a simulated response (AI unavailable). You said: "${message}".`;
      }
    }

    await Chat.create({ sessionId, role: 'assistant', content: botResponse });
    res.json({ reply: botResponse });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Loan Eligibility API & Fraud Detection
app.post('/api/eligibility', async (req, res) => {
  try {
    const { name, email, income, employmentStatus, requestedAmount, purpose, documents } = req.body;
    
    // Fraud Detection Logic
    let fraudScore = 0;
    const fraudFlags = [];

    // Rule 1: Unusual Income Pattern
    if (requestedAmount > income * 15) {
      fraudScore += 40;
      fraudFlags.push('High risk: Requested amount exceeds 15x monthly income');
    }

    // Rule 2: Document Verification
    if (!documents || documents.length === 0) {
      fraudScore += 30;
      fraudFlags.push('Missing documents');
    } else {
      // Simulate fake document detection (random chance)
      if (Math.random() < 0.05) {
        fraudScore += 50;
        fraudFlags.push('Suspicious document detected by scanner');
      }
    }

    // Determine initial status based on fraud score
    let status = 'pending';
    let isEligible = true;
    
    if (fraudScore >= 70) {
      status = 'rejected';
      isEligible = false;
      fraudFlags.push('Auto-rejected due to high fraud score');
    } else if (income > (requestedAmount * 0.3)) {
      isEligible = true;
    } else {
      isEligible = false;
      status = 'rejected';
      fraudFlags.push('Failed basic eligibility criteria');
    }

    const approvedAmount = isEligible ? income * 3 : 0;
    const interestRate = isEligible ? 5.5 : null;

    const loanApp = new Loan({ 
      name, email, income, employmentStatus, requestedAmount, purpose, 
      isEligible, approvedAmount, interestRate, status, documents, fraudScore, fraudFlags 
    });
    await loanApp.save();

    res.json({ eligible: isEligible, maxAmount: approvedAmount, rate: interestRate, fraudScore, status, flags: fraudFlags });
  } catch (error) {
    console.error('Eligibility error:', error);
    res.status(500).json({ error: 'Failed to process loan application' });
  }
});

// Admin Routes
app.get('/api/admin/loans', async (req, res) => {
  try {
    const email = req.headers['x-admin-email'];
    const adminUser = await User.findOne({ email, role: 'admin' });
    
    if (!adminUser) {
      return res.status(403).json({ error: 'Unauthorized: Admin access only' });
    }

    const loans = await Loan.find().sort('-createdAt');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});

app.post('/api/admin/loans/:id', async (req, res) => {
  try {
    const email = req.headers['x-admin-email'];
    const adminUser = await User.findOne({ email, role: 'admin' });
    
    if (!adminUser) {
      return res.status(403).json({ error: 'Unauthorized: Admin access only' });
    }

    const { status, interestRate, approvedAmount } = req.body;
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    if (status) loan.status = status;
    if (interestRate !== undefined) loan.interestRate = interestRate;
    if (approvedAmount !== undefined) loan.approvedAmount = approvedAmount;
    
    await loan.save();
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update loan' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const email = req.headers['x-admin-email'];
    const adminUser = await User.findOne({ email, role: 'admin' });
    
    if (!adminUser) {
      return res.status(403).json({ error: 'Unauthorized: Admin access only' });
    }

    const users = await User.find().select('-password -otp').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
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

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
