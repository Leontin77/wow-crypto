import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: false,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        first_name: {
            type: String,
            required: false,
            unique: false,
        },
        last_name: {
            type: String,
            required: false,
            unique: false,
        },
        achievements: {
            type: Array,
            required: false,
            unique: false,
        },
        score: {
            type: Number,
            required: false,
            unique: false,
            default: 0
        },
        stats: {
            type: Object,
            required: false,
            unique: false,
            default: {}
        },
        referrals: {
            type: Array,
            required: false,
            unique: false,
            default: []
        },
        profilePic: {
            type: String,
            required: false,
            unique: false,
        },
    },
    {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;
