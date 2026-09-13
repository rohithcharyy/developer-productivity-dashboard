import Task from "../models/Task.js";
import Project from "../models/Project.js";

// ---------------------------------------
// Update project statistics
// ---------------------------------------
const updateProjectStats = async (projectName) => {
  if (!projectName) {
    return;
  }

  const projectTasks = await Task.find({
    project: projectName,
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
    { name: projectName },
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
    const tasks = await Task.find();

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};


// ---------------------------------------
// GET /api/tasks/:id
// ---------------------------------------
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: error.message,
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

    if (!title || !project) {
      return res.status(400).json({
        success: false,
        message: "Title and project are required",
      });
    }

    const task = await Task.create({
      title,
      project,
      status,
      priority,
      dueDate,
    });

    // Update project statistics
    await updateProjectStats(project);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};


// ---------------------------------------
// PATCH /api/tasks/:id/status
// ---------------------------------------
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

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

    const task = await Task.findByIdAndUpdate(
      req.params.id,
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

    // Update project statistics
    await updateProjectStats(task.project);

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task status",
      error: error.message,
    });
  }
};


// ---------------------------------------
// DELETE /api/tasks/:id
// ---------------------------------------
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Update project statistics after deletion
    await updateProjectStats(task.project);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
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