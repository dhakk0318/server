const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const AdminRole = require("../../Model/Admin/AdminRole");
const {
  getUserByUser,
  createUser,
  assignRolesToUser,
  getUserById,
  getUserRoles,
  updateUserById,
  fetchAllUsers,
  removeRolesFromUser
} = require("../../Model/Admin/AdminUserRegistration");


exports.createRole = (req, res, next) => {
  const { role_id, role_name } = req.body;
  AdminRole.create({ role_id, role_name }, (err, result) => {
    if (err)
      return next(createError(500, "Role creation failed", { details: err }));
    res.status(201).json({ message: "Role created successfully", roleId: result.insertId });
  });
};

exports.getAllRoles = (req, res, next) => {
  AdminRole.getAll((err, results) => {
    if (err)
      return next(createError(500, "Failed to retrieve roles", { details: err }));
    res.status(200).json(results);
  });
};

exports.getRoleById = (req, res, next) => {
  const roleId = req.params.role_id;
  AdminRole.getById(roleId, (err, results) => {
    if (err)
      return next(createError(500, "Error fetching role", { details: err }));
    if (results.length === 0) return next(createError(404, "Role not found"));
    res.status(200).json(results[0]);
  });
};

exports.updateRole = (req, res, next) => {
  const { role_id } = req.params;
  const { role_name } = req.body;
  AdminRole.update(role_id, { role_name }, (err, result) => {
    if (err) return next(createError(500, "Update failed", { details: err }));
    if (result.affectedRows === 0) return next(createError(404, "Role not found"));
    res.status(200).json({ message: "Role updated successfully" });
  });
};

exports.deleteRole = (req, res, next) => {
  const { role_id } = req.params;
  AdminRole.delete(role_id, (err, result) => {
    if (err) return next(createError(500, "Deletion failed", { details: err }));
    if (result.affectedRows === 0) return next(createError(404, "Role not found"));
    res.status(200).json({ message: "Role deleted successfully" });
  });
};


exports.signup = async (req, res, next) => {
  const { user_id, user_name, password, status } = req.body;

  try {
    const existingUser = await getUserByUser(user_name);
    if (existingUser) {
      return next(createError(400, "Username already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user without assigning roles
    await createUser(user_id, user_name, hashedPassword, status);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return next(createError(500, err.message));
  }
};



exports.updateUserDetails = async (req, res, next) => {
  const userId = req.params.userId;
  const { user_name, password, status } = req.body;

  try {
   
    const updates = {};

    
    if (user_name !== undefined) {
      updates.user_name = user_name;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

   
    if (status !== undefined) {
      updates.status = status;
    }

    
    if (Object.keys(updates).length > 0) {
      await updateUserById(userId, updates);
    }

    return res.status(200).json({ message: "User details updated successfully" });
  } catch (err) {
    return next(createError(500, err.message));
  }
};

 
exports.signup = async (req, res, next) => {
  const { user_id, user_name, password, status } = req.body;

  try {
    const existingUser = await getUserByUser(user_name);
    if (existingUser) {
      return next(createError(400, "Username already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await createUser(user_id, user_name, hashedPassword, status);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return next(createError(500, err.message));
  }
};

exports.login = async (req, res, next) => {
  const { user_name, password } = req.body;

  
  if (!user_name || !password) {
    return next(createError(400, "Username and password are required"));
  }

  try {
    // Fetch user from the database 
    const user = await getUserByUser(user_name);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createError(401, "Invalid credentials"));
    }

    // Fetch user roles
    const roles = await getUserRoles(user.user_id);

    // Generate access token with roles
    const accessToken = jwt.sign(
      { userId: user.user_id, roles },
      process.env.JWT_SECRET_KEY || "jwt-secret-key",
      { expiresIn: "15m" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_REFRESH_SECRET || "refresh-secret-key",
      { expiresIn: "7d" }
    );

    // Set the tokens in cookies and respond
    return res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true for HTTPS in production
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true for HTTPS in production
        sameSite: 'None',
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .status(200)
      .json({
        message: "Login successful",
        accessToken,  // Return access token in the response
        refreshToken, // Optionally return refresh token
        user: {
          user_id: user.user_id,
          roles,
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    return next(createError(500, "Internal server error"));
  }
};


// Refresh Token Function
exports.refreshToken = (req, res, next) => {
  const refreshToken = req.cookies["refresh_token"];

  if (!refreshToken) {
    return next(createError(401, "Access Denied. No refresh token provided."));
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "refresh-secret-key"
    );
    const accessToken = jwt.sign(
      { userId: decoded.userId, roles: decoded.roles },
      process.env.JWT_SECRET_KEY || "jwt-secret-key",
      { expiresIn: "55m" }
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true for HTTPS in production
      sameSite: 'None',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    return res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    return next(createError(400, err.message));
  }
};


exports.logout = (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  return res.status(200).json({ message: "Logout successful" });
};


 

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    return next(createError(500, err.message));
  }
};

exports.getUserDetailsWithRoles = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const roles = await getUserRoles(userId);

    return res.status(200).json({
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        roles,
      },
    });
  } catch (err) {
    return next(createError(500, err.message));
  }
};

exports.updateUserRoles = async (req, res) => {
  const userId = req.params.userId; 
  const rolesToAssign = req.body.addRoles || []; 
  const rolesToRemove = req.body.removeRoles || []; 

  try {
     
      await removeRolesFromUser(userId, rolesToRemove);

      
      await assignRolesToUser(userId, rolesToAssign);

      return res.status(200).json({ message: "Roles updated successfully." });
  } catch (error) {
      console.error("Error updating user roles:", error);
      return res.status(500).json({ message: "Failed to update user roles.", error });
  }
};
