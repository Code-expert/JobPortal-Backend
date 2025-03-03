import mongoose from "mongoose";


const mongoDb = async () => {   
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected to the database');
    } catch (error) {
       console.error('Database connection error:', error);     
    }
};

export default mongoDb;