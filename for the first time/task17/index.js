/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/
//事件处理对象
var EventUtil={
	addHandler: function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent('on'+type,handler);
		}else {
			element['on'+type]=handler;
		}
	},	
	removeHandler: function(element,type,handler){
		if(element.removeEventListener){
			element.removeElementListener(type,handler,false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else {
			elemen["on"+type]=null;
		}
	}
}
function getId(str){
	return document.getElementById(str);
}
function getTag(ele,str){
	return ele.getElementsByTagName(str);
}
var formGraTime=getId('form-gra-time');
var citySelect=getId("city-select");
var ul=getTag(document,"ul")[0];
var input=getTag(document,"input")[0]
input.checked=true;
// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}
var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
 //移除li
 function removeLi(){
	 var li=getTag(ul,"li");
	 var length=li.length
	 for(var i=0;i<length;i++){
		 ul.removeChild(li[0]);
	 }
 }
 
 //创建li
 function createLi(date,h){	 
	 var li=document.createElement("li");
	 if(pageState["nowGraTime"]==="day"){
		li.style.width="5px";
	 }else  if(pageState["nowGraTime"]==="week"){
		li.style.width="10px";
	 }else  if(pageState["nowGraTime"]==="month"){
		li.style.width="15px";
	 }
	 li.style.height=h/2+"px";
	 li.title=date+" : "+h;
	 if(h<100){
		 li.style.background="#0f0";
	 } else if(100<=h &&h< 200){
		 li.style.background="#00f";
	 } else if(200<=h &&h< 300){
		 li.style.background="#f00";
	 } else if(300<=h &&h< 400){
		 li.style.background="#f0f";
	 } else if(400<=h &&h<=500){
		 li.style.background="#0ff";
	 }
	 ul.appendChild(li);	
 }

function renderChart() {
	
	removeLi();
	for(var i in chartData){
		createLi(i,chartData[i]);
	}

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(e) {
  // 确定是否选项发生了变化 
  // 设置对应数据
	if(e.target.value&&e.target.value!=pageState["nowGraTime"]){
		pageState["nowGraTime"]=e.target.value;	
		setChartData();
		  // 调用图表渲染函数
		renderChart()
	}	
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
	
  // 设置对应数据
	pageState["nowSelectCity"]=citySelect.value;
	setChartData();
  // 调用图表渲染函数
    renderChart()
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
	formGraTime.onclick=graTimeChange;
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
	EventUtil.addHandler(citySelect,"change",citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
	  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
	for(var i in aqiSourceData){
		var option=new Option(i);
		citySelect.add(option,undefined);
	}
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
    pageState["nowSelectCity"]=citySelect.value;
	setChartData();
	renderChart()
}
//设置chartData
function setChartData(){
	for(var i in aqiSourceData){
		if(i==pageState["nowSelectCity"]){		
			//分三种情况
			switch(pageState["nowGraTime"]){
				case"day":
					chartData=aqiSourceData[i];					
					break;
				case"week":
					var j,
						arr=[];
					for(j in aqiSourceData[i]){
						arr.push(aqiSourceData[i][j]);
					}
					chartData=getWeekAverage(3,arr);
					break;
				case"month":
					chartData=getMonthAverage(aqiSourceData[i]);
					break;
				default:
					break;
			}
		}
	}
	
	//a为开始的天数，arr为数组,得到周平均值
	function getWeekAverage(a,arr){
		var b=arr.length-a,
			temp=[],
			sum=0;	
		for(var i=0;i<a;i++){		
			sum+=arr[i];
		}
		temp.push(sum/a);
		
		var c=Math.floor(b/7);
		sum=0;
		//c=0表示b不够7天
		if(c>0){
			for(var i=0;i<c;i++){
				sum=arr[i*7+a]+arr[i*7+a+1]+arr[i*7+a+2]+arr[i*7+a+3]+arr[i*7+a+4]+arr[i*7+a+5]+arr[i*7+a+6];
				temp.push(sum/7);
			}
		}
		sum=0;
		if(b>0){
			for(var i=a+7*c;i<arr.length;i++){		
				sum+=arr[i];
			}
			temp.push(sum/(arr.length-(7*c+a)));
		}
		var obj={};
		for(var i=1;i<=temp.length;i++){
			obj["第"+i+"周"]=temp[i];
		}
		return obj;
	}
	
	//得到月平均值
	function getMonthAverage(o){
		var temp={},
			m,
			sum,
			num;		
		for(var j=1;j<13;j++){
			num=0;
			sum=0;			
			for(var i in o){				
				if(parseInt(i.match(/-(\d+)-/)[1])===j){
					sum+=o[i];
					num+=1;
				}				
			}
			if(num>0){
				temp[j+'月份']=sum/num;
			}			
		}		
		return temp;
	}
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();

//打印对象
function alertObj(obj){
	var s='';
	for(var i in obj){	
		s+=i;	
	}
	alert(s)
}

















