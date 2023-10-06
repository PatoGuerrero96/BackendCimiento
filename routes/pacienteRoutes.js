import express from "express";
import { registrar,
     perfil,
     confirmar,
     autenticar,
     olvidePassword,
     comprobarToken,
     nuevoPassword,
     actualizarPerfil,
     actualizarPassword,
     subirFotoPerfil,
     actualizarContacto,
     ActualizarNoPatologico,
     agregarAlergia,
     obtenerAlergias,
     actualizarAlergia,
     eliminarAlergia,
     tieneAlergia,
     agregarEnfermedad,
     obtenerEnfermedades,
     actualizarEnfermedad,
     eliminarEnfermedad,
     tieneEnfermedad,
     ActualizarEstadoGeneral,
     ActualizarSueño,
     Actualizarsaludmental,
     Actualizaralimentacion,
     ActualizarAlcohol,
     ActualizarDrogas,
     ActualizarDolor,
     ActualizarActividad,
     GuardarExamen,
     obtenerExamenes,
     agregarMotivoConsulta,
     obtenerMotivoConsultas,
     actualizarMotivoConsulta,
     actualizarvisibilidadMotivo,
     eliminarMotivoConsulta,
     ActualizarHorario,
     eliminarExamenes,
     verConsultas,
     Notificacionesleidas,
     VerMasEnConsulta,
     RechazarConsulta,
     ActualizarComentario,
     ActualizarHorarioPaciente,
     obtenerHorarioPaciente,
     eliminarHorario,
     actualizarHorariodisponible,
     RecordatorioConsultasdia,
     obtenerMotivoConsultaPorId,
     subirFotoMotivo,
     obtenerImagenesPorMotivo,
     eliminarImagenMotivo,
     actualizarvisibilidadImagenMotivo,
     actualizarInformacionMotivo,
     obtenerEducacionPorProfesionalId,
     obtenerExperienciaPorProfesionalId,
     obtenerEspecialidadPorProfesionalId,
     agregarSeguimientoMotivo,
    obtenerSeguimientoMotivoPaciente,
    actualizarSeguimientoPaciente,
    eliminarSeguimientoPaciente,
    verListaConsultasPaciente,
    verMasEnConsultaPaciente,
    consultarConsultasAceptadas,
    ActualizarpreguntasSaludgeneral,
    ActualizarpreguntasSueño,
    ActualizarpreguntasSaludMental,
    ActualizarpreguntasDolor,
    Actualizarprocesopreguntas,
    EditarDocumentoExamen,
    AceptarConsulta,
    Actualizarpreguntaspaciente,
    RechazarInterconsulta,
    AceptarInterconsulta,
    ObtenerControlesMotivo,
    HistoriaclinicaPDF,
    Obtenerunaconsulta
     } from "../controllers/pacienteController.js";
import { 
    agregarVacuna,
    tieneVacuna,
    obtenerVacunas,
    actualizarVacuna,
    eliminarVacuna,
    agregarFarmaco,
    tieneFarmaco,
    actualizarFarmaco,
    eliminarFarmaco,
    obtenerFarmacos,
    agregarQuirurgico,
    tieneQuirurgico,
    actualizarQuirurgico,
    eliminarQuirurgico,
    obtenerQuirurgicos,
    eliminarAntecedentesfam,
    actualizarAntecedentesfam,
    obtenerAntecedentesfamiliares,
    agregarAntecedentesfam,
    tieneAntecedentesfam,
    eliminarHospitalizaciones,
    actualizarHospitalizaciones,
    obtenerHospitalizaciones,
    agregarHospitalizaciones,
    tieneHospitalizaciones,
    tieneUrgencias,
    agregarUrgencias,
    obtenerUrgencias,
    actualizarUrgencias,
    eliminarUrgencias,
    actualizarIdentificacion,
    actualizarGinecoobstetrico,
    audit,
    tieneFarmacoPrevio,
    obtenerFarmacosPrevios,
    agregarFarmacoPrevio,
    eliminarFarmacoPrevio

    } from "../controllers/HistoriaCliController.js";
 import Auth from "../middleware/authMiddleware.js";    
const router = express.Router();
//Area publica Paciente
router.post("/", registrar );
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword)
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)

//Area privada Paciente
router.get("/perfil" ,Auth,perfil );
router.put("/perfil/:id" ,Auth,actualizarPerfil );
router.put("/actualizar-password", Auth, actualizarPassword)
router.put('/foto-perfil/:id',Auth, subirFotoPerfil);
router.put('/actualizar-contacto/:id',Auth, actualizarContacto);
router.put('/actualizar-identificacion/:id',Auth, actualizarIdentificacion);
router.put('/actualizar-ginecoobstetrico/:id',Auth, actualizarGinecoobstetrico);
router.put('/formulario-audit/:id',Auth, audit);

//HISTORIA CLINICA
//Seccion alergias
router.put('/tiene-alergia/:id',Auth,tieneAlergia);
router.post('/agregar-alergia',Auth,agregarAlergia);
router.get('/obtener-alergias',Auth,obtenerAlergias);
router.put('/actualizar-alergia/:id',Auth,actualizarAlergia);
router.delete('/eliminar-alergia',Auth,eliminarAlergia);
//Seccion enfermedades
router.put('/tiene-enfermedad/:id',Auth,tieneEnfermedad);
router.post('/agregar-enfermedad',Auth,agregarEnfermedad);
router.get('/obtener-enfermedad',Auth,obtenerEnfermedades);
router.put('/actualizar-enfermedad/:id',Auth,actualizarEnfermedad);
router.delete('/eliminar-enfermedad',Auth,eliminarEnfermedad);
//Seccion Vacunas
router.put('/tiene-vacuna/:id',Auth,tieneVacuna);
router.post('/agregar-vacuna',Auth,agregarVacuna);
router.get('/obtener-vacuna',Auth,obtenerVacunas);
router.put('/actualizar-vacuna/:id',Auth,actualizarVacuna);
router.delete('/eliminar-vacuna',Auth,eliminarVacuna);
//Seccion Farmacos
router.put('/tiene-farmaco/:id',Auth,tieneFarmaco);
router.post('/agregar-farmaco',Auth,agregarFarmaco);
router.get('/obtener-farmaco',Auth,obtenerFarmacos);
router.put('/actualizar-farmaco/:id',Auth,actualizarFarmaco);
router.delete('/eliminar-farmaco',Auth,eliminarFarmaco);
//Seccion Farmacos previos
router.put('/tiene-farmaco-previo/:id',Auth,tieneFarmacoPrevio);
router.get('/obtener-farmaco-previo',Auth,obtenerFarmacosPrevios);
router.post('/agregar-farmaco-previo',Auth,agregarFarmacoPrevio);
router.delete('/eliminar-farmaco-previo/:id',Auth,eliminarFarmacoPrevio);
//Seccion Antecedentes quirurgicos
router.put('/tiene-quirurgico/:id',Auth,tieneQuirurgico);
router.post('/agregar-quirurgico',Auth,agregarQuirurgico);
router.get('/obtener-quirurgico',Auth,obtenerQuirurgicos);
router.put('/actualizar-quirurgico/:id',Auth,actualizarQuirurgico);
router.delete('/eliminar-quirurgico',Auth,eliminarQuirurgico);
//Seccion Antecedentes familiares
router.put('/tiene-antecedentesfam/:id',Auth,tieneAntecedentesfam);
router.post('/agregar-antecedentesfam',Auth,agregarAntecedentesfam);
router.get('/obtener-antecedentesfam',Auth,obtenerAntecedentesfamiliares);
router.put('/actualizar-antecedentesfam/:id',Auth,actualizarAntecedentesfam);
router.delete('/eliminar-antecedentesfam',Auth,eliminarAntecedentesfam);
//Seccion Hospitalizaciones
router.put('/tiene-hospitalizacion/:id',Auth,tieneHospitalizaciones);
router.post('/agregar-hospitalizacion',Auth,agregarHospitalizaciones);
router.get('/obtener-hospitalizacion',Auth,obtenerHospitalizaciones);
router.put('/actualizar-hospitalizacion/:id',Auth,actualizarHospitalizaciones);
router.delete('/eliminar-hospitalizacion/:id',Auth,eliminarHospitalizaciones);
//Seccion Urgencias
router.put('/tiene-urgencia/:id',Auth,tieneUrgencias);
router.post('/agregar-urgencia',Auth,agregarUrgencias);
router.get('/obtener-urgencia',Auth,obtenerUrgencias);
router.put('/actualizar-urgencia/:id',Auth,actualizarUrgencias);
router.delete('/eliminar-urgencia',Auth,eliminarUrgencias);
//Seccion preguntas
router.put('/actualizar-nopatologico/:id',Auth,ActualizarNoPatologico);
router.put('/actualizar-alcohol/:id',Auth,ActualizarAlcohol  );
router.put('/actualizar-estadogeneral/:id',Auth,ActualizarEstadoGeneral);
router.put('/actualizar-sueno/:id',Auth,ActualizarSueño);
router.put('/actualizar-saludmental/:id',Auth,Actualizarsaludmental );
router.put('/actualizar-alimentacion/:id',Auth,Actualizaralimentacion );
router.put('/actualizar-drogas/:id',Auth,ActualizarDrogas);
router.put('/actualizar-actividadfisica/:id',Auth,ActualizarActividad  );
router.put('/actualizar-dolor/:id',Auth,ActualizarDolor);
router.put('/actualizar-preguntas-motivo/:id',Auth, ActualizarpreguntasSaludgeneral);
router.put('/actualizar-preguntas-sueno/:id',Auth, ActualizarpreguntasSueño);
router.put('/actualizar-preguntas-saludmental/:id',Auth, ActualizarpreguntasSaludMental);
router.put('/actualizar-preguntas-dolor/:id',Auth, ActualizarpreguntasDolor);
router.put('/actualizar-proceso-preguntas/:id',Auth, Actualizarprocesopreguntas);

//Examenes
router.post('/agregar-examen',Auth,GuardarExamen);
router.get('/obtener-examenes',Auth,obtenerExamenes);
router.delete('/eliminar-examen/:id',Auth, eliminarExamenes);

//Consultas
// *****************************************************
router.post('/agregar-motivodeconsulta',Auth,agregarMotivoConsulta);
router.get('/obtener-motivodeconsultas',Auth,obtenerMotivoConsultas);
router.get("/ver-motivodeconsulta/:id", Auth, obtenerMotivoConsultaPorId);
router.put('/actualizar-motivodeconsulta/:id',Auth,actualizarMotivoConsulta);
router.put('/actualizar-motivovisible/:id',Auth,actualizarvisibilidadMotivo);
router.patch('/eliminar-motivodeconsulta/:id',Auth,eliminarMotivoConsulta);
router.put('/actualizar-horario/:id',Auth,ActualizarHorario);
router.get("/obtener-consultas", Auth, verConsultas);
router.get("/ver-consulta/:id", Auth, VerMasEnConsulta);
router.put("/rechazar-consulta/:id", Auth, RechazarConsulta);
router.put("/comentario-consulta/:id", Auth, ActualizarComentario);
router.get('/proxima-consulta',Auth,RecordatorioConsultasdia );
router.post('/subirfoto-motivo/:id',Auth,subirFotoMotivo);
router.get('/obtener-imagen-motivo/:id',Auth,obtenerImagenesPorMotivo );
router.delete('/eliminar-imagen-motivo/:id',Auth,eliminarImagenMotivo);
router.put('/actualizar-imagenmotivovisible/:id',Auth,actualizarvisibilidadImagenMotivo);
router.patch('/actualizar-informacion/:id',Auth,actualizarInformacionMotivo);
router.get('/obtener-educacion-pro/:id',Auth,obtenerEducacionPorProfesionalId );
router.get('/obtener-experiencia-pro/:id',Auth,obtenerExperienciaPorProfesionalId);
router.get('/obtener-especialidad-pro/:id',Auth,obtenerEspecialidadPorProfesionalId);
router.post('/agregar-seguimientomotivo/:id',Auth,agregarSeguimientoMotivo);
router.get('/obtener-seguimientomotivo/:id',Auth,obtenerSeguimientoMotivoPaciente);
router.put('/actualizar-seguimientomotivo/:id',Auth,actualizarSeguimientoPaciente);
router.delete('/eliminar-seguimientomotivo/:id',Auth,eliminarSeguimientoPaciente);
router.get("/obtener-lista-consultas", Auth, verListaConsultasPaciente );
router.get("/vermas-consulta-aprobada/:id", Auth, verMasEnConsultaPaciente );
router.put("/cambiar-estado-consultas-aceptadas/:id", Auth,consultarConsultasAceptadas);
router.put("/actualizar-preguntas-paciente/:id", Auth,Actualizarpreguntaspaciente);


//Notificaciones
router.put("/consultasleidas/:id", Auth,Notificacionesleidas);
//Horario   
router.post('/agregar-Horario',Auth,ActualizarHorarioPaciente);
router.get("/ver-MiHorario", Auth, obtenerHorarioPaciente);
router.delete("/borrar-horario/:id", Auth,eliminarHorario);
router.put("/actualizar-horario-paciente/:id", Auth,actualizarHorariodisponible);
router.put("/actualizar-examen-pendiente/:id", Auth,EditarDocumentoExamen);

router.put("/aceptar-consulta/:id", Auth, AceptarConsulta);

router.put("/rechazar-interconsulta/:id", Auth, RechazarInterconsulta);
router.put("/aceptar-interconsulta/:id", Auth, AceptarInterconsulta );
router.get("/ver-controles-paciente/:id", Auth, ObtenerControlesMotivo);
router.get("/historiaclinica/:id", Auth, HistoriaclinicaPDF );
router.get("/obtener-una-consulta/:id",Auth,Obtenerunaconsulta);


export default router;