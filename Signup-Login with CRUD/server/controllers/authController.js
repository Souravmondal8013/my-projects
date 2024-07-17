const jwt=require('jsonwebtoken')
const bcryptjs=require('bcryptjs')
const User=require('../models/user')

const express=require('express')



exports.editProfile = async (req, res) => {
  
  const { username, email, password } = req.body;
  const image = req.file;
  console.log(image)
  try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's details
      if (username) user.name = username;
      if (password) user.password = await bcryptjs.hash(password, 10);
      if (image) user.photo = image.path;

      // Save the updated user to the database
      await user.save();
      res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteAccount=async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'fghjklihkuyjthgg798'); // Verify and decode JWT token
    const userEmail = decoded.email; // Extract email from decoded token

    // Find user by email and delete account
    const deletedUser = await User.findOneAndDelete({ email: userEmail });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Account deleted successfully', user: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

 
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const image=req.file
    
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("User Already Exists");
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcryptjs.hash(password, 10);
  
      // Create new user
      const user = new User({
        name:username,
        email,
        password: hashedPassword,
        photo:image?image.path:null
      });
  
      // Save user to the database
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return res.status(404).json({ message: 'User not found' });
        }

       
        const validPassword = await bcryptjs.compare(password, validUser.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Incorrect Password' });
        }

       
        const token = jwt.sign({ name: validUser.name,photo:validUser.photo,email:validUser.email}, 'fghjklihkuyjthgg798', { expiresIn: '1h' });

        
        return res.status(200).json({ message: 'success', token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};