import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import productRouter from './route/product.route.js';
import orderRouter from './route/order.route.js'

console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes' : 'No');
console.log('MONGO_URL loaded:', process.env.MONGO_URL ? 'Yes' : 'No');
const app =express();
app.use(cors({
    credentials:true,
    origin:['http://localhost:5173', 'http://localhost:5174', process.env.FRONTEND_URL].filter(Boolean)
}))


app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(helmet({
    crossOriginResourcePolicy:false 
}))
const PORT = 8080 || process.env.PORT;

app.get("/",(req,res)=>{
    res.json({message:"HEllo there,server is running"})
});

app.use('/api/user',userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);


connectDB().then(()=>{
        app.listen(PORT ,()=>{
    console.log(`SERVER IS LIVE AT ${PORT}`);
    })
    })
