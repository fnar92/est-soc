<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header('Content-Type: application/json');
class Notify extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function send() {
        $mail = new Email();
        $data=array();
        
        $data['inssue']='Prueba';
        $data['body']='Mensaje';
        $data['to']=array();
        $data['cc']=array();
        $data['cco']=array();  
        
        
        $emails=array();
        $emails[]= array(
            'email'=>'paco@paco.com',
            'name'=>'Name'
        );
        
        $emails[]= array(
            'email'=>'noe@paco.com',
            'name'=>'Name'
        );
        
        $data['to']=array_merge($emails);
        
              
        //echo json_encode($data);
        $mail->notify($data);
    }
    
    public function notify($key="") {
        if($key=="paco"){
            if(json_decode(file_get_contents('php://input'),true)){
                $params = json_decode(file_get_contents('php://input'),true);
                $mail = new Email();
                echo json_encode($mail->notify($params));
                return;
            }
        }
        exit('No access');
    }
    
}
