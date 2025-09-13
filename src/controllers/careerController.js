const Career = require('../models/Careers');


const addCareer = async (req, res) => {
  const { title, description, domain, required_skills, education_path, expected_salary } = req.body;

  if ( !title || !description || !domain || !required_skills || !education_path || !expected_salary) {
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCareers = async (req, res) => {
  try {
    const careers = await Career.find();
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCareerById = async (req, res) => {
  try {
    const career = await Career.findOne({ career_id: req.params.id });
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }
    res.json(career);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCareer = async (req, res) => {
  try {
    const career = await Career.findOne({ career_id: req.params.id });
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }

    career.title = req.body.title || career.title;
    career.description = req.body.description || career.description;
    career.domain = req.body.domain || career.domain;
    career.required_skills = req.body.required_skills || career.required_skills;
    career.education_path = req.body.education_path || career.education_path;
    career.expected_salary = req.body.expected_salary || career.expected_salary;

    await career.save();
    res.json(career);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findOneAndDelete({ career_id: req.params.id });
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }
    res.json({ message: 'Career deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addCareer, getCareers, getCareerById, updateCareer, deleteCareer };