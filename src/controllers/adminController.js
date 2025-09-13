const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const authAdmin = async (req, res) => {
  const { email, password } = req.body;

 
  const admin = await Admin.findOne({ email });

  if (admin && (await bcrypt.compare(password, admin.password_hash))) {
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '10d',
    });

    res.cookie('token', token, {
      httpOnly: true,
    });

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: "admin",
      token: token,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
const addCareerProfile = async (req, res) => {
  const { title, description, domain, required_skills, education_path, expected_salary } = req.body;

  if (!title || !description || !domain) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  try {
    const newCareer = await Career.create({
      title,
      description,
      domain,
      required_skills,
      education_path,
      expected_salary,
    });

    res.status(201).json(newCareer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
const createAdmin = async (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const newAdmin = await Admin.create({
      name,
      email,
      password_hash: password, 
    });

    if (newAdmin) {
      res.status(201).json({
        message: 'Admin created successfully',
        admin: {
          _id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { authAdmin, addCareerProfile, createAdmin };