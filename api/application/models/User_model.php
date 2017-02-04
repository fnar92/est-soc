<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class User_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function getUser($id, $type) {
        if($type==1){
            $this->db->select('id_usuario as id_usuario, username, email, nombre, apellido_paterno, apellido_materno, rol');
            $this->db->where('id_usuario', $id);
            return $this->db->get('usuario')->row();
        }else if($type==2){
            $this->db->select('id_usuario_institucion as id_usuario, id_institucion, username, email, nombre, apellido_paterno, apellido_materno, rol');
            $this->db->where('id_usuario_institucion', $id);
            return $this->db->get('usuario_institucion')->row();
        }
       
    }
    
    public function getInstitucion($id) {
        $this->db->where('id_institucion', $id);
        return $this->db->get('institucion')->row();
    }
    
}
