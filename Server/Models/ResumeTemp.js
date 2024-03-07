import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  linkedinUrl: {
    type: String,
    default: null,
  },
  summary: {
    type: String,
    required: true,
  },
  tech_skills: [
    {
      type: String,
      default: null,
    },
  ],
  soft_skills: [
    {
      type: String,
      default: null,
    },
  ],
  experience: {
    designation: {
      type: String,
      required: true,
    },
    start_month: {
      type: String,
      required: true,
    },
    start_year: {
      type: String,
      required: true,
    },
    end_month: {
      type: String,
      required: true,
    },
    end_year: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    company_city: {
      type: String,
      required: true,
    },
    work_description: {
      type: String,
      required: true,
    },
  },
  graduation: {
    degree_name: {
      type: String,
      required: true,
    },
    degree_field: {
      type: String,
      required: true,
    },
    graduation_year: {
      type: String,
      required: true,
    },
    university_name: {
      type: String,
      required: true,
    },
    university_city: {
      type: String,
      required: true,
    },
  },
  twelfth: {
    tewlfth_field: {
      type: String,
      required: true,
    },
    twelfth_year: {
      type: String,
      required: true,
    },
    twelfth_school_name: {
      type: String,
      required: true,
    },
    twelfth_school_city: {
      type: String,
      required: true,
    },
    twelfth_board_name: {
      type: String,
      required: true,
    },
  },
  tenth: {
    tenth_field: {
      type: String,
      required: true,
    },
    tenth_year: {
      type: String,
      required: true,
    },
    tenth_school_name: {
      type: String,
      required: true,
    },
    tenth_school_city: {
      type: String,
      required: true,
    },
    tenth_board_name: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ResumeTemp", resumeSchema);
