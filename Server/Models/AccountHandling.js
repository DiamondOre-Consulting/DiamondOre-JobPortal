import mongoose from "mongoose";

// const accountHandlingSchema = new mongoose.Schema({
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Employees",
//   },
//   accountHandlingStatus: {
//     type: Boolean,
//     default: false,
//   },
//   accountDetails: {
//     type: [
//       {

//         zone: {
//           type: String,
//           required: true,
//         },
//       },
//     ],
//     default: [],
//   },
//   requests: {
//     type: [
//       {
//         reqDetail: {
//           employee: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Employees"
//           },
//           accountPhone: {
//             type: String,
//           },
//           status: {
//             type: Boolean,
//             default: null
//           }
//         }
//       }
//     ],
//     default: []
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// Define the HR details schema
const hrDetailSchema = new mongoose.Schema({
  hrName: {
    type: String,
    required: true,
  },
  hrPhone: {
    type: String,
    required: true,
    unique: true,  // Ensure the phone number is unique across all documents
  },
  hrEmail: {
    type: String,
  }
});

// Define the Channel schema
const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
  },
  hrDetails: {
    type: [hrDetailSchema],
    default: [],
  }
});

// Define the Zone schema
const zoneSchema = new mongoose.Schema({
  zoneName: {
    type: String,
    required: true,
  },
  channels: {
    type: [channelSchema],
    default: [],
  }
});

// Define the request schema
const requestSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employees"
  },
  accountPhone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestDate: {
    type: Date,
    default: Date.now
  }
});

// Define the main AccountHandling schema
const accountHandlingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employees",
    required: true
  },
  accountHandlingStatus: {
    type: Boolean,
    default: false,
  },
  accountDetails: {
    type: [zoneSchema],
    default: [],
  },
  requests: {
    type: [requestSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("AccountHandling", accountHandlingSchema);