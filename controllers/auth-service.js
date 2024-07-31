const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function auth(app, Models) {
  const { User } = Models;
  app.post('/register', async function register(req, res) {
    const { name, emailId, password } = req.body;
    console.log(req.body);
    try {
      if (!emailId || !password || !name) {
        return res.status(401).json({ message: 'Please enter all the input fields.' });
      }
      const userInstance = await User.findOne({ emailId });
      if (userInstance) {
        return res.status(409).json({ message: `User with email ID: ${emailId} already exists.` });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        fullName: name,
        emailId,
        password: hashedPassword
      });

      if (!user) {
        res.status(424).json({ message: "Couldn't create a user" });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '24 h'
      });
      return res.status(201).json({ token: token, user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post('/login', async function login(req, res) {
    const { emailId, password } = req.body;
    try {
      if (!emailId || !password) {
        return res.status(401).json({ message: 'Please enter both Email and Password' });
      }
      const userInstance = await User.findOne({ emailId });
      if (!userInstance) {
        return res.status(404).json({ message: 'No user found!' });
      }
      const isPasswordCorrect = await bcrypt.compare(password, userInstance.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Wrong password!' });
      }

      const token = jwt.sign({ _id: userInstance._id }, process.env.JWT_SECRET, {
        expiresIn: '24 h'
      });
      const formattedUserInstance = userInstance.toObject();
      return res.status(200).json({ token, userInstance: formattedUserInstance });
    } catch (error) {
      return res.status(error.statusCode).json({ message: error.message });
    }
  });
}

module.exports = auth;
