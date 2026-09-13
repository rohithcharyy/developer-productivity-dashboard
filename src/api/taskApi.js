const API_URL = "http://localhost:5000/api/tasks";

// Get all tasks
export const getTasks = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
};

// Create a task
export const createTask = async (taskData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Create task backend error:", result);

    throw new Error(
      result.message ||
      result.error ||
      "Failed to create task"
    );
  }

  return result;
};

// Update task status
export const updateTaskStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update task status");
  }

  return response.json();
};

// Delete task
export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }

  return response.json();
};