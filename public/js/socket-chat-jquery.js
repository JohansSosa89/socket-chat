
var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

// Referencias de JQuery 
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

// Funciones para renderizar usuarios 
function renderizarUsuarios( personas ){


    console.log(personas);

    var html = '';

    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> '+ params.get('sala') +'</span></a>';
    html += '</li>';

    personas.forEach(persona => {
        
        html += '<li>';
        html += '   <a data-id="' + persona.id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + persona.nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    });

    divUsuarios.html(html);

}

function renderizarMensajes(data, yo){

    var html = '';
    var fecha = new Date(data.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';

    if(data.nombre === 'Administrador'){
        if(data.mensaje.includes("abandonó")){
            adminClass = 'danger';
        }
        else{
            adminClass = 'success';
        }
    }

    if(yo){
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + data.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + data.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    else{
        html += '<li class="animated fadeIn">';

        if(data.nombre !== 'Administrador'){
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '    <div class="chat-content">';
        html += '        <h5>'+ data.nombre +'</h5>';
        html += '        <div class="box bg-light-'+ adminClass +'">'+ data.mensaje +'</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }    

    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// Liteners 
divUsuarios.on('click', 'a', function(){

    var id = $(this).data('id');

    if(id){
        console.log(id);
    }

});

formEnviar.on('submit', function(e){
    e.preventDefault();
   if(txtMensaje.val().trim().length === 0){
       return;
   }

   socket.emit('crearMensaje', {
        nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });
});