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
        $familia=$this->estudio_model->saveFamilia($data);
        $id_familia=$familia['id_familia'];
        
        /*$nombre=  explode(" ", $data['familia']);
        $result1 = substr($nombre[0], 0, 2);
        $result2 = substr($nombre[1], 0, 2);
        
        $clave=$result1."-".$result2."-".$id_familia;
        
        $data_update['id_familia']=$id_familia;
        $data_update['clave_familia']=$clave;
        */
        //$this->estudio_model->updateFamilia($data_update);
        
        echo json_encode(array('id_familia'=>$id_familia));
    }
    
    public function saveEstudioInstitucion() {
        $data = json_decode(file_get_contents('php://input'),true);
        $this->estudio_model->saveEstudioInstitucion($data);
        echo json_encode(array('status'=>'200'));
    }
    
    public function updateFamilia() {
        $data = json_decode(file_get_contents('php://input'),true);
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
        $clave=date('Y').'-'.$clave;
        $data_update['folio_estudio']=$clave;
        
        $this->estudio_model->updateEstudio($data_update);
        
        echo json_encode(array('id_estudio'=>$id_estudio));
    }
    
    public function updateEstudio() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->updateEstudio($data));
    }
    
    public function getEstudios($tipoUsuario, $rolUsuario, $idUsuario, $idInstitucion, $familia) {
        echo json_encode($this->estudio_model->getEstudios($tipoUsuario, $rolUsuario, $idUsuario, $idInstitucion, $familia));
    }
    
    public function getEstudioDetalle($idEstudio, $idInstitucion) {
        echo json_encode($this->estudio_model->getEstudioDetalle($idEstudio, $idInstitucion));
    }
    /*hijos*/
    public function saveHijo() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->saveHijo($data));
    }
    
    public function deleteHijo() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->deleteHijo($data));
    }
    
    public function updateHijo() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->updateHijo($data));
    }
    
    /*dependientes*/
    public function saveDependiente() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->saveDependiente($data));
    }
    
    public function deleteDependiente() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->deleteDependiente($data));
    }
    
    public function updateDependiente() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->updateDependiente($data));
    }
    
    /*motivos*/
    public function saveMotivo() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->saveMotivo($data));
    }
    
    public function deleteMotivo() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->deleteMotivo($data));
    }
    
    public function updateMotivo() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->updateMotivo($data));
    }
    
    /*vehiculos*/
    public function saveVehiculo() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->saveVehiculo($data));
    }
    
    public function deleteVehiculo() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->deleteVehiculo($data));
    }
    
    public function updateVehiculo() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->updateVehiculo($data));
    }
    
    /*propiedades*/
    public function savePropiedad() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->savePropiedad($data));
    }
    
    public function deletePropiedad() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->deletePropiedad($data));
    }
    
    public function updatePropiedad() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->updatePropiedad($data));
    }
    
    public function cancelEstudioInstitucion($idEstudioInstitucion) {
        $data['id_estudio_institucion']=$idEstudioInstitucion;
        $data['estatus']=2;
        echo json_encode(
                array(
                    "status"=>$this->estudio_model->updateEstudioInstitucion($data)
                )
            );
    }
    
    public function saveIngresos() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->saveIngresos($data));
    }
    
    public function updateIngresos() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->updateIngresos($data));
    }
    
    public function savePapa() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->savePapa($data));
    }
    
    public function updatePapa() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->updatePapa($data));
    }
    
    public function saveEgresos() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->saveEgresos($data));
    }
    
    public function updateEgresos() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->updateEgresos($data));
    }
    
    public function saveDocumentos() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->saveDocumentos($data));
    }
    
    public function updateDocumentos() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->updateDocumentos($data));
    }
    
    public function saveEvaluacion() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->saveEvaluacion($data));
    }
    
    public function updateEvaluacion() {
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($this->estudio_model->updateEvaluacion($data));
    }
}
