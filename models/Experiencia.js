import mongoose from "mongoose";
const experienciaSchema = mongoose.Schema({
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

const Experiencia= mongoose.model("Experiencia", experienciaSchema);
export default Experiencia;