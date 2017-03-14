<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Estudio_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function getFamilias($idInstitucion, $filterFamilia) {
        if($filterFamilia!='all'){
            $this->db->like('familia', $filterFamilia);
        }
        
        $this->db->join('institucion', 'institucion.id_institucion = familia.id_institucion');
        //$this->db->join('estudios_instituciones', 'institucion.id_institucion = estudios_instituciones.id_institucion');
        $this->db->order_by('familia.id_familia', 'ASC');
        $familias=$this->db->get('familia')->result();
        $array_familias=array();
        $i=0;
        foreach ($familias as $familia) {
            $familia->estudio=  $this->getEstudiosFamiliaInstitucion($familia->id_familia, 0, 0, $idInstitucion);
            array_push($array_familias, $familia);
            $i++;
        }
        return $array_familias;
    }
    
    //Familia
    public function saveEstudioInstitucion($data) {
        return  $this->db->insert('estudios_instituciones', $data);
    }
    
    public function saveFamilia($data) {
        $data['fecha_registro']=date("Y-m-d");
        $data['fecha_modificacion']=date("Y-m-d H:i:s");
        $this->db->insert('familia', $data);
        $insert_id = $this->db->insert_id();
        return  array('id_familia'=>$insert_id);
    }
    
    public function updateFamilia($data) {
        $this->db->where('id_familia', $data['id_familia']);
        unset($data['id_familia']);
        $data['fecha_modificacion']=date("Y-m-d H:i:s");
        return array('status', $this->db->update('familia', $data));
    }
    
    public function getFamilia($id) {
        $this->db->where('id_familia', $id);
        return $this->db->get('familia')->row();
    }
    
    //Estudio
    public function saveEstudio($data) {
        $data['fecha_estudio']=date("Y-m-d");
        $data['fecha_modificacion']=date("Y-m-d H:i:s");
        unset($data['pago']);
        unset($data['num_recibo']);
        $this->db->insert('estudio', $data);
        $insert_id = $this->db->insert_id();
        return  array('id_estudio'=>$insert_id);
    }
    
    public function updateEstudio($data) {
        $this->db->where('id_estudio', $data['id_estudio']);
        unset($data['id_estudio']);
        $data['fecha_modificacion']=date("Y-m-d H:i:s");
        return array('status'=>$this->db->update('estudio', $data));
    }
    
    public function getEstudios($tipoUsuario, $rolUsuario, $idUsuario, $idInstitucion, $filterFamilia) {
        
        $this->db->select(
                 'es.id_estudio, es.folio_estudio,'
                .'es.institucion_familia, es.institucion_solicito,'
                .'fam.familia,'
                .'fam.calle, fam.num_ext, fam.num_int, fam.colonia, fam.localidad, fam.municipio, fam.estado,'
                .'es.fecha_estudio, fecha_entrevista, fecha_reagendar_entrevista, es.id_estatus_estudio, es_in.id_institucion, es.id_familia, es.id_usuario_asignado,'
                .'es_in.id_estudio_institucion, es_in.estatus');
        $this->db->from('estudio es');
        $this->db->join('estudios_instituciones es_in', 'es.id_estudio = es_in.id_estudio');
        $this->db->join('familia fam', 'es.id_familia = fam.id_familia');
        
        //$this->db->join('institucion in', 'in.id_institucion = fam.id_institucion');
        if($tipoUsuario=='1'&&$rolUsuario=='2'){
            $this->db->where('es.id_usuario_asignado', $idUsuario);
        }
        if($tipoUsuario=='2'&&$idInstitucion!='0'){
            $this->db->where('es_in.id_institucion', $idInstitucion);
        }
        
        
        
        if($filterFamilia!='all'){
            $this->db->like('fam.familia', $filterFamilia);
        }
        if($tipoUsuario=='1'){
            $this->db->group_by('es.id_estudio');
            //$this->db->where('es_in.estatus', 1);
        }
        
        $this->db->where('es_in.estatus', 1);
        $this->db->order_by('es.id_estudio');
        $estudios=$this->db->get()->result();
        $array=array();
        foreach ($estudios as $estudio) {
            $estudio->instituciones= $this->getEstudiosFamiliaInstitucion($estudio->id_familia, $estudio->id_institucion,0, $tipoUsuario);
            $estudio->usuario_asignado= $this->getUsuarioAsignado($estudio->id_usuario_asignado);
            array_push($array, $estudio);
        }
        return $array;
    }
    
    public function getUsuarioAsignado($idUsuario) {
        $this->db->where('id_usuario', $idUsuario);
        return $this->db->get('usuario')->result();;
    }
    
    public function getEstudiosFamiliaInstitucion($idFamilia, $idInstitucion, $idEstudio, $tipoUsuario) {
        $add="";
        if($idEstudio!=0){
            $add=",in.clave_institucion";
        }
        if($idInstitucion!=0){
            $add=",in.clave_institucion";
        }
        $this->db->select('es_in.id_estudio_institucion, es_in.id_estudio, es.pago, es.ciclo_escolar,'
                . 'es.num_recibo, es.id_estatus_estudio, es_in.id_institucion'
                . $add);
        $this->db->from('estudios_instituciones es_in');
        $this->db->join('estudio es', 'es.id_estudio = es_in.id_estudio');
        if($idInstitucion!=0||$idEstudio!=0){
            $this->db->join('institucion in', 'in.id_institucion = es_in.id_institucion');
        }
        
        if($idFamilia!=0){
            $this->db->where('es.id_familia', $idFamilia);
        }
        
        if($idEstudio!=0){
            $this->db->where('es_in.id_estudio', $idEstudio);
        }
        
        /*if($tipoUsuario==='2'){
            $this->db->where('es_in.estatus', 1);
        }
        
        if($tipoUsuario==='1'){
            $this->db->where('es_in.estatus', 1);
            $this->db->or_where('es_in.estatus', 2);
        }*/
        
        $this->db->where('es_in.estatus', 1);
        $this->db->group_by('es_in.id_institucion');
        $ins=$this->db->get()->result();
        $result=array();
        foreach ($ins as $in) {
            $in->count=  $this->getCountIns($in->id_estudio, $in->id_institucion);
            array_push($result, $in);
        }
        return $result;
    }
    
    public function getCountIns($idEstudio, $idInstitucion) {
        $this->db->select('count(*) as total');
        $this->db->from('estudios_instituciones es_in');
        $this->db->join('estudio es', 'es.id_estudio = es_in.id_estudio');
        $this->db->join('institucion in', 'in.id_institucion = es_in.id_institucion');
        $this->db->where('es.id_estudio', $idEstudio);
        $this->db->where('es_in.estatus', 1);
        $this->db->where('in.id_institucion', $idInstitucion);
        return $this->db->get()->row();
    }
    
    public function getEstudioActivoInstitucion($idInstitucion) {
        $this->db->select('es_in.id_estudio, es.pago, es.num_recibo');
        $this->db->from('estudios_instituciones es_in');
        $this->db->join('estudio es', 'es.id_estudio = es_in.id_estudio');   
        $this->db->where('es_in.id_institucion', $idInstitucion);
        $this->db->where('es.id_estatus_estudio!=', 6);
        return $this->db->get()->row();
    }
    
    public function getEstudioDetalle($idEstudio, $idInstitucion) {
        $this->db->select('*');
        $this->db->from('estudio es');
        $this->db->join('familia fam', 'es.id_familia = fam.id_familia'); 
        $this->db->join('institucion in', 'fam.id_institucion = in.id_institucion'); 
        $this->db->join('estudios_instituciones ei', 'ei.id_estudio = es.id_estudio'); 
        $this->db->where('es.id_estudio', $idEstudio);
        if($idInstitucion!=='0'){
            $this->db->where('ei.id_institucion', $idInstitucion);
            $this->db->where('ei.estatus', 1);
        }
        $estudio=$this->db->get()->row();
        $estudio->instituciones=  $this->getEstudiosFamiliaInstitucion($estudio->id_familia, 0,$estudio->id_estudio, 1);
        $estudio->hijos=$this->getHijosFamilia($estudio->id_familia, $estudio->id_estudio);
        $estudio->dependientes=$this->getDependientesFamilia($estudio->id_familia, $estudio->id_estudio);
        $estudio->motivos=$this->getMotivosFamilia($estudio->id_familia, $estudio->id_estudio);
        $estudio->vehiculos=$this->getVehiculosFamilia($estudio->id_familia, $estudio->id_estudio);
        $estudio->propiedades=  $this->getPropiedadesFamilia($estudio->id_familia, $estudio->id_estudio);
        $estudio->ingresos=$this->getIngresosFamilia($estudio->id_familia, $estudio->id_estudio);
        $estudio->egresos=$this->getEgresosFamilia($estudio->id_familia, $estudio->id_estudio);
        $estudio->documentos=$this->getDocumentosFamilia($estudio->id_familia, $estudio->id_estudio);
        $estudio->evaluacion=$this->getEvaluacionFamilia($estudio->id_familia, $estudio->id_estudio);
        $estudio->comentarios=$this->getComentarioesFamilia($estudio->id_familia, $estudio->id_estudio);
        $estudio->padres=$this->getPadreFamilia($estudio->id_familia, $estudio->id_estudio);
        $estudio->usuario_asignado= $this->getUsuarioAsignado($estudio->id_usuario_asignado);
        return $estudio;
    }
    /*hijos*/
    public function getHijosFamilia($idFamilia, $idEstudio){
        $this->db->where('id_familia', $idFamilia);
        $this->db->where('id_estudio', $idEstudio);
        $this->db->order_by('fecha_registro');
        return $this->db->get('hijo_familia')->result();
    }
    
    public function saveHijo($data){
        $data['fecha_registro']=date('Y-m-d H:i:s');
        $this->db->insert('hijo_familia', $data);
        return $this->getHijosFamilia($data['id_familia'], $data['id_estudio']);
        
    }
    
    public function deleteHijo($data){
        $this->db->where('id_hijo_familia', $data['id_hijo_familia']);
        $this->db->delete('hijo_familia'); 
        return $this->getHijosFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    public function updateHijo($data){
        $this->db->where('id_hijo_familia', $data['id_hijo_familia']);
        unset($data['id_hijo_familia']);
        $this->db->update('hijo_familia', $data); 
        return $this->getHijosFamilia($data['id_familia'], $data['id_estudio']);
    }
    /*dependientes*/
    public function getDependientesFamilia($idFamilia, $idEstudio){
        $this->db->where('id_familia', $idFamilia);
        $this->db->where('id_estudio', $idEstudio);
        return $this->db->get('dependiente_familia')->result();
    }
    
    public function saveDependiente($data){
        $this->db->insert('dependiente_familia', $data);
        return $this->getDependientesFamilia($data['id_familia'], $data['id_estudio']);
        
    }
    
    public function deleteDependiente($data){
        $this->db->where('id_dependiente_economico', $data['id_dependiente_economico']);
        $this->db->delete('dependiente_familia'); 
        return $this->getDependientesFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    public function updateDependiente($data){
        $this->db->where('id_dependiente_economico', $data['id_dependiente_economico']);
        unset($data['id_dependiente_economico']);
        $this->db->update('dependiente_familia', $data); 
        return $this->getDependientesFamilia($data['id_familia'], $data['id_estudio']);
    }
    /*motivos*/
    public function getMotivosFamilia($idFamilia, $idEstudio){
        $this->db->where('id_familia', $idFamilia);
        $this->db->where('id_estudio', $idEstudio);
        return $this->db->get('motivo_familia')->result();
    }
    
    public function saveMotivo($data){
        $this->db->insert('motivo_familia', $data);
        return $this->getMotivosFamilia($data['id_familia'], $data['id_estudio']);
        
    }
    
    public function deleteMotivo($data){
        $this->db->where('id_motivo', $data['id_motivo']);
        $this->db->delete('motivo_familia'); 
        return $this->getMotivosFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    public function updateMotivo($data){
        $this->db->where('id_motivo', $data['id_motivo']);
        unset($data['id_motivo']);
        $this->db->update('motivo_familia', $data); 
        return $this->getMotivosFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    /*vehiculos*/
    public function getVehiculosFamilia($idFamilia, $idEstudio){
        $this->db->where('id_familia', $idFamilia);
        $this->db->where('id_estudio', $idEstudio);
        return $this->db->get('vehiculo_familia')->result();
    }
    
    public function saveVehiculo($data){
        $this->db->insert('vehiculo_familia', $data);
        return $this->getVehiculosFamilia($data['id_familia'], $data['id_estudio']);
        
    }
    
    public function deleteVehiculo($data){
        $this->db->where('id_vehiculo_familia', $data['id_vehiculo_familia']);
        $this->db->delete('vehiculo_familia'); 
        return $this->getVehiculosFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    public function updateVehiculo($data){
        $this->db->where('id_vehiculo_familia', $data['id_vehiculo_familia']);
        unset($data['id_vehiculo_familia']);
        $this->db->update('vehiculo_familia', $data); 
        return $this->getVehiculosFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    /*propiedades*/
    public function getPropiedadesFamilia($idFamilia, $idEstudio){
        $this->db->where('id_familia', $idFamilia);
        $this->db->where('id_estudio', $idEstudio);
        return $this->db->get('propiedad_familia')->result();
    }
    
    public function savePropiedad($data){
        $this->db->insert('propiedad_familia', $data);
        return $this->getPropiedadesFamilia($data['id_familia'], $data['id_estudio']);
        
    }
    
    public function deletePropiedad($data){
        $this->db->where('id_propiedad_familia', $data['id_propiedad_familia']);
        $this->db->delete('propiedad_familia'); 
        return $this->getPropiedadesFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    public function updatePropiedad($data){
        $this->db->where('id_propiedad_familia', $data['id_propiedad_familia']);
        unset($data['id_propiedad_familia']);
        $this->db->update('propiedad_familia', $data); 
        return $this->getPropiedadesFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    public function updateEstudioInstitucion($data) {
        $this->db->where('id_estudio_institucion', $data['id_estudio_institucion']);
        unset($data['id_estudio_institucion']);
        return $this->db->update('estudios_instituciones', $data); 
    }
    
    public function getIngresosFamilia($idFamilia, $idEstudio) {
        $this->db->where('id_familia', $idFamilia);
        $this->db->where('id_estudio', $idEstudio);
        $this->db->order_by('id_ingreso_familia', 'desc');
        return $this->db->get('ingresos_familia')->result();
    }
    
    public function saveIngresos($data) {
        $this->db->insert('ingresos_familia', $data);
        return $this->getIngresosFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    public function updateIngresos($data) {
        $this->db->where('id_ingreso_familia', $data['id_ingreso_familia']);
        unset($data['id_ingreso_familia']);
        $this->db->update('ingresos_familia', $data); 
        return $this->getIngresosFamilia($data['id_familia'], $data['id_estudio']); 
    }
    
    public function getPadreFamilia($idFamilia, $idEstudio) {
        $this->db->where('id_familia', $idFamilia);
        $this->db->where('id_estudio', $idEstudio);
        $this->db->order_by('id_padre_familia', 'ASC');
        return $this->db->get('padre_familia')->result();
    }
    
    public function savePapa($data) {
        $this->db->insert('padre_familia', $data);
        return $this->getPadreFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    public function updatePapa($data) {
        $this->db->where('id_padre_familia', $data['id_padre_familia']);
        unset($data['id_padre_familia']);
        $this->db->update('padre_familia', $data); 
        return $this->getPadreFamilia($data['id_familia'], $data['id_estudio']); 
    }
    
    public function getEgresosFamilia($idFamilia, $idEstudio) {
        $this->db->where('id_familia', $idFamilia);
        $this->db->where('id_estudio', $idEstudio);
        $this->db->order_by('id_egreso_familia', 'desc');
        return $this->db->get('egresos_familia')->result();
    }
    
    public function saveEgresos($data) {
        $this->db->insert('egresos_familia', $data);
        return $this->getEgresosFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    public function updateEgresos($data) {
        $this->db->where('id_egreso_familia', $data['id_egreso_familia']);
        unset($data['id_egreso_familia']);
        $this->db->update('egresos_familia', $data); 
        return $this->getEgresosFamilia($data['id_familia'], $data['id_estudio']); 
    }
    
    public function getDocumentosFamilia($idFamilia, $idEstudio) {
        $this->db->where('id_familia', $idFamilia);
        $this->db->where('id_estudio', $idEstudio);
        $this->db->order_by('id_documento_familia', 'desc');
        return $this->db->get('documentos_familia')->result();
    }
    
    public function saveDocumentos($data) {
        $this->db->insert('documentos_familia', $data);
        return $this->getDocumentosFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    public function updateDocumentos($data) {
        $this->db->where('id_documento_familia', $data['id_documento_familia']);
        unset($data['id_documento_familia']);
        $this->db->update('documentos_familia', $data); 
        return $this->getDocumentosFamilia($data['id_familia'], $data['id_estudio']); 
    }
    
    public function getEvaluacionFamilia($idFamilia, $idEstudio) {
        $this->db->where('id_familia', $idFamilia);
        $this->db->where('id_estudio', $idEstudio);
        $this->db->order_by('id_evaluacion_familia', 'desc');
        return $this->db->get('evaluacion_familia')->result();
    }
    
    public function saveEvaluacion($data) {
        $this->db->insert('evaluacion_familia', $data);
        return $this->getEvaluacionFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    public function updateEvaluacion($data) {
        $this->db->where('id_evaluacion_familia', $data['id_evaluacion_familia']);
        unset($data['id_evaluacion_familia']);
        $this->db->update('evaluacion_familia', $data); 
        return $this->getEvaluacionFamilia($data['id_familia'], $data['id_estudio']); 
    }
    
    public function getCicloEscolar() {
        $this->db->where('status', 1);
        return $this->db->get('cat_ciclo_escolar')->result(); 
    }
    
    /*comentarios*/
    public function getComentarioesFamilia($idFamilia, $idEstudio){
        $this->db->where('id_familia', $idFamilia);
        $this->db->where('id_estudio', $idEstudio);
        return $this->db->get('comentario_familia')->result();
    }
    
    public function saveComentario($data){
        $this->db->insert('comentario_familia', $data);
        return $this->getComentarioesFamilia($data['id_familia'], $data['id_estudio']);
        
    }
    
    public function deleteComentario($data){
        $this->db->where('id_comentario_familia', $data['id_comentario_familia']);
        $this->db->delete('comentario_familia'); 
        return $this->getComentarioesFamilia($data['id_familia'], $data['id_estudio']);
    }
    
    public function updateComentario($data){
        $this->db->where('id_comentario_familia', $data['id_comentario_familia']);
        unset($data['id_comentario_familia']);
        $this->db->update('comentario_familia', $data); 
        return $this->getComentarioesFamilia($data['id_familia'], $data['id_estudio']);
    }
}
