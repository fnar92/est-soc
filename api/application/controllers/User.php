<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header('Content-Type: application/json');
class User extends CI_Controller {
    
    private $idUser;
    private $typeUser;
    private $username;
    
    public function __construct() {
        parent::__construct();
        /*if(!$this->session->userdata('id_usuario')){
            exit('not_session');
        }*/
    }
    
    public function getUser($id, $type) {
        echo json_encode($this->user_model->getUser($id, $type));
    }
    
     public function getInstitucion($id) {
        echo json_encode($this->user_model->getInstitucion($id));
    }
    
    public function getEmpleados() {
        echo json_encode($this->user_model->getEmpleados());
    }
    
    public function updateUser() {
        $data=json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->user_model->updateUser($data));
    }
    
    public function checkUser() {
        $data=json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->user_model->checkUser($data));
    }
    
}
