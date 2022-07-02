var VistaListadoParcelas = function(id){
	this.id = $(id);
	this.classDesactivateClick = '.divContenedor';
	jQuery.extend(VistaListadoParcelas.prototype,new VistaAbstracta(this.id));
}

VistaListadoParcelas.prototype = {
	constructor: VistaListadoParcelas,
	loadEvents: function(){
		this.eventButtons();
	},
	eventButtons: function(){
		var t = this;
		t.id.find("#btnTiempo").off().on('click',function(){
			t.abrirVistaTiempo()
		})
		t.id.find("#btnMenu").off().on('click',function(){
			t.abrirVistaUsuario()
		})
		t.id.find(".btnMas").off().on('click',function(){
			t.abrirVistaCrearParcela()
		})
	},
	loadData:function(){
		var t =this;
		return new Promise(function(resolve, reject) {
            usuario.cargarParcelas().then(function(){
            	t.pintarParcelas(usuario.parcelas)
            });
            resolve();
        });
	},
	pintarParcelas:function(listadoParcelas){
		var t = this,r='';
		$.each(listadoParcelas,function(index, parcela){
			r+=parcela.toStringListado();
		});
		t.id.find(".listadoParcelas > div").empty().append(r);
		t.loadEventosParcelas(listadoParcelas);
	},
	loadEventosParcelas:function(listadoParcelas){
		var t =this;
		t.id.find(".listadoParcelas > div > div").off().on('click',function(){
			var value = $(this).attr('value');
			var parcela = listadoParcelas[value];
			t.abrirVistaDetallesParcela(parcela);
		});
		
	},
	abrirVistaTiempo: function(){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor fondosVistas" style="position: fixed; left: 100%; width: 100%; height: 100%;top: 0; overflow: hidden; opacity: 1;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaPronosticoTiempo('#divL'+contPages);
        contPages++;
        v.loadHTML('html/pronosticoTiempo.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
                v.moveView(-deviceWidth);
        	});
        });
	},
	abrirVistaDetallesParcela: function(parcela){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor fondosVistas" style="position: fixed; left: 100%; width: 100%; height: 100%;top: 0; overflow: hidden; opacity: 1;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaDestallesParcela('#divL'+contPages,parcela,t);
        contPages++;
        v.loadHTML('html/detallesParcela.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
                v.moveView(-deviceWidth);
        	});
        });
	},
	abrirVistaUsuario: function(){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor fondosVistas" style="position: fixed; right: 100%; width: 100%; height: 100%;top: 0; overflow: hidden; opacity: 1;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaMiPerfil('#divL'+contPages);
        contPages++;
        v.loadHTML('html/miPerfil.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
                v.moveView(deviceWidth);
        	});
        });
	},
	abrirVistaCrearParcela: function(){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor fondosVistas" style="left:0%;position: fixed; opacity:0 ; width: 100%; height: 100%;top: 0; overflow: hidden;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaCrearParcela('#divL'+contPages,t);
        contPages++;
        v.loadHTML('html/formularioParcela.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
                v.fadeInView();
        	});
        });
	},	
};