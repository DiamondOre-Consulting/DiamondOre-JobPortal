import mongoose from "mongoose";

const recruitersAndKAMsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

export default mongoose.model('RecruiterAndKAM', recruitersAndKAMsSchema);