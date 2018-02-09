<!DOCTYPE html>
<html lang="es" ng-app="app">
<head>
    <meta charset="utf-8" />
    <link rel="apple-touch-icon" sizes="76x76" href="assets/img/apple-icon.png" />
    <link rel="icon" type="image/png" href="assets/img/favicon.png" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="robots" content="noindex">
    <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
    <meta name="viewport" content="width=device-width" />

    <title>HRWise</title>
	
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap core CSS     -->
    <link href="assets/css/bootstrap.min.css" rel="stylesheet" />
    <!--  Material Dashboard CSS    -->
    <link href="assets/css/material-dashboard.css" rel="stylesheet"/>
    <link rel="stylesheet" href="assets/css/material/angular-material.min.css" />
    <link rel="stylesheet" href="assets/css/angular-moment-picker/angular-moment-picker.min.css"> <!-- moment picker -->
    <link rel="stylesheet" href="assets/css/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/data-tables/jquery.dataTables.min.css">
    <link rel="stylesheet" href="assets/css/data-tables/dataTables.material.min.css">
    <link rel="stylesheet" href="assets/css/data-tables/angular-datatables.min.css" />
    <link rel="stylesheet" href="assets/css/angular-text-editor/textAngular.css" />
    <link rel="stylesheet" href="assets/css/main.css" />
    <link rel="stylesheet" href="assets/css/wise.css" />
    <link href="assets/css/sweetalert.css" rel="stylesheet">
    <link href="assets/css/loader_custom.css" rel="stylesheet">

    <script src="assets/js/jquery/jquery.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/ie/modernizr.js?v=<?= $fecha ?>" ></script>
    <script src='assets/js/jquery/jquery-migrate.min-ver=1.2.1.js?v=<?= $fecha ?>'></script>
    
   <link rel="stylesheet" href="assets/css/bootstrap/bootstrap.min.css">
	
    <!-- js angular -->
    <script src="assets/libs/angular/1.5.8/angular.min.js?v=<?= $fecha ?>"></script>        
    <script src="assets/libs/data-tables/angular-resource.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/data-tables/jquery.dataTables.min.js?v=<?= $fecha ?>"></script>              
    <script src="assets/libs/data-tables/angular-datatables.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/bootstrap/bootstrap.min.js?v=<?= $fecha ?>"></script>       
    <script src="assets/libs/material-1.1.0/angular-animate.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/material-1.1.0/angular-aria.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/material-1.1.0/angular-messages.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/material-1.1.0/angular-material.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/angular/complements/angular-ui-router/angular-ui-router.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/angular/complements/angular-storage/ngStorage.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/angular/complements/angular-moments/moment-with-locales.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/angular/complements/angular-moments/angular-moment.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/angular/complements/angular-moment-picker/angular-moment-picker.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/angular/complements/angular-navBar/navBar.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/angular/complements/angular-text-editor/textAngular-rangy.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/angular/complements/angular-text-editor/textAngular-sanitize.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/angular/complements/angular-text-editor/textAngular.min.js?v=<?= $fecha ?>"></script>
    <script src="assets/libs/angular/complements/angular-text-editor/textAngularSetup.js?v=<?= $fecha ?>"></script>
    <!-- end js angular -->	   

    <!--  Notifications Plugin    -->
    <script charset="utf-8" src="assets/js/jquery.easing.1.3.js?v=<?= $fecha ?>"></script>
    <script charset="utf-8" src="assets/js/bootstrap.notification.js?v=<?= $fecha ?>"></script>
    <script charset="utf-8" src="assets/js/sweetalert.min.js?v=<?= $fecha ?>" type="text/javascript"></script>
	
	
</head>

    <div ui-view></div>

    <!-- inject: app global js -->
    <script src="app/app.js?v=<?= $fecha ?>"></script>
    <script src="app/app.filters.js?v=<?= $fecha ?>"></script>
    <script src="app/app-config.js?v=<?= $fecha ?>"></script>
    <script src="app/app-run.js?v=<?= $fecha ?>"></script>
    <script src="app/app-constants.js?v=<?= $fecha ?>"></script>
    <!-- endinject -->
	
    <!-- inject: util services js -->
    <script src="app/utils/services/rest.service.js?v=<?= $fecha ?>"></script>
    <script src="app/utils/services/base64.service.js?v=<?= $fecha ?>"></script>
    <script src="app/utils/services/dialog.service.js?v=<?= $fecha ?>"></script>
    <script src="app/utils/services/validations/validation.service.js?v=<?= $fecha ?>"></script>
    <script src="app/utils/services/shared.service.js?v=<?= $fecha ?>"></script>
    <!-- endinject -->   
    
    <!-- inject: login js -->
    <script src="app/login/services/login.service.js?v=<?= $fecha ?>"></script>
    <script src="app/login/controllers/login.controller.js?v=<?= $fecha ?>"></script>
    <!-- endinject -->

    <!-- inject: Usuario servicio -->
    <script src="app/user/services/user.service.js?v=<?= $fecha ?>"></script>
    <!-- endinject -->
    
    
    <!-- inject: dashboard js -->
    <script src="app/dashboard/controllers/dashboard.controller.js?v=<?= $fecha ?>"></script>
    <!-- endinject -->

    <!-- inject: estudios js -->
    <script src="app/estudios/services/estudios.service.js?v=<?= $fecha ?>"></script>
    <script src="app/estudios/services/familia.service.js?v=<?= $fecha ?>"></script>
    <script src="app/estudios/services/hijo.service.js?v=<?= $fecha ?>"></script>
    <script src="app/estudios/services/dependiente.service.js?v=<?= $fecha ?>"></script>
    <script src="app/estudios/services/motivo.service.js?v=<?= $fecha ?>"></script>
    <script src="app/estudios/services/vehiculo.service.js?v=<?= $fecha ?>"></script>
    <script src="app/estudios/services/propiedad.service.js?v=<?= $fecha ?>"></script>
    <script src="app/estudios/services/comentario.service.js?v=<?= $fecha ?>"></script>
    <script src="app/estudios/controllers/estudios.ver.controller.js?v=<?= $fecha ?>"></script>
    <script src="app/estudios/controllers/estudios.crear.controller.js?v=<?= $fecha ?>"></script>
    <script src="app/estudios/controllers/estudios.detalle.controller.js?v=<?= $fecha ?>"></script>
    <script src="app/estudios/controllers/estudios.reporte.controller.js?v=<?= $fecha ?>"></script>
    <!-- endinject -->
    
    <!-- inject: admin js -->
    <script src="app/admin/services/admin.service.js?v=<?= $fecha ?>"></script>
    <script src="app/admin/controllers/admin.controller.js?v=<?= $fecha ?>"></script>
    <script src="app/admin/controllers/usuario.controller.js?v=<?= $fecha ?>"></script>
    <script src="app/admin/controllers/institucion.controller.js?v=<?= $fecha ?>"></script>
    <script src="app/admin/controllers/cat.controller.js?v=<?= $fecha ?>"></script>
    <script src="app/admin/controllers/fam.controller.js?v=<?= $fecha ?>"></script>
    <!-- endinject -->
    
    <!-- inject: user js -->
    <script src="app/user/controllers/user.controller.js?v=<?= $fecha ?>"></script>
    <!-- endinject -->
    
    <script>
        function hide(){
            window.scrollTo(0, 0);
            $("#loading").hide();
        };

        function show(){
            window.scrollTo(0, 0);
            $("#loading").show();
        };
        
	function mensaje(tipo, titulo, mensaje, duracion) {
		console.log('[Action] Mensaje');
		if (typeof duracion === "undefined") {
			duracion = 4000;
		}
		var img = "assets/img/icons/alert.png";
		switch (tipo) {
			case "alert":
			{
				img = "assets/img/icons/alert.png";
				break;
			}
			case "info":
			{
				img = "assets/img/icons/info.png";
				break;
			}
			case "success":
			{
				img = "assets/img/icons/success.png";
				break;
			}
			case "error":
			{
				img = "assets/img/icons/error.png";
				break;
			}
			default:
				break;
		}
		var options = {
			"type": tipo,
			"img": img,
			"width": "400",
			"content": "<strong>" + titulo + "</strong>  <br/>" + mensaje,
			"html": true,
			"autoClose": true,
			"timeOut": duracion,
			"position": "topRight",
			"effect": "slide",
			"easing": "jswing",
			"duration": 200
		};
		$.notification(options);
	};
        
        function error(){
            mensaje("error","Error inesperado","Ocurrio un error al recuperar su información",4000);
            location.href= "#/";
            window.scrollTo(0, 0); 
        };
        
        function json(json){
            return JSON.stringify(json);
        }
	
        function confirmaMsj(titulo,mensaje,bottonOK,accionOK,bottonCancelar,accionCancelar){
    
            var options = {
                "type": "info",
                "img": "assets/img/icons/info.png",
                "width": "400",
                "content": "<strong>" + titulo + "</strong> <br/>" + mensaje,
                "html": true,
                "autoClose": false,
                "timeOut": 5,
                "position": "topRight",
                "effect": "slide",
                "easing": "jswing",
                "duration": 200,
                "buttons":[
                    {
                        "text" : bottonOK,
                        "addClass": "btn btn-primary",
                        "click" : function (id){
                             accionOK();
                             $.notification('close',id);
                        }
                    },
                    {
                        "text" : bottonCancelar,
                        "addClass": "btn btn-default",
                        "click" : function (id){
                             accionCancelar();
                             $.notification('close',id);

                        }
                    }
                ]
            };
            $.notification(options);
        };
    </script>
        
    <div class="" id="loading">
        <div class="row">
            <div id="loader">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="lading"></div>
            </div>
        </div>
    </div>
    
</html>