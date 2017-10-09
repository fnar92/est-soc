<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Admin_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function getFamiliasList() {
        $this->db->select('familia.*, institucion.clave_institucion');
        $this->db->where('familia.borrado', 0);
        $this->db->join('institucion', 'institucion.id_institucion = familia.id_institucion');
        $this->db->order_by('familia.familia', 'ASC');
        return $this->db->get('familia')->result();
    }
    public function getUserList($tipoUsuario, $idInstitucion) {
        if($tipoUsuario==1){
            $this->db->select('id_usuario as id_usuario, username, email, nombre, apellido_paterno, apellido_materno, rol, estatus');
            $this->db->where('borrado', 0);
            return $this->db->get('usuario')->result();
        }else if($tipoUsuario==2){
            $this->db->select('id_usuario_institucion as id_usuario, id_institucion, username, email, nombre, apellido_paterno, apellido_materno, rol, estatus');
            $this->db->where('id_institucion', $idInstitucion);
            $this->db->where('borrado', 0);
            return $this->db->get('usuario_institucion')->result();
        }
    }
    
     public function addUser($data) {
        $tipoUsuario=$data['tipo_usuario'];
        $idInstitucion="";
        unset($data['tipo_usuario']);
        $data2=$data;
        $pass=$this->randomPassword();
        $data2['temp_password']=$pass;
        $data['password']= sha1($pass);
        if($tipoUsuario==1){
            $this->db->insert('usuario', $data);
            //notificar
            $data2['tipo_usuario']=1;
            $this->notifyNewUser($data2);
            return $this->getUserList($tipoUsuario, $idInstitucion);
        }else if($tipoUsuario==2){
            unset($data['id_usuario']);
            $idInstitucion=$data['id_institucion'];
            $this->db->insert('usuario_institucion', $data);
            //notificar
            $data2['tipo_usuario']=2;
            $this->notifyNewUser($data2);
            return $this->getUserList($tipoUsuario, $idInstitucion);
        }
    }
    
    public function updateUser($data) {
        $tipoUsuario=$data['tipo_usuario'];
        $idInstitucion="";
        unset($data['tipo_usuario']);
        unset($data['borrado']);
        $data['fecha_modificacion']=date("Y-m-d H:i:s");
        if($tipoUsuario==1){
            $this->db->where('id_usuario', $data['id_usuario']);
            unset($data['id_usuario']);
            $this->db->update('usuario', $data);
            return $this->getUserList($tipoUsuario, $idInstitucion);
        }else if($tipoUsuario==2){
            $this->db->where('id_usuario_institucion', $data['id_usuario']);
            $this->db->where('id_institucion', $data['id_institucion']);
            $idInstitucion=$data['id_institucion'];
            unset($data['id_usuario']);
            unset($data['id_institucion']);
            $this->db->update('usuario_institucion', $data);
            return $this->getUserList($tipoUsuario, $idInstitucion);
        }
    }
    
    public function deleteUser($data) {
        $tipoUsuario=$data['tipo_usuario'];
        $idInstitucion="";
        if($tipoUsuario==1){
            $this->db->where('id_usuario', $data['id_usuario']);
            $this->db->set('borrado', 1);
            $this->db->update('usuario'); 
            return $this->getUserList($tipoUsuario, $idInstitucion);
        }else if($tipoUsuario==2){
            $idInstitucion=$data['id_institucion'];
            $this->db->where('id_usuario_institucion', $data['id_usuario']);
            $this->db->where('id_institucion', $data['id_institucion']);
            $this->db->set('borrado', 1);
            $this->db->update('usuario_institucion');
            return $this->getUserList($tipoUsuario, $idInstitucion);
        }
    }
    
    public function randomPassword() {
        $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 8; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }
    
    public function notifyNewUser($user) {
        
        $text_aux="Estudios HRWise";
        if($user['tipo_usuario']==2){
            $i=$this->user_model->getInstitucion($user['id_institucion']);
            $text_aux="<strong>".$i->nombre_institucion."</strong>";
        }
        $mail = new Email();
        $data=array();
        
        $data['inssue']='Registro de nuevo usuario en Estudios HRWise';
        $message='Estimado(a) <strong> '.$user['nombre']." ".$user['apellido_paterno']." ".$user['apellido_materno'].": </strong>";
        $message.="<br><br><br>Los administradores de ".$text_aux." lo han dado de alta para que pueda acceder al sistema de Est-Soc.";
        $message.="<br><br>Datos para acceder al sistema:";
        $message.="<br><a href='".URL_FRONT."'>".URL_FRONT."</a>";
        $message.="<br>Usuario: <strong> ".$user['username']." ó ".$user['email']." </strong>";
        $message.="<br>Contraseña: <strong>".$user['temp_password']."</strong>";
        $message.="<p><strong>Le recomendamos que una vez que entre al sistema cambie su contraseña y la recuerde.</strong></p>";
        
        $data['body']=$message;
        $data['to']=array();
        $data['cc']=array();
        $data['cco']=array();  
        
        
        $emails=array();
        $emails[]= array(
            'email'=>$user['email'],
            'name'=>$user['nombre']." ".$user['apellido_paterno']." ".$user['apellido_materno']
        );
        
        $data['to']=array_merge($emails);
        return $mail->notify($data);
    }
    
    public function getInstitucionList() {
        $this->db->where('borrado', 0);
        return $this->db->get('institucion')->result();
    }
    
    public function updateInstitucion($data) {
        $this->db->where('id_institucion', $data['id_institucion']);
        unset($data['id_institucion']);
        unset($data['borrado']);
        $data['fecha_modificacion']=date("Y-m-d H:i:s");
        $this->db->update('institucion', $data);
        return $this->getInstitucionList();
    }
    
    public function getUsuariosInstitucionList($idInstitucion) {
        $this->db->select('id_usuario_institucion as id_usuario, username, email, nombre, apellido_paterno, apellido_materno, rol, estatus, id_institucion');
        $this->db->where('id_institucion', $idInstitucion);
        $this->db->where('borrado', 0);
        return $this->db->get('usuario_institucion')->result();
    }
    
    public function addInstitucion($data) {
        $this->db->insert('institucion', $data);
        return $this->getInstitucionList(); 
    }
    
    public function deleteInstitucion($data) {
        $this->db->where('id_institucion', $data['id_institucion']);
        $this->db->set('borrado', 1);
        $this->db->update('institucion'); 
        return $this->getInstitucionList(); 
    }
    
    function updateCiclo($data) {
        $this->db->where('id_ciclo_escolar', $data['id_ciclo_escolar']);
        unset($data['id_ciclo_escolar']);
        $this->db->update('cat_ciclo_escolar', $data);
    }
}