import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
if(!process.env.MONGO_URL){
    throw new Error("MONGO_URL is not defined in .env file")
}


export async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("CONNECTED TO MONGODB");
    }catch(error){
        console.error("ERROR CONNECTING TO MONGODB:", error);
    }
}

export default connectDB;
