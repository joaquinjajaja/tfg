var MomentoPronosticado = function(mid,clouds,date,dateText,humedad,presion,temperaturaAct,temperaturaMax,temperaturaMin,idPrincipal,principal,descripcion,icono){
	this.mid = mid;
	this.clouds = clouds;
	this.date = date;
	this.dateText = dateText;
	this.humedad = Math.round(humedad);
	this.presion = Math.round(presion);
	this.temperaturaAct = Math.round(temperaturaAct);
	this.temperaturaMax = Math.round(temperaturaMax);
	this.temperaturaMin = Math.round(temperaturaMin);
	this.idPrincipal = idPrincipal;
	this.principal = principal;
	this.descripcion = descripcion;
	this.icono = 'http://openweathermap.org/img/wn/'+icono.replace('n','d')+'.png';
	this.claseIcono = 'I'+icono.replace('n','d')
	this.nombre = ''
	this.getNombre();
	this.traducirPrincipal();
}

MomentoPronosticado.prototype = {
    constructor: MomentoPronosticado,
    toStringTiempo:function(){
    	var t = this;
    	var r ='<div class="day" style="display: flex;justify-content: space-around;align-items: center; opacity:0"><div class="title" style="display: flex;align-items: center;"><h3 style="color: white; font-family: &quot;Trebuchet MS&quot;;">'+t.dateText.split(' ')[1].substring(0, 5)+'</h3><div><div><div class="min-temp">'+t.principal+'</div></div></div></div><div class="icon divIconoDia"><div class="icon d000 iconoDia '+t.claseIcono+'" style="background-image:url('+t.icono+')"></div></div><div class="wind"><div class="wind"><div class="direction">Hum<div class="speed">'+t.humedad+'%</div></div></div></div><div class="temp"><div class="direction">Temp<div class="speed">'+t.temperaturaAct+'º</div></div></div></div>'
    	return r;
    },
    getNombre:function(){
    	var t = this;
		var today = new Date();
		var fechaHoy=t.dateToFecha(today);
		today.setDate(today.getDate() + 1);
		var fechaManana=t.dateToFecha(today);
    	var fechaAct= t.dateText.split(' ')[0]
    	if(fechaHoy==fechaAct){
    		t.nombre='Hoy'
    	}else if(fechaManana==fechaAct){
    		t.nombre='Mañana'
    	}else{
    		var d = new Date(t.date*1000);
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
	traducirPrincipal:function(){
		var t =this;
		switch(t.principal){
			case 'Clouds':
				t.principal = 'Nublado'
			break;
			case 'Clear':
				t.principal = 'Despejado'
			break;
			case 'Tornado':
				t.principal = 'Tornados'
			break;
			case 'Squall':
				t.principal = 'Chubascos'
			break;
			case 'Ash':
				t.principal = 'Ceniza'
			break;
			case 'Dust':
				t.principal = 'Polvo'
			break;
			case 'Sand':
				t.principal = 'Arena'
			break;
			case 'Fog':
				t.principal = 'Niebla'
			break;
			case 'Dust':
				t.principal = 'Polvo'
			break;
			case 'Haze':
				t.principal = 'Calina'
			break;
			case 'Smoke':
				t.principal = 'Humo'
			break;
			case 'Mist':
				t.principal = 'Neblina'
			break;
			case 'Snow':
				t.principal = 'Nieve'
			break;
			case 'Rain':
				t.principal = 'LLuvia'
			break;
			case 'Drizzle':
				t.principal = 'LLovizna'
			break;
			case 'Thunderstorm':
				t.principal = 'Tormenta'
			break;
		}
	}

}