const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./connect-db');
const authController = require('./controllers/auth-service');
const taskController = require('./controllers/task-service');
const cors = require('cors');

//middlewares
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('pong');
});

try {
  async function start() {
    const { Models } = await connectDB();
    console.log('Connection successful with Database');
    authController(app, Models);
    taskController(app, Models);
    app.listen(process.env.PORT || 3000, console.log(`server listening on port:${process.env.PORT || 3000}`));
  }
  start();
} catch (error) {
  console.error('Sorry! Cannot start the server!', error);
}
