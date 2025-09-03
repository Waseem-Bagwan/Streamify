import mongoose from 'mongoose'

export const connectDB = async (req,res) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Database connected successfully...`)
    } catch (error) {
        console.log(`Error while connecting to MONGO-DB : ${error}` )
        process.exit(1)
    }
}