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
          noOfJoinings: {
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
          // UM INCENTIVE   variable insentive will change to leakage
          leakage: { 
            type: Number
          },
          incentiveStatusColor: {
             type: String
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
