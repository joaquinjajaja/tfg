var Fase = function(fid,cid,nombre,humMin,humMax,temperaturaMax,temperaturaMin,phMin,phMax,duracion,descripcion,necesidadHidrica){
	this.fid = fid;
    this.cid = cid;
    this.nombre = nombre;
    this.humMin = humMin;
    this.humMax = humMax;
    this.temperaturaMax = temperaturaMax;
    this.temperaturaMin = temperaturaMin;
    this.phMin = phMin;
    this.phMax = phMax;
    this.duracion = duracion;
    this.descripcion = descripcion;
    this.necesidadHidrica = necesidadHidrica;
}

Fase.prototype = {
    constructor: Fase,
}