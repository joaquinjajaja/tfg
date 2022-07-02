var VistaCrearParcela = function(id,vistaListado){
	this.id = $(id);
	this.vistaListado=vistaListado || '';
	this.classDesactivateClick = '.divContenedor';
	this.fotoSel ='';
	this.marker = '';
	jQuery.extend(VistaCrearParcela.prototype,new VistaAbstracta(this.id));
}

VistaCrearParcela.prototype = {
	constructor: VistaCrearParcela,
	loadEvents: function(){
		this.eventButtons();
		
	},
	eventButtons: function(){
		var t = this;
		t.id.find(".btnAtras").off().on('click',function(){
			t.fadeOutView();
		})
		t.id.find(".fotoParcela").off().on('click',function(){
			t.opcionFoto();
		})
		t.id.find(".btnGuardar").off().on('click',function(){
			t.guardarParcela();
		})
	},
	loadData:function(){
		var t =this;
		return new Promise(function(resolve, reject) {
    		t.crearMapa();
            resolve();
        });
	},
	capturarSeleccionarImagen: function(buttonIndex){
		var t = this;
		var source;
        switch(buttonIndex){
            case 1:
                source = Camera.PictureSourceType.PHOTOLIBRARY;
                break;
            case 2:
                source = Camera.PictureSourceType.CAMERA;
                break;
        }
		var options = {
	        // Some common settings are 20, 50, and 100
	        quality: 50,
	        destinationType: Camera.DestinationType.DATA_URL,
	        // In this app, dynamically set the picture source, Camera or photo gallery
	        sourceType: source,
	        encodingType: Camera.EncodingType.JPEG,
	        mediaType: Camera.MediaType.PICTURE,
	        //allowEdit: true,
	        correctOrientation: true  //Corrects Android orientation quirks
	    }
	    return new Promise(function(resolve, reject) {
		    navigator.camera.getPicture(function(imageUri) {
		        resolve(imageUri);
		    }, function(error) {
		        console.log("Unable to obtain picture:");
		        console.log(error);
		        reject(false);
		    }, options);
		});
	},
	opcionFoto : function(){
        var t = this;
        var callback = function(buttonIndex) {
            if(buttonIndex == 1 || buttonIndex == 2){
                t.capturarSeleccionarImagen(buttonIndex).then(function(base64){
                	var img = new Image();
					img.src = "data:image/jpeg;base64," + base64;
					t.fotoSel = base64;
					$('.fotoParcela').empty().css('background-image','url('+img.src+')');
                });
            }else{
                window.plugins.actionsheet.hide();
            }
        };
        var options = {
            androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT, // default is THEME_TRADITIONAL
            title: 'Seleccione una opción',
            buttonLabels: ['Elegir archivo', 'Abrir camara'],
            androidEnableCancelButton : true,
            addCancelButtonWithLabel: 'Cancel',
            position: [20, 40],
        }
        window.plugins.actionsheet.show(options, callback);
    },
    crearMapa: function() {
      var t = this;
      return new Promise(function(resolve, reject) {
          	var latLong = new google.maps.LatLng(parseFloat(miUbicacion.lat),parseFloat(miUbicacion.lon));
          	var mapOptions = {
          	    center: latLong,
          	    zoom:15,
          	    disableDefaultUI: true,
          	    mapTypeId: google.maps.MapTypeId.ROADMAP,
          	    styles: [{"featureType": "administrative.locality",     "stylers": [       {         "visibility": "simplified"       }     ]   },   {     "featureType": "administrative.neighborhood",     "stylers": [       {         "visibility": "simplified"       }     ]   },   {     "featureType": "administrative.neighborhood",     "elementType": "labels.text",     "stylers": [       {         "color": "#bec0bb"       },       {         "visibility": "simplified"       }     ]   },   {     "featureType": "poi",     "stylers": [       {         "visibility": "off"       }     ]   },   {     "featureType": "road",     "stylers": [       {         "visibility": "on"       }     ]   } ]
          	};
          	t.map = new google.maps.Map(t.id.find('.divMapa')[0], mapOptions);
          	t.marker = new google.maps.Marker({
	      	    position: latLong,
	      	    map: t.map
	      	});
	      	t.map.addListener('click', function(e) {
	      		t.marker.setMap(null);
				t.marker = new google.maps.Marker({
				    position: e.latLng,
				    map: t.map
				});
				t.map.panTo(e.latLng);
			});

          	resolve();
      });
  },
  guardarParcela:function(){
  	var t =this,nombre='',descripcion='';
  	nombre = t.id.find("#inpNombre").val().trim()
  	descripcion = t.id.find("#inpDescripcion").val().trim();
  	var auxParcela = new Parcela()
  	auxParcela.crearParcela(nombre,descripcion,t.marker.position.lat(),t.marker.position.lng(),t.fotoSel).then(function(){
  		if(t.vistaListado!=''){
  			t.vistaListado.loadData()
  		}
  		navigator.notification.alert('La parcela se ha guardado correctamente', null, '', 'Cerrar')
  		t.fadeOutView();
  	},function(){
  		navigator.notification.alert('Hubo problemas para guardar su parcela', null, '', 'Cerrar')
  		t.fadeOutView();
  	})

  }
};