<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Admin_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function getUserList($tipoUsuario, $idInstitucion) {
        if($tipoUsuario==1){
            $this->db->select('id_usuario as id_usuario, username, email, nombre, apellido_paterno, apellido_materno, rol');
            return $this->db->get('usuario')->result();
        }else if($tipoUsuario==2){
            $this->db->select('id_usuario_institucion as id_usuario, id_institucion, username, email, nombre, apellido_paterno, apellido_materno, rol');
            $this->db->where('id_institucion', $idInstitucion);
            return $this->db->get('usuario_institucion')->result();
        }
       
    }
    
    
}
