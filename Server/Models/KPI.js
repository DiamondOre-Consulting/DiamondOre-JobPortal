import mongoose from "mongoose";

const kpiSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employees",
        required: true
    },
    kpis: {
        type: [
            {
                kpiMonth: {
                    month: {
                        type: String
                    },
                    year: {
                        type: Number
                    },
                    costVsRevenue: {
                        target: {
                            type: Number
                        },
                        actual: {
                            type: Number
                        },
                        weight: {
                            type: Number
                        },
                        kpiScore: {
                            type: Number
                        }
                    },
                    successfulDrives: {
                        target: {
                            type: Number
                        },
                        actual: {
                            type: Number
                        },
                        weight: {
                            type: Number
                        },
                        kpiScore: {
                            type: Number
                        }
                    },
                    accounts: {
                        target: {
                            type: Number
                        },
                        actual: {
                            type: Number
                        },
                        weight: {
                            type: Number
                        },
                        kpiScore: {
                            type: Number
                        }
                    },
                    mentorship: {
                        target: {
                            type: Number
                        },
                        actual: {
                            type: Number
                        },
                        weight: {
                            type: Number
                        },
                        kpiScore: {
                            type: Number
                        }
                    },
                    processAdherence: {
                        target: {
                            type: Number
                        },
                        actual: {
                            type: Number
                        },
                        weight: {
                            type: Number
                        },
                        kpiScore: {
                            type: Number
                        }
                    },
                    leakage: {
                        target: {
                            type: Number
                        },
                        actual: {
                            type: Number
                        },
                        weight: {
                            type: Number
                        },
                        kpiScore: {
                            type: Number
                        }
                    },
                    noOfJoining: {
                        target: {
                            type: Number
                        },
                        actual: {
                            type: Number
                        },
                        weight: {
                            type: Number
                        },
                        kpiScore: {
                            type: Number
                        }
                    },
                    totalKPIScore: {
                        type: Number
                    }
                }
            }
        ],
        default: []
    }
})

export default mongoose.model("KPI", kpiSchema);