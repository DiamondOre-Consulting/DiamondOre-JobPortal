import mongoose from "mongoose";

const accountHandlingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employees",
  },
  accountHandlingStatus: {
    type: Boolean,
    default: false,
  },
  // year: {
  //   type: Number,
  //   required: true,
  // },
  accountDetails: {
    type: [
      {
        detail: {
          hrName: {
            type: String,
            required: true,
          },
          clientName: {
            type: String,
            required: true,
          },
          phone: {
            type: String,
            required: true,
          },
          channel: {
            type: String,
            required: true,
          },
          zone: {
            type: String,
            required: true,
          },
        },
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("AccountHandling", accountHandlingSchema);