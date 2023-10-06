import mongoose from 'mongoose';

const examensolicitadoSchema = mongoose.Schema({
  opciones: [{
    type: String
  }],
  estado: {
    type: String,
    enum: ['pendiente', 'finalizado'],
    default: 'pendiente',
  },
  documento:{
    public_id: String, required:false,
    secure_url: String,required:false,
},
  paciente: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente'
  },
  profesional: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profesional'
  },
  consulta: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consulta'
  },
  motivoconsulta:{ 
    type: mongoose.Schema.Types.ObjectId,
    ref:"MotivoConsulta",
},
});

const Examensolicitado = mongoose.model('Examensolicitado', examensolicitadoSchema);
export default Examensolicitado;