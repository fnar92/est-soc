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
    
     public function addUser($data) {
        $this->db->trans_start();
        $tipoUsuario=$data['tipo_usuario'];
        unset($data['tipo_usuario']);
        if($tipoUsuario==1){
            $this->db->insert('usuario', $data);
            return array('status', $this->db->trans_complete());
        }else if($tipoUsuario==2){
            unset($data['id_usuario']);
            $this->db->insert('usuario_institucion', $data);
            return array('status', $this->db->trans_complete());
        }
    }
    
    public function updateUser($data) {
        $tipoUsuario=$data['tipo_usuario'];
        unset($data['tipo_usuario']);
        if($tipoUsuario==1){
            $this->db->where('id_usuario', $data['id_usuario']);
            unset($data['id_usuario']);
            return array('status', $this->db->update('usuario', $data));
        }else if($tipoUsuario==2){
            $this->db->where('id_usuario_institucion', $data['id_usuario']);
            $this->db->where('id_institucion', $data['id_institucion']);
            unset($data['id_usuario']);
            unset($data['id_institucion']);
            return array('status', $this->db->update('usuario_institucion', $data));
        }
    }
    
    public function deleteUser($data) {
        $tipoUsuario=$data['tipo_usuario'];
        if($tipoUsuario==1){
            $this->db->where('id_usuario', $data['id_usuario']);
            return $this->db->delete('usuario'); 
        }else if($tipoUsuario==2){
            $this->db->where('id_usuario_institucion', $data['id_usuario']);
            $this->db->where('id_institucion', $data['id_institucion']);
            $this->db->delete('usuario_institucion');
        }
    }
}
