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
          },
          noOfJoinings: {
            type: Number,
          },
          cost: {
            type: Number,
          },
          revenue: {
            type: Number,
          },
          target: {
            type: Number,
          },
          cumulativeCost: {
            type: Number,
          },
          cumulativeRevenue: {
            type: Number,
          },
          achYTD: {
            type: Number,
          },
          achMTD: {
            type: Number,
          },
          incentive: {
            type: Number
          },
          leakage: { 
            type: Number
          },
          incentiveStatusColor: {
             type: String,
             default: "#ffffff"
          }
      },
    ],
  },

  // Ticker will Run if YTD is less then 2.5 then it will save here

  YTDLessTickerMessage:{
      type : String
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("GoalSheet", goalSheetSchema);
