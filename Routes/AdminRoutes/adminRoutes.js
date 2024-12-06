const express = require("express");
const router = express.Router();
const AdminRoleController = require("../../Controllers/AdminController/adminController");
const {
  signup,
  login,
  logout,
  refreshToken,
  updateUserDetails,
  getUserDetailsWithRoles,
  getAllUsers,
  updateUserRoles
} = require("../../Controllers/AdminController/adminController");
const { authenticate, authorize } = require("../../Middlewares/AuthMiddleware");

// Role Routes
router.get("/roles", authenticate, authorize(["Admin"]), AdminRoleController.getAllRoles);
router.get("/roles/:role_id", authenticate, authorize(["Admin"]), AdminRoleController.getRoleById);
router.post("/roles", authenticate, authorize(["Admin"]), AdminRoleController.createRole);
router.patch("/roles/:role_id", authenticate, authorize(["Admin"]), AdminRoleController.updateRole);
router.delete("/roles/:role_id", authenticate, authorize(["Admin"]), AdminRoleController.deleteRole);
router.patch('/users/:userId/roles',authenticate, authorize(["Admin"]), updateUserRoles);
// User Routes 
router.post("/users/signup", signup);  
router.post("/users/login",  login); 
router.post("/users/logout",  logout); 
router.get("/users/refresh-token", refreshToken); 
router.get("/users", authenticate, authorize(["Admin"]), getAllUsers);
 
router.get("/users/protect", authenticate, authorize(["Admin"]), (req, res) => {
  res.status(200).json({ message: "Access granted. You are authorized." });
});

 
router.get("/users/:userId", authenticate, authorize(["Admin"]),  getUserDetailsWithRoles); 
router.patch("/users/:userId",authenticate, authorize(["Admin"]),   updateUserDetails); 

module.exports = router;
