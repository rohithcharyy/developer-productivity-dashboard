let projects = [
    {
        id: 1,
        name: "DevDash",
        description: "Developer Productivity Dashboard"
    }
];

// GET /api/projects
const getProjects = (req, res) => {
    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
    });
};

// GET /api/projects/:id
const getProjectById = (req, res) => {
    const id = Number(req.params.id);

    const project = projects.find(project => project.id === id);

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found"
        });
    }

    res.status(200).json({
        success: true,
        data: project
    });
};

// POST /api/projects
const createProject = (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Project name is required"
        });
    }

    const newProject = {
        id: projects.length + 1,
        name,
        description: description || ""
    };

    projects.push(newProject);

    res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: newProject
    });
};

export {
    getProjects,
    getProjectById,
    createProject
};