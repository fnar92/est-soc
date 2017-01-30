<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Auth_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function auth($username, $password) {
        $password = sha1($password);
        $this->db->select('id_usuario as id, username, password, rol, 1 as user_type');
        $this->db->where('username', $username);
        $this->db->where('password', $password);
        $query=$this->db->get('usuario');
        if($query->num_rows()==1){
            $this->session->set_userdata('id_usuario', $query->row()->id);
            $this->session->set_userdata('tipo_usuario', 1);
			$this->session->set_userdata('rol_usuario', $query->row()->rol);
            $this->session->set_userdata('username', $query->row()->username);
            return $query->row();
        }else{
            $this->db->select('id_usuario as id, username, password, rol, 1 as user_type');
            $this->db->where('email', $username);
            $this->db->where('password', $password);
            $query=$this->db->get('usuario');
            if($query->num_rows()==1){
                $this->session->set_userdata('id_usuario', $query->row()->id);
                $this->session->set_userdata('tipo_usuario', 1);
				$this->session->set_userdata('rol_usuario', $query->row()->rol);
                $this->session->set_userdata('username', $query->row()->username);
                return $query->row();
            }else{
                $this->db->select('id_usuario_institucion as id, username, password, rol, 2 as user_type');
                $this->db->where('username', $username);
                $this->db->where('password', $password);
                $query=$this->db->get('usuario_institucion');
                if($query->num_rows()==1){
                    $this->session->set_userdata('id_usuario', $query->row()->id);
                    $this->session->set_userdata('tipo_usuario', 2);
					$this->session->set_userdata('rol_usuario', $query->row()->rol);
                    $this->session->set_userdata('username', $query->row()->username);
                    return $query->row();
                }else{
                    $this->db->select('id_usuario_institucion as id, username, password, rol, 2 as user_type');
                    $this->db->where('email', $username);
                    $this->db->where('password', $password);
                    $query=$this->db->get('usuario_institucion');
                    if($query->num_rows()==1){
                        $this->session->set_userdata('id_usuario', $query->row()->id);
                        $this->session->set_userdata('tipo_usuario', 2);
						$this->session->set_userdata('rol_usuario', $query->row()->rol);
                        $this->session->set_userdata('username', $query->row()->username);
                        return $query->row();
                    }
                }
            }
        }
        return false;
    }
    
    
}
