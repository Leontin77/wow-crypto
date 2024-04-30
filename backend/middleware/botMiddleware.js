import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import generateAvatar from "../utils/generateAvatar.js";

const checkUser = async (ctx, next) => {
    try {
        const {id, first_name, last_name, username} = ctx.update.message.from;

        let findUser = await User.findOne({id});

        if (!findUser) {
            const newUser = new User({
                id,
                first_name,
                last_name,
                username
            });
            findUser =  await newUser.save();
        }

        return findUser;
    } catch (error) {
        console.log("Error in checkUser middleware: ", error.message);
    }
};

export default {checkUser};
