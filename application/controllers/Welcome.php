<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

    public function __construct() {
        parent::__construct();
    }
    
    public function index(){
        $fecha = date_create();
        $data['fecha']= date_timestamp_get($fecha);
        $this->load->view('index', $data);
    }
}
