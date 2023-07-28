const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
const { v4: uuid } = require("uuid");

require("../db/connect");
const User = require("../model/userSchema");
const Task = require("../model/taskSchema");

// home route
router.get("/", (req, res) => {
  res.send("Hello World from the router server");
});

// register route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
      return res.status(422).json({ error: "You're missing some fields" });
    }

    const userEmailExist = await User.findOne({ email: email });

    if (userEmailExist) {
      res.status(409).json({ error: "Email already Exists" });
    } else if (password != cpassword) {
      res.status(400).json({ error: "Passwords are not matching" });
    } else {
      const user = new User({ name, email, password });
      await user.save();
      res.status(200).json({ message: "User Registered Successfully" });

      const newTask = new Task({
        email,
        tasks: [],
      });
      await newTask.save();
      console.log("yayyy");
    }
  } catch (err) {
    console.log(err);
  }
});

// login route
router.post("/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "You're missing some fields" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        token = await userLogin.generateAuthToken();

        res
          .status(200)
          .json({ token: token, message: "User Logged in Successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

// userdata getter route
router.get("/userdata", authenticate, async (req, res) => {
  try {
    res.send(req.userdata);
  } catch (err) {
    console.error(err);
  }
});

// task adder route
router.post("/addtask", authenticate, async (req, res) => {
  try {
    const { email } = req.query;
    const { title, description, duedate, priority, status } = req.body;
    if (!email || !title || !description || !duedate || !priority || !status) {
      return res.status(422).json({ error: "You're missing some fields" });
    }

    const taskid = uuid().replace(/-/g, "");
    const task = {
      taskid,
      title,
      description,
      duedate,
      priority,
      status,
    };

    const existingEmail = await Task.findOne({ email });
    if (existingEmail) {
      existingEmail.tasks.push(task);
      await existingEmail.save();
    } else {
      const newTask = new Task({
        email,
        tasks: [task],
      });
      await newTask.save();
    }

    res.status(200).json({ message: "Task Added Successfully" });
  } catch (err) {
    console.log(err);
  }
});

// edit task route
router.patch("/edit/:taskId", async (req, res) => {
  try {
    const { email } = req.query;
    const { title, description, duedate, priority, status } = req.body;

    const tid = req.params.taskId;
    const existingEmail = await Task.findOne({ email });

    const taskToEdit = existingEmail.tasks.find(
      (i) => i.taskid.toString() === tid
    );

    if (!taskToEdit) {
      return res.status(404).json({ error: "Task not found" });
    }

    const historyEntry = {
      title_prev: taskToEdit.title,
      description_prev: taskToEdit.description,
      duedate_prev: taskToEdit.duedate,
      priority_prev: taskToEdit.priority,
      status_prev: taskToEdit.status,
      title_now: title,
      description_now: description,
      duedate_now: duedate,
      priority_now: priority,
      status_now: status,
    };

    taskToEdit.title = title;
    taskToEdit.description = description;
    taskToEdit.duedate = duedate;
    taskToEdit.priority = priority;
    taskToEdit.status = status;

    taskToEdit.history.push(historyEntry);
    await existingEmail.save();

    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.log(err);
  }
});

// delete task route
router.delete("/delete/:taskId", authenticate, async (req, res) => {
  try {
    const { email } = req.query;

    const tid = req.params.taskId;
    const existingEmail = await Task.findOne({ email });
    const taskToDel = existingEmail.tasks.find(
      (i) => i.taskid.toString() === tid
    );

    existingEmail.tasks.pull(taskToDel._id);
    await existingEmail.save();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// view task list route
router.get("/mytasks", authenticate, async (req, res) => {
  try {
    const { email } = req.query;
    const existingEmail = await Task.findOne({ email });
    res.send(existingEmail.tasks);
  } catch (err) {
    console.log(err);
  }
});

// view task details route
router.get("/viewtask/:taskId", authenticate, async (req, res) => {
  try {
    const { email } = req.query;

    const tid = req.params.taskId;
    const existingEmail = await Task.findOne({ email });

    const taskToView = existingEmail.tasks.find(
      (i) => i.taskid.toString() === tid
    );

    res.send(taskToView);
  } catch (err) {
    console.log(err);
  }
});

// view history route
router.get("/viewhistory/:taskId", authenticate, async (req, res) => {
  try {
    const { email } = req.query;

    const tid = req.params.taskId;
    const existingEmail = await Task.findOne({ email });

    const locatingTask = existingEmail.tasks.find(
      (i) => i.taskid.toString() === tid
    );

    res.send(locatingTask.history);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
