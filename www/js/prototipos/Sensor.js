var Sensor = function(sid,tipo,lecturas){
	this.sid = sid;
    this.tipo = tipo;
    this.lecturas = lecturas || []
}

Sensor.prototype = {
    constructor: Sensor,
    getUltimaLectura:function(){
        var t=this,maxTime=t.lecturas[0].timestamp,lecturaSel=t.lecturas[0];
        $.each(t.lecturas,function(index, lec){
            if(maxTime<lec.timestamp){
                maxTime=lec.timestamp;
                lecturaSel=lec
            }
        });
        return lecturaSel;
    },
    getDatosDia:function(dia){
        var t =this,lecturasDia=[],timestampMin=new Date(dia+" 00:00:00").getTime()/1000,timestampMax=new Date(dia+" 23:59:59").getTime()/1000;

        $.each(t.lecturas,function(index, lec){
            
            if(timestampMin<=lec.timestamp && timestampMax>=lec.timestamp){
                lecturasDia.push(lec)
            }
        });
        console.log("lecturasDia",lecturasDia)
        if(lecturasDia.length>0){
            switch(t.tipo){
                case "Temperatura":
                    var lecturaMaxSel=lecturasDia[0]
                    var lecturaMinSel=lecturasDia[0]
                    var tempMax=lecturasDia[0].dato
                    var tempMin=lecturasDia[0].dato
                    $.each(lecturasDia,function(index, lec){
                        if(tempMax<lec.dato){
                            tempMax=lec.dato;
                            lecturaMaxSel=lec
                        }
                        if(tempMin>lec.dato){
                            tempMin=lec.dato;
                            lecturaMinSel=lec
                        }
                    });
                    return {
                        tempMax:tempMax,
                        tempMin:tempMin
                    }
                break;
                case "Humedad":
                    var humedadMedia=lecturasDia[0].dato
                    var humedadAcumulada = 0
                    $.each(lecturasDia,function(index, lec){
                        humedadAcumulada=humedadAcumulada+lec.dato
                    });
                    humedadMedia=humedadAcumulada/lecturasDia.length
                    return {
                        humedadMedia:humedadMedia
                    }
                break;
                case "Caudal":
                    var caudalAcumulado = 0
                    $.each(lecturasDia,function(index, lec){
                        caudalAcumulado=caudalAcumulado+lec.dato
                    });
                    return {
                        caudalAcumulado:caudalAcumulado
                    }
                break;
            }
        }else{
            return '';
        }
        
    }
    
}