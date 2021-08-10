"use strict";

const h = 60;
var hfuter = h;
var hheader = h;
var pointsNow = 10;
var canvas;
var baseColor="#585555";
var baseGrad = '#969696';
var ballGrad = "#d3d3d3";//'#e2d6d6';
var cellSize;
var timer = null;
var timerHMS=0;
var timerGame;
var timerLoser;
var sizeNextball;
var lenLine = 5;
var allColor = 7;
var flSound = false;
var Colors = {};
var field;
var timerBlast;
var firstSound = false;
var clickAudio = new Audio(); // Создаём новый элемент Audio
if ( clickAudio.canPlayType("audio/mpeg")=="probably" )
        clickAudio.src="http://fe.it-academy.by/Examples/Sounds/button-16.mp3";
    else
        clickAudio.src="http://fe.it-academy.by/Examples/Sounds/button-16.ogg";
Colors.names = {
	blue: "#0000ff",
	darkblue: "#00008b",
	fuchsia: "#ff00ff",
	green: "#08b134",
	orange: "#ffa500",
	violet: "#800080",
	red: "#ff0000"
		// 	case 1: return '#c70b2f';
		// 	case 2: return '#120aaa';
		// 	case 3: return '#08b134';
		// 	case 4: return '#e6be34';
		// 	case 5: return '#6e08a3';
	};
function getColor(n){
	var chC=1;
	var nn = n>10?n-10:n;
	for (var prop in Colors.names){
		if (chC === nn ){
			return Colors.names[prop];
		}
		chC++;
	};		

};
const mediaQuery760s = window.matchMedia('all and (max-width: 768px)');
const mediaQuery760l = window.matchMedia('all and (min-width: 761px)');

function clickSoundInit() {
	clickAudio.play(); // запускаем звук
	clickAudio.pause(); // и сразу останавливаем
};

//закрываем окно вопроса
function closeNewGame(){
	document.getElementById('maincontecst').removeChild(document.getElementById('newGame'));
}

//закрываем окно инфо
function closeInfo(){
	var infoDIV = document.getElementById('info');
	setTimeout(function() {infoDIV.style.height=0+"px"; }, 0);
	setTimeout(function() {document.getElementById('maincontecst').removeChild(infoDIV); }, 1000);
}
function createWindowInfo(inHTML){
	var info=document.createElement('DIV');
	var winfo = canvas.width;
	var hinfo = 200;
	info.style.width=(winfo-4)+'px';
	info.style.height=0;
	info.style.border='1px solid blue';
	info.style.backgroundColor = 'white';
	info.style.position = 'absolute';
	info.style.left = (window.innerWidth-canvas.width)/2+1+'px';
	info.style.top = hinfo/2+'px';
	info.id = 'info'
	var targetHeight=(canvas.height-hinfo/2-4);
	console.log(targetHeight);
	document.getElementById('maincontecst').appendChild(info);
	setTimeout(function() { info.style.height=targetHeight+"px"; }, 0);
	var butCloseInfo = document.createElement('BUttON');
	butCloseInfo.style.width=30+'px';
	butCloseInfo.style.height=20+'px';
	butCloseInfo.style.border='1px solid blue';
	butCloseInfo.style.backgroundColor = 'blue';
	butCloseInfo.textContent = 'X';
	butCloseInfo.style.position = 'fixed';
	butCloseInfo.style.left = (window.innerWidth-canvas.width)/2+1+'px';
	butCloseInfo.style.top = hinfo/2+'px';
	info.appendChild(butCloseInfo);
	butCloseInfo.addEventListener("click", closeInfo);
	butCloseInfo.addEventListener("touchstart", closeInfo);
	var divFortxtinfo = document.createElement('DIV');
	divFortxtinfo.style.width = (winfo-butCloseInfo.style.width*3)+'px';
	divFortxtinfo.style.height =(targetHeight-80)+'px';
	divFortxtinfo.style.overflowY = 'scroll';
	divFortxtinfo.style.margin='30px';
	divFortxtinfo.style.padding='10px';
	divFortxtinfo.style.position = 'absolute';
	divFortxtinfo.style.left = '30px';
	divFortxtinfo.style.top = '0px';
	divFortxtinfo.style.textAlign='justify';
	info.appendChild(divFortxtinfo);
	var txtinfo = document.createElement('div');
	txtinfo.innerHTML=inHTML;
	divFortxtinfo.appendChild(txtinfo);
};
//инициализация
function init(wCount, hCount, rCount) {   
	cellSize = Math.floor(Math.min(window.innerWidth/wCount,(window.innerHeight-hfuter-hheader)/hCount));//60
	timerHMS = 0;
	clearInterval(timerGame);
	clearInterval(timer);
	sizeNextball = Math.floor(cellSize*2/3);
    canvas = document.getElementById("ColorLines2021");
	
	canvas.width = cellSize*wCount; 	// ширина
	hfuter = hfuter+window.innerHeight-(cellSize*hCount+hheader+hfuter);
	console.log(window.innerHeight);
	canvas.height = cellSize*hCount+hheader+hfuter;	// высота
	
	var context = canvas.getContext("2d");
	field = new L5(); // создаём объект 
	field.setParams(wCount, hCount, rCount);

	context.fillStyle = baseColor; // основной цвет "заливки"
	context.fillRect(0, 0, canvas.width, canvas.height); // закраска   
	field.draw(context, cellSize, true);


			
	// функция производит необходимые действие при клике	
	function event(x, y) { field.move(x, y); }

	//работа меню
	function showMenu(x){
		if(x===6){
			//info
			var infoHTML='<H3 style="text-Align:center;">ПРАВИЛА ИГРЫ</H3><br>'+
			'<p>Игра происходит на квадратном поле в 9×9 клеток и представляет собой серию ходов. Каждый ход сначала компьютер в случайные клетки выставляет три шарика случайных цветов, последних всего 7. Далее делает ход игрок, когда он может передвинуть любой шарик в другую свободную клетку, но при этом между начальной и конечной клетками должен существовать недиагональный путь из свободных клеток. Если после перемещения получается так, что собирается пять шариков одного цвета в линию по горизонтали, вертикали или диагонали, то все такие шарики (которых может быть больше 5), исчезают и игроку даётся возможность сделать ещё одно перемещение шарика. Если после перемещения линии не выстраивается, то ход заканчивается, и начинается новый с появлением новых шариков. Если при появлении новых шариков собирается линия, то она исчезает, игрок получает очки, но дополнительного перемещения не даётся. Игра продолжается до тех пор, пока все поле не будет заполнено шариками и игрок не сможет сделать ход.'+ "<br>"+
			'<p>Цель игры состоит в наборе максимального количества очков. Счёт устроен таким образом, что при удалении за одно перемещение большего числа шариков чем 5 игрок получает существенно больше очков. Во время игры на экране показывается три цвета шариков, которые будут выброшены на поле на следующем ходу.'+ "<br>"+
			'<p>В классической игре на экране показано квадратное поле 9×9 клеток, в случайные клетки на котором программа выставляет три шарика разных цветов. Всего 7 возможных цветов. За один ход игрок может передвинуть один шарик, выделив его и указав его новое местоположение. Для совершения хода необходимо, чтобы между начальной и конечной клетками существовал путь из свободных клеток. Цель игры состоит в удалении максимального количества шариков, которые исчезают при выстраивании шариков одного цвета по пять и более в ряд (по горизонтали, вертикали или диагонали). При исчезновении ряда шариков новые три шарика не выставляются. В остальных случаях каждый ход выставляются новые три шарика. Игрок может видеть заранее три шарика, которые появятся в следующем ходу.'+ "<br>"+
			'<p><ul type="circle" style="margin-left:10px;"><li>Игровое поле представляет собой квадратную сетку ячеек, в которых располагаются шары, но не более одного в каждой из них.'+ "</li>"+
			'<li>На каждом ходу в выбранных случайным образом ячейках появляются новые шары.'+ "</li>"+
			'<li>Игрок с помощью "мыши" должен переместить один из шаров в свободную ячейку, стараясь выстраивать из одинаковых шаров непрерывные горизонтальные, вертикальные или диагональные линии.'+ "</li>"+
			'<li>Если после перемещения или появления шара линия достигнет заданной длины, то все шары, входящие в нее, удаляются. При этом игрок набирает определенное количество очков.'+ "</li>"+
			'<li>Перемещение шара из исходной ячейки в "ячейку назначения" допускается, если существует путь, проходящий по свободным ячейкам, расположенным рядом друг с другом по вертикали или по горизонтали.'+ "</li>"+
			'<li>Если после перемещения шара была удалена линия, то на следующем ходу новые шары, которые должны были бы появиться в соответствии с п.2, не появляются.'+ "</li>"+
			'<li>Игра заканчивается, когда на игровом поле не остается свободных ячеек – они все заполнены шарами.'+ "</li>"+
			'<li>Цель игры - набрать как можно больше очков, которые запоминаются в соответствующей таблице.'+ "</li>"+
			'<li>В игре используется “шкала ценностей”. При этом количество очков, которые получает игрок при составлении линии шаров, вычисляется (при n ³ k ) по формуле q = n ×(n - k +1) (n – количество выстроенных в линию шаров, k –минимальное количество удаляемых шаров, q – получаемые очки).'+ "</li>"+
			'<li>В любой момент игры на экран выводится подсказка о шарах, которые появятся на следующем шаге. Эти подсказки отображаются на поле в виде уменьшенных изображений шаров.</li></ul>';
			createWindowInfo(infoHTML)
		}
		else if(x===5){
			//включить выключить звук
			// firstSound = true;
			flSound = !flSound;
			var img = new Image();
			img.onload = function() {
				context.drawImage(img,x*cellSize+cellSize/4, canvas.height-hfuter+cellSize/4,cellSize/2,cellSize/2);
				// console.log('2 = '+(canvas.height-hfuter+cellSize/4));
			};
			img.src = flSound?"music.svg":"mute.svg";
			if(flSound&&firstSound)
				clickAudio.play()
			else
				clickAudio.pause();
			console.log('flSound= '+flSound);
			console.log('firstSound = '+firstSound);

		}
		else if(x===1){
			createQestNewGame()
		}
		else if(x===2){
			field.undoStep()
		}
	};

	function createQestNewGame(){
		function addNewButton(nameButton){
			var butOknewGame = document.createElement('BUttON');
			butOknewGame.style.width=50+'px';
			butOknewGame.style.height=50+'px';
			butOknewGame.style.borderRadius='50%';
			butOknewGame.style.border='1px solid'+baseGrad;
			butOknewGame.style.backgroundColor = baseGrad;
			butOknewGame.style.margin = '20px';
			butOknewGame.textContent = nameButton;
			fieldBut.appendChild(butOknewGame);
			return butOknewGame
		};
		var newGame=document.createElement('DIV');
		newGame.style.border='1px solid blue';
		newGame.style.backgroundColor = baseColor;
		newGame.style.position = 'absolute';
		newGame.style.display = 'flex';
		newGame.style.flexDirection = 'column';
		newGame.style.left = (window.innerWidth-canvas.width+(canvas.width-3*cellSize)/2)/2+'px';
		newGame.style.width = canvas.width-3*cellSize+'px';
		newGame.style.padding = '20px';
		newGame.style.top = canvas.height/4+'px';
		newGame.id = 'newGame';
		document.getElementById('maincontecst').appendChild(newGame);
		var txtnewGame = document.createElement('span');
		txtnewGame.style.font= "bold 15px Sans";
		txtnewGame.style.color = 'darkblue';
		txtnewGame.textContent = 'Вы действительно хотите начать новую игру?'
		txtnewGame.style.padding = '20px';
		newGame.appendChild(txtnewGame);
		var fieldBut=document.createElement('DIV');
		fieldBut.style.display = 'flex';
		newGame.appendChild(fieldBut);

		var butOknewGame = addNewButton('Да');
		butOknewGame.addEventListener("click", okNewGame);
		butOknewGame.addEventListener("touchstart", okNewGame);
		butOknewGame = addNewButton('Нет');
		butOknewGame.addEventListener("click", closeNewGame);
		butOknewGame.addEventListener("touchstart", closeNewGame);
	}
	//начинаем новую игру
	function okNewGame(){
		closeNewGame();
		init(wCount, hCount, rCount);
	}

	// обрабатка кликов мыши
	canvas.onclick = function(e) 
	{ 
		e = e||window.event;
		var x = Math.floor((e.pageX - (window.innerWidth-canvas.width)/2) / cellSize || 0);
		var y = Math.floor((e.pageY-hheader)  / cellSize || 0);//изменила
		if((x>=0&&y>=0)&&(x<9&&y<9))
			event(y,x); 
		else if (y===9){
			showMenu(x)
		}

	};
	var xHint = 0;
	canvas.addEventListener('mousemove',hints);
	function handleTabletChange(e) {
		e = e||window.event;
		if (e.matches) {
		  canvas.removeEventListener('mousemove',hints);
		  var mainC = document.getElementById('maincontecst');
		  mainC.width = canvas.width;
		  mainC.height = canvas.height;
		  console.log('Media Query Matched!')
		}
	  };
	  function handleChange(e) {
		e = e||window.event;
		if (e.matches) {
		  canvas.addEventListener('mousemove',hints);
		  var mainC = document.getElementById('maincontecst');
		  mainC.width = '100%';
		  mainC.height = '100%';
		  console.log('Media Query Matched!')
		}
	  };
     mediaQuery760s.addListener(handleTabletChange);
     mediaQuery760l.addListener(handleChange);

	 document.addEventListener("DOMContentLoaded", function(event) { 
        /*ПОЛУЧАЕТ ТЕКУЩУЮ ШИРИНУ ЭКРАНА*/
        var widthWind = document.querySelector('body').offsetWidth;
        if (widthWind <= 760) {
			canvas.removeEventListener('mousemove',hints);
			var mainC = document.getElementById('maincontecst');
			mainC.width = canvas.width;
			mainC.height = canvas.height;
		  }
		else{
			canvas.addEventListener('mousemove',hints);
			var mainC = document.getElementById('maincontecst');
			mainC.width = '100%';
			mainC.height = '100%';
		}
});
	 // handleTabletChange(mediaQuery)
	  
	function hints(e) //onmousemove
	{ 
		e = e||window.event;
		var x = Math.floor((e.pageX - (window.innerWidth-canvas.width)/2) / cellSize || 0);
		var y = Math.floor((e.pageY-hheader)  / cellSize || 0);//изменила
		if (y===9){
			var wHint = (x===5)||(x===1)||(x===4)?140:100;
			var hHint = 20;
			var posHintX=(window.innerWidth-canvas.width)/2+x*cellSize+cellSize/2;//((e.pageX+wHint+2)>window.innerWidth?(window.innerWidth-wHint-2):e.pageX);
			var posHintY=hheader+(y+0)*cellSize+2;//((e.pageY+hHint+2)>window.innerHeight?(window.innerHeight-hHint-2):e.pageY);
			if(xHint!=x){
				removeHint();
				xHint = x;
			};
			if(x===1)
				addHint('Начать новую игру');
			else if(x===2)
				addHint('Отменить ход');
			else if(x===3)
				addHint('Открыть игру');
			else if(x===4)
				addHint('Сохранить игру');
			else if(x===5)
				addHint(flSound?'Выключить музыку':'Включить музыку');
			else if(x===6)
				addHint('Правила игры');
			else removeHint()
		}
		else removeHint()


		function addHint(txtHint){
			if (!document.getElementById('hint')){
				var hint = document.createElement('div');
				hint.style.width=wHint+'px';
				hint.style.height=hHint+'px';
				hint.style.position = 'absolute';
				hint.addEventListener('mousemove',removeHint);
				hint.style.left = posHintX+'px';
				hint.style.top = posHintY+'px';
				hint.id = 'hint';
				document.getElementById('maincontecst').appendChild(hint);
				var hintTXT = document.createElement('span');
				hintTXT.style.font= "bold 15px Sans";
				hintTXT.style.color = 'darkblue';
				hintTXT.textContent = txtHint;
				hint.appendChild(hintTXT);
			}
		}

		function removeHint(){
			if (document.getElementById('hint'))
				document.getElementById('maincontecst').removeChild(document.getElementById('hint'))
		}
	};


	function str0l(val,len) {
		var strVal=val.toString();
		while ( strVal.length < len )
			strVal='0'+strVal;
		return strVal;
	};

	function setTimer(){
		context.beginPath();
		context.font = "bold 20px Sans";
		var timerH = parseInt(timerHMS/3600);
		var timerM = parseInt((timerHMS/60)%60);
		var timerS = parseInt(timerHMS%60);		
		var timerTXT = str0l(timerH,2) + ':' + str0l(timerM,2) + ':' + str0l(timerS,2);
		var posXTimer = cellSize*(wCount-1);//6 пунктов меню+первый пустой
		// var posYTimer = canvas.height-hfuter/2;//6 пунктов меню+первый пустой
		var posYTimer = hheader/2;//6 пунктов меню+первый пустой
		context.textBaseline="middle";
		context.textAlign = 'center';
		context.fillStyle = baseColor;
		// if(hfuter>h+1){
		// 	posXTimer = cellSize*Math.floor(wCount/2);
		// 	posYTimer = canvas.height-hfuter+cellSize+10;
		// };
		context.fillRect(posXTimer-cellSize,posYTimer-10,cellSize*2+10,hheader/2);
		context.fillStyle = '#070449'; // or whatever color the text should be.
		context.fillText(timerTXT, posXTimer,posYTimer);	
		timerHMS++;
	};
	field.drawMenu();
	setTimer();
	timerGame = setInterval(setTimer,1000);

}


function blast(points){
	var context = canvas.getContext("2d");
	var posX = 20,
		posY = canvas.height / 2;
	// начальные параметры
	var particles = {},
		particleIndex = 0,
		settings = {
		density: 20,
		particleSize: 10,
		startingX: canvas.width / 2,
		startingY: hheader+40,
		gravity: 0.5
		};
	// создание шариков
	function Particle() {
		var selfBlast = this;
		selfBlast.x = settings.startingX;
		selfBlast.y = settings.startingY;
		selfBlast.vx = Math.random() * 20 - 10;
		selfBlast.vy = Math.random() * 20 - 5;
		// добавление нового шарика
		particleIndex ++;
		particles[particleIndex] = selfBlast;
		selfBlast.id = particleIndex;
		selfBlast.life = 0;
		selfBlast.maxLife = 100;
	};
    function blastCellView(x1,y1,x2,y2) 
	{
		context.strokeStyle = "#000";
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

	Particle.prototype.drawBlast = function() {
		var selfBlast = this;
		selfBlast.x += selfBlast.vx;
		if((selfBlast.y + selfBlast.vy<canvas.height-hheader-settings.particleSize)&&(selfBlast.y + selfBlast.vy>hheader-settings.particleSize))
			selfBlast.y += selfBlast.vy;
		selfBlast.vy += settings.gravity;
		selfBlast.life++;

		if (selfBlast.life >= selfBlast.maxLife) {
			delete particles[selfBlast.id];
		}
		// создание фигур
		context.clearRect(settings.leftWall, settings.groundLevel, canvas.width, canvas.height);
		context.beginPath();
		context.fillStyle=getColor(Math.floor(Math.random()*(allColor-1+1))+1);//"#f00";
		context.arc(selfBlast.x, selfBlast.y, settings.particleSize, 0, Math.PI*2, true); 
		//console.log(''+selfBlast.x+', '+selfBlast.y+', '+ settings.particleSize);
		context.closePath();
		context.fill();
		
	};
	var ch=0;
	var running = true;
	requestAnimationFrame(tick);
	setTimeout(function(){running=false},1000);
	
	function tick() {
		context.fillStyle = baseColor;
		context.fillRect(0, hheader, canvas.width, canvas.height-hheader-hfuter);
		//рисуем ячейки
        for (var i = 0; i < 9; i++) 
		{
            for (var j = 0; j < 9; j++) 
				blastCellView(cellSize*j, hheader+cellSize*i, cellSize*(j+1),hheader+cellSize*(i+1));
        };

		for (var i = 0; i < settings.density; i++) {           
			if (Math.random() > 0.77) {
					new Particle();
			}
		}
		for (var i in particles) 
			particles[i].drawBlast();
		if ( running )
			requestAnimationFrame(tick);
		else{
			var infoHTML='<H3 style="text-Align:center;">ВАШ РЕЗУЛЬТАТ = '+points+'</H3><br>'+
			'<p>Эту игру разработатли для ВАС'+ "<br>"+
			'<p>PM: Пахольчук Александр<br>'+
			'<p>QA: Ламырев Дмитрий<br>'+
			'<p>QA: Белобородов Антон<br>'+
			'<p>JS: Миронович Ольга<br>'+
			'<p>(C)';
			createWindowInfo(infoHTML);

			// ch++;
			// if(ch===1000)
			// 	clearInterval(timerBlast);
			}
	};
}

function smallBlast(j,i,colorblast,mas){
	var context = canvas.getContext("2d");
	// var posX = 20,
	// 	posY = canvas.height / 2;
	i;
	j++;
	// начальные параметры
	var particles = {},
		particleIndex = 0,
		settings = {
		density: 20,
		particleSize: 0.1,
		startingX: i*cellSize+cellSize/2,//canvas.width / 2,
		startingY: j*cellSize+cellSize/2,//hheader+40,
		gravity: 0.5
		};
		// создание шариков
	function Particle() {
		var selfBlast = this;
		selfBlast.x = settings.startingX;
		selfBlast.y = settings.startingY;
		selfBlast.vx = Math.random() * 20 -10;
		selfBlast.vy = Math.random() * 20 - 5 ;
		// добавление нового шарика
		particleIndex ++;
		particles[particleIndex] = selfBlast;
		selfBlast.id = particleIndex;
		selfBlast.life = 0;
		selfBlast.maxLife = cellSize;
	};

	Particle.prototype.drawBlast = function(cBl) {
		var selfBlast = this;
		if((selfBlast.x + selfBlast.vx<(i+1)*cellSize-8)&&(selfBlast.x + selfBlast.vx>i*cellSize+8))//&&(selfBlast.y + selfBlast.vy <(j+1)*cellSize)&&(selfBlast.y + selfBlast.vy>j*cellSize+10)){
			selfBlast.x += selfBlast.vx;
		// };
		if((selfBlast.y + selfBlast.vy <(j+1)*cellSize-8)&&(selfBlast.y + selfBlast.vy>j*cellSize+8)){
			selfBlast.y += selfBlast.vy;
		};
		selfBlast.vy += settings.gravity;
		selfBlast.xy += settings.gravity;
		selfBlast.vy = Math.random()>0.5?-selfBlast.vy:selfBlast.vy;
		selfBlast.vx = Math.random()>0.5?-selfBlast.vx:selfBlast.vx;
		selfBlast.life++;

		if (selfBlast.life >= selfBlast.maxLife) {
			delete particles[selfBlast.id];
		};
		// создание фигур
		context.beginPath();
		context.fillStyle=getColor(cBl);//Math.floor(Math.random()*(allColor-1+1))+1);//"#f00";
		var R = Math.random();
		//context.arc(settings.startingX, settings.startingY, 5, 0, Math.PI*2, true); 
		context.arc(selfBlast.x, selfBlast.y, R, 0, Math.PI*2, true); 
		if(Math.random()>0.5){
			context.fillStyle=baseGrad;
			context.arc(selfBlast.x, selfBlast.y, R, 0, Math.PI*2, true); 
		};
		context.closePath();
		context.fill();
	};
	var running = true;
	requestAnimationFrame(tick);
	setTimeout(function(){running=false},2000);

	function resetField(){
		let ch=0;
		for(let i=0;i<9;i++)
			for(let j=0;j<9;j++){
				field.clearCell(i,j);
				if(mas[i][j]>0)
					if(mas[i][j]<10)
						field.circleView(i,j,0, field.getColor(mas[i][j])); 
					else {
						field.circleViewNext(i,j,0, field.getColor(mas[i][j]));
						field.drawOneRandomCircleNext(field.getColor(mas[i][j]),ch);
						ch++;
					}

			};
		field.drawPoints();
	}
	function tick() {
		for (var k = 0; k < settings.density; k++) {           
			if (Math.random()*10 > 9.9) {
					new Particle();
			}
		};
		for (var k in particles) {
			particles[k].drawBlast(colorblast);
		};
		if ( running )
			requestAnimationFrame(tick);
		else
			resetField()
	};
}




function L5() 
{
	var loser = false;
	var rCount = 0;			//  количество рэндомно генерируемых шаров 
	var rNext = 3;			//  количество рэндомно генерируемых шаров для следующего шага
    var wCount = 0;			//  в ширину сколько
    var hCount = 0;  		//  в высоту сколько
    var mas = null;			//	поле
    //var clicks = 0;
	var context = null;		//	контекст
	var curHeight =  0;		//	текущая высота прыжка шарика
	var curAsc = true;		//	подпрыгивает или падает после прыжка
	var curI = -1;			//	строка выбранного
	var curJ = -1;			//	столбец выбранного
	var self = this;
	var points = 0;			//	очки
	var copypoints = 0;		//	очки
	var copyMas = null;
	var masKill;
	var size;	
	var masRandom = Array();
	var randomCurrent = 0;
	
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

	self.runMultipleLine = function (i,j)
	{
		if(curAsc) curHeight--;
		else curHeight++;
		
		if(curHeight===-5) curAsc = false;
		if(curHeight===0) curAsc = true;

		
		self.clearCell(i,j);
		self.circleView(i,j,curHeight, self.getColor(mas[i][j]));
		requestAnimationFrame(self.runMultipleLine(i,j))
	};

	function soundMultiple(){
		if(firstSound){
			console.log('run musik');
			clickAudio.play();
			clickAudio.autoplay = true; // Автоматически запускаем			
			clickAudio.loop = true;
			// firstSound = false
		}
	}
	
	function clearMultipleLoser(x,y)
	{
		self.eraseCircle(x,y);
		let color = self.randomN();
		context.fillStyle = self.getColor(color); 
		context.font = "bold 20px Sans";
		context.fillText('Игра закончена с результатом: '+points,size*x+size/2,hheader+size/2+x*size);
	}

	self.runMultipleLoser = function ()
	{
		for(var i=0;i<wCount;i++)
			for(var j=0;j<hCount;j++){
				if(curAsc) curHeight--;
				else curHeight++;
				
				if(curHeight===-5) curAsc = false;
				if(curHeight===0) curAsc = true;

				
				self.clearCell(i,j);
				self.circleView(i,j,curHeight, self.getColor(mas[i][j]));
			};
		timerHMS++;
		if(timerHMS>30){
			clearTimeout(timerLoser);
			timerHMS = 0;
			let ch=1;
			for(let i=0;i<wCount;i++)
				for(let j=0;j<hCount;j++){
					let now = new Date();
					setTimeout(function () { 
						console.log(i + ' key  ');
						clearMultipleLoser(i,j); 
					  }, 50*ch);
					ch++;
				};
		}
	};
	
	self.setParams = function(weightC, heightC, rC)
	{
		rCount=rC;			//  количество рэндомно генерируемых шаров 
    	wCount = weightC;	//  в ширину сколько
    	hCount = heightC;  	//  в высоту 
		mas = new Array(hCount);
		copyMas = new Array(hCount);
		masKill = new Array(hCount);
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
		// firstSound = true;
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
					if(mas[i][j] < 0) ++beforeCount;	
					
			for(var i = 0; i < hCount; ++i)
				for(var j = 0; j < wCount; ++j)
					if(mas[i][j] < 0)
					{	
						if((i-1 >= 0) && ((mas[i-1][j] === 0)||(mas[i-1][j] > 10)))	
							mas[i-1][j] = mas[i-1][j]===0?-1:mas[i-1][j]*(-1);
						if((i+1 < hCount) && ((mas[i+1][j] === 0)||(mas[i+1][j] > 10)))	
							mas[i+1][j] = mas[i+1][j]===0?-1:mas[i+1][j]*(-1);
						if((j-1 >= 0) && ((mas[i][j-1] === 0)||(mas[i][j-1] > 10)))	
							mas[i][j-1] = mas[i][j-1]===0?-1:mas[i][j-1]*(-1);
						if((j+1 < wCount) && ((mas[i][j+1] === 0)||(mas[i][j+1] > 10)))	
							mas[i][j+1] = mas[i][j+1]===0?-1:mas[i][j+1]*(-1);
					}
				
			for(var i = 0; i < hCount; ++i)
				for(var j = 0; j < wCount; ++j)
					if(mas[i][j] < 0) ++afterCount;	
			if(afterCount === beforeCount) break;
			
		}
		
		var cool = false;
		if(mas[iCheck][jCheck] < 0)	
			cool = true;
		
		mas[curI][curJ] = curColor;	
		for(var i = 0; i < hCount; ++i)
			for(var j = 0; j < wCount; ++j){
				if(mas[i][j] === -1) mas[i][j] = 0
				else if(mas[i][j] < 0) mas[i][j]=mas[i][j]*(-1);
			};
		return cool;
	}
	
	self.eraseCircle = function (i,j)
	{	//надо дописать исчезновение
		var now = new Date();
		mas[i][j] = 0;
		self.clearCell(i, j);
		self.vibro(true);//вибрируем

	}
	
	self.getPoints = function(sameColorCount)
	{
		return sameColorCount*(sameColorCount-lenLine+1);//Math.pow(2,sameColorCount);

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
	
	self.showLosingMsg = function()//конец игру
	{
		
		clearInterval(timerGame);
		timerHMS = 0;
		//timerLoser = setInterval(function() {self.runMultipleLoser();}, 50);
		blast(points);
		copyMas = new Array(hCount);
		masKill = new Array(hCount);
	}
	
	//проверка горизонтали
	self.checkHorizontalLine = function (iCheck, jCheck)
	{
		var erase = false;
		var sameColorCount = 0;
		var jMasForErase = new Array();
		var colorBlast = mas[iCheck][jCheck];

		
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
			for(var j=0; j <sameColorCount; ++j){
				smallBlast(iCheck,jMasForErase[j],colorBlast,mas);
				self.eraseCircle(iCheck,jMasForErase[j]);
			};
			sameColorCount = 0;
			console.log(masKill);
		}
		
		return erase;
		
	}
	
	
	
	//проверка вертикали
	self.checkVerticalLine = function (iCheck, jCheck)
	{
		var erase = false;
		var sameColorCount = 0;
		var iMasForErase = new Array();
		var colorBlast = mas[iCheck][jCheck];
		
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
		
		
		if(sameColorCount>=lenLine)
		{
			erase = true;
			points += self.getPoints(sameColorCount);
			for(var i=0; i <sameColorCount; ++i){
				smallBlast(iMasForErase[i],jCheck,colorBlast,mas);
				self.eraseCircle(iMasForErase[i],jCheck)
				// setTimeout(() => {
				// 	self.eraseCircle(iMasForErase[i],jCheck)
				// }, 1);
			};
			sameColorCount = 0;
		}
		
		return erase;
	}

	//проверка диагонали слева направо
	self.checkDiagonalLine_left = function (iCheck, jCheck)
	{
		var erase = false;
		var sameColorCount = 0;
		var iMasForErase = new Array();
		var colorBlast = mas[iCheck][jCheck];
		var yi = 1;
		for(var i=iCheck+1; i < hCount; i++)
		{
			if(mas[i][jCheck+yi] === mas[iCheck][jCheck])
			{
				iMasForErase[sameColorCount] = {};
				iMasForErase[sameColorCount]['i'] = i;
				iMasForErase[sameColorCount]['j'] = jCheck+yi;
				++sameColorCount;
				++yi;
				if((jCheck+yi)>wCount) break;
			}
			else break;
		};
		yi=0;
		for(var i=iCheck; i >=0; i--)
		{
			if(mas[i][jCheck-yi] === mas[iCheck][jCheck])
			{
				iMasForErase[sameColorCount] = {};
				iMasForErase[sameColorCount]['i'] = i;
				iMasForErase[sameColorCount]['j'] = jCheck-yi;
				++sameColorCount;
				++yi;
				if((jCheck-yi)<0) break;
			}
			else break;
		};
		if(sameColorCount>=lenLine)
		{
			erase = true;
			points += self.getPoints(sameColorCount);
			for(var i=0; i <sameColorCount; ++i){
				smallBlast(iMasForErase[i]['i'],iMasForErase[i]['j'],colorBlast,mas);
				self.eraseCircle(iMasForErase[i]['i'],iMasForErase[i]['j']);
			};
			sameColorCount = 0;
		}

		
		return erase;
	}
	
	//проверка диагонали справа налево
	self.checkDiagonalLine_right = function (iCheck, jCheck)
	{
		var erase = false;
		var sameColorCount = 0;
		var iMasForErase = new Array();
		var colorBlast = mas[iCheck][jCheck];
		var yi = 1;
		for(var i=iCheck+1; i < hCount; i++)
		{
			if(mas[i][jCheck-yi] === mas[iCheck][jCheck])
			{
				iMasForErase[sameColorCount] = {};
				iMasForErase[sameColorCount]['i'] = i;
				iMasForErase[sameColorCount]['j'] = jCheck-yi;
				++sameColorCount;
				++yi;
				if((jCheck-yi)<0) break;
			}
			else break;
		};
		yi=0;
		for(var i=iCheck; i >=0; i--)
		{
			if(mas[i][jCheck+yi] === mas[iCheck][jCheck])
			{
				iMasForErase[sameColorCount] = {};
				iMasForErase[sameColorCount]['i'] = i;
				iMasForErase[sameColorCount]['j'] = jCheck+yi;
				++sameColorCount;
				++yi;
				if((jCheck+yi)>wCount) break;
			}
			else break;
		};
		if(sameColorCount>=lenLine)
		{
			erase = true;
			points += self.getPoints(sameColorCount);
			for(var i=0; i <sameColorCount; ++i){
				smallBlast(iMasForErase[i]['i'],iMasForErase[i]['j'],colorBlast,mas);
				self.eraseCircle(iMasForErase[i]['i'],iMasForErase[i]['j']);
			};
			sameColorCount = 0;
		}

		
		return erase;
	}

	//проверка на уничтожение линий
	self.checkLines = function (i,j)
	{
		var erase = false;
		var colorBlast = mas[i][j];
		if(self.checkHorizontalLine(i,j))
			{	
				// smallBlast(i,j,colorBlast);
				//self.eraseCircle(i,j);
				erase = true;		
			}
		else if(self.checkVerticalLine(i,j))
			{	
				self.eraseCircle(i,j);
				erase = true;	
			}
		else if(self.checkDiagonalLine_left(i,j))
			{	
				self.eraseCircle(i,j);
				erase = true;	
			}
		else if(self.checkDiagonalLine_right(i,j))
			{	
				self.eraseCircle(i,j);
				erase = true;	
			};

		return erase;
	}
 	self.vibro = function(longFlag) {
        if ( navigator.vibrate ) { // есть поддержка Vibration API?
			//есть вибро
			console.log('есть вибро');
            if ( !longFlag )
                window.navigator.vibrate(100); // вибрация 100мс
            else
                window.navigator.vibrate([100,50,100,50,100]); // вибрация 3 раза по 100мс с паузами 50мс
        }
		else{
			//нет вибро
			console.log('нет вибро');
		}
    }
	//при клике, действия с шариком
	self.move = function (i, j)
	{
		if(loser) return;
		
		//если повторно на тот же шарик нажали

		if(curI === i && curJ === j){
			firstSound = false;
			clickAudio.pause();
			self.clearTimer(i,j);
			self.vibro(false);//вибрируем
		}
		else
		{
			
			// alert(curI+"==="+curJ);
			// console.log(mas[i][j]);
			//Проверяем нажатую ячейку - НАДО ДОДЕЛАТЬ
			if((mas[i][j] != 0)&&(mas[i][j] <= 10))
			{
				//если был нажат ранее шарик, но сейчас жмём не на него
				if(curI != -1 && curJ != -1)
					self.clearTimer(curI,curJ);
				curI = i;
				curJ = j;
				firstSound = true;
				if(flSound){
					soundMultiple();
				};
				timer = setInterval(function() {
					self.runMultiple();
				}, 50);
				self.vibro(false);//вибрируем
			}
			else
			{	
				firstSound = false;
				clickAudio.pause();
				console.log('pause');
				//если может пройти
				if(curI != -1 && curJ != -1)
					if(self.checkPassability(i,j))
					{
						//делаем копию игры
						for(let i=0;i<wCount;i++)
							for(let j=0;j<hCount;j++)
								copyMas[i][j] = mas[i][j];
						copypoints = points;
						//ползёт
						self.circleGo(i,j);
						//если ничего не исчезло
						//console.log(mas[i][j]);
						if(!self.checkLines(i,j)){
							//новые шары
							console.log('draw next circlis now');
							self.drawNextCirclisNow();
							self.drawRandomCirclesNext();
						}
						else 
							console.log('Убили линию');
							console.log(masKill);
							//убиваем линию
							for(let i=0;i<wCount;i++)
								for(let j=0;j<hCount;j++)
									masKill[i][j] = 0;
							self.drawPoints();
					}
			}
		}
		
		
	};
	
	self.drawNextCirclisNow = function(){
		for(var i=0;i<wCount;i++)
			for(var j=0;j<hCount;j++){
				if(mas[i][j]>10){
					mas[i][j]=mas[i][j]-10;
					if(!self.checkLines(i,j))
						self.circleView(i,j,0, self.getColor(mas[i][j])); 
					else 
						self.drawPoints();
				};
			};
	};
	
	
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
    self.cellViewMenu = function(x1,y1,x2,y2,punct) 
	{
		context.beginPath();
		context.strokeStyle = baseColor;
		context.arc(x1+cellSize/2, y1+cellSize/2+2, cellSize/2 , 0, 2*Math.PI);

		var gradient = context.createRadialGradient(x1, y1,cellSize,x1, y1, cellSize/2);
		gradient.addColorStop(0, baseColor);
		gradient.addColorStop(1, baseGrad);
		//gradient.addColorStop(1, baseGrad);//self.getDarkColor(color));
		
		context.fillStyle = baseColor; 
		context.fill();
		context.stroke();


		var img = new Image();
		img.onload = function() {
			context.drawImage(img,x1+cellSize/4, y1+cellSize/4,cellSize/2,cellSize/2);
			//console.log('1 = '+(y1+cellSize/4));
		};
		if(punct===5){
			//info
			img.src = "user-guide.svg";
		}
		else if(punct===4){
			//sound
			if(flSound){
				img.src = "music.svg";
			}
			else{
				img.src = "mute.svg";
			};
		}
		else if(punct===3){
			//save
			img.src = "save.svg";
		}
		else if(punct===2){
			//open
			img.src = "open.svg";
		}
		else if(punct===1){
			//undo
			img.src = "undo.svg";
		}
		else if(punct===0){
			//reboot
			img.src = "reboot.svg";
		}
    };
  
  	//чистка ячейки
  	self.clearCell = function(y,x) 
	{
		//определяем текущие координаты ячейки
		var curX = size*x;
		var curY = hheader+size*y;
		// console.log(''+curX+'-'+curY);
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
		var chC=1;
		var nn = n>10?n-10:n;
		for (var prop in Colors.names){
			if (chC === nn ){
				return Colors.names[prop];
			}
			chC++;
		};		
	};
  
  
  	self.randomN = function(n)		 
	{
		return Math.floor(Math.random()*(allColor-1+1))+1;//случайное число от 1 до allColor
	};
	
	self.randomNNext = function(n)		 
	{
		return 10+self.randomN()
	};
	
	//рисуем шарик 
   	self.circleView = function(y,x, h, color) 
	{
		var radius = size/4;
		context.strokeStyle = color;
	
		context.beginPath();
		context.moveTo((x+0.5)*self.size+radius ,(y+0.5)*size);
		context.arc((x+0.5)*size, (y+0.5)*size+h+hheader, radius , 0, 2*Math.PI);
		//раскрашиваем градиентом
		var gradient = context.createRadialGradient((x+0.5)*size, (y+0.5)*size+h+hheader, radius,(x+0.5)*size+radius, (y+0.5)*size+h+hheader-radius, radius*1.9);
		gradient.addColorStop(0, color);
		gradient.addColorStop(1, color);
		gradient.addColorStop(0.2, ballGrad);//self.getDarkColor(color));
		
		context.fillStyle = gradient; 
		context.fill();
		context.stroke();
		//context.restore();
    };
	
	//рисуем NEXT шарик в игровом поле
	self.circleViewNext = function(y,x, h, color) 
	{
		var radius = size/10;
		context.strokeStyle = color;
	
		context.beginPath();
		context.moveTo((x+0.5)*self.size+radius ,(y+0.5)*size);
		context.arc((x+0.5)*size, (y+0.5)*size+h+hheader, radius , 0, 2*Math.PI);
		//раскрашиваем градиентом
		var gradient = context.createRadialGradient((x+0.5)*size, (y+0.5)*size+h+hheader, radius,(x+0.5)*size-radius, (y+0.5)*size+h+hheader+5, 2);
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
	//рисуем след шарик и на поле и в шапке
	self.drawRandomCircleNext = function()		 
	{
		
		if(self.checkOfLosing())  return 0;
		var randj=Math.round((Math.random())*(wCount-1)); 
		var randi=Math.round((Math.random())*(hCount-1)); 
		var fl=0;
		var nextColor = 0;
		while(fl===0)
		{
			if(mas[randi][randj]===0)
			{
				mas[randi][randj] = self.randomNNext();
				self.circleViewNext(randi,randj,0, self.getColor(mas[randi][randj])); 
				nextColor = self.getColor(mas[randi][randj]);
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
		};
		if(self.checkOfLosing())  return 0;
		return nextColor
	};
	

	self.drawPoints = function() 
	{
		
		context.beginPath();
		context.fillStyle = baseColor;
		context.strokeStyle = "#000";
		context.moveTo(size*wCount+2, 0);
    	context.fillRect(size*wCount+2, hheader, size*wCount+hfuter+hheader+30, size*hCount);
		context.stroke();

		context.font = "bold 40px Sans";
		var pointsTXT = ''+points;
		while(pointsTXT.length<6)
			pointsTXT = "0"+pointsTXT;
		context.fillStyle = baseColor; // or whatever color the background is.
		context.textBaseline="middle";
		context.textAlign = 'start';
		context.fillRect(0,0,cellSize*3,hheader-2);
		context.fillStyle = '#000000'; // or whatever color the text should be.
		context.fillText(pointsTXT, pointsNow,hheader/2);	
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
	self.drawOneRandomCircleNext = function(nextColor,i){
		var pozNextBall = canvas.width/2-(sizeNextball*3)/2;
		var radius = sizeNextball/4;
		var y = 5;//смещение относительно центра футера
		var y1NextBallMenu = hheader/2-y-sizeNextball/2;
		var y2NextBallMenu = hheader/2-y+sizeNextball/2;
		//рисуем ячейки для след шаров
		var x1NextBallMenu = pozNextBall+i*sizeNextball;
		var x2NextBallMenu = pozNextBall+(i+1)*sizeNextball;
		context.strokeStyle = "#000000";
		self.cellView(x1NextBallMenu,y1NextBallMenu,x2NextBallMenu,y2NextBallMenu);
		//рисуем сам следующий шарик в меню

		context.strokeStyle = nextColor;
	
		context.beginPath();
		//context.moveTo(x1NextBallMenu+radius ,y1NextBallMenu+radius);
		context.arc(x1NextBallMenu+(x2NextBallMenu-x1NextBallMenu)/2 ,y1NextBallMenu+(y2NextBallMenu-y1NextBallMenu)/2, radius , 0, 2*Math.PI);
		//раскрашиваем градиентом
		var gradient = context.createRadialGradient(x1NextBallMenu+(x2NextBallMenu-x1NextBallMenu)/2, y1NextBallMenu+(y2NextBallMenu-y1NextBallMenu)/2, radius,x1NextBallMenu+(x2NextBallMenu-x1NextBallMenu)/2-radius, y1NextBallMenu+(y2NextBallMenu-y1NextBallMenu)/2+5, 2);
		gradient.addColorStop(0, nextColor);
		gradient.addColorStop(0.5, nextColor);
		gradient.addColorStop(1, ballGrad);//self.getDarkColor(color));
				
		context.fillStyle = gradient; 
		context.fill();
		context.stroke();

	}
	self.drawRandomCirclesNext = function()	
	{
		for (var i = 0; i < rNext; i++){
			var nextColor = self.drawRandomCircleNext();	
			if(nextColor===0)
				break;
				self.drawOneRandomCircleNext(nextColor,i)
		};
		//проверям, может рэндомные шары норм в линию на уничтожение встали
		for (var i = 0; i < rNext; i++) 
			if(self.checkLines(masRandom[i][0],masRandom[i][1]))
				self.drawPoints();
					
		randomCurrent = 0;
		if(loser) self.showLosingMsg();
	}
	

	//рисуем меню
	self.drawMenu = function(){
		var posMenu = cellSize;//canvas.width/2-(cellSize*6)/2;
		for(var i=0;i<6;i++)
			self.cellViewMenu(posMenu+i*cellSize,canvas.height-hfuter,posMenu+(i+1)*cellSize,canvas.height-hfuter+cellSize,i);
	};

	// рисуем поле
	self.draw = function(cont, s, vievCircles) 
	{
		context = cont;
		size = s;
		//поле пусто - забиваем нулями
		for(var i = 0; i < rCount; i++)
			masRandom[i] = new Array(2);
		for(var i = 0; i < wCount; i++)
		{
			mas[i] = new Array(wCount);
			copyMas[i] = new Array(wCount);
			masKill[i] = new Array(wCount);
			for(var j = 0; j < hCount; j++)
				mas[i][j] = 0;
				copyMas[i][j] = 0;
				masKill[i][j] = 0;
		}
		context.strokeStyle = "#000";
		
		//рисуем ячейки
        for (var i = 0; i < hCount; i++) 
		{
            for (var j = 0; j < wCount; j++) 
				self.cellView(size*j, hheader+size*i, size*(j+1),hheader+size*(i+1));

        };
		if(vievCircles){
			//начальные рэндомные шары
			self.drawRandomCircles();
			self.drawRandomCirclesNext();
			self.drawPoints();
		}
	}

	self.undoStep = function(){
		let ch=0;
		for(let i=0;i<wCount;i++)
			for(let j=0;j<wCount;j++){
				ch=+copyMas[i][j]
			};
		if(isNaN(ch)) return;
		ch=0;
		for(let i=0;i<wCount;i++)
			for(let j=0;j<wCount;j++){
				self.clearCell(i,j);
				mas[i][j]=copyMas[i][j];
				if(mas[i][j]>0)
					if(mas[i][j]<10)
						self.circleView(i,j,0, self.getColor(mas[i][j])); 
					else {
						self.circleViewNext(i,j,0, self.getColor(mas[i][j]));
						self.drawOneRandomCircleNext(self.getColor(mas[i][j]),ch);
						ch++;
					}

			};
		points = copypoints;
		self.drawPoints();
	};

}