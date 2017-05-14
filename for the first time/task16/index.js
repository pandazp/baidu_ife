/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {}
	var table = document.getElementById('aqi-table');
	var tr=table.getElementsByTagName("tr");
window.onload=function(){
	
	
	//var btn = document.getElementById('add-btn');	
	//btn.addEventListener("click",addBtnHandle,false);

	init();
}

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
 
function addAqiData() {
	var cityInput=document.getElementById("aqi-city-input").value;
	var indexInput=document.getElementById("aqi-value-input").value;
	if(!cityInput){
		alert("城市名不能为空")
	}else if(!/^[\u4E00-\u9FA5,A-Z,a-z]+$/.test(cityInput)){
		alert("输入不合法，城市名只能为汉字或字母")
	}else{
		var city=cityInput;
	}
	if(!indexInput){
		alert("空气质量指数不能为空")
	}else if(!/^(\d+)$/.test(indexInput)){
		alert("输入不合法，空气质量指数只能为数字")
	}else{
		var index=parseInt(indexInput);
	}	
	if(index&&city){
		aqiData[city]=index;
	}
}


 //获得对象属性和方法的数量
function getPropertyLength(obj){
	 var j=0;
	 for(var i in obj){		 
		 j++;
	 }
	 return j;
 }
 /**
 * 渲染aqi-table表格
 */

function renderAqiList() {

	var city=[];
	var cityAqi=[];

	for(var m in aqiData){
		cityAqi.push(m);
	}
	//第一次添加
	if(tr.length===0){
		var tr1=table.insertRow();
		tr1.style.textAlign="center";
		var td1=tr1.insertCell();
		td1.innerHTML="城市";
		var td2=tr1.insertCell();
		td2.innerHTML="空气质量";
		var td3=tr1.insertCell();
		td3.innerHTML="操作";
	}
	//获得列表显示的城市的数量，并把城市名添加到city
	if(tr.length>1){
		for(var k=1;k<tr.length;k++){
			var td=tr[k].getElementsByTagName("td");
			city.push(td[0].innerHTML);
		}
	}
	//b有a无
	function uni(a,b){
		var temp=[];
		var save=[];
		for(var i in a){		
			temp[a[i]]=2;		
		}	
		for(var j in b){
			if(!temp[b[j]]){			
				save.push(b[j]);
			}
		}		
		return save;
	}

	//添加行函数
	function addTr(obj){
		//取得最后一个属性值赋给i;
		for(var i in obj){};
		
		var ntr=table.insertRow();
		ntr.style.textAlign="center";
		var ntd1=ntr.insertCell();
		ntd1.innerHTML=i;
		var ntd2=ntr.insertCell();
		ntd2.innerHTML=obj[i];
		var ntd3=ntr.insertCell();
		ntd3.innerHTML="删除";
		ntd3.style.color="#00f";
		ntd3.style.cursor="pointer";
		ntd3.className="delete";
		ntd3.dataset.city=""+i;
	}
	
	//tr有aqiData无，删除
	if(uni(cityAqi,city).length){
		for(var k=1;k<tr.length;k++){
			var td=tr[k].getElementsByTagName("td");
			if(td[0].innerHTML==uni(cityAqi,city)[0]){				
				tr[k].parentNode.removeChild(tr[k]);
			}
		}
	}
	//tr无aqiData有，增加
	if(uni(city,cityAqi).length){
		addTr(aqiData);
	}
	//aqiData无数据，表格不出现
	if(!getPropertyLength(aqiData)){
		table.innerHTML="";
	}
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
  // do sth.
	delete aqiData[city];
    renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
	var btn = document.getElementById('add-btn');	
	btn.addEventListener("click",addBtnHandle,false);
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
	table.addEventListener('click',function(e){
		if(e.target.className==="delete"){
			delBtnHandle(e.target.dataset.city)
		}
	})

	
}






