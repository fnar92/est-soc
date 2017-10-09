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
            $data['usuario']=$this->db->get('usuario')->row();
            return $data;
        }else if($type==2){
            $this->db->select('id_usuario_institucion as id_usuario, id_institucion, username, email, nombre, apellido_paterno, apellido_materno, rol');
            $this->db->where('id_usuario_institucion', $id);
            $usuario=$this->db->get('usuario_institucion')->row();
            $data['usuario']=$usuario;
            $data['institucion']=$this->getInstitucion($usuario->id_institucion);
            return $data; 
        }
       
    }
    
    public function getInstitucion($id) {
        $this->db->where('id_institucion', $id);
        $this->db->where('borrado', 0);
        return $this->db->get('institucion')->row();
    }
    
    public function getEmpleados() {
        $this->db->where('borrado', 0);
        return $this->db->get('usuario')->result();
    }
    
    public function updateUser($data) {
        $tipoUsuario=$data['tipo_usuario'];
        unset($data['tipo_usuario']);
        if(isset($data['password'])){
            $data['password'] = sha1($data['password']);
        }
        if($tipoUsuario==1){
            $this->db->where('id_usuario', $data['id_usuario']);
            unset($data['id_usuario']);
            return $this->db->update('usuario', $data);
        }else if ($tipoUsuario==2) {
            $data['id_usuario_institucion']=$data['id_usuario'];
            unset($data['id_usuario']);
            $this->db->where('id_usuario_institucion', $data['id_usuario_institucion']);
            unset($data['id_usuario_institucion']);
            return $this->db->update('usuario_institucion', $data);
        }
    }
    
    public function checkUser($data) {
        $tipoUsuario=$data['tipo_usuario'];
        $username=$data['username'];
        $this->db->where('borrado', 0);
        if($tipoUsuario==1){
            $this->db->where('username', $username);
            $q=$this->db->get('usuario');
            if($q->num_rows()>0){
                return 1;
            }else{
                return 0;
            }
        }else if ($tipoUsuario==2) {
            $this->db->where('username', $username);
            $q=$this->db->get('usuario_institucion');
            if($q->num_rows()>0){
                return 1;
            }else{
                return 0;
            }
        }
    }
}
