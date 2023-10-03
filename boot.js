import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(`${process.env.DATABASE_URL}/CasaVerde`);
mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected');
});