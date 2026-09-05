let users = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@example.com"
  }
];

// GET /api/users
const getUsers = (req, res) => {
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
};

// GET /api/users/:id
const getUserById = (req, res) => {
  const id = Number(req.params.id);

  const user = users.find(user => user.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
};

// POST /api/users
const createUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required"
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: newUser
  });
};

export {
    getUsers,
    getUserById,
    createUser
};