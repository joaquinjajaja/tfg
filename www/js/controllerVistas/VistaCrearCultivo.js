var VistaCrearCultivo = function(id,vistaDetallesParcela){
	this.id = $(id);
	this.vistaDetallesParcela=vistaDetallesParcela || '';
	this.classDesactivateClick = '.divContenedor';
	jQuery.extend(VistaCrearCultivo.prototype,new VistaAbstracta(this.id));
}

VistaCrearCultivo.prototype = {
	constructor: VistaCrearCultivo,
	loadEvents: function(){
		this.eventButtons();
		
	},
	eventButtons: function(){
		var t = this;
		t.id.find(".btnAtras").off().on('click',function(){
			t.fadeOutView();
		})
		t.id.find(".btnGuardar").off().on('click',function(){
			t.guardarCultivo();
		})
	},
	loadData:function(){
		var t =this;
		return new Promise(function(resolve, reject) {
			t.pintarSelectCultivos();
            resolve();
        });
	},
	guardarCultivo:function(){
		var t =this;
		var value = t.id.find('.selectCultivos').val();
    	if(value!='-1'){
    		t.id.find('.selectCultivos').removeClass("bordeRojo")
    		var sembrado = t.id.find('.selectSembrado').val();
    		var fechaAux = t.id.find('input[name="fechaInicio"]').val();
    		var fecha = new Date(fechaAux).getTime()/1000;
    		var fechaHoy = new Date().getTime()/1000;
    		var superficie = t.id.find(".inpSuperficie").val().trim();
    		if(superficie!=''){
	    		if(fecha!='' && fecha<fechaHoy){
	    			console.log(value,sembrado,fecha)
	    			t.vistaDetallesParcela.parcela.addCultivo(value,sembrado,fecha,superficie).then(function(){
	    				t.vistaDetallesParcela.loadData().then(function(){
		    				t.fadeOutView();
		    			});
	    			})
	    		}else{
	    			t.id.find('input[name="fechaInicio"]').addClass("bordeRojo")
	    		}
	    	}else{
	    		t.id.find('.inpSuperficie').addClass("bordeRojo")
	    	}
    	}else{
    		t.id.find('.selectCultivos').addClass("bordeRojo")
    	}
	},
	pintarSelectCultivos:function(){
		var t=this;
		var r ='<option value="-1">En otro momento</option>';
	    $.each(cultivosAll,function(index, cultivo){
	    	r+='<option value="'+cultivo.cid+'">'+cultivo.nombre+'</option>'
	    });
	    t.id.find(".selectCultivos").empty().append(r);
	},
};