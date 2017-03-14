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
            $idEstatus=$estudio->id_estatus_estudio;
            
            $return.='#Script para exportar datos de N estudios al servidor';
            $return.= "\n";
            $return.= "\n";
            
            $return.='delete from padre_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";   
            $return.= "\n";
            $papas=$this->estudio_model->getPadreFamilia($idFamilia, $idEstudio);
            foreach ($papas as $papa) {
                $sql="insert into padre_familia(id_familia, id_estudio, nombre, apellido_paterno, apellido_materno, edad, fecha_nacimiento, correo, rfc, celular, profesion, ocupacion,empresa, puesto, giro, dueno, antiguedad, sueldo_neto, tipo_persona) values ('$idFamilia', '$idEstudio', '$papa->nombre','$papa->apellido_paterno', '$papa->apellido_materno', '$papa->edad', '$papa->fecha_nacimiento', '$papa->correo', '$papa->rfc', '$papa->celular', '$papa->profesion', '$papa->ocupacion','$papa->empresa', '$papa->puesto', '$papa->giro', '$papa->dueno', '$papa->antiguedad',   '$papa->sueldo_neto',  '$papa->tipo_persona'); \n";
                $return.=$sql;
            }
            $return.= "\n";
            
            $return.='delete from hijo_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.= "\n";
            $hijos=$this->estudio_model->getHijosFamilia($idFamilia, $idEstudio);
            foreach ($hijos as $hijo) {
                $sql="insert into hijo_familia(id_familia, id_estudio, folio_estudio, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, edad, correo_electronico, nivel_grado_cursar, institucion, colegiatura_pasado, colegiatura_actual, beca_actual, fuente_apoyo, apoyo_solicitado, status, comentarios, otras_colegiaturas) values ('$idFamilia', '$idEstudio', '$hijo->folio_estudio', '$hijo->nombre','$hijo->apellido_paterno', '$hijo->apellido_materno', '$hijo->fecha_nacimiento', '$hijo->edad', '$hijo->correo_electronico', '$hijo->nivel_grado_cursar', '$hijo->institucion', '$hijo->colegiatura_pasado', '$hijo->colegiatura_actual','$hijo->beca_actual', '$hijo->fuente_apoyo', '$hijo->apoyo_solicitado', '$hijo->status', '$hijo->comentarios', '$hijo->otras_colegiaturas'); \n";
                $return.=$sql;
            }
            $return.= "\n";
            
            $return.='delete from dependiente_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.= "\n";
            $dependientes=$this->estudio_model->getDependientesFamilia($idFamilia, $idEstudio);
            foreach ($dependientes as $dependiente) {
                $sql="insert into dependiente_familia(id_familia, id_estudio, folio_estudio, nombre, apellido_paterno, apellido_materno, edad, parentesco) values ('$idFamilia', '$idEstudio', '$dependiente->folio_estudio', '$dependiente->nombre','$dependiente->apellido_paterno', '$dependiente->apellido_materno','$dependiente->edad', '$dependiente->parentesco'); \n";
                $return.=$sql;
            }
            $return.= "\n";
            
            $return.='delete from motivo_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.= "\n";
            $motivos=$this->estudio_model->getMotivosFamilia($idFamilia, $idEstudio);
            foreach ($motivos as $motivo) {
                $sql="insert into motivo_familia(id_familia, id_estudio, folio_estudio, tipo_motivo, motivo) values ('$idFamilia', '$idEstudio', '$motivo->folio_estudio', '$motivo->tipo_motivo','$motivo->motivo'); \n";
                $return.=$sql;
            }
            $return.= "\n";
            
            $return.='delete from vehiculo_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.= "\n";
            $vehiculos=$this->estudio_model->getVehiculosFamilia($idFamilia, $idEstudio);
            foreach ($vehiculos as $vehiculo) {
                $sql="insert into vehiculo_familia(id_familia, id_estudio, folio_estudio, propietario, marca, modelo, anio, valor_comercial_actual, cantidad_adeuda, pago_mensual, pago_mensual_credito) values ('$idFamilia', '$idEstudio', '$vehiculo->folio_estudio', '$vehiculo->propietario', '$vehiculo->marca', '$vehiculo->modelo', '$vehiculo->anio', '$vehiculo->valor_comercial_actual', '$vehiculo->cantidad_adeuda', '$vehiculo->pago_mensual', '$vehiculo->pago_mensual_credito'); \n";
                $return.=$sql;
            }
            $return.= "\n";
            
            $return.='delete from propiedad_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.= "\n";
            $propiedades=$this->estudio_model->getPropiedadesFamilia($idFamilia, $idEstudio);
            foreach ($propiedades as $propiedad) {
                $sql="insert into propiedad_familia(id_familia, id_estudio, folio_estudio, status, tiempo_habitar, superficie_terreno, superficie_construccion, monto_renta, valor_comercial_actual, cantidad_adeuda, tiempo_resta_deuda) values ('$idFamilia', '$idEstudio', '$propiedad->folio_estudio', '$propiedad->status', '$propiedad->tiempo_habitar', '$propiedad->superficie_terreno', '$propiedad->superficie_construccion', '$propiedad->monto_renta', '$propiedad->valor_comercial_actual', '$propiedad->cantidad_adeuda', '$propiedad->tiempo_resta_deuda'); \n";
                $return.=$sql;
            }
            $return.= "\n";
            
            $return.='delete from ingresos_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.= "\n";
            $ingresos=$this->estudio_model->getIngresosFamilia($idFamilia, $idEstudio);
            foreach ($ingresos as $ingreso) {
                $sql="insert into ingresos_familia(id_familia, id_estudio, folio_estudio, num_personas_aportan, consecutivo_ingreso, sueldo_papa, sueldo_mama, ingreso_otros_miembros, ingreso_renta, ingreso_honorarios, ingreso_inversiones, ingreso_pensiones, ingreso_ventas, otros_ingresos, total_otros_ingresos, total_ingresos, ingreso_percapita, clasificacion, otros_comentario) values ('$idFamilia', '$idEstudio', '$ingreso->folio_estudio', '$ingreso->num_personas_aportan', '$ingreso->consecutivo_ingreso', '$ingreso->sueldo_papa', '$ingreso->sueldo_mama', '$ingreso->ingreso_otros_miembros', '$ingreso->ingreso_renta', '$ingreso->ingreso_honorarios', '$ingreso->ingreso_inversiones', '$ingreso->ingreso_pensiones', '$ingreso->ingreso_ventas', '$ingreso->otros_ingresos', '$ingreso->total_otros_ingresos', '$ingreso->total_ingresos', '$ingreso->ingreso_percapita', '$ingreso->clasificacion', '$ingreso->otros_comentario'); \n";
                $return.=$sql;
            }
            $return.= "\n";
            
            $return.='delete from egresos_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.= "\n";
            $egresos=$this->estudio_model->getEgresosFamilia($idFamilia, $idEstudio);
            foreach ($egresos as $egreso) {
                $sql="insert into egresos_familia(id_familia, id_estudio, folio_estudio, alimentacion_despensa, renta, credito_hipotecario, colegiaturas, otras_colegiaturas, clases_particulares, agua, luz, telefono, servicio_domestico, gas, otros, gasolina, credito_auto, pago_tdc_mensual, saldo_tdc, creditos_comerciales, vestido_calzado, medico_medicinas, diversion_entretenimiento, clubes_deportivos, seguros, vacaciones, otros2, total_servicios, comentarios, total_egresos, diferencia_egre_ingre) values ('$idFamilia', '$idEstudio', '$egreso->folio_estudio', '$egreso->alimentacion_despensa', '$egreso->renta', '$egreso->credito_hipotecario', '$egreso->colegiaturas', '$egreso->otras_colegiaturas', '$egreso->clases_particulares', '$egreso->agua', '$egreso->luz', '$egreso->telefono', '$egreso->servicio_domestico', '$egreso->gas', '$egreso->otros', '$egreso->gasolina', '$egreso->credito_auto', '$egreso->pago_tdc_mensual', '$egreso->saldo_tdc', '$egreso->creditos_comerciales', '$egreso->vestido_calzado', '$egreso->medico_medicinas', '$egreso->diversion_entretenimiento', '$egreso->clubes_deportivos', '$egreso->seguros', '$egreso->vacaciones', '$egreso->otros2', '$egreso->total_servicios', '$egreso->comentarios', '$egreso->total_egresos', '$egreso->diferencia_egre_ingre'); \n";
                $return.=$sql;
            }
            $return.= "\n";
            
            $return.='delete from documentos_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.= "\n";
            $documentos=$this->estudio_model->getDocumentosFamilia($idFamilia, $idEstudio);
            foreach ($documentos as $documento) {
                $sql="insert into documentos_familia(id_familia, id_estudio, folio_estudio, carta_no_adeudo, firma_reglamento, nomina_carta, poliza, estado_cuenta, recibos_renta, facturas_hospital, comprobante_finiquito, demandas_judiciales, servicios, pagos_credito_hipo, pagos_credito_auto, otros, comentarios) values ('$idFamilia', '$idEstudio', '$documento->folio_estudio', '$documento->carta_no_adeudo', '$documento->firma_reglamento', '$documento->nomina_carta', '$documento->poliza', '$documento->estado_cuenta', '$documento->recibos_renta', '$documento->facturas_hospital', '$documento->comprobante_finiquito', '$documento->demandas_judiciales', '$documento->servicios', '$documento->pagos_credito_hipo', '$documento->pagos_credito_auto', '$documento->otros', '$documento->comentarios'); \n";
                $return.=$sql;
            }
            $return.= "\n";
            
            $return.='delete from evaluacion_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.= "\n";
            $evaluaciones=$this->estudio_model->getEvaluacionFamilia($idFamilia, $idEstudio);
            foreach ($evaluaciones as $evaluacion) {
                $sql="insert into evaluacion_familia(id_familia, id_estudio, folio_estudio, apreciacion, discrepancia) values ('$idFamilia', '$idEstudio', '$evaluacion->folio_estudio', '$evaluacion->apreciacion', '$evaluacion->discrepancia'); \n";
                $return.=$sql;
            }
            $return.= "\n";
            
            $return.='delete from comentario_familia where id_estudio='.$idEstudio.' and id_familia='.$idFamilia.';';
            $return.= "\n";
            $return.= "\n";
            $comentarios=$this->estudio_model->getComentarioesFamilia($idFamilia, $idEstudio);
            foreach ($comentarios as $comentario) {
                $sql="insert into comentario_familia(id_familia, id_estudio, folio_estudio, comentario, tipo) values ('$idFamilia', '$idEstudio', '$comentario->folio_estudio', '$comentario->comentario', '$comentario->tipo'); \n";
                $return.=$sql;
            }
            
            $return .='update estudio set id_estatus_estudio='.$idEstatus.' where id_estudio='.$idEstudio.';';
        }
        //echo $return;
        
        $file='backs/est-soc-local-'.date('Y.m.d').'.sql';
	$handle = fopen($file,'w+');
	fwrite($handle,$return);
	fclose($handle);
        
        $mysql_host = "hrwise.com.mx";
        $mysql_database = "hrwistoz_estudios_soc";
        $mysql_user = "hrwistoz";
        $mysql_password = "mx-fn@paco";
        
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
