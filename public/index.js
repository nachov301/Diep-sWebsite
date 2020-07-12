// $ is short for jQuery
// for manipulating properties, first write property and second the value you wanna change it to
// $("h1").css("color","red");


$("body").keypress(function(event){
  $("h1").text(event.key);
});
