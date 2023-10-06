import mongoose from "mongoose";
const imagenesmotivoSchema = mongoose.Schema({
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
    visible:{
        type:Boolean,
        default:true
    },
    public_id:{ 
        type:String,
    required:true
   } ,
    secure_url:{ 
        type:String,
        required:true
    },

    motivoconsulta:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"MotivoConsulta",
    },
}, {
    timestamps: true 
  })

const ImagenesMotivo= mongoose.model("ImagenesMotivo", imagenesmotivoSchema);
export default ImagenesMotivo;