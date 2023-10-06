import mongoose from "mongoose";
const especialidadSchema = mongoose.Schema({
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

const Especialidad= mongoose.model("Especialidad", especialidadSchema);
export default Especialidad;