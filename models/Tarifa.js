import mongoose from "mongoose";
const tarifaSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    valor:{
        type:Number,
        required:true
    },
    tiempo:{
        type:Number,
        required:true
    },
    activo:{
      type:Boolean,
      default:true
    },
    consulta:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Consulta",

    },
    profesional:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Profesional",
    },
    seccionTarifa: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "SeccionesTarifa",
      },
}, {
    timestamps: true 
  })

const Tarifa= mongoose.model("Tarifa", tarifaSchema);
export default Tarifa;