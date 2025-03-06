import mongoose from 'mongoose'



const policiesSchema = new mongoose.Schema({

 Policies: {  
        leave: {
          type: String,
        },
        performanceManagement: {
          type: String,
        },
        holidayCalendar: {
          type: String,
        },
  },
   

},{
    timestamps:true
})

const Policies = mongoose.model('Policies', policiesSchema)


export default Policies


