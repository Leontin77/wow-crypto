import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import generateAvatar from "../utils/generateAvatar.js";
const checkUser = async (req, res, next) => {
    try {
        const {id} = req.params;

        if (id) {
            const findUser = await User.findOne({id: +id});
            if (!findUser) {
                return res.status(400).json({error: "Error with user"});
            }
            req.user = findUser;
        }

        next();
    } catch (error) {
        console.log("Error in checkUser: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

const checkTg = async (req, res, next) => {
    try {
        // const {id} = req.params

        console.log("req.body", req.body.initData);

        // if (id) {
        //     const findUser = await User.findOne({id});
        //     if (!findUser) {
        //         return res.status(400).json({error: "Error with user"});
        //     }
        //     req.user = findUser;
        // }

        next();
    } catch (error) {
        console.log("Error in checkTg: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};


export default {checkUser, checkTg};
