import calculations from './calculation/calculation.router.js';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const app = express();  //Create new instance

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Database connection Success!");
    }).catch((err) => {
        console.error("MongoDB Connection Error", err)
    });

const PORT = process.env.PORT || 5000; //Declare the port number
app.use(cors());
app.use(express.json()); //allows us to access request body as req.body
app.use(morgan("dev"));  //enable incoming request logging in dev mode
app.use('/calculations', calculations);

app.listen(PORT, () => {
    console.log("Server started listening on port : ", PORT);
});