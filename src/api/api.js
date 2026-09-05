const API_URL = "http://localhost:5000/api";

export const getProjects = async () => {
    const response = await fetch(`${API_URL}/projects`);

    if (!response.ok) {
        throw new Error("Failed to fetch projects");
    }

    const result = await response.json();

    return result.data;
};

export const getTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`);

    if (!response.ok) {
        throw new Error("Failed to fetch tasks");
    }

    const result = await response.json();

    return result.data;
};

export const createProject = async (project) => {
    const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(project)
    });

    if (!response.ok) {
        throw new Error("Failed to create project");
    }

    const result = await response.json();

    return result.data;
};

export const createTask = async (task) => {
    const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error("Failed to create task");
    }

    const result = await response.json();

    return result.data;
};