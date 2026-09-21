const API_URL = "https://devdash-backend.onrender.com/api/projects";
const getHeaders = () => {
  const token = localStorage.getItem("devdash_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Get all projects
export const getProjects = async () => {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch projects"
    );
  }

  return result;
};

// Create project
export const createProject = async (projectData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(projectData),
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
export const updateProject = async (
  id,
  projectData
) => {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(projectData),
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
    `${API_URL}/${id}`,
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