const API_URL = "http://localhost:5000/api/tasks";

const getHeaders = () => {
  const token = localStorage.getItem("devdash_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Get all tasks
export const getTasks = async () => {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch tasks"
    );
  }

  return result;
};

// Create task
export const createTask = async (taskData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(taskData),
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
    `${API_URL}/${id}/status`,
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
        "Failed to delete task"
    );
  }

  return result;
};