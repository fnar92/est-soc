/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function imprime(){
        var DocumentContainer = document.getElementById('contenido');
        var WindowObject = window.open('', 'PrintWindow', 'width=1000,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');
        WindowObject.document.writeln('<!DOCTYPE html>');
        WindowObject.document.writeln('<html><head><title></title>');
        WindowObject.document.writeln('<link rel="stylesheet" type="text/css" href="assets/css/print.css">');
        
        WindowObject.document.writeln('<script src="assets/css/print2.js"></script>');
        WindowObject.document.writeln('</head><body>');

        WindowObject.document.writeln(DocumentContainer.innerHTML);

        WindowObject.document.writeln('</body></html>');

        WindowObject.document.close();
    }