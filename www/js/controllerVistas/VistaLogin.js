var VistaLogin = function(id){
	this.id = $(id);
	this.classDesactivateClick = '.divContenedor';
	jQuery.extend(VistaLogin.prototype,new VistaAbstracta(this.id));
}

VistaLogin.prototype = {
	constructor: VistaLogin,
	loadEvents: function(){
		this.eventButtons();
	},
	eventButtons: function(){
		var t = this;

		t.id.find("#btnAcceder").off().on('click',function(){
			$(t.classDesactivateClick).addClass('desactivarClick');
			var email = $('#inpEmail').val(), pass = $('#inpPass').val();
			t.comprobarCredenciales(email, pass).then(function(result){
				t.abrirVistaListadoParcelas()
				$(t.classDesactivateClick).removeClass('desactivarClick');
			}, function(result){
				navigator.notification.alert(result, null, '', 'Cerrar')
				$(t.classDesactivateClick).removeClass('desactivarClick');
			});
		});
		t.eventoLoginGoogle();
		t.comprobarLoginAutomatico();
	},

	comprobarCredenciales: function(email, pass){
		var t = this;
		return new Promise(function(resolve, reject) {
			if(email != '' && pass != ''){
				var u = new Usuario();
				u.login(email, pass).then(function(data){
					usuario = u;
					window.localStorage.setItem('emailUserLog', email);
					window.localStorage.setItem('passUserLog', pass);
					window.localStorage.setItem('inicioAutomatico', '1');
		            resolve();
				}, function(msg){
					reject(msg);
				});
			}else{

				reject('Introduzca email y contraseña.');
			}
		});
	},
	comprobarLoginAutomatico: function(){
		var t = this, aux_i = window.localStorage.getItem('inicioAutomatico');
		if(aux_i == '1'){
			t.comprobarCredenciales(window.localStorage.getItem('emailUserLog'), window.localStorage.getItem('passUserLog')).then(function(result){
				console.log("exito inicio automatico")
				t.abrirVistaListadoParcelas()
			}, function(result){
				console.log('REJECT COMPROBARCREDENCIALES')
			});
		}
	},
	abrirVistaListadoParcelas:function(){
		var t =this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		var elementos = $('.divContenedor');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor fondosVistas" style="position: fixed; left: 0%; width: 100%; height: 100%;top: 0; overflow: hidden; opacity: 0;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaListadoParcelas('#divL'+contPages);
        contPages++;
        v.loadHTML('html/listadoParcelas.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
                v.fadeInView();
                t.fadeOutView();
                setTimeout(function(){
                	elementos.remove();
                },300);
        	});
        });
	},
	eventoLoginGoogle:function(){
		var t =this;
		t.id.find("#btnAccederGoogle").off().on('click',function(){
			firebase.auth().signInWithRedirect(provider).then(function() {
			    return firebase.auth().getRedirectResult().then(function(result) {
				  if (result.credential) {
				    var user = result.user.providerData[0];
			  		console.log('registro-user!!!', user)
			  		var correo = '';
			  		usuario = new Usuario();
			  		usuario.registrarUsuarioGoogle(user.displayName,user.email,user.familyName,user.photoURL,user.uid).then(function(){
			  			window.localStorage.setItem('emailUserLog', usuario.email);
						window.localStorage.setItem('passUserLog', '3Gs7pD}Q*wXo');
						window.localStorage.setItem('inicioAutomatico', '1');
						t.abrirVistaListadoParcelas()
			  		},function(err){
			  			navigator.notification.alert(err, null, '', 'Cerrar')
			  		});
				  }
				}).catch(function(error) {
				  var errorCode = error.code;
				  var errorMessage = error.message;
				  console.log("error inicio con google",errorCode,errorMessage)
				});
			})
		})
	}
};