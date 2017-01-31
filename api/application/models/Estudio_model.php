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
        $this->db->where('id_institucion', $idInstitucion);
        return $this->db->get('familia')->result();
    }
    //Familia
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
        
        $this->db->select('*');
        $this->db->from('estudio');
        $this->db->join('familia', 'estudio.id_familia = familia.id_familia');
        $this->db->join('institucion', 'institucion.id_institucion = familia.id_institucion');
        if($tipoUsuario=='1'&&$rolUsuario=='2'){
            $this->db->where('estudio.id_usuario_asignado', $idUsuario);
        }
        if($tipoUsuario=='2'&&$idInstitucion!='0'){
            $this->db->where('familia.id_institucion', $idInstitucion);
        }
        if($filterFamilia!='all'){
            $this->db->like('familia.familia', $filterFamilia);
        }
        //$this->db->get();
        //return $this->db->last_query();
        return $this->db->get()->result();
    }
    
    
    
    
    
}
