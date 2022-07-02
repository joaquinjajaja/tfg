var Cultivo = function(cid,nombre,foto,descripcion/*,necesidadHidrica,temperaturaMax,temperaturaMin,phMin,phMax,tiempoGerminacion,tiempoCrecimiento,tiempoPrefloracion,tiempoFloracion,tiempoMaduracion*/){
	this.cid = cid;
    this.nombre = nombre;
    this.foto = foto;
    this.descripcion = descripcion;
    //this.necesidadHidrica = necesidadHidrica;
    //this.temperaturaMax = temperaturaMax;
    //this.temperaturaMin = temperaturaMin;
    //this.phMin = phMin;
    //this.phMax = phMax;
    //this.tiempoGerminacion = tiempoGerminacion;
    //this.tiempoCrecimiento = tiempoCrecimiento;
    //this.tiempoPrefloracion = tiempoPrefloracion;
    //this.tiempoFloracion = tiempoFloracion;
    //this.tiempoMaduracion = tiempoMaduracion;
    this.fases={}
    this.tiempoTotal=0;
    this.cargarFases();
}

Cultivo.prototype = {
    constructor: Cultivo,
    cargarFases:function(){
        var t =this;
        return new Promise(function(resolve, reject) {
            dataSend = {
                "cid" : t.cid,
            };
            $.ajax({
                type: 'post',
                url: endPoint + 'fases/list',
                dataType: "JSON",
                data: JSON.stringify(dataSend),
                cache: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                    t.fases={}
                },
                success: function(result) { 
                    console.log("cargarfases result",result)

                    $.each(result.fases,function(index, f){
                        //var Fase = function(fid,cid,nombre,humMin,humMax,temperaturaMax,temperaturaMin,phMin,phMax,duracion,descripcion){
                        var faseAux = new Fase(f.idFase,f.idCultivo,f.nombreFase,f.humMin,f.humMax,f.tempMax,f.tempMin,f.phMin,f.phMax,f.duracion,f.descripcion,f.necesidadhidrica);
                        t.fases[f.nombreFase]=faseAux;

                        t.tiempoTotal = t.tiempoTotal + parseFloat(f.duracion)
                        console.log("tiempocultivo",t.tiempoTotal,f.duracion)
                    });
                    resolve()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("error cargarfases",jqXHR, textStatus, errorThrown )
                    reject()
                }
            });
        });
    },
    
}