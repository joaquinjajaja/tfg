//var endPoint = "https://6a06-90-169-108-191.ngrok.io/";
var endPoint ="http://192.168.1.38:8001/"
//var endPoint ="http://8904-90-169-108-191.ngrok.io/"
var contPages = 0,usuario='',transitionSpeed=300,deviceWidth = window.screen.width,deviceHeight = window.screen.height,miUbicacion={},miCiudad='Ciudad Real',cultivosAll={};
var nombreDias=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() { 
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },
    onDeviceReady: function() {
        //console.log("la app esta iniciada, vamos a probar la apirests");
        //console.log("llamo al metodo getDataUsers")
        //app.getDataUser();
        app.cargarCultivosAll();
        app.obtenerUbicacion();
        app.abrirVistaLogin();
         var firebaseConfig = {
          apiKey: "AIzaSyARexY14klBe-XfOnKShB2jBjzsRxvyrZM",
          authDomain: "apptfg-2e9c3.firebaseapp.com",
          databaseURL: "https://apptfg-2e9c3.firebaseio.com",
          projectId: "apptfg-2e9c3",
          storageBucket: "apptfg-2e9c3.appspot.com",
          messagingSenderId: "737374672128",
        };
        firebase.initializeApp(firebaseConfig);
        provider = new firebase.auth.GoogleAuthProvider();


        //SIMULARLECTURA
        //app.simularLectura('4','40','l/m²',new Date('2022-03-04 20:00:00').getTime()/1000)
        // END
    },
    getDataUser: function(){
        var t = this;
        return new Promise(function(resolve, reject) {
            dataSend = {
            };
            
            $.ajax({
                type: 'get',
                url: endPoint + 'user',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    console.log("hay una peticion aqui:"+endPoint+'user'+" con estos datos",dataSend)
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) { 
                     console.log("estos son los datos de respuesta", result);
                     resolve();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR['responseText']);
                    reject();
                }
            });
        });
    },
    abrirVistaLogin:function(){
        $('body').append('<div id="divL'+contPages+'" class="divContenedor" style="position: fixed; width: 100%; height: 100%;top: 0; overflow: hidden;z-index: 1;"></div>');
        var v = new VistaLogin('#divL'+contPages);
        contPages++;
        v.loadHTML('html/login.html').then(function(){
            v.loadEvents();
            setTimeout(function() {
                navigator.splashscreen.hide();
            }, 2000);
        });
    },
    obtenerUbicacion: function(){
        var t = this;
        //var geocoder = new google.maps.Geocoder();
        navigator.geolocation.getCurrentPosition(function(position) {
            //var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            miUbicacion = {lat: parseFloat(position.coords.latitude), lon: parseFloat(position.coords.longitude)};
            /*geocoder.geocode({'latLng': geolocate}, function(results, status) {
                $.each( results,function(i, val) {
                    $.each( val['address_components'],function(i, val) {
                        if (val['types'] == "locality,political") {
                            if (val['long_name']!="") {
                                 miCiudad = val['long_name']
                            }
                        }
                    });
                }); 
            });  */
        });
    },
    cargarCultivosAll:function(){
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'post',
                url: endPoint + 'cultivo/listAll',
                dataType: "JSON",
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) { 
                    $.each(result.cultivos,function(index, cultivo){
                        var cultivoAux = new Cultivo(cultivo.id,cultivo.nombre,cultivo.foto,cultivo.descripcion,cultivo.necesidadHidrica,cultivo.temperaturaMax,cultivo.temperaturaMin,cultivo.phMin,cultivo.phMax,cultivo.tiempoGerminacion,cultivo.tiempoCrecimiento,cultivo.tiempoPrefloracion,cultivo.tiempoFloracion,cultivo.tiempoMaduracion)
                        cultivosAll[cultivo.id]=cultivoAux;
                    });
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error cargarCultivosAll",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    simularLectura:function(idSensor,dato,unidadMedida,timestamp){
        return new Promise(function(resolve, reject) {
            dataSend = {
                "idSensor" : idSensor,
                "dato":dato,
                "unidadMedida":unidadMedida,
                "timestamp":timestamp
            };
            $.ajax({
                type: 'post',
                url: endPoint + '/lecturas/addLectura',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                success: function(result) {
                    console.log("addLectura guardado correctamente",result)
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error addLectura",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    }
};
