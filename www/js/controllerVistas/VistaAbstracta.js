var VistaAbstracta = function(id){
		this.id = id;
		this.classDesactivateClick = '.divContenedor';
}

VistaAbstracta.prototype = {
	constructor: VistaAbstracta,
	loadHTML: function(ruta){
		var idP = this.id;
		return new Promise(function(resolve, reject) {
			idP.load(ruta, function(response, status, xhr){	
				if(status == "error"){
					navigator.notification.alert("Error. "+xhr.status + " " + xhr.statusText);
					reject();
				}else{
					console.log('Vista-Controller-LoadHTML->',' html cargado');
					resolve();
				}
			});
		});
	},
	moveOutView: function(mov){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		t.id.stop(true,true).transition({x: mov},transitionSpeed, function(){
			t.id.css('display', 'none');
			t.id.remove();
			$(t.classDesactivateClick).removeClass('desactivarClick');
		});
	},
	moveView: function(mov){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		t.id.stop(true,true).transition({x: mov},transitionSpeed, function(){
			$(t.classDesactivateClick).removeClass('desactivarClick');
		});
	},
	subirVista:function(mov){
		var t =this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		t.id.stop(true,true).transition({y: mov},500, function(){
			$(t.classDesactivateClick).removeClass('desactivarClick');
		});
	},
	fadeOutView: function(){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		t.id.stop(true,true).transition({ opacity: 0 },transitionSpeed, function(){
			t.id.css('display', 'none');
			t.id.remove();
			$(t.classDesactivateClick).removeClass('desactivarClick');
		});
	},
	fadeInView: function(){
		var t = this;
		$(t.classDesactivateClick).addClass('desactivarClick');
		t.id.css({display: '', opacity: 0}).stop(true,true).transition({ opacity: 1 },transitionSpeed, function(){
			$(t.classDesactivateClick).removeClass('desactivarClick');
		});
	},
	cargaBtnAtras: function(){
		var t = this;
		
		t.id.find('.btnAtras').off().on('click', function(){
			t.moveOutView(0);
		});
	},
	cargaSwipe: function(){
        var t = this,x0=0,y0=0,vectorx=0,vectory=0,ejecucionx=true;     
        t.id.on('touchstart',function(evento){
            ejecucionx=true;
            x0 = evento.touches[0].clientX;
            y0 = evento.touches[0].clientY;
            vectorx=0;
            vectory=0;
            t.id.on('touchmove',function(evento){
                vectorx=parseInt(evento.touches[0].clientX-x0);
                vectory=parseInt(evento.touches[0].clientY-y0);
                absolutoy=Math.abs(vectory);

                if(absolutoy > (vectorx/1.75) && ejecucionx){
                    t.id.off('touchmove');
                }else{
                    if(vectorx>50){
                        t.id.css('transform','translate('+((vectorx-50)-deviceWidth)+'px,0px)');
                        ejecucionx=false;
                        evento.preventDefault();
                    }
                }
            });
        });
        t.id.on('touchend',function(evento){
            if(vectorx<(deviceWidth/2)){
                t.id.stop(true,true).transition({x: -deviceWidth },transitionSpeed, function(){
                    $(t.classDesactivateClick).removeClass('desactivarClick')
                });
            }else{
                t.id.stop(true,true).transition({x: deviceWidth },transitionSpeed, function(){
                    $(t.classDesactivateClick).removeClass('desactivarClick');
                    t.id.remove();
                });
            }
        });
	},
	cargaSwipeIzquierdo: function(){
        var t = this,x0=0,y0=0,vectorx=0,vectory=0,ejecucionx=true;     
        t.id.on('touchstart',function(evento){
            ejecucionx=true;
            x0 = evento.touches[0].clientX;
            y0 = evento.touches[0].clientY;
            vectorx=0;
            vectory=0;
            t.id.on('touchmove',function(evento){
                vectorx=parseInt(evento.touches[0].clientX-x0);
                vectory=parseInt(evento.touches[0].clientY-y0);
                absolutoy=Math.abs(vectory);

                if(absolutoy < (vectorx/1.75) && ejecucionx){
                    t.id.off('touchmove');
                }else{
                    if(vectorx<-50){
                        t.id.css('transform','translate('+((vectorx+50)+deviceWidth)+'px,0px)');
                        ejecucionx=false;
                        evento.preventDefault();
                    }
                }
            });
        });
        t.id.on('touchend',function(evento){
            if(vectorx>-(deviceWidth/2)){
                t.id.stop(true,true).transition({x: deviceWidth },transitionSpeed, function(){
                    $(t.classDesactivateClick).removeClass('desactivarClick')
                });
            }else{
                t.id.stop(true,true).transition({x: -deviceWidth },transitionSpeed, function(){
                    $(t.classDesactivateClick).removeClass('desactivarClick');
                    t.id.remove();
                });
            }
        });
	}
}
