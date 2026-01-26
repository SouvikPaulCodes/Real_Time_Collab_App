import express from "express";
import { config } from "dotenv";
config()
import cors from 'cors'
import { workRouter } from "../routes/workspaces.js";
import { msgRouter } from "../routes/messages.js";

const app = express()

app.use(cors({
    origin: process.env.NEXT_URL!
}))
app.use(express.json());

app.use('/api/workspaces', workRouter)
app.use('/api/messages', msgRouter)

export {app};
