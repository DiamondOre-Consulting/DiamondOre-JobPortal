import mongoose from "mongoose";

const erpSchema = new mongoose.Schema({
  EmpOfMonth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employees",
  },
  recognitionType: {
    type: String,
  },
  EmpOfMonthDesc: {
    type: String,
  },
  profilePic: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
  },
  Top5HRs: [
    {
      serialNumber: Number,
      name: {
        type: String,
      },
    },
  ],
  Top5Clients: [
    {
      serialNumber: Number,
      name: {
        type: String,
      },
    },
  ],
  RnRInterns: [
    {
      serialNumber: Number,
      title: {
        type: String,
      },
      name: {
        type: String,
      },
      count: {
        type: Number,
      },
      percentage: {
        type: Number,
      },
    },
  ],
  RnRRecruiters: [
    {
      serialNumber: Number,
      title: {
        type: String,
      },
      name: {
        type: String,
      },
      count: {
        type: Number,
      },
      percentage: {
        type: Number,
      },
    },
  ],
  BreakingNews: [
    {
      serialNumber: Number,
      news: {
        type: String,
      },
    },
  ],
  JoningsForWeek: [
    {
      serialNumber: Number,
      names: {
        type: String,
      },
      client: {
        type: String,
      },
      location: {
        type: String,
      },
      ctc: {
        type: Number,
      },
      recruiterName: {
        type: String,
      },
      teamLeaderName: {
        type: String,
      },
      noOfJoinings: {
        type: Number,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

erpSchema.pre("save", function (next) {
  const setSerialNumber = (arrayField) => {
    arrayField.forEach((item, index) => {
      if (!item.serialNumber) {
        item.serialNumber = index + 1;
      }
    });
  };

  setSerialNumber(this.Top5HRs);
  setSerialNumber(this.Top5Clients);
  setSerialNumber(this.RnRInterns);
  setSerialNumber(this.RnRRecruiters);
  setSerialNumber(this.BreakingNews);
  setSerialNumber(this.JoningsForWeek);

  next();
});

export default mongoose.model("ERP", erpSchema);
