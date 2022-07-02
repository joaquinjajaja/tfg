var CultivoParcela = function(cpid,idCultivo,idParcela,fecha,sembrado,porcentajeAgricultor,superficie){
	this.cpid = cpid;
    this.cultivo = cultivosAll[idCultivo];
    this.idParcela = idParcela;
    this.fecha = fecha;
    this.sembrado = sembrado;
    this.faseIdeal = '';
    this.porcentajeAgricultor =0;
    this.faseActual='';
    this.superficie = superficie;
    this.visionAgricultor=''
    this.calcularFaseIdeal();
    this.cargarVisionAgricultor()
}

CultivoParcela.prototype = {
    constructor: CultivoParcela,
    eliminar:function(){
    	var t = this;
    	return new Promise(function(resolve, reject) {
            dataSend = {
                "id" : t.cpid,
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'cultivoparcela/delete',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) { 
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error eliminar",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    toHtmlListado:function(){
        var t =this;
        var fechaAux = t.timeStampToFecha(t.fecha)
        return '<div value="'+t.cpid+'" class="elementoCultivo"><div class="imgCult" style="background-image:url('+t.cultivo.foto+')"></div><p style="color: black;">'+t.cultivo.nombre+'</p><div style="width:100%;display: flex;justify-content: flex-end;align-items: center;"> <p style="width: 100%;color: black;text-align: center;">'+t.sembrado+' <br> ('+fechaAux+')</p><div value="'+t.cpid+'" class="btnPapelera negro"></div></div></div>'
    },
    timeStampToFecha:function(fecha){
        var date = new Date(fecha * 1000);
        var anio = date.getFullYear();
        var mes  = "0" + (date.getMonth()+1);
        var dia = "0" + date.getDate();
        console.log(dia,mes,anio)
        return dia.substr(-2)+'/'+mes.substr(-2)+ '/'+anio;
    },
    cargarSensores:function(pid){
        var t = this;
        return new Promise(function(resolve, reject) {
            dataSend = {
                "id" : t.cpid,
            };
            $.ajax({
                type: 'post',
                url: endPoint + '/sensor/list',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                    t.sensores={}
                },
                success: function(result) { 
                    console.log("cargarSensores result",result)
                    $.each(result.sensores,function(index, sensor){
                        var sensorAux = new Sensor(sensor.sid,sensor.tipo,sensor.lecturas)
                        t.sensores[sensor.sid]=sensorAux;
                    });
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error cargarSensores",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    calcularFaseIdeal:function(){
        var t=this;
        var tiempo=0;
        var timeHoy = new Date().getTime()/1000;
        if(t.sembrado=="Plantado"){
            tiempo = timeHoy-parseFloat(t.fecha)+parseFloat(t.cultivo.fases['Germinación'].duracion/1000)
            
        }else{
            tiempo = timeHoy-parseFloat(t.fecha)
        }
        var faseGerminacion = parseFloat(t.cultivo.fases['Germinación'].duracion/1000);
        var faseCrecimiento = parseFloat(t.cultivo.fases['Crecimiento'].duracion/1000)+faseGerminacion;
        var fasePrefloracion = parseFloat(t.cultivo.fases['Prefloración'].duracion/1000)+faseCrecimiento;
        var faseFloracion = parseFloat(t.cultivo.fases['Floración'].duracion/1000)+fasePrefloracion;
        //var faseMaduracion = parseFloat(t.cultivoParcela.cultivo.fases['Maduración'].duracion)+faseFloracion;
        if(tiempo<faseGerminacion){
            t.faseIdeal = t.cultivo.fases['Germinación'];
        }else if(tiempo<faseCrecimiento){
            t.faseIdeal = t.cultivo.fases['Crecimiento'];
        }else if(tiempo<fasePrefloracion){
            t.faseIdeal = t.cultivo.fases['Prefloración'];
        }else if(tiempo<faseFloracion){
            t.faseIdeal = t.cultivo.fases['Floración'];
        }else{
            t.faseIdeal = t.cultivo.fases['Maduración'];
        }
        console.log("t.porcentajeAgricultor",t.porcentajeAgricultor)
        if(t.porcentajeAgricultor == ''){
            t.faseActual=t.faseIdeal;
        }else{
            t.faseActual=t.calcularFasePorcentaje(parseInt(t.porcentajeAgricultor))
        }
    },
    calcularFasePorcentaje:function(porcentaje){
        var t=this,fase='';
        var faseGerminacion = parseFloat(t.cultivo.fases['Germinación'].duracion)*100/t.cultivo.tiempoTotal;
        var faseCrecimiento = (parseFloat(t.cultivo.fases['Crecimiento'].duracion)*100/t.cultivo.tiempoTotal)+faseGerminacion;
        var fasePrefloracion = (parseFloat(t.cultivo.fases['Prefloración'].duracion)*100/t.cultivo.tiempoTotal)+faseCrecimiento;
        var faseFloracion = (parseFloat(t.cultivo.fases['Floración'].duracion)*100/t.cultivo.tiempoTotal)+fasePrefloracion;
        //var faseMaduracion = parseFloat(t.cultivoParcela.cultivo.fases['Maduración'].duracion)+faseFloracion;
        console.log(faseGerminacion,faseCrecimiento,fasePrefloracion,faseFloracion)
        if(porcentaje<faseGerminacion){
           fase = t.cultivo.fases['Germinación'];
        }else if(porcentaje<faseCrecimiento){
            fase = t.cultivo.fases['Crecimiento'];
        }else if(porcentaje<fasePrefloracion){
           fase = t.cultivo.fases['Prefloración'];
        }else if(porcentaje<faseFloracion){
           fase = t.cultivo.fases['Floración'];
        }else{
           fase = t.cultivo.fases['Maduración'];
        }
        return fase;
    },
    guardarPorcentajeAgricultor:function(porcentajeAgricultor){
        var t = this;
        return new Promise(function(resolve, reject) {
            dataSend = {
                "id" : t.cpid,
                "porcentajeAgricultor" : porcentajeAgricultor
            };
            $.ajax({
                type: 'post',
                url: endPoint + '/cultivoparcela/addporcentaje',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");

                },
                success: function(result) {
                    console.log("porcentaje guardado correctamente",result)
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error guardarPorcentajeAgricultor",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    guardarVisionAgricultor:function(porcentajeAgricultor){
        var t =this
        var timeHoy = new Date().getTime()/1000;
        
        var progreso = porcentajeAgricultor*(t.cultivo.tiempoTotal/1000)/100;
        var fechaIndicada = t.fecha+progreso
        if(t.sembrado=="Plantado"){
            fechaIndicada = fechaIndicada-parseFloat(t.cultivo.fases['Germinación'].duracion/1000)
        }

        return new Promise(function(resolve, reject) {
            dataSend = {
                "idCultivoParcela" : t.cpid,
                "idUsuario":usuario.uid,
                "fechaCreacion":timeHoy,
                "fechaIndicada":fechaIndicada,
                "activada":1
            };
            $.ajax({
                type: 'post',
                url: endPoint + '/usuario/addVisionAgricultor',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");

                },
                success: function(result) {
                    console.log("addVisionAgricultor guardado correctamente",result)
                    t.visionAgricultor={
                        "id":result.id,
                        "idCultivoParcela" : t.cpid,
                        "idUsuario":usuario.uid,
                        "fechaCreacion":timeHoy,
                        "fechaIndicada":fechaIndicada,
                        "activada":1
                    }
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error addVisionAgricultor",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    quitarActivarVisionAgricultor:function(idVision,activada){
        var t = this;
        t.visionAgricultor.activada=activada

        return new Promise(function(resolve, reject) {
            dataSend = {
                "id" : idVision,
                "activada":activada
            };
            $.ajax({
                type: 'post',
                url: endPoint + '/usuario/quitarActivarVisionAgricultor',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");

                },
                success: function(result) {
                    console.log("quitarActivarVisionAgricultor guardado correctamente",result)
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error quitarActivarVisionAgricultor",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    cargarVisionAgricultor:function(){
        var t = this;
        return new Promise(function(resolve, reject) {
            dataSend = {
                "idUsuario" : usuario.uid,
                "idCultivoParcela":t.cpid
            };
            $.ajax({
                type: 'post',
                url: endPoint + '/usuario/cargarVisionAgricultor',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) {
                    console.log("cargarVisionAgricultor guardado correctamente",result)
                    
                    if(result.visionAgricultor!=undefined && result.visionAgricultor!=null){
                        t.visionAgricultor=result.visionAgricultor
                       
                            var timeHoy = new Date().getTime()/1000;
                            var diferenciaTiempo = timeHoy-t.visionAgricultor.fechaCreacion
                            console.log("diferenciaTiempo",diferenciaTiempo)
                            var tiempo = t.visionAgricultor.fechaIndicada + diferenciaTiempo
                            
                            console.log("tiempo",tiempo)
                            if(t.sembrado=="Plantado"){
                                tiempo = tiempo-parseFloat(t.fecha)+parseFloat(t.cultivo.fases['Germinación'].duracion/1000)
                                
                            }else{
                                tiempo = tiempo-parseFloat(t.fecha)
                            }
                            console.log("t.cultivo.tiempoTotal",t.cultivo.tiempoTotal)
                            var progreso = tiempo*100/(t.cultivo.tiempoTotal/1000);
                            console.log("progreso",progreso)
                            if(progreso>100){
                                progreso=100;
                            }
                            t.porcentajeAgricultor=progreso
                            console.log("t.porcentajeAgricultor",t.porcentajeAgricultor)
                        
                    }
                    
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error cargarVisionAgricultor",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    calcularFaseByTimestamp:function(timestamp){
        var t=this,faseResultado=''

        if(t.visionAgricultor.activada){
            var tiempo=0;
            if(t.sembrado=="Plantado"){
                tiempo = timestamp-parseFloat(t.fecha)+parseFloat(t.cultivo.fases['Germinación'].duracion/1000)
                
            }else{
                tiempo = timestamp-parseFloat(t.fecha)
            }
            var faseGerminacion = parseFloat(t.cultivo.fases['Germinación'].duracion/1000);
            var faseCrecimiento = parseFloat(t.cultivo.fases['Crecimiento'].duracion/1000)+faseGerminacion;
            var fasePrefloracion = parseFloat(t.cultivo.fases['Prefloración'].duracion/1000)+faseCrecimiento;
            var faseFloracion = parseFloat(t.cultivo.fases['Floración'].duracion/1000)+fasePrefloracion;
            if(tiempo<faseGerminacion){
                faseResultado = t.cultivo.fases['Germinación'];
            }else if(tiempo<faseCrecimiento){
                faseResultado = t.cultivo.fases['Crecimiento'];
            }else if(tiempo<fasePrefloracion){
                faseResultado = t.cultivo.fases['Prefloración'];
            }else if(tiempo<faseFloracion){
                faseResultado = t.cultivo.fases['Floración'];
            }else{
                faseResultado = t.cultivo.fases['Maduración'];
            }
        }else{
            var tiempo=0;
            if(t.sembrado=="Plantado"){
                tiempo = timestamp-parseFloat(t.fecha)+parseFloat(t.cultivo.fases['Germinación'].duracion/1000)
                
            }else{
                tiempo = timestamp-parseFloat(t.fecha)
            }
            var faseGerminacion = parseFloat(t.cultivo.fases['Germinación'].duracion/1000);
            var faseCrecimiento = parseFloat(t.cultivo.fases['Crecimiento'].duracion/1000)+faseGerminacion;
            var fasePrefloracion = parseFloat(t.cultivo.fases['Prefloración'].duracion/1000)+faseCrecimiento;
            var faseFloracion = parseFloat(t.cultivo.fases['Floración'].duracion/1000)+fasePrefloracion;
            if(tiempo<faseGerminacion){
                faseResultado = t.cultivo.fases['Germinación'];
            }else if(tiempo<faseCrecimiento){
                faseResultado = t.cultivo.fases['Crecimiento'];
            }else if(tiempo<fasePrefloracion){
                faseResultado = t.cultivo.fases['Prefloración'];
            }else if(tiempo<faseFloracion){
                faseResultado = t.cultivo.fases['Floración'];
            }else{
                faseResultado = t.cultivo.fases['Maduración'];
            }
        }
        return faseResultado;
    }
}