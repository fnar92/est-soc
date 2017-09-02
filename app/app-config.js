(function () { 
    'use strict';
        
    angular
        .module('app')
        .config(config);

    function config ($stateProvider, $urlRouterProvider, $mdThemingProvider, momentPickerProvider, moment) {
        $mdThemingProvider.disableTheming();
	momentPickerProvider.options(configDatePicker(moment));
        
	$urlRouterProvider.otherwise('/');
		
	$stateProvider
        
            .state('/app', {
                    abstract: true,
                    controller: 'DashboardController',
                    controllerAs: 'dash',
                    templateUrl: 'tpl.html'
            })
            
            .state('/app.dashboard', { 
                url: '/',
                views: {
                    'page': { 
                        templateUrl: 'app/dashboard/views/dashboard.tpl.html'
                    }
                }      
            })
            
            .state('/app.estudios', { 
                url: '/estudios/ver',
                views: {
                    'page': { 
                        templateUrl: 'app/estudios/views/estudios.ver.tpl.html'
                    }
                }      
            })
            
            .state('/app.estudios_crear', { 
                url: '/estudios/crear',
                views: {
                    'page': { 
                        templateUrl: 'app/estudios/views/estudios.crear.tpl.html'
                    }
                }      
            })
            
            .state('/app.estudios_detalle', { 
                url: '/estudios/detalle',
                views: {
                    'page': { 
                        templateUrl: 'app/estudios/views/estudios.detalle.tpl.html'
                    },
                    'form1': { 
                        templateUrl: 'app/estudios/views/forms/form1.html'
                    }
                }      
            })
            
            .state('/estudios_reporte', { 
                url: '/estudios/reporte',
                controller: 'EstudiosReporteController',
                controllerAs: 'scope',
                templateUrl: 'app/estudios/views/reporte.tpl.html'
            })
            
            .state('/app.admin', { 
                url: '/admin/index',
                views: {
                    'page': { 
                        templateUrl: 'app/admin/views/admin.tpl.html'
                    }
                }      
            })
            
            .state('/app.admin_usuario', { 
                url: '/admin/usuario/ver',
                views: {
                    'page': { 
                        templateUrl: 'app/admin/views/usuario.ver.tpl.html'
                    }
                }      
            })
            
            .state('/about', { 
                url: '/about',
                controller: '',
                templateUrl: 'app/home/views/about.tpl.html'
            })
            
            .state('/store', { 
                url: '/store',
                controller: '',
                templateUrl: 'app/store/views/store.tpl.html'
            })
            
            .state('/account', { 
                url: '/account',
                controller: '',
                templateUrl: 'app/account/views/account.tpl.html'
            })
            
            .state('/register', { 
                url: '/register',
                controller: '',
                templateUrl: 'app/login/views/signup.tpl.html'
            })
            
            .state('login', { 
                url: '/login',
                controller: '',
                templateUrl: 'app/login/views/login.tpl.html'
            });
            
            /*.state('home', {
		abstract: true,
                templateUrl: 'app/tools/main/views/main.tpl.html' 
            })
            .state('home.configuration-ur', {
		url: '/configuration-ur',
                controller: 'DataURController',
                views: {
                    '': { templateUrl: 'app/configuration-ur/views/home-configuration-ur.tpl.html'},
                    'columnListUR@home.configuration-ur': { 
                        templateUrl: 'app/configuration-ur/views/list-data-ur.tpl.html'
                    },
                    'columnListOnlyUR@home.configuration-ur': { 
                        templateUrl: 'app/configuration-ur/views/list-only-ur.tpl.html'
                    }
                }      
            })
            .state('home.list-budget-program', {// Cargo pagina: Programa Presupuestario (bolsitas)
		url: '/list-budget-program',
		templateUrl: 'app/configuration-pp/views/list-budget-program.tpl.html',
                controller: 'BudgetProgramController',
                controllerAs: 'ctrlBP'
            })
            .state('home.create-budget-program', {// Cargo pagina: Solicitud Programa Presupuestario
		url: '/create-budget-program',
		templateUrl: 'app/configuration-pp/views/create-budget-program.tpl.html',
                controller: 'CreateBudgetProgramController',
                controllerAs: 'ctrlCBP'
            })
            .state('home.budget-program', {// Cargo pagina: Proceso de Programa Presupuestario (Diagnostico,MIR y PTA)
		url: '/budget-program',
		templateUrl: 'app/budget-program-phases/views/budgets-programs-phases.tpl.html',
                controller: 'BudgetProgramPhasesController',
                controllerAs: 'ctrlBPPhases'
            })
            .state('home.budget-schedule-setting', {// Cargo pagina: Configuración del programa presupuestario
		url: '/budget-schedule-setting',
		templateUrl: 'app/configuration-pp/views/budget-schedule-setting.tpl.html',
                controller: 'BudgetScheduleSettingController',
                controllerAs: 'ctrlBSS'
            })
            .state('home.diagnostic', {// Cargo pagina: Diagnostico
		url: '/diagnostic',
		templateUrl: 'app/diagnostic/views/diagnostic.tpl.html',
                controller: 'DiagnosticController',
                controllerAs: 'ctrlDiag'
            })
            .state('home.mir', {// Cargo pagina: Tabs de la MIR
		url: '/mir',
		templateUrl: 'app/mir-tabs/views/mir-tabs.tpl.html'
            })
            .state('home.mir.definition-problem', {// Cargo pagina: Definición  del problema
		url: '/definition-problem',
		templateUrl: 'app/mir-definition-problem/views/mir-definition-problem.tpl.html',
                controller: 'MIRDefinitionProblemController',
                controllerAs:'ctrlMIRDefProb'
            })
            .state('home.mir.problem-tree', {// Cargo pagina: Árbol del problema
		url: '/problem-tree',
		templateUrl: 'app/mir-problem-tree/views/mir-problem-tree.tpl.html',
                controller: 'MIRProbTreeController',
                controllerAs: 'ctrlMIRPTree'
            })
            .state('home.mir.objetive-tree', {// Cargo pagina: Árbol del objetivo
		url: '/objetive-tree',
		templateUrl: 'app/mir-objetive-tree/views/mir-objetive-tree.tpl.html',
                controller: 'MIRObjTreeController',
                controllerAs: 'ctrlMIROTree'
            })
            .state('home.mir.matrix', {// Cargo pagina: Matriz 4 x4 MIR
		url: '/matrix-4x4',
		templateUrl: 'app/mir-matrix/views/mir-matrix.tpl.html',
                controller: 'DataTableMIRController'
            });	*/
    }
    
    function configDatePicker (moment) {
        return {
            /* Picker properties */
            locale:        'es',
            format:        'L LTS', /*Sin segundos: LL LT*/
            minView:       'decade',
            maxView:       'minute',
            startView:     'month',
            autoclose:     true,
            today:         false,
            keyboard:      false,
            
            /* Extra: Views properties */
            leftArrow:     '&larr;',
            rightArrow:    '&rarr;',
            yearsFormat:   'YYYY',
            monthsFormat:  'MMM',
            daysFormat:    'D',
            hoursFormat:   'HH:[00]',
            minutesFormat: moment.localeData().longDateFormat('LT').replace(/[aA]/, ''),
            secondsFormat: 'ss',
            minutesStep:   5,
            secondsStep:   5
        };
    }

})();
