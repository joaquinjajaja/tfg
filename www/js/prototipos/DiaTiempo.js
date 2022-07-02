var DiaTiempo = function(id,time,temperaturaMax,temperaturaMin,humedad,presion,velViento,dirViento,descripcion,claseIcono,probLLuvia,resumen){
	this.id = id;
	this.time= time;
	this.temperaturaMax = Math.round((temperaturaMax - 32) * 5 / 9);
	this.temperaturaMin = Math.round((temperaturaMin - 32) * 5 / 9);
	this.humedad = Math.round(humedad*100);
	this.presion = presion;
	this.velViento = velViento;
	this.dirViento = dirViento;
	this.descripcion = descripcion;
	this.claseIcono = claseIcono;
	this.probLLuvia = Math.round(probLLuvia*100);
	this.resumen = resumen || '';
	this.nombre = '';
	this.getNombre();
	this.getDescripcion();
	console.log("dia", this)
}
''
DiaTiempo.prototype = {
    constructor: DiaTiempo,
    toStringTiempo:function(){
    	var t = this;
    	var r = '<div class="day" value="'+t.id+'" style="heigth:90px; display: flex;justify-content: space-around;align-items: center;opacity: 0;"><div class="title" style="display: flex;align-items: center;"><div><p style="color: white;">'+t.nombre+'</p><p style="color: white;">'+t.dateToString(t.time)+'</p></div><div class="ic" style="padding-left:10px;align-items: unset;"><div class="icon d000 iconoDia '+t.claseIcono+'"></div></div><p style="padding-left:8px;min-width: 55px;max-width: 55px;">'+t.descripcion+'</p></div><div class="divProb" style="align-items: center;text-align: center;"><div class="divIconoDetalle" style="width: 20px;background-image: url(css/src/paraguasAzul.svg);height: 20px;margin-top: 0;"></div><div class="Prob">Prob.<div class="valor">'+t.probLLuvia+'%</div></div></div><div class="divMaxMin" style="align-items: center;text-align: center;"><div class="divIconoDetalle" style="width: 20px;background-image: url(css/src/termometroNaranja.svg);height: 20px;margin-top: 0;"></div><div class="divMax"><div class="Max">Max: '+t.temperaturaMax+'º</div></div><div class="divMin"><div class="Min">Min: '+t.temperaturaMin+'º</div></div></div></div>'
    	return r;
    },
    getNombre:function(){
    	var t = this;
		var today = new Date();
		var fechaHoy=t.dateToString(today.getTime()/1000)
		today.setDate(today.getDate() + 1);
		var fechaManana=t.dateToString(today.getTime()/1000);
		

    	if(fechaHoy==t.dateToString(t.time)){
    		t.nombre='Hoy'
    	}else if(fechaManana==t.dateToString(t.time)){
    		t.nombre='Mañana'
    	}else{
    		var d = new Date(t.time*1000);
    		t.nombre=nombreDias[d.getDay()]
    	}
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
		console.log("date",date)
		var dia = date.getDate();
		if(dia<10){
			dia='0'+dia;
		}
		var mes = (date.getMonth()+1);
		if(mes<10){
			mes='0'+mes;
		}
		fecha = dia+'-'+mes+'-'+date.getFullYear();
		console.log("fecha",fecha)
		return fecha;
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