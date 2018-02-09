<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Auth_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function auth($username, $password) {
        $password = sha1($password);
        $this->db->where('borrado',0);
        $this->db->select('id_usuario as id, username, password, rol, 1 as user_type');
        $this->db->where('username', $username);
        $this->db->where('password', $password);
        $query=$this->db->get('usuario');
        if($query->num_rows()==1){
            $this->session->set_userdata('id_usuario', $query->row()->id);
            $this->session->set_userdata('tipo_usuario', 1);
            $this->session->set_userdata('rol_usuario', $query->row()->rol);
            $this->session->set_userdata('username', $query->row()->username);
            $this->db->where('id_usuario',$query->row()->id);
            $this->db->set('estatus',1);
            $this->db->update('usuario');
            return $query->row();
        }else{
            $this->db->where('borrado',0);
            $this->db->select('id_usuario as id, username, password, rol, 1 as user_type');
            $this->db->where('email', $username);
            $this->db->where('password', $password);
            $query=$this->db->get('usuario');
            if($query->num_rows()==1){
                $this->session->set_userdata('id_usuario', $query->row()->id);
                $this->session->set_userdata('tipo_usuario', 1);
		$this->session->set_userdata('rol_usuario', $query->row()->rol);
                $this->session->set_userdata('username', $query->row()->username);
                $this->db->where('id_usuario',$query->row()->id);
                $this->db->set('estatus',1);
                $this->db->update('usuario');
                return $query->row();
            }else{
                $this->db->where('borrado',0);
                $this->db->select('id_usuario_institucion as id, username, password, rol, 2 as user_type');
                $this->db->where('username', $username);
                $this->db->where('password', $password);
                $query=$this->db->get('usuario_institucion');
                if($query->num_rows()==1){
                    $this->session->set_userdata('id_usuario', $query->row()->id);
                    $this->session->set_userdata('tipo_usuario', 2);
                    $this->session->set_userdata('rol_usuario', $query->row()->rol);
                    $this->session->set_userdata('username', $query->row()->username);
                    $this->db->where('id_usuario_institucion',$query->row()->id);
                    $this->db->set('estatus',1);
                    $this->db->update('usuario_institucion');
                    return $query->row();
                }else{
                    $this->db->where('borrado',0);
                    $this->db->select('id_usuario_institucion as id, username, password, rol, 2 as user_type');
                    $this->db->where('email', $username);
                    $this->db->where('password', $password);
                    $query=$this->db->get('usuario_institucion');
                    if($query->num_rows()==1){
                        $this->session->set_userdata('id_usuario', $query->row()->id);
                        $this->session->set_userdata('tipo_usuario', 2);
			$this->session->set_userdata('rol_usuario', $query->row()->rol);
                        $this->session->set_userdata('username', $query->row()->username);
                        $this->db->where('id_usuario_institucion',$query->row()->id);
                        $this->db->set('estatus',1);
                        $this->db->update('usuario_institucion');
                        return $query->row();
                    }
                }
            }
        }
        return false;
    }
    
    public function recover($username) {
        $this->db->where('borrado',0);
        $this->db->select('*');
        $this->db->where('username', $username);
        $query=$this->db->get('usuario');
        if($query->num_rows()==1){
            $pass=$this->randomPassword();
            $this->db->where('id_usuario',$query->row()->id_usuario);
            $this->db->set('password', sha1($pass));
            $this->db->update('usuario');
            $user['email']=$query->row()->email;
            $user['username']=$query->row()->username;
            $user['nombre']=$query->row()->nombre;
            $user['apellido_paterno']=$query->row()->apellido_paterno;
            $user['apellido_materno']=$query->row()->apellido_materno;
            $user['temp_password']=$pass;
            $this->notifyRecover($user);
            return $response=array(
                'status'=>200,
                'msg'=>'ok'
            );
        }else{
            $this->db->where('borrado',0);
            $this->db->select('*');
            $this->db->where('email', $username);
            $query=$this->db->get('usuario');
            if($query->num_rows()==1){
                $pass=$this->randomPassword();
                $this->db->where('id_usuario',$query->row()->id_usuario);
                $this->db->set('password', sha1($pass));
                $this->db->update('usuario');
                $user['email']=$query->row()->email;
                $user['username']=$query->row()->username;
                $user['nombre']=$query->row()->nombre;
                $user['apellido_paterno']=$query->row()->apellido_paterno;
                $user['apellido_materno']=$query->row()->apellido_materno;
                $user['temp_password']=$pass;
                $this->notifyRecover($user);
                return $response=array(
                    'status'=>200,
                    'msg'=>'ok'
                );
            }else{
                $this->db->where('borrado',0);
                $this->db->select('*');
                $this->db->where('username', $username);
                $query=$this->db->get('usuario_institucion');
                if($query->num_rows()==1){
                    $pass=$this->randomPassword();
                    $this->db->where('id_usuario_institucion',$query->row()->id_usuario_institucion);
                    $this->db->set('password', sha1($pass));
                    $this->db->update('usuario_institucion');
                    $user['email']=$query->row()->email;
                    $user['username']=$query->row()->username;
                    $user['nombre']=$query->row()->nombre;
                    $user['apellido_paterno']=$query->row()->apellido_paterno;
                    $user['apellido_materno']=$query->row()->apellido_materno;
                    $user['temp_password']=$pass;
                    $this->notifyRecover($user);
                    return $response=array(
                        'status'=>200,
                        'msg'=>'ok'
                    );
                }else{
                    $this->db->where('borrado',0);
                    $this->db->select('*');
                    $this->db->where('email', $username);
                    $query=$this->db->get('usuario_institucion');
                    if($query->num_rows()==1){
                        $pass=$this->randomPassword();
                        $this->db->where('id_usuario_institucion',$query->row()->id_usuario_institucion);
                        $this->db->set('password', sha1($pass));
                        $this->db->update('usuario_institucion');
                        $user['email']=$query->row()->email;
                        $user['username']=$query->row()->username;
                        $user['nombre']=$query->row()->nombre;
                        $user['apellido_paterno']=$query->row()->apellido_paterno;
                        $user['apellido_materno']=$query->row()->apellido_materno;
                        $user['temp_password']=$pass;
                        $this->notifyRecover($user);
                        return $response=array(
                            'status'=>200,
                            'msg'=>'ok'
                        );
                    }
                }
            }
        }
        return $response=array(
                'status'=>400,
                'msg'=>'error'
            );
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
    
    public function notifyRecover($user) {
        $mail = new Email();
        $data=array();
        
        $data['inssue']='Recuperación de contraseña en Estudios HRWise';
        $message='Estimado(a) <strong> '.$user['nombre']." ".$user['apellido_paterno']." ".$user['apellido_materno'].": </strong>";
        $message.="<br><br><br>El sistema ha restablecido su contraseña, a continuación se le presentan los nuevos datos.";
        $message.="<br><br>Datos para acceder al sistema:";
        $message.="<br><a href='".URL_FRONT."'>".URL_FRONT."</a>";
        $message.="<br>Usuario: <strong> ".$user['username']." ó ".$user['email']." </strong>";
        $message.="<br>Nueva contraseña: <strong>".$user['temp_password']."</strong>";
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
    
}
