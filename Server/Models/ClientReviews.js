import mongoose from "mongoose";

const clientReviewsSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    reviewFor: {
        type: String,
        required: true
    },
    diamonds: {
        type: Number,
        required: true
    },
    review: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("ClientReviews", clientReviewsSchema);