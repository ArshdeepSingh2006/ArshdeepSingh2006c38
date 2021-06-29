//Create variables here
var dog, dogImg1, happyDogImg, database, foodS, foodStock, readStock;
var foodObj, feedTime, lastFed, feed, addFoods, feedDog;
var bedroomImg, gardenImg, washroomImg, garden, gameState;
var milkBottle2, lazyImg;

function preload()
{
	//load images here
  dogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/happydogImg.png");
  bedroomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png");
  lazyImg = loadImage("images/Lazy.png");
}

function setup() {
	createCanvas(600, 550);
  database = firebase.database();
  foodObj = new Food();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  
  //read gameState from database
  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })

  fedTime = database.ref('FeedTime');
fedTime.on("value", function(data){
  lastFed = data.val();
})
  

  dog = createSprite(650,150,10,60);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  
}


function draw() { 
  background("green");
  
  foodObj.display();
  writeStock(foodS);

  if(foodS == 0){
    dog.addImage(happyDogImg);
    milkBottle2.visible = false;
  }else{
    dog.addImage(lazyImg);
    milkBottle2.visible = true;
  }
 
currentTime=hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry");
  foodObj.display();
}

//gameState 1
if(gameState===1){
  dog.addImage(happyDogImg);
  dog.scale = 0.175;
  dog.y =250;
}

//gameState 2
if(gameState===2){
  dog.addImage(lazyImg);
  dog.scale = 0.175;
  milkbottle2.visible = true;
  dog.y =250;
}

//gameState 3
var Bath = createButton("I want to take bath");
Bath.position(580,125);
if(Bath.mousePressed(function(){
  gameState = 3;
  database.ref('/').update({'gameState':gameState});
}));
if(gameState===3){
  dog.addImage(washroom);
  dog.scale = 1;
  milkBottle2.visible = true;
}

//gameState 4
var Sleep = createButton("I am very sleepy");
Sleep.position(710,125);
if(Sleep.mousePressed(function(){
  gameState = 4;
  database.ref('/').update({'gameState':gameState});
}));
if(gameState===4){
  dog.addImage(bedroom);
  dog.scale = 1;
  milkBottle2.visible = true;
}

// gameState 5 
var Play = createButton("Lets play !");
Play.position(500,160);
if(Play.mousePressed(function(){
  gameState = 5;
  database.ref('/').update({'gameState':gameState});
}));
if(gameState===5){
  dog.addImage(livingroom);
  dog.scale = 1;
  milkBottle2.visible = true;
}

// gameState 6 
var PlayInGarden = createButton("Lets play in park");
PlayInGarden.position(585,160);
if(PlayInGarden.mousePressed(function(){
  gameState = 6;
  database.ref('/').update({'gameState':gameState});
}));
if(gameState===6){
  dog.y=175;
  dog.addImage(livingroom);
  dog.scale = 1;
  milkBottle2.visible = true;
}



fill(225,225,254);
textSize(15);
milkBottle2(remaining +foodS);

  drawSprites();
  //add styles here
  }



function readStock(data){
  foodS = data.val();
  
}

function writeStock(x){
database.ref('/').update({
  food:x
})
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

//function in update gamestates in database
function update(state){
  database.ref('/').update({
    gameState: state
  });
}