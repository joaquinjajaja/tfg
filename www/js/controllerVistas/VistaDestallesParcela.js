var VistaDestallesParcela = function(id,parcela,vistaListado){
	this.id = $(id);
	this.parcela = parcela;
	this.vistaListado = vistaListado || '';
	this.classDesactivateClick = '.divContenedor';
	jQuery.extend(VistaDestallesParcela.prototype,new VistaAbstracta(this.id));
}

VistaDestallesParcela.prototype = {
	constructor: VistaDestallesParcela,
	loadEvents: function(){
		this.eventButtons();
		this.cargaBtnAtras();
		this.cargaSwipe();
	},
	eventButtons: function(){
		var t = this;
		t.id.find(".menu > div").off().on('click',function(){
			if(!$(this).hasClass('activo')){
				t.id.find(".menu > div").removeClass('activo')
				$(this).addClass('activo')
				var value = $(this).attr('value');
				if(value=='1'){
					t.id.find('.divCultivos,.divPie').transition({ opacity: 0 },transitionSpeed, function(){
						$(this).css('display','none');
						t.id.find('.divDescripcion').css('display','').transition({opacity: 1},transitionSpeed)
					});
				}else{
					t.id.find('.divDescripcion').transition({ opacity: 0 },transitionSpeed, function(){
						$(this).css('display','none')
						t.id.find('.divCultivos,.divPie').css('display','').transition({ opacity: 1 },transitionSpeed)
					});
				}
			}
			
		})
		t.id.find(".btnEditarPar").off().on('click',function(){
			t.abrirVistaModificarParcela()
		})
		t.id.find(".btnMasCultivo").off().on('click',function(){
			t.id.find('.selectCultivos').focus();
		})
		t.id.find(".btnMasCultivo").off().on('click',function(){
			t.abrirVistaCrearCultivo();
		})
	},
	loadData:function(){
		var t =this;
		return new Promise(function(resolve, reject) {
			console.log("la parcela que tengo que pintar es ", t.parcela)
			t.parcela.cargarCultivos().then(function(){
				t.pintarCultivos(t.parcela.cultivos)
				
			})
			t.id.find(".cabeceraImg").css("background-image",'url('+t.parcela.foto+')')
            t.id.find("#pTitulo").html(t.parcela.nombre);
            t.id.find(".pDescripcion").html(t.parcela.descripcion)
            t.loadTiempoDark(t.parcela.lat,t.parcela.lng).then(function(listadoDias){
            	console.log("listadoDias",listadoDias)
            	t.pintarMeteo(listadoDias[0])
            	resolve();
            })
            
        });
	},
	pintarCultivos:function(cultivos){
		var t =this,r='';
		console.log('hay que pintar estos cultivos', cultivos)
		$.each(cultivos,function(index, cultivoParcela){
            r+=cultivoParcela.toHtmlListado();
        });
		t.id.find('.listadoCultivos').empty().append(r);
		if(r==''){
			t.id.find(".divCultivos > p").html('Aún no tienes cultivos asociados a esta parcela')
		}else{
			t.id.find(".divCultivos > p").html('Los cultivos de esta parcela son:')
		}
		t.id.find(".listadoCultivos .btnPapelera").off().on('click',function(){
			var value=$(this).attr('value');
			navigator.notification.confirm(
			    '¿Deseas eliminar este cultivo de la parcela?', // message
			    function onConfirm(buttonIndex) {
			    	if(buttonIndex==1){
			    		t.parcela.cultivos[value].eliminar();
						delete t.parcela.cultivos[value];
						t.pintarCultivos(t.parcela.cultivos);
			    	}
				},
			    '',// title
			    ['Si','No']// buttonLabels
			);
		})
		t.id.find(".listadoCultivos > div").off().on('click',function(e){
			if(!$(e.target).hasClass('btnPapelera')){
				var value=$(this).attr('value');
				t.abrirVistaDetallesCultivo(t.parcela.cultivos[value])
			}
			
		})
		t.pintarSelectCultivos();
	},
	abrirVistaModificarParcela: function(){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor fondosVistas" style="left:0%;position: fixed;left:100%; width: 100%; height: 100%;top: 0; overflow: hidden;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaModificarParcela('#divL'+contPages,t);
        contPages++;
        v.loadHTML('html/formularioParcela.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
               	v.moveView(-deviceWidth);
        	});
        });
	},
	
	pintarSelectCultivos:function(){
		var t=this;
		var r ='<option value="-1">En otro momento</option>';
		console.log(t.parcela.cultivos)
	    $.each(cultivosAll,function(index, cultivo){
	    	console.log(cultivo)
	    	if(t.parcela.cultivos[cultivo.cid]==undefined){
	    		 r+='<option value="'+cultivo.cid+'">'+cultivo.nombre+'</option>'
	    	}
	    });
	    t.id.find(".selectCultivos").empty().append(r);
	    t.id.find(".selectCultivos").on('change',function(){
	    	var value = $(this).val();
	    	if(value!='-1'){
	    		t.parcela.cultivos[value]=cultivosAll[value];
	    		t.parcela.addCultivo(value)
	    		t.pintarCultivos(t.parcela.cultivos)
	    	}
	    	
	    })
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
	pintarMeteo:function(dia){
		var t = this;
		
		t.id.find(".pFechaDia").html(dia.dateToString(dia.time))
		t.id.find(".iconoBrujula").css("transform","rotate("+dia.dirViento+"deg);")
		t.id.find(".pDia").html(dia.nombre)
		t.id.find('.pTempMax span').html(dia.temperaturaMax+' º')
		t.id.find('.pTempMin span').html(dia.temperaturaMin+' º')
		t.id.find('.pHum span').html(dia.humedad+' %')
		t.id.find('.pPres span').html(dia.presion+' hPa')
		t.id.find('.pProb span').html(dia.probLLuvia+' %')
		t.id.find('.pVelViento span').html(dia.velViento+' m/s')
		t.id.find('.pDirViento span').html(dia.dirViento+' º')
	},
	abrirVistaDetallesCultivo: function(cultivo){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor fondosVistas" style="position: fixed; left: 100%; width: 100%; height: 100%;top: 0; overflow: hidden; opacity: 1;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaDestallesCultivo('#divL'+contPages,cultivo,t);
        contPages++;
        v.loadHTML('html/detallesCultivo.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
                v.moveView(-deviceWidth);
        	});
        });
	},
	abrirVistaCrearCultivo: function(){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor fondosVistas" style="left:0%;position: fixed; opacity:0 ; width: 100%; height: 100%;top: 0; overflow: hidden;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaCrearCultivo('#divL'+contPages,t);
        contPages++;
        v.loadHTML('html/formularioCultivo.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
                v.fadeInView();
        	});
        });
	}
}