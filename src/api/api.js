const API_URL = "http://localhost:5000/api";

// Get saved JWT token
const getToken = () => {
  return localStorage.getItem("devdash_token");
};

// Create authorization headers
const getHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// =========================================================
// PROJECT APIs
// =========================================================

// Get all projects
export const getProjects = async () => {
  const response = await fetch(`${API_URL}/projects`, {
    headers: getHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch projects"
    );
  }

  return result;
};

// Create project
export const createProject = async (project) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(project),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error(
      "Create project backend error:",
      result
    );

    throw new Error(
      result.message ||
        result.error ||
        "Failed to create project"
    );
  }

  return result;
};

// Update project
export const updateProject = async (id, project) => {
  const response = await fetch(
    `${API_URL}/projects/${id}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(project),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to update project"
    );
  }

  return result;
};

// Delete project
export const deleteProject = async (id) => {
  const response = await fetch(
    `${API_URL}/projects/${id}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to delete project"
    );
  }

  return result;
};

// =========================================================
// TASK APIs
// =========================================================

// Get all tasks
export const getTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: getHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch tasks"
    );
  }

  return result;
};

// Create task
export const createTask = async (task) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(task),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        result.error ||
        "Failed to create task"
    );
  }

  return result;
};

// Update task status
export const updateTaskStatus = async (
  id,
  status
) => {
  const response = await fetch(
    `${API_URL}/tasks/${id}/status`,
    {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({
        status,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to update task status"
    );
  }

  return result;
};

// Delete task
export const deleteTask = async (id) => {
  const response = await fetch(
    `${API_URL}/tasks/${id}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to delete task"
    );
  }

  return result;
};