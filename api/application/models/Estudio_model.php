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
        $this->db->order_by('familia.id_familia', 'ASC');
        $familias=$this->db->get('familia')->result();
        $array_familias=array();
        $i=0;
        foreach ($familias as $familia) {
            $familia->estudio=  $this->getEstudiosFamiliaInstitucion($familia->id_familia, 0, 0);
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
                .'es.fecha_estudio, es.id_estatus_estudio, es_in.id_institucion, es.id_familia, es_in.id_estudio_institucion');
        $this->db->from('estudio es');
        $this->db->join('estudios_instituciones es_in', 'es.id_estudio = es_in.id_estudio');
        $this->db->join('familia fam', 'es.id_familia = fam.id_familia');
        
        //$this->db->join('institucion in', 'in.id_institucion = fam.id_institucion');
        if($tipoUsuario=='1'&&$rolUsuario=='2'){
            $this->db->where('es.id_usuario_asignado', $idUsuario);
        }
        if($tipoUsuario=='2'&&$idInstitucion!='0'){
            $this->db->where('es_in.id_institucion', $idInstitucion);
            $this->db->where('es_in.estatus', 1);
        }
        
        if($filterFamilia!='all'){
            $this->db->like('fam.familia', $filterFamilia);
        }
        $this->db->group_by('es.id_estudio'); 
        $estudios=$this->db->get()->result();
        $array=array();
        foreach ($estudios as $estudio) {
            $estudio->instituciones= $this->getEstudiosFamiliaInstitucion($estudio->id_familia, $estudio->id_institucion,0);
            array_push($array, $estudio);
        }
        return $array;
    }
    
    public function getEstudiosFamiliaInstitucion($idFamilia, $idInstitucion, $idEstudio) {
        $add="";
        if($idEstudio!=0){
            $add=",in.clave_institucion";
        }
        if($idInstitucion!=0){
            $add=",in.clave_institucion";
        }
        $this->db->select('es_in.id_estudio_institucion, es_in.id_estudio, es.pago,'
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
        
        $this->db->where('es.id_estatus_estudio!=', 5);
        $this->db->where('es.id_estatus_estudio!=', 6);
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
    
    public function getEstudioDetalle($idEstudio) {
        $this->db->select('');
        $this->db->from('estudio es');
        $this->db->join('familia fam', 'es.id_familia = fam.id_familia'); 
        $this->db->join('institucion in', 'fam.id_institucion = in.id_institucion'); 
        $this->db->where('es.id_estudio', $idEstudio);
        $estudio=$this->db->get()->row();
        $estudio->instituciones=  $this->getEstudiosFamiliaInstitucion($estudio->id_familia, 0,$estudio->id_estudio);
        $estudio->hijos=$this->getHijosFamilia($estudio->id_familia);
        $estudio->dependientes=$this->getDependientesFamilia($estudio->id_familia);
        $estudio->motivos=$this->getMotivosFamilia($estudio->id_familia);
        $estudio->vehiculos=$this->getVehiculosFamilia($estudio->id_familia);
        $estudio->propiedades=  $this->getPropiedadesFamilia($estudio->id_familia);
        $estudio->ingresos=array();
        $estudio->egresos=array();
        $estudio->documentos=array();
        $estudio->evaluacion=array();
        $estudio->comentarios=array();
        return $estudio;
    }
    /*hijos*/
    public function getHijosFamilia($idFamilia){
        $this->db->where('id_familia', $idFamilia);
        return $this->db->get('hijo_familia')->result();
    }
    
    public function saveHijo($data){
        $this->db->insert('hijo_familia', $data);
        return $this->getHijosFamilia($data['id_familia']);
        
    }
    
    public function deleteHijo($data){
        $this->db->where('id_hijo_familia', $data['id_hijo_familia']);
        $this->db->delete('hijo_familia'); 
        return $this->getHijosFamilia($data['id_familia']);
    }
    
    public function updateHijo($data){
        $this->db->where('id_hijo_familia', $data['id_hijo_familia']);
        unset($data['id_hijo_familia']);
        $this->db->update('hijo_familia', $data); 
        return $this->getHijosFamilia($data['id_familia']);
    }
    /*dependientes*/
    public function getDependientesFamilia($idFamilia){
        $this->db->where('id_familia', $idFamilia);
        return $this->db->get('dependiente_familia')->result();
    }
    
    public function saveDependiente($data){
        $this->db->insert('dependiente_familia', $data);
        return $this->getDependientesFamilia($data['id_familia']);
        
    }
    
    public function deleteDependiente($data){
        $this->db->where('id_dependiente_economico', $data['id_dependiente_economico']);
        $this->db->delete('dependiente_familia'); 
        return $this->getDependientesFamilia($data['id_familia']);
    }
    
    public function updateDependiente($data){
        $this->db->where('id_dependiente_economico', $data['id_dependiente_economico']);
        unset($data['id_dependiente_economico']);
        $this->db->update('dependiente_familia', $data); 
        return $this->getDependientesFamilia($data['id_familia']);
    }
    /*motivos*/
    public function getMotivosFamilia($idFamilia){
        $this->db->where('id_familia', $idFamilia);
        return $this->db->get('motivo_familia')->result();
    }
    
    public function saveMotivo($data){
        $this->db->insert('motivo_familia', $data);
        return $this->getMotivosFamilia($data['id_familia']);
        
    }
    
    public function deleteMotivo($data){
        $this->db->where('id_motivo', $data['id_motivo']);
        $this->db->delete('motivo_familia'); 
        return $this->getMotivosFamilia($data['id_familia']);
    }
    
    public function updateMotivo($data){
        $this->db->where('id_motivo', $data['id_motivo']);
        unset($data['id_motivo']);
        $this->db->update('motivo_familia', $data); 
        return $this->getMotivosFamilia($data['id_familia']);
    }
    
    /*vehiculos*/
    public function getVehiculosFamilia($idFamilia){
        $this->db->where('id_familia', $idFamilia);
        return $this->db->get('vehiculo_familia')->result();
    }
    
    public function saveVehiculo($data){
        $this->db->insert('vehiculo_familia', $data);
        return $this->getVehiculosFamilia($data['id_familia']);
        
    }
    
    public function deleteVehiculo($data){
        $this->db->where('id_vehiculo_familia', $data['id_vehiculo_familia']);
        $this->db->delete('vehiculo_familia'); 
        return $this->getVehiculosFamilia($data['id_familia']);
    }
    
    public function updateVehiculo($data){
        $this->db->where('id_vehiculo_familia', $data['id_vehiculo_familia']);
        unset($data['id_vehiculo_familia']);
        $this->db->update('vehiculo_familia', $data); 
        return $this->getVehiculosFamilia($data['id_familia']);
    }
    
    /*propiedades*/
    public function getPropiedadesFamilia($idFamilia){
        $this->db->where('id_familia', $idFamilia);
        return $this->db->get('propiedad_familia')->result();
    }
    
    public function savePropiedad($data){
        $this->db->insert('propiedad_familia', $data);
        return $this->getPropiedadesFamilia($data['id_familia']);
        
    }
    
    public function deletePropiedad($data){
        $this->db->where('id_propiedad_familia', $data['id_propiedad_familia']);
        $this->db->delete('propiedad_familia'); 
        return $this->getPropiedadesFamilia($data['id_familia']);
    }
    
    public function updatePropiedad($data){
        $this->db->where('id_propiedad_familia', $data['id_propiedad_familia']);
        unset($data['id_propiedad_familia']);
        $this->db->update('propiedad_familia', $data); 
        return $this->getPropiedadesFamilia($data['id_familia']);
    }
    
    public function updateEstudioInstitucion($data) {
        $this->db->where('id_estudio_institucion', $data['id_estudio_institucion']);
        unset($data['id_estudio_institucion']);
        return $this->db->update('estudios_instituciones', $data); 
    }
}
