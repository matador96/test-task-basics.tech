const UserController = require("../controllers/user");
const {
  authenticate,
  authenticateWithoutReturn,
} = require("../middleware/authenticate");

module.exports = (router) => {
  router.get("/api/people", authenticateWithoutReturn, UserController.getUsers),
    router.post("/api/account/register", UserController.registerUser),
    router.post("/api/account/login", UserController.loginUser),
    router.get("/api/account/logout", authenticate, UserController.logoutUser),
    router.get("/api/account", authenticate, UserController.getAccount),
    router.put("/api/account", authenticate, UserController.updateAccount);
};
