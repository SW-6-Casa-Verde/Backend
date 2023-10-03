import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const { Category } = require('./db');

mongoose.connect(`${process.env.DATABASE_URL}/CasaVerde`);
mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected');
});

async function boot() {
    await Category.deleteMany({});
    await Category.insertMany([
        {id:30, name: 'test3'},
    ])
  }
  
boot();