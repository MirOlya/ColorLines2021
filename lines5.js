"use strict";

var hfuter = 60;
var hheader = 60;
var pointsNow = 10;
var canvas;
var baseColor="#585555";
var baseGrad = '#969696';
var ballGrad = '#e2d6d6';
var cellSize;
var timerHMS=0;
var sizeNextball;
var lenLine = 5;
//инициализация
function init(wCount, hCount, rCount) {   
	cellSize = Math.min(window.innerWidth/wCount,(window.innerHeight-hfuter-hheader)/hCount);//60
	sizeNextball = cellSize-20;
    canvas = document.getElementById("linesMironovich");
	
	canvas.width = cellSize*wCount; 	// ширина
	canvas.height = cellSize*hCount+hfuter+hheader;	// высота
	console.log(''+canvas.width+' - '+canvas.height);

	var context = canvas.getContext("2d");
	var field = new L5(); // создаём объект 
	field.setParams(wCount, hCount, rCount);


	context.fillStyle = baseColor; // основной цвет "заливки"
	context.fillRect(0, 0, canvas.width, canvas.height); // закраска   
	field.draw(context, cellSize);
	
	
			
	// функция производит необходимые действие при клике	
	function event(x, y) { field.move(x, y); }

	// обрабатка кликов мыши
	canvas.onclick = function(e) 
	{ 
		e = e||window.event;
		var x = Math.floor((e.pageX - (window.innerWidth-canvas.width)/2) / cellSize || 0);
		var y = Math.floor((e.pageY-hfuter)  / cellSize || 0);
		if((x>0&&y>0)&&(x<9&&y<9))
			event(y,x); 
		else if (y===9)
			console.log('menu')
	};

	function str0l(val,len) {
		var strVal=val.toString();
		while ( strVal.length < len )
			strVal='0'+strVal;
		return strVal;
	};
	var oldTimer = '';

	function setTimer(){
		var y = 5;//смещение относительно центра футера
		context.font = "bold 10px Sans";
		var timerH = parseInt(timerHMS/3600);
		var timerM = parseInt((timerHMS/60)%60);
		var timerS = parseInt(timerHMS%60);		
		var timerTXT = str0l(timerH,2) + ':' + str0l(timerM,2) + ':' + str0l(timerS,2);
		var pozTimer = canvas.width/2-(sizeNextball*3)/2+sizeNextball;
		context.fillStyle = baseColor; // or whatever color the background is.
		context.fillText(oldTimer, pozTimer,hfuter-7);
		context.fillStyle = '#070449'; // or whatever color the text should be.
		context.fillText(timerTXT, pozTimer,hfuter-7);	
		oldTimer = timerTXT;	
		timerHMS++;
	};
	setTimer();
	setInterval(setTimer,1000);
	field.drawMenu();

}

function L5() 
{
	var loser = false;
	var rCount = 0;			//  количество рэндомно генерируемых шаров 
    var wCount = 0;			//  в ширину сколько
    var hCount = 0;  		//  в высоту сколько
    var mas = null;			//	поле
    //var clicks = 0;
	var context = null;		//	контекст
	var curHeight =  0;		//	текущая высота прыжка шарика
	var curAsc = true;		//	подпрыгивает или падает после прыжка
	var curI = -1;			//	строка выбранного
	var curJ = -1;			//	столбец выбранного
	var timer = null;
	var self = this;
	var points = 0;			//	очки

	var mas;
	var size;	
	var masRandom = Array();
	var randomCurrent = 0;
	var oldText = '';
	
	//таймер для прыганья ^_^
	self.runMultiple = function ()
	{
		var i = curI;
		var j = curJ;

		if(curAsc) curHeight--;
		else curHeight++;
		
		if(curHeight===-5) curAsc = false;
		if(curHeight===0) curAsc = true;

		
		self.clearCell(i,j);
		self.circleView(i,j,curHeight, self.getColor(mas[i][j]));
	};
	
	
	self.setParams = function(weightC, heightC, rC)
	{
		rCount=rC;			//  количество рэндомно генерируемых шаров 
    	wCount = weightC;	//  в ширину сколько
    	hCount = heightC;  	//  в высоту 
		mas = new Array(hCount);
	};
	
	
	self.clearTimer = function (i,j)
	{
		curHeight =  0;
		curAsc = true;
		curI = -1;
		curJ = -1;
		self.clearCell(i,j);
		self.circleView(i,j,0, self.getColor(mas[i][j]));
		clearInterval(timer);
	}
	
	
	//проверка на проходимость
	self.checkPassability = function (iCheck, jCheck)
	{
		var afterCount = 0;
		var beforeCount = 0;
		var curColor = mas[curI][curJ];
		mas[curI][curJ] = -1;
		while(true)
		{
			afterCount = 0;
			beforeCount = 0;
			for(var i = 0; i < hCount; ++i)
				for(var j = 0; j < wCount; ++j)
					if(mas[i][j] === -1) ++beforeCount;	
					
			for(var i = 0; i < hCount; ++i)
				for(var j = 0; j < wCount; ++j)
					if(mas[i][j] === -1)
					{	
						if((i-1 >= 0) && (mas[i-1][j] === 0))	
							mas[i-1][j] = -1;
						if((i+1 < hCount) && (mas[i+1][j] === 0))	
							mas[i+1][j] = -1;
						if((j-1 >= 0) && (mas[i][j-1] === 0))	
							mas[i][j-1] = -1;
						if((j+1 < wCount) && (mas[i][j+1] === 0))	
							mas[i][j+1] = -1;
					}
				
			for(var i = 0; i < hCount; ++i)
				for(var j = 0; j < wCount; ++j)
					if(mas[i][j] === -1) ++afterCount;	
			if(afterCount === beforeCount) break;
			
		}
		
		var cool = false;
		if(mas[iCheck][jCheck] === -1)	
			cool = true;
		
		mas[curI][curJ] = curColor;	
		for(var i = 0; i < hCount; ++i)
			for(var j = 0; j < wCount; ++j)
				if(mas[i][j] === -1) mas[i][j] = 0;
					
		return cool;
	}
	
	self.eraseCircle = function (i,j)
	{	
		mas[i][j] = 0;
		self.clearCell(i, j);
	}
	
	self.getPoints = function(sameColorCount)
	{
		
		return Math.pow(2,sameColorCount);
	}
	
	self.checkOfLosing = function ()
	{
		if(loser) return loser;
		var emptyCellsCount = 0;
		for(var i = 0; i < hCount; ++i)
			for(var j = 0; j < wCount; ++j)
					if(mas[i][j] === 0) ++emptyCellsCount;
		
		loser = (emptyCellsCount===0);
		
		
		
		return loser;
	}
	
	self.showLosingMsg = function()
	{
		context.beginPath();
		context.fillStyle = "#7e7e7e";
		context.strokeStyle = "#000";
		context.moveTo(size*wCount+2, 0);
    	context.fillRect(10, size*hCount/2-20, size*wCount-10, size*hCount/2+20);
		context.stroke();
		
		
		context.fillStyle = "#000"; 
		context.font = "bold 20px Sans";
		context.fillText('Losing with Points: '+points,20,size*hCount/2);
	}
	
	//проверка горизонтали
	self.checkHorizontalLine = function (iCheck, jCheck)
	{
		var erase = false;
		var sameColorCount = 0;
		var jMasForErase = new Array();
		
		for(var j=jCheck+1; j < wCount; j++)
		{
			if(mas[iCheck][j] === mas[iCheck][jCheck])
			{
				jMasForErase[sameColorCount] = j;
				++sameColorCount;
			}
			else break;
		}
		
		for(var j=jCheck; j >=0; j--)
		{
			if(mas[iCheck][j] === mas[iCheck][jCheck])
			{
				jMasForErase[sameColorCount] = j;
				++sameColorCount;
			}
			else break;
		}
		
		
		if(sameColorCount>=lenLine)
		{
			erase = true;
			points += self.getPoints(sameColorCount);
			for(var j=0; j <sameColorCount; ++j)
				self.eraseCircle(iCheck,jMasForErase[j]);
			
			
			
		}
		
		return erase;
		
	}
	
	
	
	//проверка вертикали
	self.checkVerticalLine = function (iCheck, jCheck)
	{
		var erase = false;
		var sameColorCount = 0;
		var iMasForErase = new Array();
		
		for(var i=iCheck+1; i < hCount; i++)
		{
			if(mas[i][jCheck] === mas[iCheck][jCheck])
			{
				iMasForErase[sameColorCount] = i;
				++sameColorCount;
			}
			else break;
		}
		
		for(var i=iCheck; i >=0; i--)
		{
			if(mas[i][jCheck] === mas[iCheck][jCheck])
			{
				iMasForErase[sameColorCount] = i;
				++sameColorCount;
			}
			else break;
		}
		
		
		if(sameColorCount>=4)
		{
			erase = true;
			points += self.getPoints(sameColorCount);
			for(var i=0; i <sameColorCount; ++i)
				self.eraseCircle(iMasForErase[i],jCheck);
			
			
			
		}
		
		return erase;
	}
	
	//проверка на уничтожение линий
	self.checkLines = function (i,j)
	{
		var erase = false;
		var curColorN = mas[i][j];
		if(self.checkHorizontalLine(i,j))
		{
			erase = true;		
			self.circleView(i,j,0,self.getColor(curColorN));	
			mas[i][j] = curColorN;
		}
		if(self.checkVerticalLine(i,j) || erase)
		{	
			self.eraseCircle(i,j);
			erase = true;	
		}
			

			
			
		return erase;
	}
	
	//при клике, действия с шариком
	self.move = function (i, j)
	{
		if(loser) return;
		
		//если повторно на тот же шарик нажали

		if(curI === i && curJ === j)
			self.clearTimer(i,j);
		else
		{
			
			// alert(curI+"==="+curJ);
			console.log(mas[i][j]);
			if(mas[i][j] != 0)
			{
				//если был нажат ранее шарик, но сейчас жмём не на него
				if(curI != -1 && curJ != -1)
					self.clearTimer(curI,curJ);
				curI = i;
				curJ = j;
				timer = setInterval(function() {self.runMultiple();}, 50);
			}
			else
			{
				//если может пройти
				if(curI != -1 && curJ != -1)
					if(self.checkPassability(i,j))
					{
						//ползёт
						self.circleGo(i,j);
						
						//если ничего не исчезло
						if(!self.checkLines(i,j))
							//новые шары
							self.drawRandomCircles();
							
						else 
							self.drawPoints();
						
					}
					else 
					{
					}
			}
		}
		
		
	}
	
	
	//двигаем шарик
	self.circleGo = function(i,j) 
	{
		var iToClear = curI;
		var jToClear =  curJ;
		
		mas[i][j] = mas[curI][curJ];
		self.clearTimer(curI, curJ);
		mas[iToClear][jToClear] = 0;
		self.clearCell(iToClear, jToClear);
		
		self.circleView(i,j,0,self.getColor(mas[i][j]));
	}
	
    // рисуем ячейку
    self.cellView = function(x1,y1,x2,y2) 
	{
		context.beginPath();   
		context.lineWidth = 2;
		context.moveTo(x1, y1);
		context.lineTo(x2, y1);
		context.lineTo(x2,y2);
		context.lineTo(x1, y2);
		context.lineTo(x1, y1);

		var gradient = context.createLinearGradient(x1, y1, x2, y2);
		gradient.addColorStop(0, baseColor);
		gradient.addColorStop(1, baseGrad);//self.getDarkColor(color));
		
		context.fillStyle = gradient; 
		context.fillRect(x1, y1, x2-x1, y2-y1);

		context.stroke();
		
    };
    // рисуем пункт меню
    self.cellViewMenu = function(x1,y1,x2,y2) 
	{
		// context.beginPath();   
		// context.lineWidth = 2;
		// context.moveTo(x1, y1);
		// context.lineTo(x2, y1);
		// context.lineTo(x2,y2);
		// context.lineTo(x1, y2);
		// context.lineTo(x1, y1);


		context.beginPath();
		context.arc(x1+cellSize/2, y1+cellSize/2, cellSize/2 , 0, 2*Math.PI);

		var gradient = context.createRadialGradient(x1, y1,0,x2, y2, cellSize*2);
		gradient.addColorStop(0, baseColor);
		gradient.addColorStop(1, baseGrad);//self.getDarkColor(color));
		
		context.fillStyle = gradient; 
		context.fill();
		context.stroke();
		
    };
  
  	//чистка ячейки
  	self.clearCell = function(y,x) 
	{
		//определяем текущие координаты ячейки
		var curX = size*x;
		var curY = hfuter+size*y;
		console.log(''+curX+'-'+curY);
		//сначала заливка фоном
		context.beginPath();
		context.strokeStyle = "#000";
		context.moveTo(curX, curY);

		var gradient = context.createLinearGradient(curX, curY, curX+size, curY+size);
		gradient.addColorStop(0, baseColor);
		gradient.addColorStop(1, baseGrad);//self.getDarkColor(color));
		
		context.fillStyle = gradient; 

		context.fillRect(curX, curY, size, size);
		context.stroke();
		self.cellView(curX, curY, curX+size, curY+size)
		
    };
	
	//цвет для рэндомного шарика
	self.getColor = function(n)		 
	{
		var rand = Math.random(); 
		switch(n)
		{
			case 1: return '#c70b2f';
			case 2: return '#120aaa';
			case 3: return '#08b134';
			case 4: return '#e6be34';
			default: return '#6e08a3';
		}
		
	};
  
  
  	self.randomN = function(n)		 
	{
		var rand=Math.random(); 
		if(rand<0.2) 
			return 1;
		if(rand<0.4) 
			return 2;
		if(rand<0.6) 
			return 3;
		if(rand<0.8) 
			return 4;
		return 5;
		
	};
	
	//рисуем шарик 
   	self.circleView = function(y,x, h, color) 
	{
		var radius = size/4;
		context.strokeStyle = color;
	
		context.beginPath();
		context.moveTo((x+0.5)*self.size+radius ,(y+0.5)*size);
		context.arc((x+0.5)*size, (y+0.5)*size+h+hfuter, radius , 0, 2*Math.PI);
		//раскрашиваем градиентом
		var gradient = context.createRadialGradient((x+0.5)*size, (y+0.5)*size+h+hfuter, radius,(x+0.5)*size-radius, (y+0.5)*size+h+hfuter+5, 2);
		gradient.addColorStop(0, color);
		gradient.addColorStop(0.5, color);
		gradient.addColorStop(1, ballGrad);//self.getDarkColor(color));
		
		context.fillStyle = gradient; 
		context.fill();
		context.stroke();
		//context.restore();
    };
	
	
  	self.drawRandomCircle = function()		 
	{
		
		if(self.checkOfLosing())  return;
		var randj=Math.round((Math.random())*(wCount-1)); 
		var randi=Math.round((Math.random())*(hCount-1)); 
		var fl=0;
		while(fl===0)
		{
			if(mas[randi][randj]===0)
			{
				mas[randi][randj] = self.randomN();
				self.circleView(randi,randj,0, self.getColor(mas[randi][randj])); 
				masRandom[randomCurrent][0] = randi;
				masRandom[randomCurrent][1] = randj;
				randomCurrent++;
				fl=1;
				//alert('g');
			}
			else
			{
				randj=Math.round((Math.random())*(wCount-1)); 
				randi=Math.round((Math.random())*(hCount-1)); 
			}
		}
		if(self.checkOfLosing())  return;
	};
	
	self.drawPoints = function() 
	{
		
		context.beginPath();
		context.fillStyle = baseColor;
		context.strokeStyle = "#000";
		context.moveTo(size*wCount+2, 0);
    	context.fillRect(size*wCount+2, hfuter, size*wCount+hfuter+hheader+30, size*hCount);
		context.stroke();

		var y = 5;//смещение относительно центра футера
		context.font = "bold 40px Sans";
		var pointsTXT = ''+points;
		while(pointsTXT.length<6)
			pointsTXT = "0"+pointsTXT
		context.fillStyle = baseColor; // or whatever color the background is.
		context.textBaseline="middle";
		context.fillText(oldText, pointsNow,hfuter/2);
		context.fillStyle = '#000000'; // or whatever color the text should be.
		context.fillText(pointsTXT, pointsNow,hfuter/2);	
		oldText = pointsTXT;	

		//рисуем ячейки для след шаров
		var pozNextBall = canvas.width/2-(sizeNextball*3)/2;
		for(var i=0;i<3;i++)
			self.cellView(pozNextBall+i*sizeNextball,hfuter/2-y-sizeNextball/2,pozNextBall+(i+1)*sizeNextball,hfuter/2-y+sizeNextball/2);

	}
	
	self.drawRandomCircles = function()	
	{
		for (var i = 0; i < rCount; i++) self.drawRandomCircle();	
		
		//проверям, может рэндомные шары норм в линию на уничтожение встали
		for (var i = 0; i < rCount; i++) 
			if(self.checkLines(masRandom[i][0],masRandom[i][1]))
				self.drawPoints();
					
		randomCurrent = 0;
		if(loser) self.showLosingMsg();
	}
	
	//рисуем меню
	self.drawMenu = function(){
		var posMenu = canvas.width/2-(cellSize*6)/2;
		for(var i=0;i<6;i++)
			self.cellViewMenu(posMenu+i*cellSize,canvas.height-hheader,posMenu+(i+1)*cellSize,canvas.height-hheader+cellSize);
	};

	// рисуем поле
	self.draw = function(cont, s) 
	{
		context = cont;
		size = s;
		//поле пусто - забиваем нулями
		for(var i = 0; i < rCount; i++)
			masRandom[i] = new Array(2);
		for(var i = 0; i < hCount; i++)
		{
			mas[i] = new Array(wCount);
			for(var j = 0; j < wCount; j++)
				mas[i][j] = 0;
		}
		context.strokeStyle = "#000";
		
		//рисуем ячейки
        for (var i = 0; i < hCount; i++) 
		{
            for (var j = 0; j < wCount; j++) 
				self.cellView(size*j, hfuter+size*i, size*(j+1),hfuter+size*(i+1));

        }
		
		//начальные рэндомные шары
		self.drawRandomCircles();
		self.drawPoints();
    };
	
}