var VistaEditarPerfil = function(id){
	this.id = $(id);
	this.classDesactivateClick = '.divContenedor';
	jQuery.extend(VistaEditarPerfil.prototype,new VistaAbstracta(this.id));
}

VistaEditarPerfil.prototype = {
	constructor: VistaEditarPerfil,
	loadEvents: function(){
		this.eventButtons();
		this.cargaBtnAtras();
		this.cargaSwipe();
	},
	eventButtons: function(){
		var t = this;
		t.id.find(".btnEditar").off().on('click',function(){
			t.abrirVistaEditarPerfil();
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
};