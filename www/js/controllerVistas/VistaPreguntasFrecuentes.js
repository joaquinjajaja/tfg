var VistaPreguntasFrecuentes = function(id){
	this.id = $(id);
	this.classDesactivateClick = '.divContenedor';
	jQuery.extend(VistaPreguntasFrecuentes.prototype,new VistaAbstracta(this.id));
}

VistaPreguntasFrecuentes.prototype = {
	constructor: VistaPreguntasFrecuentes,
	loadEvents: function(){
		this.eventButtons();
		this.cargaBtnAtras();
		this.cargaSwipe();
	},
	eventButtons: function(){
		var t = this;
		t.id.find('.listadoPreguntas > .btnTrans').off().on('click',function(){
			if($(this).hasClass('activo')){
				$(this).removeClass('activo')
			}else{
				$(this).addClass('activo')
			}
		})
	},
	loadData:function(){
		var t =this;
		return new Promise(function(resolve, reject) {
            resolve();
        });
	},
};