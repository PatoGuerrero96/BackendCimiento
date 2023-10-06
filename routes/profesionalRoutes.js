import express, { Router }  from "express";

const router = express.Router();
import { perfil, confirmar, autenticar, olvidePassword, 
    comprobarToken, nuevoPassword,
    actualizarPassword,actualizarPerfil,
    subirFotoPerfil,
    Obtenermotivosdeconsulta,
    Obtenerunmotivodeconsulta,
    generarNotificacion,
    verConsultas,
    obtenerTarifa,
    obtenerTarifaGlobal,
    verListaConsultas,
    consultarConsultasAceptadas,
    VerMasEnConsultaPro,
    agregarTarifaProfesional,
    obtenerTarifaProfesional,
    eliminarTarifaProfesional,
    actualizarTarifa,
    agregarEducacionProfesional,
    obtenerEducacionProfesional,
    eliminarEducacionProfesional,
    actualizarEducacion,
    actualizarExperiencia,
    eliminarExperienciaProfesional,
    obtenerExperienciaProfesional,
    agregarExperienciaProfesional,
    actualizarEspecialidad,
    eliminarEspecialidadProfesional,
    obtenerEspecialidadProfesional,
    agregarEspecialidadProfesional,
    agregarSeccionTarifa,
    obtenerSeccionTarifa,
    eliminarSeccionTarifa,
    actualizarSeccionTarifa,
    obtenertarifaGlobales,
    Consultascalendario,
    actualizarvisibilidadCelular,
    actualizarvisibilidadCorreo,
    ObtenerInformacionPaciente,
    ActualizarEnfermedadesPaciente,
    GuardarEnfermedadPaciente,
    GuardarSolicitudExamenPaciente,
    ActualizarIdentificacionPaciente,
    ActualizarFarmacoPaciente,
    obtenerEnfermedades,
    GuardarFarmacoPaciente,
    ActualizarFarmacoPrevioPaciente,
    GuardarFarmacoPrevioPaciente,
    ActualizarQuirurgicosPaciente,
    GuardarQuirurgicosPaciente,
    ActualizarAlergiasPaciente,
    GuardarAlergiaPaciente,
    ActualizarAntecedentesfamPaciente,
    GuardarAntecedentesfamPaciente,
    ActualizarHospitalizacionesPaciente,
    GuardarHospitalizacionesPaciente,
    Actualizarpreguntaspro,
    ActualizarGinePaciente,
    ActualizarConsultaFicha,
    ActualizarMotivoConsulta,
    obtenerMedidasGenerales,
    GuardarMedidaGeneral,
    GuardarEnfermedadPacienteFicha,
    GuardarFarmacoPacienteFicha,
    GuardarReceta,
    GuardarExamenSolicitado,
    ObtenerExamenesSolicitados,
    ObtenerRecetasMotivo,
    obtenertusMedidasGenerales,
    eliminarMedida,
    actualizarMedida,
    NotificacionParainterconsulta,
    GuardarControlesPaciente,
    ObtenerControlesMotivo,
    NoInterconsulta,
    FinalizarConsulta,
    ActualizarLinkFicha,
    eliminarFarmacosFicha,
    eliminarExamensolicitado,
    obtenerrecetasmagistrales,
    GuardarRecetasMagistral,
    obtenertusRecetasmagistrales,
    eliminarRecetaMagistral,
    actualizarRecetaMagistral,
    obtenertusSignosalarma,
    GuardarSignosalarma,
    obtenertusSignos,
    eliminarSignos,
    actualizarSignos,
    ActualizarSignosmotivo
 } from '../controllers/profesionalController.js'
import AuthPro from "../middleware/authProMiddleware.js";

//Area publica
router.get("/confirmar/:token",confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:token",comprobarToken)
router.post("/olvide-password/:token", nuevoPassword)

// area privada
router.get("/perfil", AuthPro, perfil);
router.put("/perfil/:id" ,AuthPro,actualizarPerfil );
router.put("/actualizar-password", AuthPro, actualizarPassword)
router.put('/foto-perfil/:id',AuthPro, subirFotoPerfil);

//Motivos de consulta
router.get("/obtener-motivos", AuthPro, Obtenermotivosdeconsulta);
router.get("/obtener-motivo/:id", AuthPro, Obtenerunmotivodeconsulta);
router.post("/generar-consulta",AuthPro,generarNotificacion );
router.get("/obtener-consultas", AuthPro, verConsultas);
router.get("/obtener-lista-consultas", AuthPro, verListaConsultas);
router.get("/obtener-consultas-calendario", AuthPro, Consultascalendario);
router.get("/obtener-tarifas", AuthPro, obtenerTarifa);
router.get("/obtener-tarifas-global", AuthPro, obtenerTarifaGlobal);
router.put("/cambiar-estado-consultas-aceptadas/:id", AuthPro,consultarConsultasAceptadas);
router.get("/verconsulta/:id", AuthPro, VerMasEnConsultaPro);

//Tarifas
router.post("/crear-tarifa",AuthPro,agregarTarifaProfesional );
router.get("/traer-tarifas",AuthPro, obtenerTarifaProfesional);
router.delete("/borrar-tarifa/:id",AuthPro, eliminarTarifaProfesional );
router.put("/actualizar-tarifa/:id",AuthPro, actualizarTarifa);

//Educacion
router.post("/crear-educacion",AuthPro,agregarEducacionProfesional );
router.get("/traer-educacion",AuthPro, obtenerEducacionProfesional);
router.delete("/borrar-educacion/:id",AuthPro, eliminarEducacionProfesional);
router.put("/actualizar-educacion/:id",AuthPro, actualizarEducacion);

//Experiencia laborarl
router.post("/crear-experiencia",AuthPro,agregarExperienciaProfesional );
router.get("/traer-experiencia",AuthPro, obtenerExperienciaProfesional);
router.delete("/borrar-experiencia/:id",AuthPro, eliminarExperienciaProfesional);
router.put("/actualizar-experiencia/:id",AuthPro, actualizarExperiencia);

//Especialidad
router.post("/crear-especialidad",AuthPro, agregarEspecialidadProfesional );
router.get("/traer-especialidad",AuthPro,  obtenerEspecialidadProfesional);
router.delete("/borrar-especialidad/:id",AuthPro, eliminarEspecialidadProfesional);
router.put("/actualizar-especialidad/:id",AuthPro,  actualizarEspecialidad);

//Secciones para tarifas
router.post("/crear-seccion-tarifa",AuthPro, agregarSeccionTarifa);
router.get("/traer-seccion-tarifa",AuthPro, obtenerSeccionTarifa);
router.delete("/borrar-seccion/:id",AuthPro,  eliminarSeccionTarifa);
router.put("/actualizar-seccion/:id",AuthPro,actualizarSeccionTarifa);
//tarifa globales
router.get("/traer-tarifaglobales",AuthPro,obtenertarifaGlobales);


//ocultar perfil 
router.put('/actualizar-visibilidadcelular/:id',AuthPro,actualizarvisibilidadCelular);
router.put('/actualizar-visibilidadcorreo/:id',AuthPro,actualizarvisibilidadCorreo);

//Ficha paciente
router.put("/editar-indentificacion-paciente/:id",AuthPro,ActualizarIdentificacionPaciente);
router.get("/informacion-paciente-consulta/:id",AuthPro,ObtenerInformacionPaciente);
router.put("/editar-enfermedades-paciente/:id",AuthPro,ActualizarEnfermedadesPaciente);
router.post('/agregar-enfermedad-paciente',AuthPro,GuardarEnfermedadPaciente);
router.post('/agregar-solicitud-examen',AuthPro,GuardarSolicitudExamenPaciente);
router.put("/editar-farmacos-paciente/:id",AuthPro,ActualizarFarmacoPaciente);
router.get("/obtener-enfermedades",AuthPro,obtenerEnfermedades);
router.post('/agregar-farmaco-paciente',AuthPro,GuardarFarmacoPaciente);
router.put("/editar-farmacos-previos-paciente/:id",AuthPro,ActualizarFarmacoPrevioPaciente);
router.post('/agregar-farmaco-previo-paciente',AuthPro,GuardarFarmacoPrevioPaciente);
router.put("/editar-quirurgicos-paciente/:id",AuthPro,ActualizarQuirurgicosPaciente);
router.post('/agregar-quirurgicos-paciente',AuthPro,GuardarQuirurgicosPaciente);
router.put("/editar-alergias-paciente/:id",AuthPro,ActualizarAlergiasPaciente);
router.post('/agregar-alergias-paciente',AuthPro,GuardarAlergiaPaciente);
router.put("/editar-antecedentefam-paciente/:id",AuthPro,ActualizarAntecedentesfamPaciente);
router.post('/agregar-antecedentefam-paciente',AuthPro,GuardarAntecedentesfamPaciente);
router.put("/editar-hospitalizaciones-paciente/:id",AuthPro,ActualizarHospitalizacionesPaciente);
router.post('/agregar-hospitalizaciones-paciente',AuthPro,GuardarHospitalizacionesPaciente);
router.put("/actualizar-preguntas-pro/:id",AuthPro,Actualizarpreguntaspro);
router.put("/actualizar-gine/:id", AuthPro,ActualizarGinePaciente);
router.put("/actualizar-consulta-ficha/:id", AuthPro,ActualizarConsultaFicha);
router.put("/actualizar-motivo-ficha/:id", AuthPro,ActualizarMotivoConsulta);
router.get("/obtener-medidasgenerales",AuthPro,obtenerMedidasGenerales);
router.post('/agregar-medidageneral',AuthPro,GuardarMedidaGeneral);
router.post('/agregar-enfermedad-motivo',AuthPro,GuardarEnfermedadPacienteFicha);
router.post('/agregar-farmaco-motivo',AuthPro,GuardarFarmacoPacienteFicha);

router.post('/guardar-receta',AuthPro,GuardarReceta);
router.get("/obtener-recetas/:id",AuthPro,ObtenerRecetasMotivo);
router.post('/guardar-examenes-solicitado',AuthPro,GuardarExamenSolicitado);
router.get("/obtener-examenes-solicitados/:id",AuthPro,ObtenerExamenesSolicitados);
router.get("/obtener-tus-medidas-generales/:id",AuthPro,obtenertusMedidasGenerales);
router.delete("/eliminar-medida-general/:id",AuthPro,eliminarMedida);
router.put("/actualizar-medida-general/:id",AuthPro,actualizarMedida);
router.put("/actualizar-notificacion-interconsulta/:id",AuthPro,NotificacionParainterconsulta);
router.post('/guardar-control',AuthPro,GuardarControlesPaciente);
router.get("/obtener-controles-motivo/:id",AuthPro,ObtenerControlesMotivo);
router.put("/actualizar-no-interconsulta/:id",AuthPro,NoInterconsulta);
router.put('/finalizar-consulta/:id',AuthPro,FinalizarConsulta);
router.put('/actualizar-link-consulta/:id',AuthPro,ActualizarLinkFicha);
router.delete("/eliminar-farmaco-motivo/:id",AuthPro,eliminarFarmacosFicha);
router.delete("/eliminar-examensolicitado-ficha/:id",AuthPro,eliminarExamensolicitado);

router.get("/obtener-recetasmagistrales",AuthPro,obtenerrecetasmagistrales);
router.post('/guardar-datos-recetas-magistral',AuthPro,GuardarRecetasMagistral);
router.get("/obtener-tus-recetas-magistrales/:id",AuthPro,obtenertusRecetasmagistrales);
router.delete("/eliminar-receta-magistral/:id",AuthPro,eliminarRecetaMagistral);
router.put("/actualizar-receta-magistral/:id",AuthPro,actualizarRecetaMagistral);

router.get("/obtener-signos",AuthPro,obtenertusSignosalarma);
router.post('/guardar-datos-signos',AuthPro,GuardarSignosalarma);
router.get("/obtener-tus-signos/:id",AuthPro,obtenertusSignos);
router.delete("/eliminar-signos/:id",AuthPro,eliminarSignos);
router.put("/actualizar-signos/:id",AuthPro,actualizarSignos);
router.put("/actualizar-signos-motivo/:id",AuthPro,ActualizarSignosmotivo);

export default router;