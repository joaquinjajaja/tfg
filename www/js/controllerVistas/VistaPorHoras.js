var VistaPorHoras = function(id,listadoHoras){
	this.id = $(id);
	this.listadoHoras= listadoHoras;
	this.classDesactivateClick = '.divContenedor';
	jQuery.extend(VistaPorHoras.prototype,new VistaAbstracta(this.id));
}

VistaPorHoras.prototype = {
	constructor: VistaPorHoras,
	loadEvents: function(){
		this.eventButtons()
	},
	eventButtons: function(){
		var t = this;
		t.id.find(".btnAtras").off().on('click',function(){
			console.log("boton")
			t.subirVista(0)
		})
	},
	loadData:function(){
		var t =this;
		return new Promise(function(resolve, reject) {
       		console.log("hay que pintar estas horas",t.listadoHoras)
       		t.pintarTiempoDark(t.listadoHoras)
            resolve();
        });
	},
	pintarTiempoDark:function(listadoHoras){
		var t = this,r='',contador=0;
		var diaSel = ''
		$.each(listadoHoras,function(i, hora){
			if(diaSel!=hora.getNombreDia()){
				diaSel=hora.getNombreDia()
				r+='<p style="text-align:center;color:white">'+diaSel+'<p>'
			}
		    r+=hora.toStringTiempo()
		    contador++
	    });
	    t.id.find("#tablaTiempo").empty().append(r);
	    var elementosHora = t.id.find("#tablaTiempo > .day");
	    $.each(elementosHora,function(i, e){
    		setTimeout(function(){
	        	$(e).css({opacity: 0}).transition({ opacity: 1 },transitionSpeed);
	        },(100*i))
	   	});
		
	},
};