import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		mongoose.set('strictQuery', false);
		await mongoose.connect(process.env.MONGO_DB_URL || "mongodb+srv://wow:nF65xeWrAlpJuImC@cluster0.qoevxih.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;
