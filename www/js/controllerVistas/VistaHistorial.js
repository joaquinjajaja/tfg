var VistaHistorial = function(id,vistaDetallesCultivo){
	this.id = $(id);
	this.vistaDetallesCultivo=vistaDetallesCultivo || '';
  this.cultivoParcela=vistaDetallesCultivo.cultivoParcela || ''
	this.classDesactivateClick = '.divContenedor';
  this.chart='';
  this.chartRecomendado='';
  this.max=6;
  this.tiempos =[]/*["2022-03-01","2022-03-02","2022-03-03","2022-03-04","2022-03-01","2022-03-02","2022-03-03","2022-03-04",
  "2022-03-01","2022-03-02","2022-03-03","2022-03-04","2022-03-01","2022-03-02","2022-03-03","2022-03-04",
  "2022-03-01","2022-03-02","2022-03-03","2022-03-04","2022-03-01","2022-03-02","2022-03-03","2022-03-04",
  "2022-03-01","2022-03-02","2022-03-03","2022-03-04","2022-03-01","2022-03-02","2022-03-03","2022-03-04",
  "2022-03-01","2022-03-02","2022-03-03","2022-03-04","2022-03-01","2022-03-02","2022-03-03","2022-03-04",
  "2022-03-01","2022-03-02","2022-03-03","2022-03-04","2022-03-01","2022-03-02","2022-03-03","2022-03-04"]*/
  for(var i=0;i<32;i++){
    this.tiempos.push("2022-03-"+i)
  }
  this.tiempos =["2022-06-25","2022-06-26","22022-06-27","2022-06-28","2022-06-29"]
  /*this.caudal = [2,3,2,5,2,3,2,5,2,3,2,5,2,3,2,5,2,3,2,5,2,3,2,5,2,3,2,5,2,3,2,5,2,3,2,5,2,3,2,5,2,3,2,5,2,3,2,5]
  this.caudalRecomendado = [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
  this.temperaturaMax = [40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37]
  this.temperaturaMin = [20,21,23,29,20,21,23,29,20,21,23,29,20,21,23,29,20,21,23,29,20,21,23,29,20,21,23,29,20,21,23,29,20,21,23,29,20,21,23,29,20,21,23,29,20,21,23,29]
  this.humedad = [40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37]*/
  this.caudal = [2,3,2,5,2]//,3,2,5,2,3,2,5,2,3,2,5,2,3,2,5,2,3,2,5,2,3,2,5,2,3,2,5]
  this.caudalRecomendado = [3,3,3,3,3]//,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
  this.temperaturaMax = [40,38,41,37,40]//,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37]
  this.temperaturaMin = [20,21,23,29,20]//,21,23,29,20,21,23,29,20,21,23,29,20,21,23,29,20,21,23,29,20,21,23,29,20,21,23,29]
  this.humedad = [40,38,41,37,40]//,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37,40,38,41,37]

	jQuery.extend(VistaHistorial.prototype,new VistaAbstracta(this.id));
}

VistaHistorial.prototype = {
	constructor: VistaHistorial,
	loadEvents: function(){
		var t = this;
		t.eventButtons();
		t.cargaBtnAtras();
		t.cargaSwipe();
	},
	eventButtons: function(){
		var t = this;
    t.id.find(".selectHistorial").off().on("change",function(){
      var value = $(this).val()
      switch(value){
        case "temperatura":
          
          t.cargarDiagramaTemperaturaRecomendado(t.tiempos,t.caudalRecomendado,t.temperaturaMax,t.temperaturaMin)
          t.cargarDiagramaTemperatura(t.tiempos,t.caudal,t.temperaturaMax,t.temperaturaMin)
        break;
        case "humedad":

          t.cargarDiagramaHumedadRecomendado(t.tiempos,t.caudalRecomendado,t.humedad)
          t.cargarDiagramaHumedad(t.tiempos,t.caudal,t.humedad)
        break
      }
    })
	},
  cargarDatos:function(){
    var t = this;
    t.caudal = []
    t.caudalRecomendado = []
    t.temperaturaMax = []
    t.temperaturaMin = []
    t.humedad = []
    return new Promise(function(resolve, reject) {
      if(t.vistaDetallesCultivo.cultivoParcela!=''){
        $.each(t.tiempos,function(index, tiempo){
          $.each(t.vistaDetallesCultivo.cultivoParcela.sensores,function(index, sensor){
              switch(sensor.tipo){
                case 'Temperatura':
                  var resultado = sensor.getDatosDia(tiempo)
                  t.temperaturaMin.push(resultado.tempMin)
                  t.temperaturaMax.push(resultado.tempMax)
                break;
                case 'Humedad':
                  var resultado = sensor.getDatosDia(tiempo)
                  t.humedad.push(resultado.humedadMedia)
                break;
                case 'Caudal':
                  var resultado = sensor.getDatosDia(tiempo)
                  t.caudal.push(resultado.caudalAcumulado)
                  
                break;
              }
          });
          var faseDia = t.vistaDetallesCultivo.cultivoParcela.calcularFaseByTimestamp(new Date(tiempo).getTime()/1000)
          t.caudalRecomendado.push(faseDia.necesidadHidrica)
        });
        console.log("caudal",t.caudal)
        console.log("temperaturaMin",t.temperaturaMin)
        console.log("temperaturaMax",t.temperaturaMax)
        console.log("humedad",t.humedad)
        console.log("caudalRecomendado",t.caudalRecomendado)
        var maximoCaudal=0
        $.each(t.caudal,function(index, caudal){
          if(maximoCaudal<caudal){
            maximoCaudal=caudal
          }
        });
        $.each(t.caudalRecomendado,function(index, caudal){
          if(maximoCaudal<caudal){
            maximoCaudal=caudal
          }
        });
        t.max=maximoCaudal
      }
      resolve();
    });
  },
	loadData:function(){
		var t =this;
		return new Promise(function(resolve, reject) {
      //t.cargarDatos().then(function(){
        t.cargarDiagramaTemperaturaRecomendado(t.tiempos,t.caudalRecomendado,t.temperaturaMax,t.temperaturaMin)
        t.cargarDiagramaTemperatura(t.tiempos,t.caudal,t.temperaturaMax,t.temperaturaMin)
        resolve();
      //})
    });
	},
  cargarDiagramaTemperaturaRecomendado:function(tiempos,caudal,temperaturaMax,temperaturaMin){
    var t =this;
    
    var auxCaudal={
      name:'Caudal',
      type:'column',
      data:caudal,
    };
    var auxTemperaturaMax={
      name:'Temperatura Max',
      type:'line',
      data:temperaturaMax,
    };
    var auxTemperaturaMin={
      name:'Temperatura Min',
      type:'line',
      data:temperaturaMin,
    };
    var series = [auxCaudal,auxTemperaturaMax,auxTemperaturaMin];
    var options ={
      series:series,
      chart:{height: 350,type: 'line',stacked: false},
      dataLabels:{enabled: false},
      stroke: {width: [1, 4, 4],dashArray:[0,0,5],colors:["#008FFB","#FEB019","#FEB019"]},
      title: {text: 'Riego recomendado del cultivo',align: 'center',style: {color: 'white'}},
      xaxis: {categories: tiempos},
      yaxis: [
          {
            axisTicks: {show: true},
            axisBorder: {show: true,color: '#008FFB'},
            labels: {style: {colors: '#008FFB'}},
            title: {text: "Caudal(L/m2)",style: {color: '#008FFB',}},
            tooltip: {enabled: false},
            max:t.max,
          },
          {
            seriesName: 'TemperaturaMax',
            opposite: true,
            axisTicks: {show: true},
            axisBorder: {show: true,color: '#FEB019'},
            labels: {style: {colors: '#FEB019',}},
            title: {text: "Temperatura(º)",style: {color: '#FEB019'}},
            tickAmount: 6,
            min: 0,
            max: 60,
          },
          {
            show: false,
            seriesName: 'TemperaturaMin',
            opposite: true,
            axisTicks: {show: false},
            axisBorder: {show: false,color: '#00E396'},
            labels: {style: {colors: '#00E396',}},
            title: {text: "Temperatura(º)",style: {color: '#00E396'}},
            tickAmount: 6,
            min: 0,
            max: 60,
          },
      ],
      legend: {
        markers:{fillColors:["#008FFB","#FEB019","#FEB019"]},
      }
    };
    if(t.chartRecomendado!=''){
      t.chartRecomendado.destroy();
    }
    t.chartRecomendado = new ApexCharts(t.id.find("#chartRecomendado")[0], options);
    t.chartRecomendado.render();
    $.each(t.id.find("span.apexcharts-legend-marker"),function(index,marker){
      if($(marker).attr("rel")=="2"){
        $(marker).addClass("markerContinuo")
      }
      if($(marker).attr("rel")=="3"){
        $(marker).addClass("markerDiscontinuo")
      }

    })
  },
  cargarDiagramaTemperatura:function(tiempos,caudal,temperaturaMax,temperaturaMin){
    var t =this;
    
    var auxCaudal={
      name:'Caudal',
      type:'column',
      data:caudal,
    };
    var auxTemperaturaMax={
      name:'Temperatura Max',
      type:'line',
      data:temperaturaMax,
    };
    var auxTemperaturaMin={
      name:'Temperatura Min',
      type:'line',
      data:temperaturaMin,
    };
    var series = [auxCaudal,auxTemperaturaMax,auxTemperaturaMin];
    var options ={
      series:series,
      chart:{height: 350,type: 'line',stacked: false},
      dataLabels:{enabled: false},
      stroke: {width: [1, 4, 4],dashArray:[0,0,5],colors:["#008FFB","#FEB019","#FEB019"]},
      title: {text: 'Riego real del cultivo',align: 'center',style: {color: 'white'}},
      xaxis: {categories: tiempos},
      yaxis: [
          {
            axisTicks: {show: true},
            axisBorder: {show: true,color: '#008FFB'},
            labels: {style: {colors: '#008FFB'}},
            title: {text: "Caudal(L/m2)",style: {color: '#008FFB',}},
            tooltip: {enabled: false},
            max: t.max,
          },
          {
            seriesName: 'TemperaturaMax',
            opposite: true,
            axisTicks: {show: true},
            axisBorder: {show: true,color: '#FEB019'},
            labels: {style: {colors: '#FEB019',}},
            title: {text: "Temperatura(º)",style: {color: '#FEB019'}},
            tickAmount: 6,
            min: 0,
            max: 60,
          },
          {
            show: false,
            seriesName: 'TemperaturaMin',
            opposite: true,
            axisTicks: {show: false},
            axisBorder: {show: false,color: '#00E396'},
            labels: {style: {colors: '#00E396',}},
            title: {text: "Temperatura(º)",style: {color: '#00E396'}},
            tickAmount: 6,
            min: 0,
            max: 60,
          },
      ],
      legend: {
        markers:{fillColors:["#008FFB","#FEB019","#FEB019"]},
      }
    };
    if(t.chart!=''){
      t.chart.destroy();
    }
    t.chart = new ApexCharts(t.id.find("#chart")[0], options);
    t.chart.render();
    $.each(t.id.find("span.apexcharts-legend-marker"),function(index,marker){
      if($(marker).attr("rel")=="2"){
        $(marker).addClass("markerContinuo")
      }
      if($(marker).attr("rel")=="3"){
        $(marker).addClass("markerDiscontinuo")
      }

    })
  },
  cargarDiagramaHumedadRecomendado:function(tiempos,caudal,humedad){
    var t =this;
    
    var auxCaudal={
      name:'Caudal',
      type:'column',
      data:caudal,
    };
    var auxHumedad={
      name:'Humedad',
      type:'line',
      data:humedad,
    };
    var series = [auxCaudal,auxHumedad];
    var options ={
      series:series,
      chart:{height: 350,type: 'line',stacked: false},
      dataLabels:{enabled: false},
      stroke: {width: [1, 4]},
      title: {text: 'Riego recomendado del cultivo',align: 'center',style: {color: 'white'}},
      xaxis: {categories: tiempos},
      yaxis: [
          {
            axisTicks: {show: true},
            axisBorder: {show: true,color: '#008FFB'},
            labels: {style: {colors: '#008FFB'}},
            title: {text: "Caudal(L/m2)",style: {color: '#008FFB',}},
            tooltip: {enabled: false},
            max: t.max,
          },
          {
            seriesName: 'Humedad',
            opposite: true,
            axisTicks: {show: true},
            axisBorder: {show: true,color: '#00E396'},
            labels: {style: {colors: '#00E396',}},
            title: {text: "Humedad(%)",style: {color: '#00E396'}},
            tickAmount: 10,
            min: 0,
            max: 100,
          },
      ]
    };
    if(t.chartRecomendado!=''){
      t.chartRecomendado.destroy();
    }
    t.chartRecomendado = new ApexCharts(t.id.find("#chartRecomendado")[0], options);
    t.chartRecomendado.render();
  },
  cargarDiagramaHumedad:function(tiempos,caudal,humedad){
    var t =this;
    
    var auxCaudal={
      name:'Caudal',
      type:'column',
      data:caudal,
    };
    var auxHumedad={
      name:'Humedad',
      type:'line',
      data:humedad,
    };
    var series = [auxCaudal,auxHumedad];
    var options ={
      series:series,
      chart:{height: 350,type: 'line',stacked: false},
      dataLabels:{enabled: false},
      stroke: {width: [1, 4]},
      title: {text: 'Riego real del cultivo',align: 'center',style: {color: 'white'}},
      xaxis: {categories: tiempos},
      yaxis: [
          {
            axisTicks: {show: true},
            axisBorder: {show: true,color: '#008FFB'},
            labels: {style: {colors: '#008FFB'}},
            title: {text: "Caudal(L/m2)",style: {color: '#008FFB',}},
            tooltip: {enabled: false},
            max: t.max
          },
          {
            seriesName: 'Humedad',
            opposite: true,
            axisTicks: {show: true},
            axisBorder: {show: true,color: '#00E396'},
            labels: {style: {colors: '#00E396',}},
            title: {text: "Humedad(%)",style: {color: '#00E396'}},
            tickAmount: 10,
            min: 0,
            max: 100,
          },
      ]
    };
    if(t.chart!=''){
      t.chart.destroy();
    }
    t.chart = new ApexCharts(t.id.find("#chart")[0], options);
    t.chart.render();
  }
	/*cargarDiagrama:function(){
		var t =this;
		var options = {
          series: [{
          name: 'L/m2',
          type: 'column',
          data: [1.4, 2, 2.5, 1.5, 2.5]
        }, {
          name: 'Humedad',
          type: 'line',
          data: [70, 80, 50, 40, 44]
        }, {
          name: 'Temperatura',
          type: 'line',
          data: [20, 29, 37, 36, 44]
        }],--
          chart: {
          height: 350,
          type: 'line',
          stacked: false
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [1, 4, 4]
        },
        title: {
          text: 'Historial del cultivo actual',
          align: 'center',
          offsetX: 110
        },
        xaxis: {
          categories: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo', 'Lunes'],
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#008FFB'
            },
            labels: {
              style: {
                colors: '#008FFB',
              }
            },
            title: {
              text: "Caudal(L/m2)",
              style: {
                color: '#008FFB',
              }
            },
            tooltip: {
              enabled: true
            }
          },
          {
            seriesName: 'Caudal',
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#00E396'
            },
            labels: {
              style: {
                colors: '#00E396',
              }
            },
            title: {
              text: "Humedad(%)",
              style: {
                color: '#00E396',
              }
            },
          },
          {
            seriesName: 'Temperatura',
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#FEB019'
            },
            labels: {
              style: {
                colors: '#FEB019',
              },
            },
            title: {
              text: "Temperatura(º)",
              style: {
                color: '#FEB019',
              }
            }
          },
        ],
        tooltip: {
          fixed: {
            enabled: true,
            position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
            offsetY: 30,
            offsetX: 60
          },
        },
        legend: {
          horizontalAlign: 'left',
          offsetX: 40
        }
        };
        var chart = new ApexCharts(t.id.find("#chart")[0], options);
        chart.render();
	}*/
};