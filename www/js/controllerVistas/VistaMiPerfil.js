var VistaMiPerfil = function(id){
	this.id = $(id);
	this.classDesactivateClick = '.divContenedor';
	jQuery.extend(VistaMiPerfil.prototype,new VistaAbstracta(this.id));
}

VistaMiPerfil.prototype = {
	constructor: VistaMiPerfil,
	loadEvents: function(){
		this.eventButtons();
		this.cargaBtnAtras();
		this.cargaSwipeIzquierdo();
	},
	eventButtons: function(){
		var t = this;
		t.id.find(".btnEditar").off().on('click',function(){
			t.abrirVistaEditarPerfil();
		})
		t.id.find(".btnAcerca").off().on('click',function(){
			t.abrirVistaTextual('acerca');
		})
		t.id.find(".btnPolitica").off().on('click',function(){
			t.abrirVistaTextual('politica');
		})
		t.id.find(".btnFAQ").off().on('click',function(){
			t.abrirVistaPreguntasFrecuentes();
		})
		t.id.find(".btnCerrarSesion").off().on('click',function(){
			window.localStorage.setItem('emailUserLog', '');
			window.localStorage.setItem('passUserLog', '');
			window.localStorage.setItem('inicioAutomatico', '0');
			location.reload();
		})
	},
	loadData:function(){
		var t =this;
		return new Promise(function(resolve, reject) {
            t.pintarUsario()
            resolve();
        });
	},
	pintarUsario:function(){
		var t = this;
		console.log("hay que pintar este usuario", usuario)
		t.id.find(".fotoUser").css('background-image','url('+usuario.foto+')')
		t.id.find(".pNombre").html(usuario.nombre+' '+usuario.apellidos)
	},
	abrirVistaEditarPerfil: function(){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor fondosVistas" style="position: fixed; left: 100%; width: 100%; height: 100%;top: 0; overflow: hidden; opacity: 1;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaEditarPerfil('#divL'+contPages);
        contPages++;
        v.loadHTML('html/editarPerfil.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
                v.moveView(-deviceWidth);
        	});
        });
	},
	abrirVistaTextual: function(opcion){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor fondosVistas" style="position: fixed; left: 100%; width: 100%; height: 100%;top: 0; overflow: hidden; opacity: 1;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaTextual('#divL'+contPages,opcion);
        contPages++;
        v.loadHTML('html/seccionTextual.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
                v.moveView(-deviceWidth);
        	});
        });
	},
	abrirVistaPreguntasFrecuentes: function(){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor fondosVistas" style="position: fixed; left: 100%; width: 100%; height: 100%;top: 0; overflow: hidden; opacity: 1;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaPreguntasFrecuentes('#divL'+contPages);
        contPages++;
        v.loadHTML('html/preguntasFrecuentes.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
                v.moveView(-deviceWidth);
        	});
        });
	}
};