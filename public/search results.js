/**var setCookie = function (name, value, day) {
 
    var expires = day * 24 * 60 * 60 * 1000;
    var exp = new Date();
    exp.setTime(exp.getTime() + expires);
    document.cookie = name + "=" + value + ";expires=" + exp.toUTCString();
};

var delCookie = function (name) {
    setCookie(name, ' ', -1);
};

function getCookie(cname){
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
	}
	return "";
}

var user=getCookie("username");
var psw=getCookie("password");**/

var user=localStorage.getItem("username");
var psw=localStorage.getItem("password");

$(document).ready(function(){
	$(".error").css({"padding":"10px","color":"#f24144","font-size":"20px"});
	if (typeof(Storage) !== "undefined") {
	if(user!=""&&psw!="")
	   {
	    $(".logout").css('display','block');
		   $(".logReg").css('display','none');
	   }
	   else{
	   $(".logout").css('display','none');
		   $(".logReg").css('display','block');
	   }
	}
	else{
		console.log("check browser support failed");
	}
});

$(document).ready(function(){
	
		$("#RegisterConfirm").click(function(){
			var username=$('#RegisterUsername').val().trim();
			var password=$('#RegisterPwd').val().trim();
			
			if(username==null||username==""){
				console.log("null username");
				$(".error").text("Please insert username");
			}
			else if(password==null||password==""){
				console.log("null password");
				$(".error").text("Please insert password");
			}
			else{
				$.ajax({
				url:'https://us-central1-sem-demo-mk0.cloudfunctions.net/function-user_account_management/register',
				type:'post',
				data:{
					Account:username,
					Password:password
				},
				//dataType:'JSON',
					/**beforeSend: function(request)
					{
					  request.setRequestHeader("Access-Control-Allow-Origin", "*");
						request.setRequestHeader('Access-Control-Allow-Credentials','true');
					
				},**/
				success: function(data){
					
					if(data=="OK"){
						alert("REGISTER SUCCESSFULLY！");
					$("#myRegisterModal").modal('hide');
					$("#myLoginModal").modal('show');
						$("#RegisterPwd").text("");
						$("#RegisterUsername").text("");
						$(".error").text("");
					}
					else
						{
							$(".error").text(data);
							$("#RegisterPwd").text("");
						$("#RegisterUsername").text("");
						}
					
				},
				error: function()
				{
					console.log("post fail");
				}		
			});
			}
			
	});
	
	
	});
	
	$(document).ready(function(){
	
	 $("#LoginConfirm").click(function(){
			var username=$('#LoginUsername').val().trim();
			var password=$('#LoginPwd').val().trim();
			
		 if(username==null||username==""){
				console.log("null username or password");
			  $(".error").text("Please insert username or password");
			}
		 else if(password==null||password==""){
				console.log("null password");
				$(".error").text("Please insert password");
			}
		 else{
			 $.ajax({
				url:'https://us-central1-sem-demo-mk0.cloudfunctions.net/function-user_account_management/login',
				type:'post',
				data:{
					Account:username,
					Password:password
				},
				success: function(data){
					if(data=="OK"){
					alert("LOGIN SUCCESSFULLY！");
						localStorage.setItem("username",username);
						localStorage.setItem("password",password);
					$("#myLoginModal").modal('hide');
					$(".logout").css('display','block');
		         $(".logReg").css('display','none');
						$(".error").text("");
						$("#LoginPwd").text("");
						$("#LoginUsername").text("");
					}
					else
						{
							$(".error").text(data);
							$("#LoginPwd").text("");
						$("#LoginUsername").text("");
						}
				},
				error: function(errorMsg)
				{
					console.log("Login failed")
				}		
			});
		 }		
	});	
	});


$(document).ready(function(){
	$(".btn-close").click(function(){
		$("#LoginPwd").text("");
		$("#LoginUsername").text("");
		$(".error").text("");
		$("#RegisterPwd").text("");
		$("#RegisterUsername").text("");
	});
});

$(document).ready(function(){
	$("#LoginCancel").click(function(){
		$("#LoginPwd").text("");
		$("#LoginUsername").text("");
		$(".error").text("");
		$("#RegisterPwd").text("");
		$("#RegisterUsername").text("");
	});
});

$(document).ready(function(){
	$("#RegisterCancel").click(function(){
		$("#LoginPwd").text("");
		$("#LoginUsername").text("");
		$(".error").text("");
		$("#RegisterPwd").text("");
		$("#RegisterUsername").text("");
	});
});

$(document).ready(function(){
	
	 $(".logout").click(function(){
		 localStorage.clear;
	 });
});


$(document).ready(function(){
	var searchContentFromLastPage = localStorage.getItem("searchContent");
	console.log(searchContentFromLastPage);
	if(searchContentFromLastPage==""||searchContentFromLastPage==null)
		{
			 $('.searchResult').text("WHAT DO YOU WANT TO SEARCH ? ");
		}
	else{
		
		$('#searchContent').text(searchContentFromLastPage);
		var searchContent=$('#searchContent').val().trim();
		$.ajax({
				url:'https://us-central1-sem-demo-mk0.cloudfunctions.net/function-key_word_search/moviesByKeyword',
				type:'post',
				data:{
					Title:searchContent,
					Limit:'[0,5]',
				},
			   dataType: 'json',
				success: function(data){
					console.log("search successfully!");
	            	showResults(data);
				},
				error: function()
				{
					console.log("search failed");
				}		
			});
	}
	
	
	 $("#searchBtn").click(function(){
		 localStorage.removeItem("searchContent");
		
		
		
	 });
});


function showResults(Rdata){
	var str = "";
          for (var i = 0; i < Rdata.length; i++) { 
			  $.ajax({
				url:'https://api.themoviedb.org/3/search/movie?api_key=12aa6fa5f9d0e956ea2a1c6bf00f24c8&query='+Rdata[i].title,
				type:'get',
			   dataType: 'json',
				success: function(Mdata){
					console.log("search image successfully!");
					console.log("search image successfully!!!!"+JSON.stringify(Mdata));
					
					var img = document.createElement("img");
					var imgid = Mdata.backdrop_path;
					if(imgid!=null||imgid!=""||imgid!="undefined")
						{
							img.src = "https://image.tmdb.org/t/p/w500/"+imgid;
                           str = "<div>" + img+ Rdata[i].title+"</div>";
						}
					else{
						img.src = "img/moviePhoto.png";
                           str = "<div>" + img+ Rdata[i].title+"</div>"
					}
			  
            
              $(".searchResult").append(str);
				},
				error: function()
				{
					console.log("search image failed");
				}		
			});
			  }
			  
			      
};








