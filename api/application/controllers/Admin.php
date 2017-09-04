<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header('Content-Type: application/json');
class Admin extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function getUserList($tipoUsuario, $idInstitucion) {
        echo json_encode($this->admin_model->getUserList($tipoUsuario, $idInstitucion));
    }
    
    public function addUser() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->admin_model->addUser($data));
    }
    
    public function updateUser() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->admin_model->updateUser($data));
    }
    
    public function deleteUser() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->admin_model->deleteUser($data));
    }
}
