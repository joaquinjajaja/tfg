var VistaTextual = function(id,opcion){
	this.id = $(id);
	this.opcion= opcion;
	this.classDesactivateClick = '.divContenedor';
	jQuery.extend(VistaTextual.prototype,new VistaAbstracta(this.id));
}
VistaTextual.prototype = {
	constructor: VistaTextual,
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
			switch(t.opcion){
				case 'politica':
					t.id.find('.pTituloVista').html('Política de privacidad')
					t.id.find('.divTexto').html('Política de privacidad de Joaquín Chaparro\n\nEsta Política de privacidad describe cómo se recopila, utiliza y comparte su información personal cuando visita la aplicación.\n\nINFORMACIÓN PERSONAL QUE RECOPILAMOS\n\nCuando visita el Sitio, recopilamos automáticamente cierta información sobre su dispositivo, incluida modelo del dispositivo, sistema operativo, ubicación. Además cuando inicia sesión en la aplicación recopilamos información visible de su cuenta de Google.\n\n¿CÓMO UTILIZAMOS SU INFORMACIÓN PERSONAL?\n\nLa información recopilada acerca del dispositivo la utilizamos para que tenga una buena experiencia de usuario, que pueda navegar fluidamente por cada una de las secciones de la aplicación y no tenga cierres o cortes de servicio.\n\nLa ubicación la utilizamos para agilizar el proceso de creación de parcelas.\n\nLos datos proporcionados de la cuenta de Google los utilizaremos para realizar un registro del usuario en la aplicación para poder asignarle parcelas y cultivos, y mantener la sesión iniciada.\n\nCAMBIOS\n\nPodemos actualizar esta política de privacidad periódicamente para reflejar, por ejemplo, cambios en nuestras prácticas o por otros motivos operativos, legales o reglamentarios.\n\nCONTÁCTENOS\n\nPara obtener más información sobre nuestras prácticas de privacidad, si tiene alguna pregunta o si desea presentar una queja, contáctenos por correo electrónico a joakinchaparro@hotmail.com o por correo mediante el uso de la información que se proporciona a continuación:\n\n Fray Tomás de la Virgen, 34, Villanueva de los Infantes, CR, 13320, España\n\n')
				break;
				case 'acerca':
					t.id.find('.pTituloVista').html('Acerca de la aplicación')
					t.id.find('.divTexto').html('Esta es una aplicacion desarrollada por joaquin que tiene como objetivo monitorizar los valores meteorologicos de un cultivo')
				break;
			}
            resolve();
        });
	},
};