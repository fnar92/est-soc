<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header('Content-Type: application/json');
class Sync extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function index() {
        $this->db->where('sync',1);
        $estudios=$this->db->get('estudio')->result();
        $this->db->flush_cache();
        $return='';
        foreach ($estudios as $estudio) {
            $idEstudio=$estudio->id_estudio;
            $idFamilia=$estudio->id_familia;
            
            $return.='delete from padre_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";    
            $return.='delete from hijo_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.='delete from dependiente_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.='delete from motivo_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.='delete from vehiculo_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.='delete from propiedad_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.='delete from ingresos_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.='delete from egresos_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.='delete from documentos_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.='delete from evaluacion_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.='delete from comentario_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.= "\n";
            
            $papas=$this->estudio_model->getPadreFamilia($idFamilia, $idEstudio);
            
            foreach ($papas as $papa) {
                $padres="insert into padre_familia(id_familia, id_estudio, nombre, apellido_paterno, apellido_materno, edad, correo, rfc, celular, profesion, ocupacion,empresa, puesto, giro, dueno, antiguedad, sueldo_neto, tipo_persona) values ('$idFamilia', '$idEstudio', '$papa->nombre','$papa->apellido_paterno', '$papa->apellido_materno','$papa->edad', '$papa->correo', '$papa->rfc', '$papa->celular', '$papa->profesion', '$papa->ocupacion','$papa->empresa', '$papa->puesto', '$papa->giro', '$papa->dueno', '$papa->antiguedad',   '$papa->sueldo_neto',  '$papa->tipo_persona'); \n";
                $return.=$padres;
                $return.= "\n";
                
            }
            
            
            
            
            
            
            
            
            
            //$return .='update esdtudio set sync=1 where id_estudio='.$idEstudio.';';
            //echo $return;
        }
        
        $file='backs/est-soc-local-'./*.time().*/'-'./*(md5(implode(',',$tables)))*/date('Y.m.d').'.sql';
	$handle = fopen($file,'w+');
	fwrite($handle,$return);
	fclose($handle);
        
        $mysql_host = "hrwise.com.mx";
        $mysql_database = "hrwistoz_estudios_soc";
        $mysql_user = "hrwistoz";
        $mysql_password = "mx-fn@paco";
        # MySQL with PDO_MYSQL  
        $db = new PDO("mysql:host=$mysql_host;dbname=$mysql_database", $mysql_user, $mysql_password);

        $query = file_get_contents($file);
        
        $stmt = $db->prepare($query);

        if ($stmt->execute()) {
            echo json_encode(array('status' => '200'));
        } else {
            echo json_encode(array('status' => '400'));
        }
        
    }
}
