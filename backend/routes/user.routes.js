import express from "express";
import userMiddleware from "../middleware/userMiddleware.js";
import userController from "../controllers/user.controller.js";
const router = express.Router();


router.get("/:id",
    userMiddleware.checkUser,
    userController.user
);

router.post("/",
    userMiddleware.checkTg,
    // authMiddleware.checkUser,
    // chatMiddleware.checkChat,
    // authController.login
);
//
// router.get("/logout",
//     authMiddleware.checkToken,
//     authController.logout
// );

export default router;
