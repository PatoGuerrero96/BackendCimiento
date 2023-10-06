import mongoose from "mongoose";
const seccionestarifaSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: false,
        trim: true
    },
    color:{
        type:String,
        required:false
    },
    activo:{
      type:Boolean,
      default:true
    },
    profesional:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Profesional",
    },
}, {
    timestamps: true 
  })

const SeccionesTarifa= mongoose.model("SeccionesTarifa", seccionestarifaSchema);
export default SeccionesTarifa;