/*
*
* @author VicK Vasquez
* @descripcion Chat
*
*/
var express = require("express"),
	app 	= express(),
	server  = require("http").createServer(app),
	io 		= require("socket.io").listen(server);

	server.listen(process.env.PORT || 3000,function(){
		console.log("Servidor corriendo: Verificar en localhost:3000 en el navegador :>)= ");
	})

	app.get("/", function(req,res){
		res.sendfile(__dirname + '/index.html');
	})

	app.use(express.static("./vendors"))

	var usuarios = [];

	io.sockets.on("connection", function (socket) {

		console.log(usuarios);
		console.log(socket.id);

		socket.on("usuario", function( usuario) {

			usuarios.push(usuario);			
			usuarios.sort();			
			socket.emit("usuarios",usuarios);			
			//Manda la lista de todos los usuarios conectados para tratarlo del lado del cliente
			socket.broadcast.emit("usuarios", usuarios);
			//Manda un msj a todos los clientes que se conectó  un nuevo cliente
			socket.broadcast.emit("nuevo",usuario);

			socket.on("msg",function(msj){
				//Emitimos el mensaje al mismo usuario
				socket.emit("msg",usuario,msj);
				//Emitimos el mensaje a todos los clientes
				socket.broadcast.emit("envmsj",usuario,msj);
			});
		});


		socket.on("disconnect", function(usuario){
			usuarios.splice(usuarios.indexOf(usuario), 1);
			socket.emit("usuarios",usuarios);
			socket.broadcast.emit("desconectado", usuario);
		});
	});