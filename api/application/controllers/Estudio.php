<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header('Content-Type: application/json');
class Estudio extends CI_Controller {
    
    
    public function __construct() {
        parent::__construct();
        
    }
    
    public function getFamilias($idInstitucion,$familia) {
        echo json_encode($this->estudio_model->getFamilias($idInstitucion, $familia));
    }
    
    public function saveFamilia() {
        $data = json_decode(file_get_contents('php://input'),true);
        $id_familia=0;
        $familia=$this->estudio_model->saveFamilia($data);
        $id_familia=$familia['id_familia'];
        
        $nombre=  explode(" ", $data['familia']);
        $result1 = substr($nombre[0], 0, 2);
        $result2 = substr($nombre[1], 0, 2);
        
        $clave=$result1."-".$result2."-".$id_familia;
        
        $data_update['id_familia']=$id_familia;
        $data_update['clave_familia']=$clave;
        
        $this->estudio_model->updateFamilia($data_update);
        
        echo json_encode(array('id_familia'=>$id_familia));
    }
    
    public function updateFamilia($data) {
        echo json_encode($this->estudio_model->updateFamilia($data));
    }
    
     public function saveEstudio() {
        $data = json_decode(file_get_contents('php://input'),true);
        $id_estudio=0;
        
        $clave_institucion=$data['clave_institucion'];
        unset($data['clave_institucion']);
        $estudio=$this->estudio_model->saveEstudio($data);
        $id_estudio=$estudio['id_estudio'];
        
        
        $clave=$clave_institucion."-".$id_estudio;
        
        $data_update['id_estudio']=$id_estudio;
        $data_update['folio_estudio']=$clave;
        
        $this->estudio_model->updateEstudio($data_update);
        
        echo json_encode(array('folio'=>$clave));
    }
    
    public function updateEstudio($data) {
        echo json_encode($this->estudio_model->updateEstudio($data));
    }
    
    
}
