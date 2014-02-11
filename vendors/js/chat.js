$(document).on("ready", function(){

	var self=this;

	/*
	 * Nos conectamos al servidor del socket y los almacenamos en la variable sockets
	*/
	var sockets=io.connect("/");

	/* Escuchamos cuando se conecte un cliente
	 * Verificamos que el usuario no este vacio de ser asi lo redirigimos al login	
	 * De lo contrario emitimos al servidor el usuario que se esta conectando
	*/
	sockets.on("connect", function(){
		// if(sessionStorage.usuario==="" || sessionStorage.usuario===undefined || sessionStorage.usuario===null) {
		// 	mostrarRes("Por favor inicia sesion");
		// 	location.href="login.html";
		// }
		// else {
			debugger;
			sockets.emit("usuario",sessionStorage.usuario=prompt("Ingresa tu nombre"));
		//}			
	});

	/*
	 * Escuchamo el evento keypress es decir cuando se apriete el enter dentro del cuandro de texto
	 * Evitamos el evento por default
	 * Emitimos al servidor el mensaje tecleado en el caudro de texto
	 * Limpiamos el cuadro de texto
	 * Cambiamos el titulo del documento
	*/
	$("#text-area .texto").on("keypress",function (e){
		if(e.keyCode===13) {
			e.preventDefault();
			sockets.emit("msg",$(this).val());
			$(this).val('');
			document.title="SISTEMA DE PUNTO DE VENTA";
		}
	});

	/*
	 * Escuchamos al evento Focus del textarea 
	 * Verificamos que el  nombre del usuario no este vacio de ser asi redireccionamos al login
	 * De lo contrario ponemos el div a su estilo original
	*/

	$("#text-area .texto").on("focus", function() {
		if(sessionStorage.usuario==="" || sessionStorage.usuario===undefined || sessionStorage.usuario===null) {
			mostrarRes("Por favor inicia sesion");
			location.href="login.html";
		}
		else {
			$("#msj").removeClass("rojo");
		}	
	});

	/*
	 * Escuchamos cuando el servidor nos mande un msg 
	 * Creamos una funcion anonima que recibe como parametros el usuario que esta mandando el msj y el msj recibido
	 * Ponemos al div en su estilo original
	 * Creamos una variable de tip Date
	*/
	sockets.on("msg", function (usuario,msj){
		$("#msj").removeClass("rojo");
		hora=new Date();		
		$(document.createElement("div"))
		.html("<strong>"+ usuario +":</strong><span class='mmsj'>" + msj +"</span>"+hora.getHours()+":"+ hora.getMinutes() + ":" + hora.getSeconds())
		.appendTo("#mensajes"); 

		$("#chat").scrollTop($("#mensajes").height());
		//Esto nos permitira mantener visible el ultimo mensaje
		//$("#mensajes").scrollTop($(this).height());
	});

	/*
	 * Se escribe los mensajes a otros clientes
	*/
	sockets.on("envmsj", function(usuario,msj) {
		debugger;
		sonido=document.createElement("audio");		
		document.body.appendChild(sonido);
		sonido.setAttribute("src","js/not/0458.mp3");
		debugger;
		$("#msj").addClass("rojo");
		texto="Nuevo mensaje de :" + usuario;
		hora=new Date();
		document.title=texto;

		sonido.pause();
		//sonido.currentTime=0;
		sonido.play();

		$(document.createElement("div"))
		.html("<span class='mmsj'>" + msj +"</span><strong>"+ usuario +":</strong>")
		.appendTo("#mensajes"); 
		//console.log( usuario +" dice :"+ msj);
	});

	//Lista todos los usuarios en linea;
	sockets.on("usuarios", function(usuarios) {
      $("#users-online").html('');
      for (var i = 0; i < usuarios.length; i++) {
          $(document.createElement("div")).text(usuarios[i]).appendTo("#users-online");
      }
  	});
	
	//Cuando se conecta un nuevo usuario mostramos un mensaje a tdos los demas clientez conectados
	sockets.on("nuevo", function(usuario){
		$("#users-online").html("Se ha conectado :" + usuario);
		$("#users-online").fadeIn()
		.delay(3000)
		.fadeOut();
		});
		
	});
