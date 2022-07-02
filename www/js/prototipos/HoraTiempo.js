var HoraTiempo = function(id,time,temperatura,humedad,presion,velViento,dirViento,descripcion,claseIcono,probLLuvia){
	this.id = id;
	this.time= time;
	this.temperatura = Math.round((temperatura - 32) * 5 / 9);
	this.humedad = Math.round(humedad*100);
	this.presion = Math.round(presion);
	this.velViento = velViento;
	this.dirViento = dirViento;
	this.descripcion = descripcion;
	this.claseIcono = claseIcono;
	this.probLLuvia = Math.round(probLLuvia*100);
	this.nombre = '';
	this.getNombre();
	//this.getDescripcion();
	//console.log("dia", this)
}

HoraTiempo.prototype = {
    constructor: HoraTiempo,
    toStringTiempo:function(){
    	var t = this;
    	var r = '<div class="day" value="'+t.nombre+'" style="heigth:90px; display: flex;justify-content: space-around;align-items: center;opacity: 0;"><div class="title" style="min-width: 0px;display: flex;align-items: center;"><p style="color: white;">'+t.nombre+'</p><div class="icon" style="padding-left:10px;align-items: unset;"><div class="icon d000 iconoDia '+t.claseIcono+'"></div></div></div><div class="divHum" style="align-items: center;text-align: center;"><div class="divIconoDetalle" style="width: 20px;background-image: url(css/src/humedad.svg);height: 20px;margin-top: 0;"></div><div class="Hum" >Hum<div class="valor">'+t.humedad+'%</div></div></div><div class="divPres" style="align-items: center;text-align: center;"><div class="divIconoDetalle" style="width: 20px;background-image: url(css/src/presion.svg);height: 20px;margin-top: 0;"></div><div class="Pres" >Presión<div class="valor"> '+t.presion+'hPa</div></div></div><div class="divProb" style="align-items: center;text-align: center;"><div class="divIconoDetalle" style="width: 20px;background-image: url(css/src/paraguasAzul.svg);height: 20px;margin-top: 0;"></div><div class="Prob">Prob.<div class="valor">'+t.probLLuvia+'%</div></div></div><div class="divTemp" style="align-items: center;text-align: center;"><div class="divIconoDetalle" style="width: 20px;background-image: url(css/src/termometroNaranja.svg);height: 20px;margin-top: 0;"></div><div class="Temp" >Temp<div class="valor">'+t.temperatura+'º</div></div></div></div></div>'
    	return r;
    },
    getNombre:function(){
    	var t = this;
    	var date = new Date(t.time*1000)
		var fecha='';
		var dia = date.getDate();
		if(dia<10){
			dia='0'+dia;
		}
		var mes = (date.getMonth()+1);
		if(mes<10){
			mes='0'+mes;
		}
		var hora = date.getHours();
		if(hora<10){
			hora='0'+hora;
		}
		fecha = hora+':00';
		t.nombre = fecha;
    },
    dateToFecha:function(date){
		var fecha='';
		var dia = date.getDate();
		if(dia<10){
			dia='0'+dia;
		}
		var mes = (date.getMonth()+1);
		if(mes<10){
			mes='0'+mes;
		}
		fecha = date.getFullYear()+'-'+mes+'-'+dia;
		return fecha;
	},
	dateToString:function(time){
		var fecha='';
		var date = new Date(time*1000);
		var dia = date.getDate();
		if(dia<10){
			dia='0'+dia;
		}
		var mes = (date.getMonth()+1);
		if(mes<10){
			mes='0'+mes;
		}
		fecha = dia+'-'+mes+'-'+date.getFullYear();
		return fecha;
	},
	getNombreDia:function(){
    	var t = this;
		var today = new Date();
		var fechaHoy=t.dateToString(today.getTime()/1000)
		today.setDate(today.getDate() + 1);
		var fechaManana=t.dateToString(today.getTime()/1000);
		
		var nombre = ''
    	if(fechaHoy==t.dateToString(t.time)){
    		nombre='Hoy'
    	}else if(fechaManana==t.dateToString(t.time)){
    		nombre='Mañana'
    	}else{
    		var d = new Date(t.time*1000);
    		nombre=nombreDias[d.getDay()]
    	}
    	return(nombre)
    },
	getDescripcion:function(){
    	var t = this;
		switch(t.claseIcono){
			case 'clear-day':
				t.descripcion = 'Despejado'
			break;
			case 'clear-night':
				t.descripcion = 'Despejado'
			break;
			case 'partly-cloudy-day':
				t.descripcion = 'Parcialmente Nublado'
			break;
			case 'partly-cloudy-night':
				t.descripcion = 'Parcialmente Nublado'
			break;
			case 'cloudy':
				t.descripcion = 'Nublado'
			break;
			case 'sleet':
				t.descripcion = 'LLuvia débil'
			break;
			case 'rain':
				t.descripcion = 'LLuvia'
			break;
			case 'snow':
				t.descripcion = 'Nieve'
			break;
			case 'fog':
				t.descripcion = 'Niebla'
			break;
			case 'wind':
				t.descripcion = 'Viento'
			break;
			
		}
    },
}