import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import generateAvatar from "../utils/generateAvatar.js";
import {tgIdValidator} from "../validators/index.js";
import * as constants from "constants";

const checkUser = async (ctx, next) => {
    try {
        const {id, first_name, last_name, username} = ctx.update.message.from;

        let findUser = await User.findOne({id});

        if (!findUser) {
            const newUser = new User({
                id,
                first_name,
                last_name,
                username,
            });
            findUser = await newUser.save();
        }
        console.log("222222222!!!!!!!!!!!!!!!!!!!!!!!!!1", findUser)
        // next();

        return findUser;
    } catch (error) {
        console.log("Error in checkUser middleware: ", error.message);
    }
};

const checkRefCode = async (ctx, idRef) => {
    try {
        await tgIdValidator.validate({id: idRef})

        if (idRef === ctx?.update?.message?.from?.id) {
            return
        }

        const userRef = await User.findOne({id: idRef});

        if (userRef && ctx.state.user ) {
            userRef.referrals = Array.from(new Set([...userRef.referrals, ctx.state.user._id]))
            await userRef.save();
        }
    } catch (error) {
        console.log("Error in checkRefCode middleware: ", error.message);
    }
};


export default {checkUser, checkRefCode};
