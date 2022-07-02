var Parcela = function(pid,idPropietario,nombre,foto,descripcion,lat,lng){
	this.pid = pid;
    this.idPropietario = idPropietario;
    this.nombre = nombre;
    this.foto = foto;
    this.sensores = {};
    this.descripcion = descripcion;
    this.cultivos = {};
    this.lat= lat;
    this.lng = lng;
}

Parcela.prototype = {
    constructor: Parcela,
    
    toStringListado:function(){
        var t =this,r='';
        r='<div value="'+t.pid+'" class="elementoParcela"><div class="fotoListado" style="background-image:url('+t.foto+')"></div><div class="pieListado"><p>'+t.nombre+'</p></div></div>'
        return r;
    },
    cargarCultivos:function(){
        var t = this;
        return new Promise(function(resolve, reject) {
            dataSend = {
                "pid" : t.pid,
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'cultivoparcela/list',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                    t.parcelas={}
                },
                success: function(result) { 
                    console.log("estos son los cultivos", result)
                    $.each(result.cultivos,function(index, cultivo){
                        //(cid,idParcela,nombre,foto,descripcion,necesidadHidrica,temperaturaMax,temperaturaMin)
                        //var cultivoAux = new Cultivo(cultivo.id,cultivo.nombre,cultivo.foto,cultivo.descripcion,cultivo.necesidadHidrica,cultivo.temperaturaMax,cultivo.temperaturaMin)
                        t.cultivos[cultivo.id] = new CultivoParcela(cultivo.id,cultivo.idCultivo,cultivo.idParcela,cultivo.fecha,cultivo.sembrado,cultivo.porcentajeAgricultor,cultivo.superficie)
                        
                    });
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error cargarParcelas",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    cargarDatos:function(){
        var t =this;
        return new Promise(function(resolve, reject) {
            dataSend = {
                "pid" : t.pid,
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'parcela/load',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) { 
                    console.log("se ha modificado la parcela id", result)
                    var resultado= result.data[0]
                    t.nombre = resultado.nombre;
                    t.foto = resultado.foto;
                    t.descripcion = resultado.descripcion;
                    t.lat= resultado.lat;
                    t.lng = resultado.lng;
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error modificado parcela",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    crearParcela:function(nombre,descripcion,lat,lng,foto){
        var t =this;
        return new Promise(function(resolve, reject) {
            dataSend = {
                "uid" : usuario.uid,
                "nombre" : nombre,
                "descripcion" : descripcion,
                "lat" : lat,
                "lng" : lng,
                "foto" : foto
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'parcela/add',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) { 
                    console.log("se ha creado la parcela id", result)
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error crear parcela",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    modificarParcela:function(nombre,descripcion,lat,lng,foto){
        var t =this;
        return new Promise(function(resolve, reject) {
            dataSend = {
                "uid" : usuario.uid,
                "pid" : t.pid,
                "nombre" : nombre,
                "descripcion" : descripcion,
                "lat" : lat,
                "lng" : lng,
                "foto" : foto
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'parcela/update',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) { 
                    console.log("se ha modificado la parcela id", result)
                    t.cargarDatos().then(function(){
                        resolve()   
                    })
                    
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error modificado parcela",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    eliminarParcela:function(){
        var t =this;
        return new Promise(function(resolve, reject) {
            dataSend = {
                "pid" : t.pid,
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'parcela/remove',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) { 
                    console.log("se ha eliminado la parcela id", result)
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error eliminado parcela",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    addCultivo:function(cid,sembrado,fecha,superficie){
        var t =this;
        return new Promise(function(resolve, reject) {
            dataSend = {
                "pid" : t.pid,
                "fecha" : fecha,
                "sembrado" : sembrado,
                "cid" : cid,
                "superficie" : superficie
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'cultivoparcela/add',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) { 
                    console.log("se ha addCultivo", result)
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error addCultivo",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    }
}