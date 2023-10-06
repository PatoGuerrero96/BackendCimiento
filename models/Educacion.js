import mongoose from "mongoose";
const educacionSchema = mongoose.Schema({
    fechainicio:{
        type:Number,
        required:false
    },
    fechafin:{
        type:Number,
        required:false
    },
    nombre:{
        type:String,
        required:false
    },
    profesional:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Profesional",
    },
}, {
    timestamps: true 
  })

const Educacion= mongoose.model("Educacion", educacionSchema);
export default Educacion;