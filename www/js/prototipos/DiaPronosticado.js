var DiaPronosticado = function(nombre,momento){
	this.nombre= nombre;
	this.momentosPronosticados=[momento];
	this.temperaturaAct = momento.temperaturaAct;
	this.temperaturaMax = momento.temperaturaMax;
	this.temperaturaMin = momento.temperaturaMin;
	this.humedad = momento.humedad;
	this.presion = momento.presion;
	this.principal = momento.principal;
	this.descripcion = momento.descripcion;
	this.icono = momento.icono;
	this.claseIcono = momento.claseIcono;
}

DiaPronosticado.prototype = {
    constructor: DiaPronosticado,
    addMomento:function(momento){
    	var t =this
    	t.momentosPronosticados.push(momento)
    },
    calcularDatosDia:function(){
    	var t =this,sumaTemp=0,sumaHum=0,sumaPre=0;
    	var auxIdIcono= {}
    	$.each(t.momentosPronosticados,function(i, momento){
			if(t.temperaturaMin>momento.temperaturaMin){
				t.temperaturaMin=momento.temperaturaMin;
			}
			if(t.temperaturaMax<momento.temperaturaMax){
				t.temperaturaMax=momento.temperaturaMax;
			}
			sumaTemp=sumaTemp+momento.temperaturaAct;
			sumaHum=sumaHum+momento.humedad;
			sumaPre=sumaPre+momento.presion;
			if(auxIdIcono[momento.idPrincipal]==undefined){
				auxIdIcono[momento.idPrincipal]=1
			}else{
				auxIdIcono[momento.idPrincipal]=auxIdIcono[momento.idPrincipal]+1
			}
	    });
	    t.temperaturaAct=Math.round((sumaTemp/t.momentosPronosticados.length))
	    t.humedad=Math.round((sumaHum/t.momentosPronosticados.length))
	    t.presion=Math.round((sumaPre/t.momentosPronosticados.length))
	    var maxIcon=0
	    var iconSel = ''
	    $.each(auxIdIcono,function(id, cantidad){
			if(maxIcon<cantidad){
				maxIcon=cantidad
				iconSel=id
			}
	    });
	    console.log("iconsel",iconSel)
	    $.each(t.momentosPronosticados,function(i, momento){
			if(momento.idPrincipal==iconSel){
				t.icono=momento.icono;
				t.descripcion=momento.descripcion
				t.principal=momento.principal;
				t.claseIcono=momento.claseIcono;
			}
	    });

    },
    toStringTiempo:function(){
    	var t = this;
    	t.calcularDatosDia();
    	//var r ='<div class="day" value="'+t.nombre+'" style="display: flex;justify-content: space-around;align-items: center; opacity:0"><div class="title" style="display: flex;align-items: center;"><h3 style="color: white; font-family: &quot;Trebuchet MS&quot;;">'+t.nombre+'</h3><div><div><div class="min-temp">'+t.principal+'</div></div><div><div class="max-temp">Max: '+t.temperaturaMax+'°</div><div class="min-temp">Min: '+t.temperaturaMin+'°</div></div></div></div><div class="icon divIconoDia"><div class="icon d000 iconoDia '+t.claseIcono+'" style="background-image:url('+t.icono+')"></div></div><div class="wind"><div class="wind"><div class="direction">Hum<div class="speed">'+t.humedad+'%</div></div></div></div><div class="temp"><div class="direction">Temp<div class="speed">'+t.temperaturaAct+'º</div></div></div></div>'
    	var r = '<div class="day" value="'+t.nombre+'" style="heigth:90px; display: flex;justify-content: space-around;align-items: center;opacity: 1;"><div class="title" style="display: flex;align-items: center;"><h3 style="color: white;">'+t.nombre+'</h3><div><div class="divHum"><div class="Hum">Hum<div class="valor">'+t.humedad+'%</div></div></div><div class="divPres"><div class="Pres">Pres<div class="valor">'+t.presion+'hPa</div></div></div></div><div style="margin-left: 10px;"><div class="divWind"><div class="Wind">Wind<div class="valor">21m/s</div></div><div class="direccion" style="text-align: center;">O</div></div></div></div><div class="icon" style="align-items: unset;"><p style="margin: 0;">'+t.principal+'</p><div class="icon d000 iconoDia '+t.claseIcono+'" style="background-image:url('+t.icono+')"></div></div><div class="divTemp"><div class="Temp">Temp<div class="valor">'+t.temperaturaAct+'º</div></div></div><div class="divMaxMin"><div class="divMax"><div class="Max" style="margin-bottom: 5px;">Max<div class="valor">'+t.temperaturaMax+'º</div></div></div><div class="divMin"><div class="Min">Min<div class="valor">'+t.temperaturaMin+'º</div></div></div></div></div>'

    	return r;
    },
}