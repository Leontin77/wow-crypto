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
        lastOnline: {
            type: Date,
            required: false,
            unique: false,
        },
        score: {
            type: Number,
            required: false,
            unique: false,
            default: 1
        },
      stats: {
            type: {
                strength: { type: Number, default: 0 },
                speed: { type: Number, default: 0 },
                energy: { type: Number, default: 0 }
            },
            required: false,
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
