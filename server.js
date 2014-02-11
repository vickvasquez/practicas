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



 


// var fs = require('fs');
// var url = require('url');

// var server = require('http').createServer(function( req , res ){
//     var fileR = url.parse(req.url).pathname;
//     if( fileR == '/' ){
//         response = fs.readFileSync('public/index.html');
//     }else{
//         if( fileR.match(/.js$/) ){
//             res.setHeader("Content-Type", "text/javascript");
//         }else if( fileR.match(/.css$/) ){
//             res.setHeader("Content-Type", "text/css");
//         }
//         if( fs.existsSync( 'public' + fileR ) ){
//             res.writeHead(200);
//             response = fs.readFileSync('public' + fileR );
//         }else{
//             res.writeHead(404);
//             response = "Not found";
//         }
//     }
//     res.end( response );
// });

// var io = require('socket.io').listen( server );
// server.listen(8181);

// var users = [];
// io.sockets.on('connection', function (socket) {
//     console.log( users );
//     socket.on('register',function(data){
//         username = data.username.replace( /<\/?[a-z][a-z0-9]*[^<>]*>/ig , '' );
//         username = username.replace( /\s/ig , '' );
//         if( users.indexOf(username) > -1 || username.length < 3 ){
//             socket.emit( 'retry' );
//         }else{
//             users.push( username );
//             users.sort();
//             socket.username = username;
//             socket.emit( 'nick' , {'username':username} );
//         }
//         socket.emit( 'userList' , users );
//         socket.broadcast.emit( 'userList' , users );
//     });
    
//     socket.on( 'message' , function(data){
//         console.log( data );
//         if( users.indexOf( data.user ) > -1 ){
//             str = data.str.replace( /<\/?[a-z][a-z0-9]*[^<>]*>/ig , '' );
//             socket.emit( 'message' , {'user':data.user,'message':str} );
//             socket.broadcast.emit( 'message' , {'user':data.user,'message':str} );
//         }
//     });
    
//     socket.on('disconnect',function(){
//         users.splice( users.indexOf(socket.username) , 1 );
//         socket.broadcast.emit( 'userList' , users );
//     });
    
// });