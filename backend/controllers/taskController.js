import mongoose from "mongoose";
import Task from "../models/Task.js";
import Project from "../models/Project.js";

// ---------------------------------------
// Update project statistics
// ---------------------------------------
const updateProjectStats = async (projectName, userId) => {
  if (!projectName || !userId) {
    return;
  }

  const projectTasks = await Task.find({
    project: projectName,
    user: userId,
  }).lean();

  const totalTasks = projectTasks.length;

  const tasksCompleted = projectTasks.filter(
    (task) => task.status === "Done"
  ).length;

  const progress =
    totalTasks > 0
      ? Math.round((tasksCompleted / totalTasks) * 100)
      : 0;

  await Project.findOneAndUpdate(
    {
      name: projectName,
      user: userId,
    },
    {
      totalTasks,
      tasksCompleted,
      progress,
    }
  );
};

// ---------------------------------------
// GET /api/tasks
// ---------------------------------------
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Fetch tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

// ---------------------------------------
// GET /api/tasks/:id
// ---------------------------------------
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Fetch task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};

// ---------------------------------------
// POST /api/tasks
// ---------------------------------------
const createTask = async (req, res) => {
  try {
    const {
      title,
      project,
      status,
      priority,
      dueDate,
    } = req.body;

    if (!title?.trim() || !project?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and project are required",
      });
    }

    const task = await Task.create({
      user: req.user.id,
      title: title.trim(),
      project: project.trim(),
      status,
      priority,
      dueDate,
    });

    await updateProjectStats(
      task.project,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

// ---------------------------------------
// PATCH /api/tasks/:id/status
// ---------------------------------------
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const allowedStatuses = [
      "Todo",
      "In Progress",
      "Done",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      {
        status,
        completedAt:
          status === "Done"
            ? new Date().toISOString().split("T")[0]
            : null,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await updateProjectStats(
      task.project,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update task status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update task status",
    });
  }
};

// ---------------------------------------
// DELETE /api/tasks/:id
// ---------------------------------------
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await updateProjectStats(
      task.project,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};

export {
  getTasks,
  getTaskById,
  createTask,
  updateTaskStatus,
  deleteTask,
};