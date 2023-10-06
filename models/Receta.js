import mongoose from "mongoose";
const recetaSchema = mongoose.Schema({
    documento:{
        public_id: String, required:false,
        secure_url: String,required:false,
    },
    tipoReceta:{
        type: String,
        required: false,
        default:null
    },
    estado: {
        type: String,
        enum: ['pendiente', 'finalizado'],
        default: 'pendiente',
      },
    paciente:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Paciente",
    },
    profesional:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Profesional",
    },
    motivoconsulta:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"MotivoConsulta",
    },
    consulta:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Consulta",
    },
    opciones: [{
        type: String
      }],

})

const Receta= mongoose.model("Receta", recetaSchema);
export default Receta;