const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  tasks: [
    {
      taskid: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      duedate: {
        type: String,
        required: true,
      },
      priority: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      history: [
        {
          title_prev: String,
          description_prev: String,
          duedate_prev: String,
          priority_prev: String,
          status_prev: String,
          title_now: String,
          description_now: String,
          duedate_now: String,
          priority_now: String,
          status_now: String,
          updatedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
});

const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;
