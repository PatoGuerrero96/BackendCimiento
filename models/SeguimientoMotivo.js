import mongoose from "mongoose";
const seguimientomotivoSchema = mongoose.Schema({
    fecha:{
        type: Date,
        default:Date.now(),
    },
    nombre:{
        type:String,
        required:false
    },
    descripcion:{
        type:String,
        required:false
    },
    motivoconsulta:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"MotivoConsulta",
    },
    paciente:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Paciente",
    },
}, {
    timestamps: true 
  })

const SeguimientoMotivo= mongoose.model("SeguimientoMotivo", seguimientomotivoSchema);
export default SeguimientoMotivo;