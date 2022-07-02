var VistaPronosticoTiempoDetalles = function(id,dia,sitio){
	this.id = $(id);
	this.classDesactivateClick = '.divContenedor';
	this.dia=dia;
	this.sitio = sitio || '';
	jQuery.extend(VistaPronosticoTiempoDetalles.prototype,new VistaAbstracta(this.id));
}

VistaPronosticoTiempoDetalles.prototype = {
	constructor: VistaPronosticoTiempoDetalles,
	loadEvents: function(){
		this.eventButtons();
		this.cargaBtnAtras();
		this.cargaSwipe();
	},
	eventButtons: function(){
		var t = this;
	},
	loadData:function(){
		var t =this;
		return new Promise(function(resolve, reject) {
            t.pintarTiempo(t.dia)
            resolve();
        });
	},
	pintarTiempo:function(dia){
		var t = this;
		console.log("hay que pintar este dia", dia)
		t.id.find(".iconoBrujula").css("transform","rotate("+dia.dirViento+"deg);")
		t.id.find(".pFechaDia").html(dia.dateToString(dia.time))
		t.id.find('.pDia').html(dia.nombre);
		t.id.find('.pSitio').html(t.sitio);
		t.id.find('.pResumen').html(dia.resumen);
		t.id.find('.pTempMax span').html(dia.temperaturaMax+' º')
		t.id.find('.pTempMin span').html(dia.temperaturaMin+' º')
		t.id.find('.pHum span').html(dia.humedad+' %')
		t.id.find('.pPres span').html(dia.presion+' hPa')
		t.id.find('.pProb span').html(dia.probLLuvia+' %')
		t.id.find('.pVelViento span').html(dia.velViento+' m/s')
		t.id.find('.pDirViento span').html(dia.dirViento+' º')
	}
};