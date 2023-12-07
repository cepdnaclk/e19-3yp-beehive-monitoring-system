//Create a server with express
import express from 'express';
import {router as userRouter} from './routes/userRoute.js';
import mongoose from 'mongoose';
import { mongoURL } from './config/dbconfig.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api',userRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});



mongoose.connect(mongoURL).then(()=>{
    console.log('Connected to MongoDB');
}
);