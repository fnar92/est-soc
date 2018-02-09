<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Email {
    public function __construct(){
        require_once('PHPMailer/class.phpmailer.php');
    }
    public function notify($data){
        $mode="dev";
        $mail = new PHPMailer(true);
        /*$mail->SMTPDebug = false;                                 // Enable verbose debug output
        $mail->isSMTP();                                      // Set mailer to use SMTP
		$mail->SMTPAuth = true;                               // Enable SMTP authentication
		$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;  
		*/
        $mail->Host = 'hrwise.com.mx';  // Specify main and backup SMTP servers
        $mail->Username = 'estudios@hrwise.com.mx';                 // SMTP username
        $mail->Password = 'estudios2017';                           // SMTP password
        $mail->setFrom('estudios@hrwise.com.mx', 'Estudios HRWise');
        $mail->Subject = $data['inssue'];  //Asunto del mensaje
        
        $mto=$this->obj($data['to']);
        $mcc=$this->obj($data['cc']);
        $mcco=$this->obj($data['cco']);
        $to=null;
        
        $text_dev="";
        if(ENVIRONMENT=="dev"){
            $mail->addCC("francisco.acevedo@infotec.mx", "Admin Estudios");
            $text_dev.="<div style='font-size:8px'>";
            $text_dev.="<hr>";
            $text_dev.="<h3>SIN VALIDEZ OFICIAL, SISTEMA EN DESARROLLO</h3>";
            $text_dev.="<h3>Destinatarios</h3>";
            foreach ($mto as $to) {
                $text_dev.="<li>".$to->email."</li>";
            }
            $text_dev.="<h3>Con copia</h3>";
            foreach ($mcc as $to) {
                $text_dev.="<li>".$to->email."</li>";
            }
            $text_dev.="<h3>Con copia oculta</h3>";
            foreach ($mcco as $to) {
                $text_dev.="<li>".$to->email."</li>";
            }
            $text_dev.="</div>";
        }else{
            foreach ($mto as $to) {
                $mail->AddAddress($to->email, $to->name);
            }
            foreach ($mcc as $to) {
                $mail->addCC($to->email, $to->name);
            }
            foreach ($mcco as $to) {
                $mail->addBCC($to->email, $to->name);
            }
            $mail->addBCC("paconoeacevedo@gmail.com", "Admin Est-Soc");
        }
        
        $mail->IsHTML(true);
        $text=$data['body'];
        $text.=$text_dev;
        $body= str_replace('content', $text, file_get_contents('email.php'));
        $mail->MsgHTML($body);
        $mail->charSet = "UTF-8";
        
        if(!$mail->Send()) {
            echo "Mailer Error: " . $mail->ErrorInfo;
            return false;
        } else {
            return true;
        }
    }
    
    function obj($array) {
        $object = new stdClass();
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $value = $this->obj($value);
            }
            $object->$key = $value;
        }
        return $object;
    }
}
