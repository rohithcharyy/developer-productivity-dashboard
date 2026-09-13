const API_URL = "http://localhost:5000/api/projects";

// Get all projects
export const getProjects = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
};

// Create project
export const createProject = async (projectData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
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

// Update project
export const updateProject = async (id, projectData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  return response.json();
};

// Delete project
export const deleteProject = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }

  return response.json();
};