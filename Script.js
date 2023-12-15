
const canvas = document.getElementById('Canv');
const context = canvas.getContext("2d");
const loadingScreen = document.getElementById("loading-screen");
loadingScreen.style.display = "none";
var body = document.getElementsByTagName("body")[0]
canvas.width = window.innerWidth;
canvas.height = window.innerHeight
var Character_x = canvas.width/ 2 - (canvas.width/ 4.8)
var enemy_y = canvas.height / 2 - (canvas.height/3.325)
var arena = new Image();
arena.src = "assets/arena.jpg";
var PunchSFX = new Audio('assets/sounds/Punch Sound effect.mp3');
var BlockSFX = new Audio('assets/sounds/Block Sound effect.mp3');
var trailEffect = new Image();
var Enemy;
var Fighter
trailEffect.src = "assets/effects/dodging/dodgeEffect.png"


window.addEventListener("gamepadconnected", function (e) {
    var gamepad = e.gamepad;
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        gamepad.index, gamepad.id,
        gamepad.buttons.length, gamepad.axes.length);

    // Check if it's a PS4 controller based on the ID
    if (gamepad.id.includes("Wireless Controller")) {
        console.log("PS4 controller connected!");
        // Your code to handle the PS4 controller input goes here
    }
});




function playPunchSound() {
    var punchSoundClone = PunchSFX.cloneNode(true);
    punchSoundClone.play();
}
function playBlockSound() {
    var blockSoundClone = BlockSFX.cloneNode(true);
    blockSoundClone.play();
}
function check_lost(){
    if (Enemy.hp <= 0 || Fighter.hp <=0){
        canvas.parentNode.removeChild(canvas);
        const para = document.createElement("p");
        const node = document.createTextNode("Round Over");
        para.appendChild(node);
        body.appendChild(para);
    }
    window.requestAnimationFrame(check_lost)
}
function dodge_effect(direction){
    let x;
    if (direction == "left"){
        x = 800;
    }
    else if (direction == "right"){
        x = 100;
    }
    context.drawImage(trailEffect,x,100);
}   
var damageCanvas = document.createElement('canvas');
document.body.appendChild(damageCanvas);
var damageContext = damageCanvas.getContext('2d');
damageCanvas.style.display = 'none';
function change_toRed(sprite,x,y,object){
    damageCanvas.width = object.width; // Assuming all frames have the same width
    damageCanvas.height = object.height; // Assuming all frames have the same height
    damageContext.clearRect(0, 0, damageCanvas.width, damageCanvas.height);
    damageContext.globalCompositeOperation = 'source-over';
    damageContext.drawImage(sprite, 0, 0,damageCanvas.width, damageCanvas.height);
    const imageData = damageContext.getImageData(0, 0, damageCanvas.width, damageCanvas.height);
    const data = imageData.data; 
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) {
            data[i] = 255; // Red channel
            data[i + 1] = 0; // Green channel
            data[i + 2] = 0; // Blue channel
            data[i + 3] = 40;
        }
    }
    damageContext.putImageData(imageData, 0, 0);
    context.drawImage(damageCanvas, x, y);
}
const draw_arena = () => {
    context.beginPath()
    context.drawImage(arena, 0, 0, canvas.width, canvas.height);
    ;}
class Boxer{
    constructor(name, player, pos_x, pos_y, 
        health, demage1, demage2, attack_cooldown,
        stnce_rng, attack1_range, attack2_range, block_range,dodgeLeft_range ,stnce_folder, attack1_folder, attack2_folder, block_folder, dodgeLeft_folder)
        { 
        //logic
        this.name = name;
        this.player = player;
        this.x = pos_x;
        this.y = pos_y;
        this.width = canvas.width / 2.4;
        this.height = canvas.height / 1.16375;
        this.attack_type = 0;
        //stats
        this.hp = health;
        this.dmg1 = demage1;
        this.dmg2 = demage2;
        this.atckcldn = attack_cooldown;
        //animations logic
        this.stnce_rng = stnce_rng;
        this.atk1_rng = attack1_range;
        this.atk2_rng = attack2_range;
        this.block_rng = block_range;
        this.dodgeLeft_rng = dodgeLeft_range;
        this.stnce_folder = stnce_folder;
        this.atk1_folder = attack1_folder;
        this.atk2_folder = attack2_folder;
        this.block_folder = block_folder;
        this.dodgeLeft_folder = dodgeLeft_folder;
        this.stance_animation = [];
        this.atck1_animations = [];
        this.atck2_animations = [];
        this.block_animations = [];
        this.dodgeLeft_animations = [];
        this.list;
        this.hz = 0;
            //timing logic
        this.take_time = 0;
        this.damage_time = new Date();
        this.action = 0;
        this.attack_time = 0;
        this.attack_time2 = 0;  
        this.dodging_time = 0; 
            //boolean logic
        this.damaged = false;
        this.blocking = false;
        this.attacking = false;
        this.dodging = false;
        this.holdingspace = false;
            //end
        }

    update_action = function(value){
        if (this.action!=value){
            this.hz = 0;
            this.action = value;}
    }
    draw = function() {
        let list;
        let hz;
        if (this.blocking && !(this.attacking)){
            this.update_action(2);
        }
        if (this.attacking){
            this.update_action(1);
        }
        if (this.attacking == false && this.blocking == false && this.dodging == true){
            this.update_action(3)
        }
        
        if (this.attacking == false && this.blocking == false && this.dodging == false){
            this.update_action(0)
        }
        if(this.action == 1){
            if (this.attack_type == 1){
                list = this.atck1_animations;
                hz = 1;
                this.cooldown = 50;}
            else if (this.attack_type ==2){
                list = this.atck2_animations;
                hz = 1;
                this.cooldown = 50;
            }
            
        }
        else if(this.action == 2){
            list = this.block_animations
            hz = 1
            this.cooldown = 20;
        }
        
        else if (this.action == 3){
            list = this.dodgeLeft_animations;
            hz = 1;
            if (this.player == 0)
            {
                this.cooldown = 52;
            }
            else if (this.player == 1)
            {
                this.cooldwon = 1500;
            }
        }
        
        else {
            list = this.stance_animation;
            hz = 1;
            this.cooldown = 100;
        }
        
        this.list = list;
        
        if  (new Date() - this.take_time>=this.cooldown){   
            this.hz+=hz; 
            this.take_time = new Date()}
        if (this.hz >= list.length){
            if (this.blocking == false && this.attacking == false){
                this.hz = 0
                
            }
            else((this.hz= list.length - 1))
            this.attacking = false
        }
        this.model = list[this.hz];
        
        
       try{
            context.drawImage(this.model, this.x, this.y,this.width,this.height);}
        catch(error){
            
        }
            
        if (this.damaged){
            change_toRed(list[this.hz], this.x, this.y,this);
           
            if (new Date() - this.damage_time >= 800){
                this.damaged = false
                this.damage_time = new Date()}
            }     
    }

    attack = (other) => {
        let dmg;
        if (this.attack_type == 1){
            dmg = this.dmg1;
            this.attack_time = new Date(); 
        }
        else if(this.attack_type == 2){
            dmg = this.dmg2
            this.attack_time2 = new Date();
        }
        this.attacking = true;
        if (!other.dodging){
            if (other.blocking) {
                other.hp -= dmg / 2;
                playBlockSound();
            } 
            else {
                other.damaged = true;
                other.hp -= dmg;
                playPunchSound();
            }
            other.damage_time = new Date();
        }
    }

    dodge = (other, direction) => {
        let player_x = this.x;
        
        let dodged = false;
        this.dodging = true;
        this.dodging_time = new Date();
    
        const move = () => {
            if (!dodged){
            if ((direction === "right" && this.x < player_x + 90) || (direction === "left" && this.x > player_x - 90)) {
                this.x += (direction === "right" ? 5 : -5);
                if (other.player == 0){
                other.width += 8;
                other.height += 5;
                other.x -=5;
                other.y -= 3;
                arena.height += 3;
                }
                else{dodge_effect(direction)};
                window.requestAnimationFrame(move);
            }
            else {   
                dodged = true;
            }}
            if (dodged){
                if ((direction === "right" && this.x > player_x) || (direction === "left" && this.x < player_x)){
                    this.x -= (direction === "right" ? 5 : -5);
                    if (other.player == 0){
                    other.width -= 8;
                    other.height -= 5;
                    other.x += 5;
                    other.y += 3;
                    }
                    window.requestAnimationFrame(move)
                }
                else{
                    this.dodged = false;
                    this.dodging = false;
                }
            }
        };
    
        move();
    };
    
    
    moves = function(target) {
        document.addEventListener("keypress", (event) => {
            if (this.attacking == false && this.dodging == false){
                switch(event.code) {
                    case "KeyJ":
                        if (new Date() - this.attack_time >= this.atckcldn) {
                            this.attack_type = 1;
                            this.attack(target); 
                            this.blocking = false;
                            if (this.holdingspace) {
                            this.blocking = true;}
                        }
                        break;
                    
                    case "KeyK":
                        if (new Date() - this.attack_time2 >= this.atckcldn){
                            this.attack_type = 2;
                            this.attack(target);
                            this.blocking = false;
                            if (this.holdingspace){
                                this.blocking = true}
                        }
                        break;
                   
                    case "KeyA":
                        if (new Date() - this.dodging_time >= 500){
                        this.dodge(target, "left")}
                        break;

                    case "KeyD":
                        if (new Date() - this.dodging_time >= 500){    
                        this.dodge(target, "right")
                    }
                        break;

                
                }
                }
                    
                })
        
        document.addEventListener("keydown", (event) => {
            if (event.code == 'Space'&& this.attacking == false) {
                this.blocking = true;
                this.damaged = false;
                this.holdingspace = true;
            }
        });
        document.addEventListener("keyup", (event) => {
            if (event.code == "Space") {
                this.blocking = false;
                this.holdingspace = false
            }
        });
    }
    

    ai = (target) => {
        const randomAction = Math.random(); // Generate a random number between 0 and 1

        // 50% chance to attack, 50% chance to block
        if (randomAction < 0.2) {
            if (new Date() - this.attack_time >= this.atkcldn){
                    this.attack(target);
                    
        }   
        }
        
        
    }
    };


    

    function load_images(range, folder, animations_list) {
        return new Promise((resolve, reject) => {
            let filename;
            let loadedImages = 0;
            for (let i = 1; i <= range; i++) {
                filename = (i < 10) ? `${folder}0${i}.png` : `${folder}${i}.png`;
                let img = new Image();
                img.onload = () => {
                    loadedImages++;
                    console.log(`Image ${filename} loaded. (${loadedImages}/${range})`);
                    
                    if (loadedImages === range) {
                        resolve();
                    }
                };
                img.onerror = (error) => {
                    console.log("error",error)
                }
                img.src = filename;
                animations_list.push(img);
            }
        });
    }
    


//--------------MAIN GAME LOOP ---------------------------
Enemy = new Boxer("Enemy",0, Character_x, enemy_y, 100,5, 8,1000,7,9,6,2,9,'assets/Enemy/stance/Enemy_Stance', 'assets/Enemy/jab/Enemy_Jab', 'assets/Enemy/cross/Enemy_cross', 'assets/Enemy/block/Enemy_block','assets/Enemy/dodge/left/Enemy_dodgeLeft');
Fighter = new Boxer("Fighter",1, Character_x, (canvas.height / 7.16153846154), 100,5, 8,1000,7,10,7,7,2,'assets/Fighter/stance/Fighter_hands', 'assets/Fighter/jab/jab', 'assets/Fighter/cross/cross', 'assets/Fighter/Block/Fighter_Block','assets/Fighter/stance/Fighter_hands');

function loadAllImages() {
    const promises = [
        load_images(Enemy.stnce_rng, Enemy.stnce_folder, Enemy.stance_animation),
        load_images(Enemy.atk1_rng, Enemy.atk1_folder, Enemy.atck1_animations),
        load_images(Enemy.block_rng, Enemy.block_folder, Enemy.block_animations),
        load_images(Enemy.atk2_rng, Enemy.atk2_folder, Enemy.atck2_animations),
        load_images(Enemy.dodgeLeft_rng,Enemy.dodgeLeft_folder,Enemy.dodgeLeft_animations),
        load_images(Fighter.stnce_rng, Fighter.stnce_folder, Fighter.stance_animation),
        load_images(Fighter.atk1_rng, Fighter.atk1_folder, Fighter.atck1_animations),
        load_images(Fighter.block_rng, Fighter.block_folder, Fighter.block_animations),
        load_images(Fighter.atk2_rng, Fighter.atk2_folder, Fighter.atck2_animations),
        load_images(Fighter.dodgeLeft_rng, Fighter.dodgeLeft_folder, Fighter.dodgeLeft_animations)
    ];

    return Promise.all(promises);
}


function drawHealthbar(object,x,y,width,height,moving=0,original_hp = object.hp) {
    let ratio;
    ratio = object.hp / original_hp;
    if (width - moving > Math.round(width * ratio)){
        moving++
    }
    context.beginPath();
    context.fillStyle = "red";
    context.roundRect(x, y, width , height, 6)
    context.fill();
    context.beginPath();
    context.fillStyle = "#06f008";
    context.roundRect(x, y, width - moving,height, 6)
    context.fill();
    window.requestAnimationFrame(() => {drawHealthbar(object,x,y,width,height,moving, original_hp)})
}

function drawall(){
    context.clearRect(0,0,window.width,window.health);
    draw_arena()
    Enemy.draw();
    Fighter.draw()
    window.requestAnimationFrame(drawall)
}
function Game_loop(){

loadAllImages().then(() => {
    loadingScreen.style.display = "none";
    drawall();
    drawHealthbar(Enemy,Enemy.x + (canvas.width / 5.5652173913), Enemy.y + (canvas.height/15.5166666667),(canvas.width / 10.6666666667),(canvas.height / 37.24))
    drawHealthbar(Fighter,Fighter.x + (canvas.width / 6.62068965517), Fighter.y + (canvas.height / 1.24133333333),(canvas.width / 9.14285714286),(canvas.height / 31.0333333333))
    Fighter.moves(Enemy)
    //Enemy.moves(Fighter)
    check_lost()
})}


var conn;

//------------------------------------------------------------

function Online() {
    var peer = new Peer();
    
    var connectButton = document.getElementById("connectButton");
    var Idheader = document.getElementById("idHeader");
    var container = document.getElementById("container");
    var input = document.getElementById("idinput");
    peer.on('open', (id) => {
        Idheader.innerHTML = id;
    });
    connectButton.addEventListener("click", () => {
        var IdToConnect = input.value;
        conn = peer.connect(IdToConnect);
        console.log(IdToConnect);
        conn.on('open', () => {
            console.log("Connection opened!");
        });
    });

    document.addEventListener('keypress', (event) => {
        if ( conn && conn.open) {
            if (event.code === 'KeyJ') {
                if (Fighter.attacking == false && Fighter.dodging == false){
                    if (new Date() - Fighter.attack_time >= Fighter.atckcldn){
                        conn.send("Jab");}}
            } 

            if (event.code ==="KeyK"){
                if (Fighter.attacking==false && Fighter.dodging == false){
                    if (new Date() - Fighter.attack_time2 >= Fighter.atckcldn){
                        conn.send("Cross");
                    }
                }
            }
            if (event.code === "Space"){
                conn.send("Block")
            }
        
            if (event.code ==="KeyA"){ 
                if (new Date() - Fighter.dodging_time >= 500 && Fighter.dodging == false && Fighter.attacking == false){
                    console.log(new Date() - Fighter.dodging_time)
                    console.log("sending left dodge")
                    conn.send('Dodging Right');
            }
            }
            if (event.code==="KeyD"){
                if (new Date() - Fighter.dodging_time >= 500 && Fighter.dodging == false && Fighter.attacking == false){ 
                    console.log(new Date() - Fighter.dodging_time)
                    console.log("sending right dodge")
                    conn.send("Dodging Left");
                    
            }}
        
        }
        else {            
            console.log("No open connection to send ");
            }
        

        
    });

    document.addEventListener('keyup', (event) =>{
        if ( conn && conn.open){
            if (event.code==="Space"){
                conn.send("No Block")
            }
        }
    })

    var ready = document.getElementById("ready"); // Define the ready variable here

    peer.on('connection', (connection) => {
        connection.on('data', (data) => {
            console.log(data)
            if (data == "Jab") {
                Enemy.attack_type = 1;
                Enemy.attack(Fighter);
            }
            if (data=="Cross"){
                Enemy.attack_type = 2;
                Enemy.attack(Fighter);
                
            }
            if (data=="Block"){
                Enemy.blocking = true;
            }
            if (data=="No Block"){
                Enemy.blocking = false;
            }
            if (data=="Dodging Right"){
                console.log("Enemy dodging");
                Enemy.dodge(Fighter,"right");
                setTimeout(() => {Enemy.dodging = false;}, 600)
                }
            if (data=="Dodging Left"){
                console.log("Enemy dodging");
                Enemy.dodge(Fighter,"left");
                setTimeout(() => {Enemy.dodging = false;}, 600)
                
            }
        });
    });

    ready.addEventListener('click', () => {
        if (conn.on) {
            container.parentNode.removeChild(container);
            loadingScreen.style.display = "flex"
        }
        Game_loop();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    Online();
});
