import mongoose from "mongoose";
const signosalarmaSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: false,
        default:null
    },
    fuente:{
        type: String,
        required: false,
        default:null
    },
    contenido: {
        type: [String], // Cambiar el tipo a Array de String
        required: false,
        default: null
      },
    anonimo:{
        type: Boolean,
        default:false
    },
    profesional:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Profesional",
    },
}, {
    timestamps: true 
  })
const Signosalarma= mongoose.model("Signosalarma",signosalarmaSchema);
export default Signosalarma;