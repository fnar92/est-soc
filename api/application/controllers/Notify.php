<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header('Content-Type: application/json');
class Notify extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function send() {
        $this->load->library('Email');
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
}
