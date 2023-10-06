import mongoose from "mongoose";
const medidageneralSchema = mongoose.Schema({
    titulo:{
        type: String,
        default:null
    },
    descripcion:{
        type: String,
        default:null
    },
    fuente:{
        type: String,
        default:null
    },
    anonimo:{
        type: Boolean,
        default:false
    },
    tags:{
     type: String,
     default:null
    },
    profesional:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Profesional",
    },
}, {
    timestamps: true 
  })
const Medidageneral= mongoose.model("Medidageneral", medidageneralSchema);
export default Medidageneral;