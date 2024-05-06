import generateTokenAndSetCookie from "../utils/generateToken.js";

const user = async (req, res) => {
    try {
        const {user} = req;
        generateTokenAndSetCookie(user._id, res);


        console.log("!!!!!")

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in user controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};
//
// export const logout = (req, res) => {
//     try {
//         res.cookie("jwt", "", {maxAge: 0});
//         res.status(200).json({message: "Logged out successfully"});
//     } catch (error) {
//         console.log("Error in logout controller", error.message);
//         res.status(500).json({error: "Internal Server Error"});
//     }
// };
export default {user};
