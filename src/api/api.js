const API_URL = "http://localhost:5000/api";

// --------------------------------
// PROJECT APIs
// --------------------------------

export const getProjects = async () => {
  const response = await fetch(`${API_URL}/projects`);

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const result = await response.json();

  return result;
};


export const createProject = async (project) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  const result = await response.json();

  return result;
};


export const updateProject = async (id, project) => {
  const response = await fetch(
    `${API_URL}/projects/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  const result = await response.json();

  return result;
};


export const deleteProject = async (id) => {
  const response = await fetch(
    `${API_URL}/projects/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }

  const result = await response.json();

  return result;
};


// --------------------------------
// TASK APIs
// --------------------------------

export const getTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const result = await response.json();

  return result;
};


export const createTask = async (task) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  const result = await response.json();

  return result;
};


export const updateTaskStatus = async (id, status) => {
  const response = await fetch(
    `${API_URL}/tasks/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update task status");
  }

  const result = await response.json();

  return result;
};


export const deleteTask = async (id) => {
  const response = await fetch(
    `${API_URL}/tasks/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }

  const result = await response.json();

  return result;
};