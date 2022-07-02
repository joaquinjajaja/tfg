var VistaPronosticoTiempo = function(id){
	this.id = $(id);
	this.classDesactivateClick = '.divContenedor';
	this.momentosPronosticados =[];
	this.diasPronosticados = {};
	this.listadoHoras={}
	this.ciudadSel = new Ciudad();
	jQuery.extend(VistaPronosticoTiempo.prototype,new VistaAbstracta(this.id));
}

VistaPronosticoTiempo.prototype = {
	constructor: VistaPronosticoTiempo,
	loadEvents: function(){
		this.eventButtons();
		this.cargaBtnAtras();
		this.cargaSwipe();
	},
	eventButtons: function(){
		var t = this;
		var input = document.getElementById('inpBuscador');
		var options = {
		  types: ['geocode'],
		  componentRestrictions: {country: 'es'}
		};
		autocomplete = new google.maps.places.Autocomplete(input, options);
		autocomplete.addListener('place_changed', function(e) {
			var place = autocomplete.getPlace();
			console.log('CAMBIO PLACE CHANGED', place)
			t.id.find('.pNombreCiudad').html(place.name)
			//t.loadTiempo(place.geometry.location.lat(),place.geometry.location.lng()).then(function(nombre){
            //	t.pintarTiempo(nombre)
            //});
            t.ciudadSel.nombreCiudad= place.name;
            t.ciudadSel.lat=place.geometry.location.lat()
            t.ciudadSel.lng=place.geometry.location.lng()

            usuario.comprobarFavorito(t.ciudadSel).then(function(result){
            	if(result){
            		t.id.find('.icon-corazon').addClass('marcado').css('display','')
            	}else{
            		t.id.find('.icon-corazon').removeClass('marcado').css('display','')
            	}
            });
            t.loadTiempoDark(place.geometry.location.lat(),place.geometry.location.lng()).then(function(listadoDias){
				t.pintarTiempoDark(listadoDias);
			});
			t.id.find(".selectFavoritos").val('-1')
		});
		t.id.find("#btnPorHoras").off().on('click',function(){
			t.abrirVistaPorHoras()
		})
		t.id.find('.icon-corazon').off().on('click',function(){
			if($(this).hasClass('marcado')){
				$(this).removeClass('marcado')
				usuario.modificarFavorito('0',t.ciudadSel).then(function(){
					usuario.cargarCiudadesFavoritas().then(function(){
						t.pintarSelect();
					});
				});
			}else{
				$(this).addClass('marcado')
				usuario.modificarFavorito('1',t.ciudadSel).then(function(){
					usuario.cargarCiudadesFavoritas().then(function(){
						t.pintarSelect();
					});
				});
			}
		})
		
	},
	loadData:function(){
		var t =this;
		return new Promise(function(resolve, reject) {
			usuario.cargarCiudadesFavoritas().then(function(){
				t.pintarSelect();
			});
			t.ciudadSel.nombreCiudad= miCiudad;
            t.ciudadSel.lat=miUbicacion.lat;
            t.ciudadSel.lng=miUbicacion.lon;
            usuario.comprobarFavorito(t.ciudadSel).then(function(result){
            	if(result){
            		t.id.find('.icon-corazon').addClass('marcado').css('display','')
            	}else{
            		t.id.find('.icon-corazon').removeClass('marcado').css('display','')
            	}
            });
			t.loadTiempoDark(miUbicacion.lat,miUbicacion.lon).then(function(listadoDias){
				t.pintarTiempoDark(listadoDias);
			});
			t.id.find('.pNombreCiudad').html(miCiudad)
            //t.loadTiempo(miUbicacion.lat,miUbicacion.lon).then(function(nombre){
            //	t.pintarTiempo(nombre)
            //});
            resolve();
        });
	},
	pintarTiempoDark:function(listadoDias){
		var t = this,r='',contador=0;
		$.each(listadoDias,function(i, dia){
			if(contador!=5){
		        r+=dia.toStringTiempo()
		        contador++
		    }
	    });
	    t.id.find("#tablaTiempo").empty().append(r);
	    var elementosDia = t.id.find("#tablaTiempo > .day");
	    $.each(elementosDia,function(i, e){
    		setTimeout(function(){
	        	$(e).css({opacity: 0}).transition({ opacity: 1 },transitionSpeed);
	        },(200*i))
	   	});
	    t.loadEventosDia(listadoDias);
		
	},
	pintarTiempo:function(nombre){
		var t = this,r='',contador=0;
		//var listadoPorDias=t.filtrarPorDias(t.momentosPronosticados)
		t.ordenarPorDias(t.momentosPronosticados);
		console.log("t.diasPronosticados",t.diasPronosticados)

		$.each(t.diasPronosticados,function(i, dia){
			if(contador!=5){
		        r+=dia.toStringTiempo()
		        contador++
		    }
	    });
	    t.id.find("#tablaTiempo").empty().append(r);
	    var elementosDia = t.id.find("#tablaTiempo > .day");
	    $.each(elementosDia,function(i, e){
    		setTimeout(function(){
	        	$(e).css({opacity: 0}).transition({ opacity: 1 },transitionSpeed);
	        },(100*i))
	   	});
	    t.loadEventosDia();
		
	},

	loadTiempo :function(lat,lon){//id ciudad real 6357128// infantes 2516449
		var t =this;
		t.momentosPronosticados=[];
		return new Promise(function(resolve, reject) {
			$.ajax({
			   	type: "GET",
			   	//url: "http://api.agromonitoring.com/agro/1.0/image/search?start=1500336000&end=1508976000&polyid=5d8b48afeb408b00071464f4&appid=48187d218a30c5eec25c5dc816ed0496",
			   	//url: "http://api.openweathermap.org/data/2.5/weather?id=2516449&lang=en&units=metric&APPID=48187d218a30c5eec25c5dc816ed0496",
			   	//url: "http://api.openweathermap.org/data/2.5/weather?q=Ciudad real, PR&APPID={48187d218a30c5eec25c5dc816ed0496}",
			   	//url: "http://api.openweathermap.org/data/2.5/forecast?id=2516449&lang=en&units=metric&APPID=48187d218a30c5eec25c5dc816ed0496",
			   	url: 'http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&lang=en&units=metric&APPID=48187d218a30c5eec25c5dc816ed0496',
			   	dataType: "json",
			   	success: function (data) {
			   		console.log("restultado tiempo ", data);
			   		//coger el icono http://openweathermap.org/img/wn/10d@2x.png
			   		$.each(data.list,function(i, m){
                        var aux = new MomentoPronosticado(i,m.clouds,m.dt,m.dt_txt,m.main.humidity,m.main.pressure,m.main.temp,m.main.temp_max,m.main.temp_min,m.weather[0].id,m.weather[0].main,m.weather[0].description,m.weather[0].icon)
                    	t.momentosPronosticados.push(aux);
                    });
			   		resolve(data.city.name)
			   	},
			   	error: function (jqXHR, textStatus, errorThrown) {
			     	alert(errorThrown);
			     	resolve()
			   	}
			});
		});
	},
	loadTiempoDark :function(lat,lon){//id ciudad real 6357128// infantes 2516449
		var t =this;
		t.momentosPronosticados=[];
		return new Promise(function(resolve, reject) {
			$.ajax({
			   	type: "GET",
			   	//url: 'http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&lang=en&units=metric&APPID=48187d218a30c5eec25c5dc816ed0496',
			   	url: 'https://api.darksky.net/forecast/2dcf6047f344475aa329145b5d7402ec/'+lat+','+lon+'?lang=es',
			   	dataType: "json",
			   	success: function (data) {
			   		var listadoDias={};
					t.listadoHoras = {};			   		
			   		console.log("restultado tiempo ", data);
			   		$.each(data.daily.data,function(i, d){
			   			var diaTiempo = new DiaTiempo(i,d.time,d.temperatureMax,d.temperatureMin,d.humidity,d.pressure,d.windSpeed,d.windBearing,d.summary,d.icon,d.precipProbability,d.summary)
                    	listadoDias[i]=diaTiempo;
                    });
                    $.each(data.hourly.data,function(i, d){
			   			var horaTiempo = new HoraTiempo(i,d.time,d.temperature,d.humidity,d.pressure,d.windSpeed,d.windBearing,d.summary,d.icon,d.precipProbability)
                    	t.listadoHoras[i]=horaTiempo;
                    });
			   		resolve(listadoDias)
			   	},
			   	error: function (jqXHR, textStatus, errorThrown) {
			     	alert(errorThrown);
			     	resolve()
			   	}
			});
		});
	},
	filtrarPorDias: function(listado){
		var t = this,listadoFiltrado=[];
		$.each(listado,function(i, m){
	        if(!t.existeDia(listadoFiltrado,m)){
	        	listadoFiltrado.push(m)
	        }
	    });
	    return listadoFiltrado;
	},
	existeDia:function(listado,m){
		var t =this,existe=-1;
		$.each(listado,function(i, ml){
	        if(ml.nombre==m.nombre){
	        	existe=i;
	        }
	    });
	    if(existe!=-1){
	    	return true;
	    }else{
	    	return false;
	    }
	},
	ordenarPorDias: function(listado){
		var t = this;
		t.diasPronosticados={};
		$.each(listado,function(i, m){
	        if(t.diasPronosticados[m.nombre]==undefined){
	        	t.diasPronosticados[m.nombre]= new DiaPronosticado(m.nombre,m)
	        }else{
	        	t.diasPronosticados[m.nombre].addMomento(m)
	        }
	    });
	},
	loadEventosDia:function(listadoDias){
		var t =this;
		console.log("listado dias", listadoDias)
		t.id.find("#tablaTiempo > .day").off().on('click',function(){
			var value=$(this).attr('value');
			var dia = listadoDias[value]
			t.abrirVistaTiempoDetalle(dia);
		});
	},
	abrirVistaTiempoDetalle:function(dia){
		var t =this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor" style="position: fixed; left: 100%; width: 100%; height: 100%;top: 0; overflow: hidden; opacity: 1;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaPronosticoTiempoDetalles('#divL'+contPages,dia,t.id.find('.pNombreCiudad').html());
        contPages++;
        v.loadHTML('html/pronosticoTiempoDetalles.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
                v.moveView(-deviceWidth);
        	});
        });
	},
	abrirVistaPorHoras:function(){
		var t =this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor fondosVistas" style="left: 0;position: fixed; bottom: -100%; width: 100%; height: 100%; overflow: hidden; opacity: 1;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaPorHoras('#divL'+contPages,t.listadoHoras);
        contPages++;
        v.loadHTML('html/pronosticoPorHoras.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
                v.subirVista(-deviceHeight);
        	});
        });
	},
	pintarSelect:function(){
		var t = this,r=' <option value="-1">Selecciona una parcela</option>';
		console.log('usuario',usuario)
		$.each(usuario.parcelas,function(i, p){
    		r+='<option value="'+p.pid+'">'+p.nombre+'</option>'
	   	});
	   	$.each(usuario.ciudadesFavoritas,function(i, c){
    		r+='<option value="'+c.nombreCiudad+'">'+c.nombreCiudad+'</option>'
	   	});
	   	t.id.find(".selectFavoritos").empty().append(r);
	   	t.id.find(".selectFavoritos").on('change',function(){
	   		var idParcela = $(this).val();
	   		if(idParcela!='-1'){
	   			if(usuario.parcelas[idParcela]!=undefined){
	   				t.id.find('.pNombreCiudad').html(usuario.parcelas[idParcela].nombre)
	   				t.id.find('.icon-corazon').css('display','none')
			   		t.loadTiempoDark(usuario.parcelas[idParcela].lat,usuario.parcelas[idParcela].lng).then(function(listadoDias){
						t.pintarTiempoDark(listadoDias);
					});
	   			}else{
	   				t.ciudadSel= usuario.ciudadesFavoritas[idParcela];
	            	t.id.find('.pNombreCiudad').html(t.ciudadSel.nombreCiudad)
			   		usuario.comprobarFavorito(t.ciudadSel).then(function(result){
		            	if(result){
		            		t.id.find('.icon-corazon').addClass('marcado').css('display','')
		            	}else{
		            		t.id.find('.icon-corazon').removeClass('marcado').css('display','')
		            	}
		            });
		            t.loadTiempoDark(t.ciudadSel.lat,t.ciudadSel.lng).then(function(listadoDias){
						t.pintarTiempoDark(listadoDias);
					});
	   			}
		   	}else{
		   		t.id.find('.pNombreCiudad').html(t.ciudadSel.nombreCiudad)
		   		usuario.comprobarFavorito(t.ciudadSel).then(function(result){
	            	if(result){
	            		t.id.find('.icon-corazon').addClass('marcado').css('display','')
	            	}else{
	            		t.id.find('.icon-corazon').removeClass('marcado').css('display','')
	            	}
	            });
	            t.loadTiempoDark(t.ciudadSel.lat,t.ciudadSel.lng).then(function(listadoDias){
					t.pintarTiempoDark(listadoDias);
				});
		   	}
	   	});

	}
	
};