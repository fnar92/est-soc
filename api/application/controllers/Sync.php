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
            
            $papa=$this->estudio_model->getPadreFamilia($idEstudio, $idFamilia);
            
            
            
            
            
            
            
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
            $return.='delete from ingreso_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.='delete from egreso_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.='delete from documento_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.='delete from evaluacion_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.='delete from comentario_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.= "\n";
            
            
            
            
            $return .='update estudio set sync=0 where id_estudio='.$idEstudio;
            echo $return;
        }
        
        $file='backs/est-soc-local-'./*.time().*/'-'./*(md5(implode(',',$tables)))*/date('Y.m.d').'.sql';
	$handle = fopen($file,'w+');
	fwrite($handle,$return);
	fclose($handle);
        
        var_dump($papa);
        
    }
}
