const db = require("../../Config/db");

const getUserByUser = (user_name) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM tbl_admin_user_registration WHERE user_name = ?";
    db.query(query, [user_name], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

const createUser = (user_id, user_name, password, status) => {
  return new Promise((resolve, reject) => {
    const query = `
            INSERT INTO tbl_admin_user_registration (user_id, user_name, password, status, registration) 
            VALUES (?, ?, ?, ?, NOW())`; 
    db.query(query, [user_id, user_name, password, status], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId); 
    });
  });
};

const assignRolesToUser = async (userId, roles) => {
  try {
    // Fetch existing roles of the user
    const existingRoles = await getUserRoles(userId);

    // Filter out roles that are already assigned
    const uniqueRoles = roles.filter((role) => !existingRoles.includes(role));

    // Only assign roles that are not already assigned
    if (uniqueRoles.length > 0) {
      const insertQuery = "INSERT INTO tbl_admin_user_role_assign (role_id, user_id) VALUES ?";
      const rolesData = uniqueRoles.map((roleId) => [roleId, userId]);

      await new Promise((resolve, reject) => {
        db.query(insertQuery, [rolesData], (err) => {
          if (err) {
            console.error("Error inserting roles:", err);
            return reject(err);
          }
          console.log("Roles assigned successfully");
          resolve();
        });
      });
    } else {
      console.log("No new roles to assign.");
    }
  } catch (err) {
    console.error("Error in assignRolesToUser:", err);
    throw err;
  }
};



const getUserRoles = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT role_name 
            FROM tbl_admin_roles 
            WHERE role_id IN (SELECT role_id FROM tbl_admin_user_role_assign WHERE user_id = ?)
        `;
    db.query(query, [userId], (err, result) => {
      if (err) return reject(err);
      const roles = result.map((role) => role.role_name);
      resolve(roles);
    });
  });
};

const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM tbl_admin_user_registration WHERE user_id = ?";
    db.query(query, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};


const updateUserById = (userId, updates) => {
  return new Promise((resolve, reject) => {
    // Prepare the SET clause of the SQL query based on the provided updates
    const setClauses = [];
    const values = [];

    // Check if user_name is to be updated
    if (updates.user_name) {
      setClauses.push("user_name = ?");
      values.push(updates.user_name);
    }

    // Check if password is to be updated
    if (updates.password) {
      setClauses.push("password = ?");
      values.push(updates.password);
    }

    // Check if status is to be updated
    if (updates.status) {
      setClauses.push("status = ?");
      values.push(updates.status);
    }

    // Ensure there's something to update
    if (setClauses.length === 0) {
      return resolve(); // No updates to apply
    }

    const query = `
      UPDATE tbl_admin_user_registration 
      SET ${setClauses.join(", ")} 
      WHERE user_id = ?
    `;
    values.push(userId); // Add userId to the end of values for the WHERE clause

    db.query(query, values, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const fetchAllUsers = () => {
  return new Promise((resolve, reject) => {
    // Modified query to include roles
    const query = `
      SELECT u.user_id, u.user_name, u.status,
             GROUP_CONCAT(r.role_name) AS roles
      FROM tbl_admin_user_registration u
      LEFT JOIN tbl_admin_user_role_assign ur ON u.user_id = ur.user_id
      LEFT JOIN tbl_admin_roles r ON ur.role_id = r.role_id
      GROUP BY u.user_id, u.user_name, u.status;
    `;
    
    db.query(query, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const removeRolesFromUser = async (userId, rolesToRemove) => {
  try {
    if (!Array.isArray(rolesToRemove) || rolesToRemove.length === 0) {
      console.log("No roles to remove.");
      return;
    }

    // Prepare the query with placeholders for the number of roles to remove
    const placeholders = rolesToRemove.map(() => '?').join(', ');
    const deleteQuery = `DELETE FROM tbl_admin_user_role_assign WHERE user_id = ? AND role_id IN (${placeholders})`;

    await new Promise((resolve, reject) => {
      db.query(deleteQuery, [userId, ...rolesToRemove], (err) => {
        if (err) {
          console.error("Error removing roles:", err);
          return reject(err);
        }
        console.log("Roles removed successfully");
        resolve();
      });
    });
  } catch (err) {
    console.error("Error in removeRolesFromUser:", err);
    throw err;
  }
};


module.exports = {
  getUserByUser,
  createUser,
  assignRolesToUser,
  getUserById,
  getUserRoles,
  updateUserById,
  fetchAllUsers,
  removeRolesFromUser
};
