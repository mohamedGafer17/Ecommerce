import mongoose from "mongoose";
export const connectDB = async ()=>{
    await mongoose.connect(process.env.CONNECTION_URL).then(()=>console.log('DB Connected')).catch(()=>console.log('something went wrong!'))
}