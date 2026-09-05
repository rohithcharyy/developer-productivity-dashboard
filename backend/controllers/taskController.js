let tasks = [
    {
        id: 1,
        title: "Create User API",
        description: "Build and test user endpoints",
        status: "Completed",
        priority: "High",
        projectId: 1
    },
    {
        id: 2,
        title: "Create Projects API",
        description: "Build project creation and retrieval endpoints",
        status: "In Progress",
        priority: "High",
        projectId: 1
    }
];

// GET /api/tasks
const getTasks = (req, res) => {
    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
};

// GET /api/tasks/:id
const getTaskById = (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    res.status(200).json({
        success: true,
        data: task
    });
};

// POST /api/tasks
const createTask = (req, res) => {
    const {
        title,
        description,
        priority,
        projectId
    } = req.body;

    if (!title || !projectId) {
        return res.status(400).json({
            success: false,
            message: "Title and projectId are required"
        });
    }

    const newTask = {
        id: tasks.length + 1,
        title,
        description: description || "",
        status: "Pending",
        priority: priority || "Medium",
        projectId: Number(projectId)
    };

    tasks.push(newTask);

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: newTask
    });
};

// PATCH /api/tasks/:id/status
const updateTaskStatus = (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = [
        "Pending",
        "In Progress",
        "Completed"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status"
        });
    }

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    task.status = status;

    res.status(200).json({
        success: true,
        message: "Task status updated successfully",
        data: task
    });
};

export {
    getTasks,
    getTaskById,
    createTask,
    updateTaskStatus
};