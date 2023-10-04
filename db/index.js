import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
// import { Category } from "./db";

mongoose.connect(`${process.env.DATABASE_URL}/CasaVerde`);

mongoose.connection.on('error', () => {
    console.error.bind(console, 'MongoDB connect error:')
});
mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected')
});

// async function boot() {
//     await Category.deleteMany({});
//     console.log('database Category initialized');

//     await Category.insertMany([
//         { id: 1, name: 'PLANT' },
//         { id: 2, name: 'POT' },
//         { id: 3, name: 'GARDENING TOOL' },
//         { id: 4, name: 'GARDENING KIT' },
//     ])
// }

// boot();