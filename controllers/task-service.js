const auth = require('../middlewares/authentication');

function taskService(app, Models) {
  const { Task } = Models;
  app.post('/create', async function createProd(req, res) {
    const { title, status, priority, description, user, deadline } = req.body;
    console.log(req.body);
    if (!title || !status) {
      return res.status(400).json({ message: 'Please send required fields' });
    }
    try {
      const taskInstance = await Task.create({
        taskTitle: title,
        status,
        priority: priority || '',
        description: description || '',
        user,
        deadline
      });
      if (taskInstance) {
        return res.status(201).json({ _id: taskInstance._id, message: 'Task created' });
      } else {
        return res.status(404).json({ message: "Couldn't create task! Please try again" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
  app.delete('/delete', auth, async function deleteProd(req, res) {
    const { id, userId } = req.body;
    try {
      const deletedProd = await Task.findOneAndDelete({ user: userId, _id: id });
      if (deletedProd) {
        return res.status(200).json({ message: 'Task deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
  app.get('/all-tasks', async function getAllProd(req, res) {
    const { userId } = req.query;
    try {
      const taskInstance = await Task.find({ user: userId });
      console.log(taskInstance);
      const taskObj = taskInstance.reduce(
        (acc, task) => {
          if (task.status === 'toDo') {
            acc.toDo.push(task);
          } else if (task.status === 'underReview') {
            acc.underReview.push(task);
          } else if (task.status === 'inProgress') {
            acc.inProgress.push(task);
          } else if (task.status === 'finished') {
            acc.finished.push(task);
          }
          return acc;
        },
        { toDo: [], underReview: [], inProgress: [], finished: [] }
      );
      if (taskInstance) {
        return res.status(200).json({ taskObj });
      } else {
        return res.status(404).json({ message: `No task found for user: ${userId}` });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
  app.put('/update', auth, async function updateProd(req, res) {
    const { status, id, userId } = req.body;
    try {
      const taskInstance = await Task.findOneAndUpdate({ _id: id, user: userId }, { status });
      if (taskInstance) {
        res.status(200).json({ message: 'Task updated successfully' });
      } else {
        res.status(404).json({ message: 'Task not found!' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}

module.exports = taskService;
