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
        // Validate the idRef to ensure it's a valid Telegram ID
        await tgIdValidator.validate({ id: idRef });
        // Ensure the idRef is not the same as the current user's ID
        if (idRef.toString() === ctx.state.user.id.toString()) {
            console.log('User cannot refer themselves.')
            return;
        }
         // Check if the idRef is already a referral of any user
        const existingReferral = await User.findOne({ referrals: ctx.state.user._id });
        if (existingReferral) {
            console.log("User is already someone's referral.");
            return;
        }
        // Find the user being referred
        const userRef = await User.findOne({ id: idRef });
        console.log("50🚀 ~ checkRefCode ~ userRef:", userRef)

        if (userRef && ctx.state.user) {
            console.log("53🚀 ~ checkRefCode ~ userRef:", userRef)
            // Check if the current user is already in the referrals array
            const currentUserId = ctx.state.user._id;
            console.log("56🚀 ~ checkRefCode ~ currentUserId:", currentUserId)
            if (!userRef.referrals.includes(currentUserId)) {
                // Add the current user's ID to the referrals array
                userRef.referrals.push(currentUserId);
                await userRef.save();
                console.log("Referral added successfully.");
            } else {
                console.log("User is already a referral.");
            }
        } else {
            console.log("Referral user not found or current user is not authenticated.");
        }
    } catch (error) {
        console.log("Error in checkRefCode middleware: ", error.message);
    }
};




export default {checkUser, checkRefCode};
