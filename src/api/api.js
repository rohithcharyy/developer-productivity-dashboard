const API_URL = "https://devdash-backend.onrender.com/api";

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

export const createProject = async (project) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(project),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Create project backend error:", result);

    throw new Error(
      result.message ||
        result.error ||
        "Failed to create project"
    );
  }

  return result;
};

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
      result.message || "Failed to update project"
    );
  }

  return result;
};

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
      result.message || "Failed to delete project"
    );
  }

  return result;
};

// =========================================================
// TASK APIs
// =========================================================

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

export const updateTaskStatus = async (id, status) => {
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
      result.message || "Failed to update task status"
    );
  }

  return result;
};

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
      result.message || "Failed to delete task"
    );
  }

  return result;
};