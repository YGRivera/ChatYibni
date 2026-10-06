var express = require('express');
var socket = require('socket.io');
const multer = require('multer');

// Configuración de almacenamiento con Multer
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

var app = express();

var server = app.listen(4000, function () {
    console.log('Servidor corriendo en http://localhost:4000');
});

// Middleware para servir la carpeta public
app.use(express.static('public'));
app.use(express.json());

// Endpoint para la subida de archivos
app.post('/upload', upload.single('archivo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            mensaje: 'No se recibió ningún archivo'
        });
    }

    res.json({
        archivo: req.file.filename
    });
});

// WebSockets
var io = socket(server);

io.on('connection', function (socket) {
    console.log('Hay una conexión', socket.id);

    socket.on('chat', function (data) {
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    });
});