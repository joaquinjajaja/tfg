var VistaDestallesCultivo = function(id,cultivoParcela,vistaDetalles){
	this.id = $(id);
	this.cultivoParcela = cultivoParcela;
	this.vistaDetalles = vistaDetalles || '';
	this.classDesactivateClick = '.divContenedor';
	jQuery.extend(VistaDestallesCultivo.prototype,new VistaAbstracta(this.id));
}

VistaDestallesCultivo.prototype = {
	constructor: VistaDestallesCultivo,
	loadEvents: function(){
		this.eventButtons();
		this.cargaBtnAtras();
		this.cargaSwipePersonalizado();
	},
	cargaSwipePersonalizado: function(){
        var t = this,x0=0,y0=0,vectorx=0,vectory=0,ejecucionx=true;     
        t.id.on('touchstart',function(evento){
        	if($(evento.target).closest('.barraProgreso.agricultor').length==0){
	            ejecucionx=true;
	            x0 = evento.touches[0].clientX;
	            y0 = evento.touches[0].clientY;
	            vectorx=0;
	            vectory=0;
	            t.id.on('touchmove',function(evento){
	            	if($(evento.target).closest('.barraProgreso.agricultor').length==0){
		                vectorx=parseInt(evento.touches[0].clientX-x0);
		                vectory=parseInt(evento.touches[0].clientY-y0);
		                absolutoy=Math.abs(vectory);

		                if(absolutoy > (vectorx/1.75) && ejecucionx){
		                    t.id.off('touchmove');
		                }else{
		                    if(vectorx>50){
		                        t.id.css('transform','translate('+((vectorx-50)-deviceWidth)+'px,0px)');
		                        ejecucionx=false;
		                        evento.preventDefault();
		                    }
		                }
		            }
	            });
        	}
        });
        t.id.on('touchend',function(evento){
            if(vectorx<(deviceWidth/2)){
                t.id.stop(true,true).transition({x: -deviceWidth },transitionSpeed, function(){
                    $(t.classDesactivateClick).removeClass('desactivarClick')
                });
            }else{
                t.id.stop(true,true).transition({x: deviceWidth },transitionSpeed, function(){
                    $(t.classDesactivateClick).removeClass('desactivarClick');
                    t.id.remove();
                });
            }
        });
	},
	eventButtons: function(){
		var t = this;
		t.id.find(".menu > div").off().on('click',function(){
			if(!$(this).hasClass('activo') && !$(this).hasClass('desactivado')){
				t.id.find(".menu > div").removeClass('activo')
				$(this).addClass('activo')
				var value = $(this).attr('value');
				if(value=='1'){
					t.id.find('.divSensores').transition({ opacity: 0 },transitionSpeed, function(){
						$(this).css('display','none');
						t.id.find('.divDescripcion').css('display','').transition({opacity: 1},transitionSpeed)
					});
				}else{
					t.id.find('.divDescripcion').transition({ opacity: 0 },transitionSpeed, function(){
						$(this).css('display','none')
						t.id.find('.divSensores').css('display','').transition({ opacity: 1 },transitionSpeed)
					});
				}
			}
			
		});
		t.id.find(".btnMostrarFases").off().on('click',function(){
			$(this).transition({ opacity: 0 },transitionSpeed/2, function(){
				$(this).html('Selecciona la fase en la que está tu cultivo').css('text-decoration','none')
				$(this).transition({ opacity: 1 },transitionSpeed/2)
			});
			t.id.find(".radioFases").transition({'height': '140px'},transitionSpeed);
		})
		t.id.find(".radioFases input").off().on('click',function(){
			var value = $(this).val()
			t.id.find(".btnMostrarFases").transition({ opacity: 0 },transitionSpeed/2, function(){
				t.id.find(".btnMostrarFases").html('Has puesto tu cultivo en fase de '+value+', ¿Quieres cambiarlo?').css('text-decoration','underline')
				t.id.find(".btnMostrarFases").transition({ opacity: 1 },transitionSpeed/2)
			});
			t.id.find(".radioFases").transition({'height': '0px'},transitionSpeed);
		})
		t.id.find(".interruptor").off().on('click',function(){
			if($(this).hasClass('activo')){
				
				$(this).removeClass("activo")
				t.id.find(".divProgresoTiempo.agricultor").addClass("desactivado");
				t.id.find(".divProgresoTiempo.app").removeClass("desactivado");
				t.cultivoParcela.quitarActivarVisionAgricultor(t.cultivoParcela.visionAgricultor.id,0)
				t.id.find("#strFase").html(t.cultivoParcela.faseIdeal.nombre)
            	t.id.find(".pTituloFase").html(t.cultivoParcela.faseIdeal.nombre)
            	t.id.find(".pDescripcionFase").html(t.cultivoParcela.faseIdeal.descripcion)
			}else{
				$(this).addClass("activo")
				t.id.find(".divProgresoTiempo.agricultor").removeClass("desactivado")
				t.id.find(".divProgresoTiempo.app").addClass("desactivado");
				t.cultivoParcela.faseActual = t.cultivoParcela.calcularFasePorcentaje(t.cultivoParcela.porcentajeAgricultor)
            	//t.cultivoParcela.guardarPorcentajeAgricultor(t.cultivoParcela.porcentajeAgricultor);
            	t.cultivoParcela.quitarActivarVisionAgricultor(t.cultivoParcela.visionAgricultor.id,1)
            	t.id.find("#strFase").html(t.cultivoParcela.faseActual.nombre)
            	t.id.find(".pTituloFase").html(t.cultivoParcela.faseActual.nombre)
            	t.id.find(".pDescripcionFase").html(t.cultivoParcela.faseActual.descripcion)
			}
		});
		t.id.find(".btnHistorial").off().on('click',function(){
			t.abrirVistaHistorial()
		})
	},
	loadData:function(){
		var t =this;
		return new Promise(function(resolve, reject) {
			console.log("el cultivo que tengo que pintar es ", t.cultivoParcela)
			t.id.find(".cabeceraImg").css("background-image",'url('+t.cultivoParcela.cultivo.foto+')')
            t.id.find("#pTitulo").html(t.cultivoParcela.cultivo.nombre);
            t.id.find(".pTituloFase").html(t.cultivoParcela.faseIdeal.nombre)
            t.id.find(".pDescripcionFase").html(t.cultivoParcela.faseIdeal.descripcion)
            t.cultivoParcela.cargarSensores(t.vistaDetalles.parcela.pid).then(function(){
            	t.pintarSensores(t.cultivoParcela.sensores);
            	if(Object.keys(t.cultivoParcela.sensores).length==0){
	            	t.id.find('.menu > div[value="2"]').addClass("desactivado")
	            }
            	resolve(); 
            });
            t.pintarProgreso();
            var mySlider = $(".editable").slider();
            mySlider.on('slideStop',function(e){
            	t.cultivoParcela.faseActual = t.cultivoParcela.calcularFasePorcentaje(e.value)
            	//t.cultivoParcela.guardarPorcentajeAgricultor(e.value);
            	t.cultivoParcela.guardarVisionAgricultor(e.value)
            	t.cultivoParcela.porcentajeAgricultor=e.value;
            	t.id.find("#strFase").html(t.cultivoParcela.faseActual.nombre)
            	 t.id.find(".pTituloFase").html(t.cultivoParcela.faseActual.nombre)
            t.id.find(".pDescripcionFase").html(t.cultivoParcela.faseActual.descripcion)
            })
            mySlider.slider('setValue',t.cultivoParcela.porcentajeAgricultor )

            if(t.cultivoParcela.visionAgricultor.activada){
            	console.log("t.cultivoParcela.porcentajeAgricultor",t.cultivoParcela.porcentajeAgricultor)
            	t.id.find(".interruptor").addClass("activo").attr("checked",true)
				t.id.find(".divProgresoTiempo.agricultor").removeClass("desactivado")
				t.id.find(".divProgresoTiempo.app").addClass("desactivado")
				

            }
            t.id.find(".pTituloFase").html(t.cultivoParcela.faseActual.nombre)
            t.id.find(".pDescripcionFase").html(t.cultivoParcela.faseActual.descripcion)
            t.id.find("#strFase").html(t.cultivoParcela.faseActual.nombre)
            
        });
	},
	pintarSensores:function(listadoSensores){
		var t = this,rTipo='',rMedida='',rDeseable='';
		console.log("hay que pintar estos sensores",listadoSensores)
		$.each(listadoSensores,function(index, sensor){
			var ultimaLectura=sensor.getUltimaLectura();
            switch(sensor.tipo){
            	case 'Temperatura':
            		rTipo+='<p>Temperatura</p>'
            		rMedida+='<p>'+ultimaLectura.dato+''+ultimaLectura.unidadMedida+'</p>'
            		rDeseable+='<p>'+t.cultivoParcela.faseActual.temperaturaMin+'-'+t.cultivoParcela.faseActual.temperaturaMax+''+ultimaLectura.unidadMedida+'</p>'
            		t.pintarProgresoSensores(t.id.find('.barraTemp'),ultimaLectura.dato,t.cultivoParcela.faseActual.temperaturaMin,t.cultivoParcela.faseActual.temperaturaMax)
            	break;
            	case 'Humedad':
            		rTipo+='<p>Humedad</p>'
            		rMedida+='<p>'+ultimaLectura.dato+''+ultimaLectura.unidadMedida+'</p>'
            		rDeseable+='<p>'+t.cultivoParcela.faseActual.humMin+'-'+t.cultivoParcela.faseActual.humMax+''+ultimaLectura.unidadMedida+'</p>'
            		t.pintarProgresoSensores(t.id.find('.barraHum'),ultimaLectura.dato,t.cultivoParcela.faseActual.humMin,t.cultivoParcela.faseActual.humMax)
            	break;
            	case 'Caudal':
            		rTipo+='<p>Caudal</p>'
            		rMedida+='<p>'+ultimaLectura.dato+''+ultimaLectura.unidadMedida+'</p>'
            		rDeseable+='<p>'+t.cultivoParcela.faseActual.necesidadHidrica+''+ultimaLectura.unidadMedida+'</p>'
            		t.pintarProgresoSensores(t.id.find('.barraCaudal'),ultimaLectura.dato,t.cultivoParcela.faseActual.necesidadHidrica)
            	break;
            }
        });
        t.id.find('.divTipoSensores').empty().append(rTipo)
        t.id.find('.divReales').empty().append(rMedida)
        t.id.find('.divDeseados').empty().append(rDeseable)
	},
	pintarProgreso:function(){
		var t =this,tiempo='';
		var timeHoy = new Date().getTime()/1000;
		if(t.cultivoParcela.sembrado=="Plantado"){
			tiempo = timeHoy-parseFloat(t.cultivoParcela.fecha)+parseFloat(t.cultivoParcela.cultivo.fases['Germinación'].duracion/1000)
			
		}else{
			tiempo = timeHoy-parseFloat(t.cultivoParcela.fecha)
		}
		console.log("tiempo",timeHoy, tiempo,t.cultivoParcela.cultivo.tiempoTotal)
		console.log(t.cultivoParcela.fecha,parseFloat(t.cultivoParcela.fecha))
		var progreso = tiempo*100/(t.cultivoParcela.cultivo.tiempoTotal/1000);
		if(progreso>100){
			progreso=100;
		}
		console.log("progreso", progreso)
		t.id.find(".barraProgreso .progreso").css("width",progreso+'%');
		t.pintarFases();
	},
	pintarFases:function(){
		var t = this;
		var faseGerminacion = parseFloat(t.cultivoParcela.cultivo.fases['Germinación'].duracion)*100/t.cultivoParcela.cultivo.tiempoTotal
		t.id.find(".barraProgreso .fases .faseCrecimiento").css("margin-left",faseGerminacion+'%');
		var faseCrecimiento = parseFloat(t.cultivoParcela.cultivo.fases['Crecimiento'].duracion)*100/t.cultivoParcela.cultivo.tiempoTotal
		//faseCrecimiento = faseCrecimiento+faseGerminacion;
		t.id.find(".barraProgreso .fases .fasePrefloracion").css("margin-left",faseCrecimiento+'%');
		var fasePrefloracion = parseFloat(t.cultivoParcela.cultivo.fases['Prefloración'].duracion)*100/t.cultivoParcela.cultivo.tiempoTotal
		//fasePrefloracion = fasePrefloracion+faseCrecimiento;
		t.id.find(".barraProgreso .fases .faseFloracion").css("margin-left",fasePrefloracion+'%');
		var faseFloracion = parseFloat(t.cultivoParcela.cultivo.fases['Floración'].duracion)*100/t.cultivoParcela.cultivo.tiempoTotal
		//faseFloracion = faseFloracion+fasePrefloracion;
		t.id.find(".barraProgreso .fases .faseMaduracion").css("margin-left",faseFloracion+'%');
		var faseMaduracion = parseFloat(t.cultivoParcela.cultivo.fases['Maduración'].duracion)*100/t.cultivoParcela.cultivo.tiempoTotal
		//faseMaduracion = faseMaduracion+faseFloracion;
		//t.id.find(".barraProgreso .fases .faseMaduracion").css("margin-left",faseMaduracion+'%');
	},
	pintarProgresoSensores:function(elemento,valor,limInf,limSup){
		var t =this;
		var total = $(elemento).attr("data-total");
		var negativos = parseInt($(elemento).attr("data-negativos"));
		var partes = $(elemento).find(".fases > div").length;
		var posValor= (valor+negativos)*100/total;
		var poslimInf= (limInf+negativos)*100/total;
		var poslimSup= (limSup+negativos)*100/total;
		$(elemento).find('.limites .inf').css('margin-left', poslimInf+'%').attr("value",limInf)
		$(elemento).find('.limites .sup').css('margin-left', (poslimSup-poslimInf)+'%').attr("value",limSup)
		$(elemento).find('.progreso').css('width', posValor+'%')
	},
	abrirVistaHistorial: function(){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		$('body').append('<div id="divL'+contPages+'" class="divContenedor fondosVistas" style="position: fixed; left: 100%; width: 100%; height: 100%;top: 0; overflow: hidden; opacity: 1;z-index: 1;background-color: #F9FAFC;"></div>');            
		var v = new VistaHistorial('#divL'+contPages,t);
        contPages++;
        v.loadHTML('html/historial.html').then(function(){
        	v.loadData().then(function(){
                v.loadEvents();
                v.moveView(-deviceWidth);
        	});
        });
	},
}