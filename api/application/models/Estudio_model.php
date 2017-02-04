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
        //$this->db->where('id_institucion', 1);
        //$this->db->select('*');
        //$this->db->from('estudio');
        //$this->db->join('familia', 'familia.id_institucion = institucion.id_institucion');
        $this->db->join('institucion', 'institucion.id_institucion = familia.id_institucion');
        $this->db->order_by('familia.id_familia', 'ASC');
        $familias=$this->db->get('familia')->result();
        $array_familias=array();
        $i=0;
        foreach ($familias as $familia) {
            /*if ($i == 2) {
                break;
            }*/
            $familia->estudio=  $this->getEstudiosFamiliaInstitucion($familia->id_familia, 0);
            //$array_familias[]=  array_merge($familia);
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
        $this->db->insert('estudio', $data);
        $insert_id = $this->db->insert_id();
        return  array('id_estudio'=>$insert_id);
    }
    
    public function updateEstudio($data) {
        $this->db->where('id_estudio', $data['id_estudio']);
        unset($data['id_estudio']);
        $data['fecha_modificacion']=date("Y-m-d H:i:s");
        return array('status', $this->db->update('estudio', $data));
    }
    
    public function getEstudios($tipoUsuario, $rolUsuario, $idUsuario, $idInstitucion, $filterFamilia) {
        
        /*$this->db->select(
                 'es.id_estudio, es.folio_estudio,'
                .'es.institucion_familia, es.institucion_solicito,'
                .'fam.familia,'
                .'fam.calle, fam.num_ext, fam.num_int, fam.colonia, fam.localidad, fam.municipio, fam.estado,'
                .'es.fecha_estudio, es.id_estatus_estudio');
        $this->db->from('estudio es');
        $this->db->join('estudios_instituciones es_in', 'es.id_estudio = es_in.id_institucion');
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
        }*/
        
        $this->db->select(
                 'es.id_estudio, es.folio_estudio,'
                .'es.institucion_familia, es.institucion_solicito,'
                .'fam.familia,'
                .'fam.calle, fam.num_ext, fam.num_int, fam.colonia, fam.localidad, fam.municipio, fam.estado,'
                .'es.fecha_estudio, es.id_estatus_estudio, es_in.id_institucion, es.id_familia');
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
        $this->db->group_by('es.id_estudio'); 
        $estudios=$this->db->get()->result();
        $array=array();
        foreach ($estudios as $estudio) {
            $estudio->instituciones=  $this->getEstudiosFamiliaInstitucion($estudio->id_familia, $estudio->id_institucion);
            //$array_familias[]=  array_merge($familia);
            array_push($array, $estudio);
        }
        
        return $array;
    }
    
    public function getEstudiosFamiliaInstitucion($idFamilia, $idInstitucion) {
        $add="";
        if($idInstitucion!=0){
            $add=",in.clave_institucion";
        }
        $this->db->select('es_in.id_estudio, es.pago,'
                . 'es.num_recibo, es.id_estatus_estudio, es_in.id_institucion'
                . $add);
        $this->db->from('estudios_instituciones es_in');
        $this->db->join('estudio es', 'es.id_estudio = es_in.id_estudio');
        if($idInstitucion!=0){
            $this->db->join('institucion in', 'in.id_institucion = es_in.id_institucion');
            //$this->db->where('in.id_institucion', $idInstitucion);
        }
        
        //$this->db->join('familia fam', 'fam.id_familia = es.id_familia');     
        if($idFamilia!=0){
            $this->db->where('es.id_familia', $idFamilia);
        }
        
        
        //$this->db->where('es_in.id_institucion', $idInstitucion);
        $this->db->where('es.id_estatus_estudio!=', 5);
        $this->db->where('es.id_estatus_estudio!=', 6);
        return $this->db->get()->result();
        /*$this->db->select('*');
        $this->db->from('estudio es');
        $this->db->join('familia fam', 'es.id_familia = fam.id_familia');
        $this->db->where('fam.id_familia', $idFamilia);
        $this->db->where('es.id_estatus_estudio!=', 6);
        return $this->db->get()->result();*/
    }
    
    public function getEstudioActivoInstitucion($idInstitucion) {
        $this->db->select('es_in.id_estudio, es.pago, es.num_recibo');
        $this->db->from('estudios_instituciones es_in');
        $this->db->join('estudio es', 'es.id_estudio = es_in.id_estudio');   
        $this->db->where('es_in.id_institucion', $idInstitucion);
        $this->db->where('es.id_estatus_estudio!=', 6);
        return $this->db->get()->row();
    }
    
    
    
    
    
}
