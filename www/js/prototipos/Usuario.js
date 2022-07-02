var Usuario = function(uid,nombre,apellidos,email){
	this.uid = uid;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.email=email;
    this.parcelas = {};
    this.ciudadesFavoritas ={};
    this.foto = 'css/src/fotoUserDefecto.jpg'
}

Usuario.prototype = {
    constructor: Usuario,
    login:function(email,pass){
        var t = this;
        console.log("voy a hacer la llamada",email,pass)
        return new Promise(function(resolve, reject) {
            dataSend = {
               "email" : email,
                "pass" : pass
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'login',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) { 
                    console.log("resultado login",result)
                    if(Object.keys(result).length==0){
                        reject('usuario o contraseña incorrecto')
                    }else{//id: 1, nombre: "joakin", apellidos: "chaparro", email: "joakinchaparro@hotmail.com", pass: "qwer"
                        t.uid=result.datos.id;
                        t.nombre = result.datos.nombre;
                        t.apellidos = result.datos.apellidos;
                        t.email=result.datos.email;
                        t.getTokenFCM()
                        resolve()
                    }
                    
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("erro login",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    cargarParcelas:function(){
        var t = this;
        console.log("voy a cargar las parcelas de este usuario", usuario)
        return new Promise(function(resolve, reject) {
            dataSend = {
                "uid" : t.uid,
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'parcela/list',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                    t.parcelas={}
                },
                success: function(result) { 
                    $.each(result.parcelas,function(index, parcela){
                        var parcelaAux = new Parcela(parcela.id,parcela.idPropietario,parcela.nombre,parcela.foto,parcela.descripcion,parcela.lat,parcela.lng)
                        t.parcelas[parcela.id]=parcelaAux;
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
    modificarFavorito:function(favorito,ciudad){
        var t = this;
        return new Promise(function(resolve, reject) {
            dataSend = {
                "uid" : t.uid,
                "favorito" : favorito,
                "nombreCiudad" : ciudad.nombreCiudad,
                "lat" : ciudad.lat,
                "lng" : ciudad.lng,
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'usuario/modificarFavorito',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) { 
                    console.log("result",result)
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error modificarFavorito",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        }); 
    },
    comprobarFavorito:function(ciudad){
        var t = this;
        return new Promise(function(resolve, reject) {
            dataSend = {
                "uid" : t.uid,
                "nombreCiudad" : ciudad.nombreCiudad,
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'usuario/comprobarFavorito',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) { 
                    console.log("result comprobarFavorito",result)
                    var esFavorito = false;
                    if(result.esfavorito==1 || result.esfavorito=='1'){
                        esFavorito=true;
                    }
                    resolve(esFavorito)
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error comprobarFavorito",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        }); 
    },
    cargarCiudadesFavoritas:function(){
        var t = this;
        return new Promise(function(resolve, reject) {
            dataSend = {
                "uid" : t.uid,
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'usuario/cargarCiudadesFavoritas',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                    t.ciudadesFavoritas ={};
                },
                success: function(result) { 
                    console.log("result cargarCiudadesFavoritas",result)
                    $.each(result.ciudades,function(index, ciudad){
                        var ciudadAux = new Ciudad(ciudad.nombre,ciudad.lat,ciudad.lng)
                        t.ciudadesFavoritas[ciudad.nombre]=ciudadAux;
                    });
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error cargarCiudadesFavoritas",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        }); 
    },
    registrarUsuarioGoogle: function(nombre, email,apellidos,foto,uuid){
        var t = this,correo='';
        if(email != '' && email != null && email != undefined){
            correo = email;
        }else{
            correo = uuid+ '@apptfg.com';
        }
        if(nombre!=undefined){
            nombre = nombre.replace('+',' ')
        }
        if(apellidos!=undefined){
            apellidos = apellidos.replace('+',' ')
        }
        return new Promise(function(resolve, reject) {
            dataSend = {
                "field_nombre" : nombre,
                "field_apellidos" : apellidos || '',
                "email" : correo,
                "user_picture": foto || '',
                "id_firebase" : uuid
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'usuario/loginFB',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result, call, jqXHR) { 
                    console.log("restul",result)
                    t.uid = result.uid;
                    var img = new Image();
                    img.src = result.foto || (foto || 'css/src/fotoUserDefecto.jpg');
                    t.foto=img.src
                    if(t.foto == '' || t.foto == null || t.foto == undefined){
                        t.foto='css/src/fotoUserDefecto.jpg';
                    }
                    t.nombre = result.nombre || (nombre || '');
                    t.email = correo;
                    t.apellidos = result.apellido || (apellidos || '');
                    t.getTokenFCM()
                    t.facebookApple=1;
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                    reject('Error al conectar con el servidor, vuelva a intentarlo mas tarde');
                }
            });
        });
    },
    getTokenFCM: function(){ /*Obtener token FCM y escucha activa */
        var t = this;
        FCMPlugin.onTokenRefresh(function(token){
            console.log('tokken refresh!!!!!', token);
            if(token != undefined){
                //t.saveTokenGCM(token);
                t.tokenFCM = token;
            }
        });

        FCMPlugin.getToken(function(token){
            console.log('tokken get!!!!', token);
            if(token != undefined){
                //t.saveTokenGCM(token);
                t.tokenFCM = token;
            }
        }, function(err){
            ///t.cerrarSesion().then(function(){
            ///    console.log('no tiene tokken',err);
            ///});
        });

        FCMPlugin.onNotification(function(data){
            console.log("data",data)
        });
    },
    saveTokenGCM: function(token){
        var t = this;
        if(token != '' && token != undefined && token != null && token.length > 1){
            dataSend = {
                "uid" : t.uid,
                "tokenfcm" : token
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'usuario/registartokenfcm',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) { 
                    console.log('DEBUG resultado saveTokkenGCM --> ', result['msg']);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR['responseText']);
                },
                complete: function(jqXHR, textStatus){
                    console.log('')
                }
            });
        }else{
            t.cerrarSesion().then(function(){
                console.log('no tiene tokken');
            });
        }
    },
}