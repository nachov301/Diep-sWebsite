// $ is short for jQuery
// for manipulating properties, first write property and second the value you wanna change it to
// $("h1").css("color","red");

// with this for i added a listener to all the buttons
for (var i = 0; i < document.querySelectorAll(".drum").length; i++) {
  document.querySelectorAll(".drum")[i].addEventListener("click",function(){
// with this.innerHTML im giving the value of the button which was pressed to the variable buttonPressed
    var buttonPressed = this.innerHTML;
    // calling the function make sound and passing buttonPressed as a paramether
    makeSound(buttonPressed);

    buttonAnimation(buttonPressed);

  });
};

// with the event i can detect the element which does the action at the moment and i also added a listener to the whole document
document.addEventListener("keypress", function(event){
  // with .key i get the value of the key which was pressed, for example a,s,d, etc
  makeSound(event.key);

  buttonAnimation(event.key);
});

// i recive a value and then i check, i create a new  Audio object and then i utilize the method play to play the sounds
function makeSound(key){
  switch (key) {
    case "w":
      var tom1 = new Audio("sounds/tom-1.mp3");
      tom1.play();
      break;
    case "a":
      var tom2 = new Audio("sounds/tom-2.mp3");
      tom2.play();
      break;
    case "s":
      var tom3 = new Audio("sounds/tom-3.mp3");
      tom3.play();
      break;
    case "d":
      var tom4 = new Audio("sounds/tom-4.mp3");
      tom4.play();
      break;
    case "j":
      var snare = new Audio("sounds/snare.mp3");
      snare.play();
      break;
    case "k":
      var crash = new Audio("sounds/crash.mp3");
      crash.play();
      break;
    case "l":
      var kick = new Audio("sounds/kick-bass.mp3");
      kick.play();
      break;
    default:
  }
}

function buttonAnimation(currentKey){
// add a dot "." before the currentKey variable so it can make reference to the class of the button in the html file, it needs to be for example .w to make a reference to that button
  var activeButton = document.querySelector("." + currentKey);
// adds the style to the current button, in this case it adds the style pressed from the css to whatever button was pressed
  activeButton.classList.add("pressed");
// set the time before the function is called, in this case is gonna take 1 sec to call activeButton.classList.remove("pressed")
  setTimeout(function(){
    activeButton.classList.remove("pressed");
  }, 100);
}
