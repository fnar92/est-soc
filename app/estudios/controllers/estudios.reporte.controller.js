(function () { 
    'use strict';
	
    angular
	.module('app.estudios')
	.controller('EstudiosReporteController', EstudiosReporteController);
    
    function EstudiosReporteController (
        VehiculoService, 
        FamiliaService, 
        EstudiosService, 
        HijoService, 
        PropiedadService,
        DependienteService, 
        MotivoService, 
        ComentarioService,
        $localStorage, 
        $rootScope, 
        $state, 
        $mdDialog, 
        $mdToast, 
        DialogService, RestService, AuthenticationService, Constants, UserService, $q) {
        /* jshint validthis: true */
        console.log('init estudios REPORTE detalle');
        
        //Check session
        AuthenticationService.isAuth();
        
        var scope = this;  
        
        if(EstudiosService.idEstudioSeleccionado===0){
            EstudiosService.idEstudioSeleccionado=1;
        }
        if(EstudiosService.idEstudioSeleccionado===0){
            error();
        }
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
        
        scope.suma_col=0.00;
        scope.suma_apoyo_soli=0;
        scope.suma_apoyo_suge=0;
        
        scope.estudio={};
        scope.hijo={};
        scope.dependiente={};
        scope.motivo={};
        scope.vehiculo={};
        scope.propiedad={};
        scope.comentario={};
        scope.listaEmpleado=[];
        scope.empleadoAsignado={};
        scope.ingresos={};
        scope.egresos={};
        scope.documentos={};
        scope.evaluacion={};
        //Banderas
        scope.load=false;
        scope.verAccion=false;
        scope.banderaActualizar=false;
        scope.total_2=0;
        scope.diferencia_2=0;
        scope.necesidad=0;
        scope.confiabilidad=0;
        
        scope.porcentaje=0;
        scope.factor1=0;
        scope.factor2=0;
        scope.factor3=0;
        
        scope.factor1_1=0;
        scope.factor2_2=0;
        scope.factor3_3=0;
        
        scope.suma_docs=0;
        
        scope.resta_porcentaje=0;
        
        
        hide();
        
        scope.calcula=calcula;
        scope.setSueldo=setSueldo;
        
        
        scope.calculaEgresos=calculaEgresos;
        scope.calculaEgresosServicios=calculaEgresosServicios;
        scope.calculaEgresosTotal=calculaEgresosTotal;
        
        scope.ingresos.ingreso_otros_miembros=0;
        scope.ingresos.ingreso_renta=0;
        scope.ingresos.ingreso_honorarios=0;
        scope.ingresos.ingreso_inversiones=0;
        scope.ingresos.ingreso_pensiones=0;
        scope.ingresos.ingreso_ventas=0;
        scope.ingresos.otros_ingresos=0;
        scope.ingresos.total_otros_ingresos=0;
        scope.ingresos.sueldo_papa=0;
        scope.ingresos.sueldo_mama=0;
        scope.ingresos.ingreso_percapita=0;
        scope.ingresos.clasificacion='';
        
        scope.egresos.alimentacion_despensa=0;
        scope.egresos.renta=0;
        scope.egresos.credito_hipotecario=0;
        scope.egresos.colegiaturas=0;
        scope.egresos.otras_colegiaturas=0;
        scope.egresos.clases_particulares=0;
        scope.egresos.agua=0;
        scope.egresos.luz=0;
        scope.egresos.telefono=0;
        scope.egresos.servicio_domestico=0;
        scope.egresos.gas=0;
        scope.egresos.total_servicios=0;
        scope.egresos.gasolina=0;
        scope.egresos.credito_auto=0;
        scope.egresos.pago_tdc_mensual=0;
        scope.egresos.saldo_tdc=0;
        scope.egresos.creditos_comerciales=0;
        scope.egresos.vestido_calzado=0;
        scope.egresos.medico_medicinas=0;
        scope.egresos.diversion_entretenimiento=0;
        scope.egresos.clubes_deportivos=0;
        scope.egresos.seguros=0;
        scope.egresos.vacaciones=0;
        scope.egresos.otros=0;
        scope.egresos.otros2=0;
        scope.egresos.total_egresos=0;
        scope.egresos.diferencia_egre_ingre=0;
        
        var id=0;
        if($rootScope.tipoUsuario==='2'){
            id=$rootScope.institucion.id_institucion;
        }
        load();
       
        function sumaCol(){
            
            for(var i=0; i<scope.estudio.hijos.length; i++){
                scope.suma_col+=parseFloat(scope.estudio.hijos[i].colegiatura_pasado);
                scope.suma_apoyo_soli+=parseFloat(scope.estudio.hijos[i].apoyo_solicitado);
            }
            
            for(var i=0; i<scope.estudio.hijos.length; i++){
                var x=parseFloat(scope.estudio.hijos[i].colegiatura_pasado)/scope.suma_col;
                console.log(x);
            }
            
        }
        
        
        
        function load(){
            
            var promesas=[];
            promesas.push(EstudiosService.obtenerDetalleEstudio(EstudiosService.idEstudioSeleccionado, id));
            $q.all(promesas)
            .then(
                function(response1){
                    var response=response1[0].data;
                                console.log(response);
                    scope.estudio=response;
                    
                     if(response.evaluacion.length>0){
                        scope.evaluacion=scope.estudio.evaluacion[0];
                    }

                    if(response.documentos.length>0){
                        scope.documentos=scope.estudio.documentos[0];
                    }
                    
                    if(scope.estudio.padres.length>0){

                        for(var i=0; i<scope.estudio.padres.length; i++){
                            if(scope.estudio.padres[i].tipo_persona==='PAPA'){
                                scope.estudio.id_papa=scope.estudio.padres[i].id_padre_familia;
                                scope.estudio.nombre_papa=scope.estudio.padres[i].nombre;
                                scope.estudio.apellido_paterno_papa=scope.estudio.padres[i].apellido_paterno;
                                scope.estudio.apellido_materno_papa=scope.estudio.padres[i].apellido_materno;
                                scope.estudio.edad_papa=scope.estudio.padres[i].edad;
                                scope.estudio.correo_papa=scope.estudio.padres[i].correo;
                                scope.estudio.rfc_papa=scope.estudio.padres[i].rfc;
                                scope.estudio.celular_papa=scope.estudio.padres[i].celular;
                                scope.estudio.profesion_papa=scope.estudio.padres[i].profesion;
                                scope.estudio.ocupacion_papa=scope.estudio.padres[i].ocupacion;
                                scope.estudio.empresa_papa=scope.estudio.padres[i].empresa;
                                scope.estudio.puesto_papa=scope.estudio.padres[i].puesto;
                                scope.estudio.giro_papa=scope.estudio.padres[i].giro;
                                scope.estudio.dueno_papa=scope.estudio.padres[i].dueno;
                                scope.estudio.antiguedad_papa=scope.estudio.padres[i].antiguedad;
                                scope.estudio.sueldo_papa=scope.estudio.padres[i].sueldo_neto;
                            }
                            if(scope.estudio.padres[i].tipo_persona==='MAMA'){
                                scope.estudio.id_mama=scope.estudio.padres[i].id_padre_familia;
                                scope.estudio.nombre_mama=scope.estudio.padres[i].nombre;
                                scope.estudio.apellido_paterno_mama=scope.estudio.padres[i].apellido_paterno;
                                scope.estudio.apellido_materno_mama=scope.estudio.padres[i].apellido_materno;
                                scope.estudio.edad_mama=scope.estudio.padres[i].edad;
                                scope.estudio.correo_mama=scope.estudio.padres[i].correo;
                                scope.estudio.rfc_mama=scope.estudio.padres[i].rfc;
                                scope.estudio.celular_mama=scope.estudio.padres[i].celular;
                                scope.estudio.profesion_mama=scope.estudio.padres[i].profesion;
                                scope.estudio.ocupacion_mama=scope.estudio.padres[i].ocupacion;
                                scope.estudio.empresa_mama=scope.estudio.padres[i].empresa;
                                scope.estudio.puesto_mama=scope.estudio.padres[i].puesto;
                                scope.estudio.giro_mama=scope.estudio.padres[i].giro;
                                scope.estudio.dueno_mama=scope.estudio.padres[i].dueno;
                                scope.estudio.antiguedad_mama=scope.estudio.padres[i].antiguedad;
                                scope.estudio.sueldo_mama=scope.estudio.padres[i].sueldo_neto;
                            }
                        }

                    }


                    scope.estudio.sueldo_papa=parseFloat(scope.estudio.sueldo_papa);
                    scope.estudio.sueldo_mama=parseFloat(scope.estudio.sueldo_mama);
                    scope.ingresos.sueldo_papa=scope.estudio.sueldo_papa;
                    scope.ingresos.sueldo_mama=scope.estudio.sueldo_mama;


                    sumaCol();
                    if(response.ingresos.length>0){
                        scope.ingresos=response.ingresos[0];
                        parseIngresos();
                        calcula();
                    }

                    if(response.egresos.length>0){
                        scope.egresos=response.egresos[0];
                        parseEgresos();
                    }
                    if(response.documentos.length>0){
                        setBool();		
                    }
                    calculaEgresos();
                    
                },
                function(error){
                    console.log('Error al obtener el detalle: '+error);
                }
            );
        }//end load

        
        /*FUNCIONES COMUNES*/
        function setSueldo(){
            scope.ingresos.sueldo_papa=scope.estudio.sueldo_papa;
            scope.ingresos.sueldo_mama=scope.estudio.sueldo_mama;
        }
        
        function calcula(){
            var suma=0;
            
            suma+=scope.ingresos.ingreso_otros_miembros;
            suma+=scope.ingresos.ingreso_renta;
            suma+=scope.ingresos.ingreso_honorarios;
            suma+=scope.ingresos.ingreso_inversiones;
            suma+=scope.ingresos.ingreso_pensiones;
            suma+=scope.ingresos.ingreso_ventas;
            suma+=scope.ingresos.otros_ingresos;
            scope.ingresos.total_otros_ingresos=suma;
            
            scope.ingresos.total_ingresos=scope.ingresos.sueldo_papa+scope.ingresos.sueldo_mama+scope.ingresos.total_otros_ingresos;
            var n=scope.estudio.dependientes.length+scope.estudio.hijos.length+2;
            scope.ingresos.ingreso_percapita=scope.ingresos.total_ingresos/n;
            
            
            if(scope.ingresos.ingreso_percapita>15000){
                scope.ingresos.clasificacion='A';
            }
            if(scope.ingresos.ingreso_percapita>8000&&scope.ingresos.ingreso_percapita<14999){
                scope.ingresos.clasificacion='B';
            }
            if(scope.ingresos.ingreso_percapita<8000){
                scope.ingresos.clasificacion='C';
            }
            if(scope.ingresos.ingreso_percapita<8000){
                scope.ingresos.clasificacion='C-';
            }
            
        }
        
        function calculaEgresos(){
            var renta=0;
            var hipoteca=0;
            var cole=0;
            var otrasCole=0;
            var creditoAuto=0;
            
            for(var i=0; i<scope.estudio.propiedades.length; i++){
                if(scope.estudio.propiedades[i].status==='Rentada'){
                    renta+=parseFloat(scope.estudio.propiedades[i].monto_renta);
                }
                if(scope.estudio.propiedades[i].status==='Hipotecada'){
                    hipoteca+=parseFloat(scope.estudio.propiedades[i].monto_renta);
                }
            }
            
            for(var i=0; i<scope.estudio.hijos.length; i++){
                cole+=parseFloat(scope.estudio.hijos[i].colegiatura_actual);
                //otrasCole+=parseFloat(scope.estudio.hijos[i].otras_colegiaturas);
            }
            
            for(var i=0; i<scope.estudio.vehiculos.length; i++){
                creditoAuto+=parseFloat(scope.estudio.vehiculos[i].pago_mensual);
            }
            
            scope.egresos.renta=renta;
            scope.egresos.credito_hipotecario=hipoteca;
            scope.egresos.colegiaturas=cole;
            //scope.egresos.otras_colegiaturas=otrasCole;
            scope.egresos.credito_auto=creditoAuto;
            scope.calculaEgresosTotal();
        }
        
        function calculaEgresosServicios(){
            //scope.egresos.total_servicios+=scope.egresos.clases_particulares;
            scope.egresos.total_servicios=0;
            scope.egresos.total_servicios+=parseFloat(scope.egresos.agua);
            scope.egresos.total_servicios+=parseFloat(scope.egresos.luz);
            scope.egresos.total_servicios+=parseFloat(scope.egresos.telefono);
            //scope.egresos.total_servicios+=scope.egresos.servicio_domestico;
            scope.egresos.total_servicios+=parseFloat(scope.egresos.gas);
        }
        
        function calculaEgresosTotal(){
            scope.egresos.total_egresos=0;
            scope.egresos.total_egresos+=parseFloat(scope.egresos.alimentacion_despensa);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.renta);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.credito_hipotecario);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.colegiaturas);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.otras_colegiaturas);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.clases_particulares);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.servicio_domestico);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.otros);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.gasolina);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.credito_auto);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.pago_tdc_mensual);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.vestido_calzado);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.medico_medicinas);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.diversion_entretenimiento);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.clubes_deportivos);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.seguros);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.vacaciones);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.otros2);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.total_servicios);
            
            scope.egresos.diferencia_egre_ingre=scope.ingresos.total_ingresos-scope.egresos.total_egresos;
            scope.total_2=0;
            scope.total_2+=parseFloat(scope.egresos.alimentacion_despensa);
            scope.total_2+=parseFloat(scope.egresos.renta);
            scope.total_2+=parseFloat(scope.egresos.credito_hipotecario);
            scope.total_2+=parseFloat(scope.egresos.colegiaturas);
            scope.total_2+=parseFloat(scope.egresos.otras_colegiaturas);
            scope.total_2+=parseFloat(scope.egresos.clases_particulares);
            scope.total_2+=parseFloat(scope.egresos.total_servicios);
            scope.total_2+=parseFloat(scope.egresos.servicio_domestico);
            scope.total_2+=parseFloat(scope.egresos.gasolina);
            scope.total_2+=parseFloat(scope.egresos.credito_auto);
            scope.total_2+=parseFloat(scope.egresos.pago_tdc_mensual);
            scope.total_2+=parseFloat(scope.egresos.vestido_calzado);
            scope.total_2+=parseFloat(scope.egresos.medico_medicinas);
            //scope.total_2+=parseFloat(scope.egresos.diversion_entretenimiento);
            scope.total_2+=parseFloat(scope.egresos.clubes_deportivos);
            scope.total_2+=parseFloat(scope.egresos.seguros);
            scope.total_2+=parseFloat(scope.egresos.vacaciones);
            scope.total_2+=parseFloat(scope.egresos.otros2);
            
            scope.diferencia_2=scope.ingresos.total_ingresos-scope.total_2;
            
            scope.porcentaje=(scope.suma_col/scope.estudio.ingresos[0].total_ingresos)*100;
            if(scope.porcentaje>=33){
                scope.factor1=3.33;
            }else{
                if(scope.porcentaje<=10){
                    scope.factor1=1.11;
                }else{
                    scope.factor1=2.22;
                }
            }
            console.log('Factor1: '+scope.factor1);
            
            if(scope.ingresos.clasificacion==='C'){
                scope.factor2=3.33;
            }else{
                if(scope.ingresos.clasificacion==='A'){
                    scope.factor2=1.11;
                }else{
                    scope.factor2=2.22;
                }
            }
            
            console.log('Factor2: '+scope.factor2);
            
            if(scope.estudio.hijos.length>=5){
                scope.factor3=3.33;
            }else{
                if(scope.ingresos.clasificacion<=2){
                    scope.factor3=1.11;
                }else{
                    scope.factor3=2.22;
                }
            }
            
            console.log('Factor3: '+scope.factor3);
            
            scope.necesidad=scope.factor1+scope.factor2+scope.factor3;
            console.log('Necesidad: '+scope.necesidad);
            
            if(scope.evaluacion.apreciacion==='NADA CONFIABLE'){
                scope.factor1_1=0;
            }else{
                if(scope.evaluacion.apreciacion==='POCO CONFIABLE'){
                    scope.factor1_1=2.22;
                }else{
                    scope.factor1_1=3.33;
                }
            }
            
            console.log('factor 1_1: '+scope.factor1_1);
            
            
            if(scope.evaluacion.discrepancia==='MENOR'){
                scope.factor2_2=3.33;
            }else{
                if(scope.evaluacion.discrepancia==='GRAVE'){
                    scope.factor2_2=1.11;
                }else{
                    scope.factor2_2=0;
                }
            }
            console.log('factor 2_2: '+scope.factor2_2);
            scope.factor3_3=(scope.suma_docs*3.3)/13;
            console.log('factor 3_3: '+scope.factor3_3);
            
            scope.confiabilidad=scope.factor1_1+scope.factor2_2+scope.factor3_3;
         
            scope.calif_globlal=(scope.necesidad*.8)+(scope.confiabilidad*.2);
            
            scope.resta_porcentaje=(scope.suma_col/scope.estudio.ingresos[0].total_ingresos);
            scope.resta_porcentaje-=.20;
            //scope.resta_porcentaje=Math.ceil(scope.resta_porcentaje);;
            console.log('resta porcen: '+scope.resta_porcentaje);
            
            console.log('ingre: '+scope.estudio.ingresos[0].total_ingresos);
            scope.factorN=scope.estudio.ingresos[0].total_ingresos*scope.resta_porcentaje;
            scope.factorN=Math.ceil(scope.factorN);
            console.log('total n: '+scope.factorN);
            scope.suma_apoyo_suge=0;
            for (var i = 0; i < scope.estudio.hijos.length; i++) {
                var x=scope.estudio.hijos[i].colegiatura_pasado;
                var y=x/scope.suma_col;
                scope.estudio.hijos[i].apoyo_sugerido=scope.factorN*y;
                scope.suma_apoyo_suge+=scope.estudio.hijos[i].apoyo_sugerido;
            }
            
            
        }
        
        function setBool(){
            scope.suma_docs=0;
            if(scope.documentos.carta_no_adeudo==='1'){
               scope.documentos.carta_no_adeudo=true;
            }
            
            if(scope.documentos.carta_no_adeudo==='0'){
                scope.documentos.carta_no_adeudo=false;
                scope.suma_docs+=1.01;
                console.log('sumo 1');
            }
            
            if(scope.documentos.firma_reglamento==='1'){
                scope.documentos.firma_reglamento=true;
                
            }
            if(scope.documentos.firma_reglamento==='0'){
                scope.documentos.firma_reglamento=false;
                scope.suma_docs+=1.01;
                console.log('sumo 2');
            }
            
            if(scope.documentos.nomina_carta==='1'){
                scope.documentos.nomina_carta=true;
                
            }
            if(scope.documentos.nomina_carta==='0'){
                scope.documentos.nomina_carta=false;
                scope.suma_docs+=1.01;
                console.log('sumo 3');
            }
            
            if(scope.documentos.poliza==='1'){
                scope.documentos.poliza=true;
                
            }
            if(scope.documentos.poliza==='0'){
                scope.documentos.poliza=false;
                scope.suma_docs+=1.01;
                console.log('sumo 4');
            }
            
            if(scope.documentos.estado_cuenta==='1'){
                scope.documentos.estado_cuenta=true;
                
            }
            if(scope.documentos.estado_cuenta==='0'){
                scope.documentos.estado_cuenta=false;
                scope.suma_docs+=1.01;
                console.log('sumo 5');
            }
            
            if(scope.documentos.recibos_renta==='1'){
                scope.documentos.recibos_renta=true;
                
            }
            if(scope.documentos.recibos_renta==='0'){
                scope.documentos.recibos_renta=false;
                //scope.suma_docs+=1.01;
                console.log('sumo 6');
            }
            
            if(scope.documentos.facturas_hospital==='1'){
                scope.documentos.facturas_hospital=true;
                
            }
            if(scope.documentos.facturas_hospital==='0'){
                scope.documentos.facturas_hospital=false;
                scope.suma_docs+=1.01;
                console.log('sumo 7');
            }
           
             if(scope.documentos.comprobante_finiquito==='1'){
                scope.documentos.comprobante_finiquito=true;
                
            }
            if(scope.documentos.comprobante_finiquito==='0'){
                scope.documentos.comprobante_finiquito=false;
                scope.suma_docs+=1.01;
                console.log('sumo 8');
            }
            
            if(scope.documentos.demandas_judiciales==='1'){
                scope.documentos.demandas_judiciales=true;
                
            }
            if(scope.documentos.demandas_judiciales==='0'){
                scope.documentos.demandas_judiciales=false;
                //scope.suma_docs+=1.01;
                console.log('sumo 9');
            }

            if(scope.documentos.servicios==='1'){
                scope.documentos.servicios=true;
                
            }
            if(scope.documentos.servicios==='0'){
                scope.documentos.servicios=false;
                scope.suma_docs+=1.01;
                console.log('sumo 10');
            }
            
            if(scope.documentos.pagos_credito_hipo==='1'){
                scope.documentos.pagos_credito_hipo=true;
                
            }
            if(scope.documentos.pagos_credito_hipo==='0'){
                scope.documentos.pagos_credito_hipo=false;
                scope.suma_docs+=1.01;
                console.log('sumo 11');
            }
            
            if(scope.documentos.pagos_credito_auto==='1'){
                scope.documentos.pagos_credito_auto=true;
                
            }
            if(scope.documentos.pagos_credito_auto==='0'){
                scope.documentos.pagos_credito_auto=false;
                scope.suma_docs+=1.01;
                console.log('sumo 12');
            }
            
            if(scope.documentos.otros==='1'){
                scope.documentos.otros=true;
                
            }
            if(scope.documentos.otros==='0'){
                scope.documentos.otros=false;
                scope.suma_docs+=1.01;
                console.log('sumo 13');
            }
        }
        function parseIngresos(){
            scope.ingresos.ingreso_otros_miembros=parseFloat(scope.ingresos.ingreso_otros_miembros);
            scope.ingresos.ingreso_renta=parseFloat(scope.ingresos.ingreso_renta);
            scope.ingresos.ingreso_honorarios=parseFloat(scope.ingresos.ingreso_inversiones);
            scope.ingresos.ingreso_inversiones=parseFloat(scope.ingresos.ingreso_inversiones);
            scope.ingresos.ingreso_pensiones=parseFloat(scope.ingresos.ingreso_pensiones);
            scope.ingresos.ingreso_ventas=parseFloat(scope.ingresos.ingreso_ventas);
            scope.ingresos.otros_ingresos=parseFloat(scope.ingresos.otros_ingresos);
            scope.ingresos.total_otros_ingresos=parseFloat(scope.ingresos.total_otros_ingresos);
            scope.ingresos.sueldo_papa=parseFloat(scope.ingresos.sueldo_papa);
            scope.ingresos.sueldo_mama=parseFloat(scope.ingresos.sueldo_mama);
            scope.ingresos.ingreso_percapita=parseFloat(scope.ingresos.ingreso_percapita);
            scope.ingresos.total_ingresos=parseFloat(scope.ingresos.total_ingresos);

        }
        
        function parseEgresos(){
            console.log(scope.egresos);
            scope.egresos.alimentacion_despensa=parseFloat(scope.egresos.alimentacion_despensa);
            scope.egresos.renta=parseFloat(scope.egresos.renta);
            scope.egresos.credito_hipotecario=parseFloat(scope.egresos.credito_hipotecario);
            scope.egresos.colegiaturas=parseFloat(scope.egresos.colegiaturas);
            scope.egresos.otras_colegiaturas=parseFloat(scope.egresos.otras_colegiaturas);
            scope.egresos.clases_particulares=parseFloat(scope.egresos.clases_particulares);
            scope.egresos.agua=parseFloat(scope.egresos.agua);
            scope.egresos.luz=parseFloat(scope.egresos.luz);
            scope.egresos.telefono=parseFloat(scope.egresos.telefono);
            scope.egresos.servicio_domestico=parseFloat(scope.egresos.servicio_domestico);
            scope.egresos.gas=parseFloat(scope.egresos.gas);
            scope.egresos.total_servicios=parseFloat(scope.egresos.total_servicios);
            scope.egresos.gasolina=parseFloat(scope.egresos.gasolina);
            scope.egresos.credito_auto=parseFloat(scope.egresos.credito_auto);
            scope.egresos.pago_tdc_mensual=parseFloat(scope.egresos.pago_tdc_mensual);
            scope.egresos.saldo_tdc=parseFloat(scope.egresos.saldo_tdc);
            scope.egresos.creditos_comerciales=parseFloat(scope.egresos.creditos_comerciales);
            scope.egresos.vestido_calzado=parseFloat(scope.egresos.vestido_calzado);
            scope.egresos.medico_medicinas=parseFloat(scope.egresos.medico_medicinas);
            scope.egresos.diversion_entretenimiento=parseFloat(scope.egresos.diversion_entretenimiento);
            scope.egresos.clubes_deportivos=parseFloat(scope.egresos.clubes_deportivos);
            scope.egresos.seguros=parseFloat(scope.egresos.seguros);
            scope.egresos.vacaciones=parseFloat(scope.egresos.vacaciones);
            scope.egresos.otros2=parseFloat(scope.egresos.otros2);
            scope.egresos.otros=parseFloat(scope.egresos.otros);
            scope.egresos.total_egresos=parseFloat(scope.egresos.total_egresos);
            scope.egresos.diferencia_egre_ingre=parseFloat(scope.egresos.diferencia_egre_ingre);
        }
    };//end controller

})();