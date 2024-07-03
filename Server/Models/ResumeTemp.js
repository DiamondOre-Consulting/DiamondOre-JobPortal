import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  full_name: {
    type: String,
    
  },
  address: {
    type: String,
    
  },
  phone: {
    type: String,
    
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
      
    },
    start_month: {
      type: String,
      
    },
    start_year: {
      type: String,
      
    },
    end_month: {
      type: String,
      
    },
    end_year: {
      type: String,
      
    },
    company: {
      type: String,
      
    },
    company_city: {
      type: String,
      
    },
    work_description: {
      type: String,
      
    },
  },
  graduation: {
    degree_name: {
      type: String,
      
    },
    degree_field: {
      type: String,
      
    },
    graduation_year: {
      type: String,
      
    },
    university_name: {
      type: String,
      
    },
    university_city: {
      type: String,
      
    },
  },
  twelfth: {
    twelfth_field: {
      type: String,
      
    },
    twelfth_year: {
      type: String,
      
    },
    twelfth_school_name: {
      type: String,
      
    },
    twelfth_school_city: {
      type: String,
      
    },
    twelfth_board_name: {
      type: String,
      
    },
  },
  tenth: {
    tenth_field: {
      type: String,
      
    },
    tenth_year: {
      type: String,
      
    },
    tenth_school_name: {
      type: String,
      
    },
    tenth_school_city: {
      type: String,
      
    },
    tenth_board_name: {
      type: String,
      
    },
  },
  resumeLink:{
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ResumeTemp", resumeSchema);
