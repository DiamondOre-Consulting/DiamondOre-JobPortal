import mongoose from "mongoose";

const kpiSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employees",
        required: true
    },
    
     
})