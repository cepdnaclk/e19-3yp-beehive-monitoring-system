
import { createServer } from './utils/server.js';
import mongoose from 'mongoose';
import { mongoURL } from './config/dbconfig.js';

const app = createServer();
const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});



mongoose.connect(mongoURL).then(()=>{
    console.log('Connected to MongoDB');
}
);