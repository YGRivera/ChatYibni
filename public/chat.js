var socket = io.connect('http://localhost:4000');

var persona = document.getElementById('persona'),
    appChat = document.getElementById('app-chat'),
    panelBienvenida = document.getElementById('panel-bienvenida'),
    usuario = document.getElementById('usuario'),
    mensaje = document.getElementById('mensaje'),
    archivo = document.getElementById('archivo'),
    botonEnviar = document.getElementById('enviar'),
    escribiendoMensaje = document.getElementById('escribiendo-mensaje'),
    output = document.getElementById('output');

var sonido = document.getElementById('sonido');

botonEnviar.addEventListener('click', async function () {

    if (archivo.files.length > 0) {

        const formData = new FormData();
        formData.append('archivo', archivo.files[0]);

        const respuesta = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const datos = await respuesta.json();

        const extension = datos.archivo.split('.').pop().toLowerCase();

        let contenidoArchivo = '';

        if (
            extension === 'jpg' ||
            extension === 'jpeg' ||
            extension === 'png' ||
            extension === 'gif' ||
            extension === 'webp'
        ) {

            contenidoArchivo =
                '<br>/uploads/' +
                datos.archivo +
                '';

        }
        else if (
            extension === 'mp4' ||
            extension === 'webm' ||
            extension === 'ogg'
        ) {

            contenidoArchivo =
                '<br><video controls width="250">' +
                '/uploads/' +
                datos.archivo +
                '' +
                '</video>';

        }
        else if (
            extension === 'mp3' ||
            extension === 'wav' ||
            extension === 'm4a'
        ) {

            contenidoArchivo =
                '<br><audio controls>' +
                '/uploads/' +
                datos.archivo +
                '' +
                '</audio>';

        }
        else {

            contenidoArchivo =
                '<br>/uploads/' +
                datos.archivo +
                '' +
                datos.archivo +
                '</a>';
        }

        socket.emit('chat', {
            usuario: usuario.value,
            mensaje: contenidoArchivo
        });

        archivo.value = '';
        return;
    }

    if (mensaje.value) {

        socket.emit('chat', {
            usuario: usuario.value,
            mensaje: mensaje.value
        });

        mensaje.value = '';
    }
});

mensaje.addEventListener('keyup', function () {

    socket.emit('typing', {
        nombre: usuario.value,
        texto: mensaje.value
    });

});

socket.on('chat', function (data) {

    escribiendoMensaje.innerHTML = '';

    if (sonido) {
        sonido.play().catch(() => {});
    }

    output.innerHTML +=
        '<p><strong>' +
        data.usuario +
        ':</strong> ' +
        data.mensaje +
        '</p>';
});

socket.on('typing', function (data) {

    if (data.texto) {

        escribiendoMensaje.innerHTML =
            '<p><em>' +
            data.nombre +
            ' está escribiendo un mensaje...</em></p>';

    } else {

        escribiendoMensaje.innerHTML = '';

    }
});

function ingresarAlChat() {

    if (persona.value) {

        panelBienvenida.style.display = 'none';
        appChat.style.display = 'block';

        usuario.value = persona.value;
        usuario.readOnly = true;

    }
}
