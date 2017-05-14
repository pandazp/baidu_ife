var EventUtil={
	addHandler: function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;
		}
	},	
	removeHandler: function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else{
			element["on"+type]=null;
		}
	}
}

//验证文本框的输入值
var input=document.getElementById("input");
EventUtil.addHandler(input,"focus",function(){
	input.select();
})
input.focus();
//input.select();

var wrapper=document.getElementById("wrapper")
EventUtil.addHandler(wrapper,"click",function(e){
	if(input.value.match(/^\d+$/)){
		switch(e.target.value){
			case"左侧入":
				//alert(input.value)
				addLi(ul,ul.firstChild,input.value);
				break;
			case"右侧入":
				addLi(ul,null,input.value);
				break;
			case"左侧出":
				alert(ul.children[0].innerHTML);
				removeLi(ul.children[0]);
				break;
			case"右侧出":
				alert(ul.children[ul.children.length-1].innerHTML)
				removeLi(ul.children[ul.children.length-1]);
				break;
		}
	}		
})


EventUtil.addHandler(input,"change",function(){
	if(!input.value.match(/^\d+$/)){
		alert('输入错误，请输入数字');
		input.value="请输入数字";
		input.focus();		
	}
	//alert(input.value)
})

//给四个按钮添加事件处理程序
var ul=document.getElementsByTagName("ul")[0];
//添加节点
function addLi(parent,node,str){
	//alert(node)
	var li=document.createElement('li');
	li.innerHTML=str;
	parent.insertBefore(li,node);
}
//移除节点
function removeLi(node){	
	if(node){
		node.parentNode.removeChild(node);
	}	
}


//给每个li添加点击移除事件
EventUtil.addHandler(ul,"click",function(e){
	//alert(e.target.tagName.toLowerCase())
	if(e.target.tagName.toLowerCase()==="li"){
		removeLi(e.target);
	}
})
		















