const express = require('express');
const { protect, authorize } = require('../middleware/protect');
const { register, login, getUsers, blockUser, me, deleteUser, resetPassword } = require("../controller/user-controller");

const router = express.Router();

// /api/v1/users
router.route('/login').post(login);

router.use(protect);
router.route('/register').post(authorize(), register);
router.route("/").get(getUsers).delete(authorize(), deleteUser);
router.route("/:id").put(authorize(), blockUser);
router.route("/me").get(me);

router.route("/reset-password").post(authorize(), resetPassword);

module.exports = router;
