import mongoose from "mongoose";

const goalSheetSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employees",
  },
  goalSheetDetails: {
    type: [
      {
          year: {
            type: Number
          },
          month: {
            type: Number,
            // required: true,
          },
          noOfJoining: {
            type: Number,
            // required: true,
          },
          cost: {
            type: Number,
            // required: true,
          },
          revenue: {
            type: Number,
            // required: true,
          },
          target: {
            type: Number,
            // required: true,
          },
          cumulativeCost: {
            type: Number,
            // required: true,
          },
          cumulativeRevenue: {
            type: Number,
            // required: true,
          },
          achYTD: {
            type: Number,
            // required: true,
          },
          achMTD: {
            type: Number,
            // required: true,
          },
          incentive: {
            type: Number
          },
          // UM INCENTIVE
          variableIncentive: { 
            type: Number
          }
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("GoalSheet", goalSheetSchema);
