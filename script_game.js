'use strict'
var game = function(){
/////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////////////////
var frame = document.getElementById('frame');
var spriteBalloon = document.getElementById('sprite-balloon');
var player = document.getElementById('player');
player.style.top = 0;
player.style.left = 0;
var skills, airplanes, paperplanes, drones;
var airplaneId, paperplaneId, droneId;
var skillId, spriteDroneId;
var life = 3;
var score = 0;
      
//////////////////////////////////////////////// GAME //////////////////////////////////////////////////////////////////////////////

// ON PAGE LOAD //
window.addEventListener('load', function() {
    var idKey;
    animateSky(); //see FUNCTIONS part below
    balloon.animateSprite();
    play();

    // ON KEYDOWN - BALLOON ANIMATION
    window.addEventListener('keydown', function(event){
        var code = event.keyCode;
        switch(code){
        case 37:
            if (idKey) {
                clearInterval(idKey) 
            }
            idKey = setInterval(function(){
                balloon.animateLeft(-15, '0px');
            }, 50);     
        break;
        case 38:
            if (idKey) {
                clearInterval(idKey) 
            }
            idKey = setInterval(function(){
                balloon.animateTop(-15, '0px');
            }, 50);    
        break;
        case 39:
            if (idKey) {
                clearInterval(idKey) 
            }
            idKey = setInterval(function(){
                balloon.animateLeft(15, '620px');
            }, 40); 
        break;
        case 40:
            if (idKey) {
                clearInterval(idKey) 
            }
            idKey = setInterval(function(){
                balloon.animateTop(15, (frame.offsetHeight - 134));
            }, 50);
        break;
        };
    });

    // ON KEY UP
    window.addEventListener('keyup', function(event){
        switch(event.keyCode){
            case 37:
            clearInterval(idKey);
            break;
            case 38:
            clearInterval(idKey);
            break;
            case 39:
            clearInterval(idKey);
            break;
            case 40:
            clearInterval(idKey);
            break;
        }
    })
}); 

///////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////////////////////
// SKY ANIMATION
var animateSky = function() {
    var i = 0;
    setInterval(function() {
    document.getElementById('sky').style.backgroundPosition = i + 'px';
        i++;
    }, 40);
};

// PLAYER BALLOON
var balloon = {
    W: 80,
    H: 134,
    animateSprite: function() {
        var i = 1;
        setInterval(function() {
            if (i < 6) {
                spriteBalloon.style.left = (i * -80) + 'px';
                i++;
            } else {
                spriteBalloon.style.left = (i * -80) + 'px';
                i = 1;
            }  
        }, 100);
    },
    animateLeft: function(a, b) {
        var result = parseInt(player.style.left);
        result += a;
        player.style.left = result + 'px';
        //collision check with frame left & right
        if (player.style.left < '0px' || (player.offsetLeft + this.W) >= 600) {
            player.style.left = b;
        }
    },
    animateTop: function(a, b) {
        var result = parseInt(player.style.top);
        result += a;
        player.style.top = result + 'px';
        //collision check with frame top & bottom
        if (player.style.top < '0px' || player.offsetTop + this.H >= frame.offsetHeight) {
            player.style.top = b;
        }
    },
};

// PLAY
var play = function() {
    var newDiv = document.createElement('div');
    var button = frame.appendChild(newDiv);
    button.setAttribute('id', 'play');
    seeResume(); //see below
    document.getElementById('play').addEventListener('click', function() {
        frame.removeChild(button);
        frame.removeChild(document.getElementById('cv'));
        ennemyRelease(); //see below
        skillsRelease(); //see below
    });
};

// SEE RESUME
var seeResume = function() {
    var newImg = document.createElement('img');
    var button = document.getElementById('cv').appendChild(newImg);
    button.setAttribute('src', 'src/img/see-cv-150.png');
    document.getElementById('cv').setAttribute('href', 'src/cv_arc.pdf');
    document.getElementById('cv').setAttribute('target', 'blank');
};
 
// ENNEMIES RELEASE
var ennemyRelease = function() {
    airplaneId = setInterval(function() { //launching an airplane every 15s
        AirplaneFactory().init(Math.round(Math.random() * (750 - 102) + 102) + 'px');
    }, 15000);
    
    paperplaneId = setInterval(function(){ //launching a paperplane every 8s
        PaperplaneFactory().init(Math.round(Math.random() * (750 - 102) + 102) + 'px');
    }, 8000);

    droneId = setInterval(function(){ //launching a drone every 12s
        DroneFactory().init(Math.round(Math.random() * (750 - 102) + 102) + 'px');
    }, 12000);
};

// SKILLS RELEASE
var skillsRelease = function() {
    setTimeout(function() {
        arraySkills[0].animateSkill('html5'); //launching the first skill
    }, 10000);
};

//YOU WIN
var youWin = function() {
    clearInterval(airplaneId); // stops creating ennemies
    clearInterval(paperplaneId);
    clearInterval(droneId);
    var newDiv = document.createElement('div');
    var button = frame.appendChild(newDiv);
    button.setAttribute('id', 'youwin');
    document.getElementById('youwin').addEventListener('click', function() {
        //retour au site
    })
}

//LIFE LOST
var lostLife = function() {
    player.style.display = 'none'; // balloon disappears and retrieves initial position
    player.style.top = 0;
    player.style.left = 0;
    var button;
    if (life === 1) { // specific button according to the balloon lost
        button = document.getElementById('lostlife1');
    } else {
        if (life === 2) {
            button = document.getElementById('lostlife2');
        } else {
            if (life === 3) {
                button = document.getElementById('lostlife3');
            }
        }
    }
    button.style.display = 'block';
    setTimeout(function() {
        button.style.display = 'none';
    }, 2000);
};

//GAME OVER
var gameOver = function() {
    var newDiv = document.createElement('div');
    var button = frame.appendChild(newDiv);
    button.setAttribute('id', 'gameover');
    setTimeout(function() {frame.removeChild(document.getElementById('gameover'))}, 3000);
};

//REPLAY
var replay = function() {
    var newDiv = document.createElement('div');
    var button = frame.appendChild(newDiv);
    button.setAttribute('id', 'replay');
};
//////////////////////////////////////// FACTORIES /////////////////////////////////////////////////////////

// SKILLS FACTORY
var SkillFactory = (function() {
    //declaring constructor function
    var SkillsConstructor = function() {
        this.W = 34,
        this.H = 38
    };

    //methods in prototype
    SkillsConstructor.prototype.addSkill = function(img, topVal) {
        var newDiv = document.createElement('div');
        var skillAdd = document.getElementById('frame').appendChild(newDiv);
        skillAdd.setAttribute('class', 'skill' );
        skillAdd.style.background = "url('src/img/skills/" + img + ".png')";
        skillAdd.style.top = topVal;
        skillAdd.style.left = '-40px';
        return this;
    };

    SkillsConstructor.prototype.animateSkill = function(img) {
        skills = document.getElementsByClassName('skill');
        var that = this;
            skillId = setInterval(function() { //moving the div just created to the right
                var result = parseInt(skills[0].style.left);
                result += 1;
                skills[0].style.left = result + 'px'; 
                if (skills[0].offsetLeft === 900) { //if div out of limits, returns to initial position
                    skills[0].style.left = -10
                }
                that.checkCollisions(img); 
            }, 40);
        return this;
    };

    SkillsConstructor.prototype.checkCollisions = function(img) {
        skills = document.getElementsByClassName('skill');
            var skillX = skills[0].offsetLeft;
            var skillY = skills[0].offsetTop;
            var skillW = skills[0].offsetWidth;
            var skillH = skills[0].offsetHeight;
            var balloonX = player.offsetLeft;
            var balloonY = player.offsetTop;
            if (balloonY <= skillY + this.H && balloonX + balloon.W >= skillX && balloonY + balloon.H >= skillY && balloonX <= skillX + this.W) { //collision
                score++;
                console.log('et paf');
                frame.removeChild(skills[0]);//removing div
                arraySkills.splice(0, 1);//removing object from arraySkills
                arrayImg.splice(0, 1);//removing img from arrayImg
                document.getElementById(img).style.display = 'block'; //displaying matching div in skills button
                clearInterval(skillId); //stopping div's movement
                if (skills[0] != undefined) {
                    setTimeout(function() {arraySkills[0].animateSkill(arrayImg[0]);}, 5000); //launching animation for next skill
                }
                if (score === 6) {
                    console.log('gagné');
                    youWin();
                }
            }
        return this;
    };
    return function() {
        return new SkillsConstructor();
    }
}()); //end of factory

// ARRAY OF SKILLS
var arraySkills = [
    SkillFactory().addSkill('html5', '652px'),
    SkillFactory().addSkill('css3', '179px'),
    SkillFactory().addSkill('js', '670px'),
    SkillFactory().addSkill('angular', '250px'),
    SkillFactory().addSkill('node', '460px'),
    SkillFactory().addSkill('mongo', '36px')
];

// ARRAY OF SKILLS IMAGES
var arrayImg = ['html5', 'css3', 'js', 'angular', 'node', 'mongo'];

//////////////////////////////////////// AIRPLANE FACTORY /////////////////////////////////////////////////////////
var AirplaneFactory = (function(){
    //declaring constructor function
    var AirplaneConstructor = function() {
        this.W = 300,
        this.H = 91
    };

    //methods in prototype
    AirplaneConstructor.prototype.init = function(a) {
        var newDiv = document.createElement('div');
        var divAirplane = frame.appendChild(newDiv);
        divAirplane.setAttribute('class', 'airplane' );
        divAirplane.style.top = a;
        this.animate();
        return this;
    },

    AirplaneConstructor.prototype.animate = function() {
        airplanes = document.getElementsByClassName('airplane');
        airplanes[0].style.left = 600;
        airplanes[0].style.width = 300;
        var that = this;
        var airplaneId = setInterval(function() { // moving div
            var result = parseInt(airplanes[0].style.left);
            result -= 5;
            airplanes[0].style.left = result + 'px';
            // if airplane out of limits, div removed and interval cleared
            if (airplanes[0].offsetLeft === -300) {
                frame.removeChild(airplanes[0]);
                clearInterval(airplaneId)
            } else {
                // check collisions
                that.checkCollisions();  
            }          
        }, 50);
        return this;
    },

    AirplaneConstructor.prototype.checkCollisions = function() {
        airplanes = document.getElementsByClassName('airplane');
        var airplaneX = airplanes[0].offsetLeft;
        var airplaneY = airplanes[0].offsetTop;
        var balloonX = player.offsetLeft;
        var balloonY = player.offsetTop;
        if (balloonY <= airplaneY + this.H && balloonX + balloon.W >= airplaneX && balloonY + 102 >= airplaneY && balloonX <= airplaneX + this.W) { //collision
            if (life === 1) {
                player.style.display = 'none';
                document.getElementById('star1').style.display = "none";
                lostLife();
                setTimeout(function(){gameOver()}, 3000);
                setTimeout(function(){replay()}, 6000);
            } else {
                if (life === 2) {
                    lostLife();
                    life--;
                    spriteBalloon.setAttribute('src', 'src/img/sprite-crazy-orange-80x134.png'); //balloon changes color
                    document.getElementById('star2').style.display = "none"; //life star disappears
                    setTimeout(function(){player.style.display = 'block';}, 3000);
                } else {
                    if (life === 3) {
                        lostLife();
                        life--;
                        spriteBalloon.setAttribute('src', 'src/img/sprite-crazy-purple-80x134.png');
                        document.getElementById('star3').style.display = "none";
                        setTimeout(function(){player.style.display = 'block';}, 3000);
                    }
                }
            }
        }
        return this;
    }
    return function() {
        return new AirplaneConstructor();
    }
}()); // end of factory

//////////////////////////////////////// PAPERPLANE FACTORY /////////////////////////////////////////////////////////
var PaperplaneFactory = (function() {
    //declaring constructor function
    var PaperplaneConstructor = function() {
        this.W = 100,
        this.H = 62
    };

    //methods in prototype
    PaperplaneConstructor.prototype.init = function(a) {
        var newDiv = document.createElement('div');
        var divPaperplane = frame.appendChild(newDiv);
        divPaperplane.setAttribute('class', 'paperplane' );
        divPaperplane.style.top = a;
        this.animate();
        return this;
    },

    PaperplaneConstructor.prototype.animate = function() {
        paperplanes = document.getElementsByClassName('paperplane');
        paperplanes[0].style.left = 800;
        paperplanes[0].style.width = 100;
        paperplanes[0].style.height = 62;
        var that = this;
        var idPaperplane = setInterval(function() { //moving div
            var result = parseInt(paperplanes[0].style.left);
            result -= 5;
            paperplanes[0].style.left = result + 'px';
            // if paperplane out of limits, div removed and interval cleared
            if (paperplanes[0].offsetLeft === -100) {
                frame.removeChild(paperplanes[0]);
                clearInterval(idPaperplane);
            } else {
                that.checkCollisions();
            }
        }, 40);
        return this;
    },

    PaperplaneConstructor.prototype.checkCollisions = function() {
        paperplanes = document.getElementsByClassName('paperplane');
        var paperplaneX = paperplanes[0].offsetLeft;
        var paperplaneY = paperplanes[0].offsetTop;
        var balloonX = player.offsetLeft;
        var balloonY = player.offsetTop;
        if (balloonY <= paperplaneY + this.H && balloonX + balloon.W >= paperplaneX && balloonY + 102 >= paperplaneY && balloonX <= paperplaneX + this.W) { //collision
            if (life === 1) {
                player.style.display = 'none';
                document.getElementById('star1').style.display = "none";
                lostLife();
                setTimeout(function(){gameOver()}, 3000);
                setTimeout(function(){replay()}, 6000);
            } else {
                if (life === 2) {
                    lostLife();
                    life--;
                    spriteBalloon.setAttribute('src', 'src/img/sprite-crazy-orange-80x134.png'); //balloon changes color
                    document.getElementById('star2').style.display = "none"; //life star disappears
                    setTimeout(function(){player.style.display = 'block';}, 3000);  
                } else {
                    if (life === 3) {
                        lostLife();
                        life--;
                        spriteBalloon.setAttribute('src', 'src/img/sprite-crazy-purple-80x134.png');
                        document.getElementById('star3').style.display = "none";
                        setTimeout(function(){player.style.display = 'block';}, 3000);
                    }
                }
            }
        }
        return this;
    }
    return function() {
        return new PaperplaneConstructor();
    }
}()); //end of factory

/////////////////////////////////////// DRONE FACTORY /////////////////////////////////////////////////////////
var DroneFactory = (function() {
    //declaring constructor function
    var DroneConstructor = function() {
        this.W = 150,
        this.H = 42
    };

    //methods in prototype
    DroneConstructor.prototype.init = function(a) {
        var newDiv = document.createElement('div');
        var divDrone = frame.appendChild(newDiv);
        divDrone.setAttribute('class', 'drone' );
        divDrone.style.top = a;
        this.animateSprite();
        this.animate();
        return this;        
    },

    DroneConstructor.prototype.animateSprite = function() {
        var i = 1;
        drones = document.getElementsByClassName('drone');
        spriteDroneId = setInterval(function() {
            if (i < 4) {
                drones[0].style.backgroundPosition = (i * -150) + 'px';
                i++;
            } else {
                drones[0].style.backgroundPosition = (i * -150) + 'px';
                i = 1;
            }
        }, 50);
    },

    DroneConstructor.prototype.animate = function() {
        drones = document.getElementsByClassName('drone');
        drones[0].style.left = -40;
        drones[0].style.width = 150;
        drones[0].style.height = 42;
        var that = this;
        var idDrone = setInterval(function() { 
            var result = parseInt(drones[0].style.left);
            result += 5;
            drones[0].style.left = result + 'px';
            // if drone out of limits, div removed and interval cleared
            if (drones[0].offsetLeft === 800) {
                frame.removeChild(drones[0]);
                clearInterval(idDrone);
                clearInterval(spriteDroneId);
            } else {
                that.checkCollisions();
            }
        }, 40);
        return this;
    },

    DroneConstructor.prototype.checkCollisions = function() {
        drones = document.getElementsByClassName('drone');
        var droneX = drones[0].offsetLeft;
        var droneY = drones[0].offsetTop;
        var balloonX = player.offsetLeft;
        var balloonY = player.offsetTop;
        if (balloonY <= droneY + this.H && balloonX + balloon.W >= droneX && balloonY + 102 >= droneY && balloonX <= droneX + this.W) {
            if (life === 1) {
                player.style.display = 'none';
                document.getElementById('star1').style.display = "none";
                lostLife();
                setTimeout(function(){gameOver()}, 3000);
                setTimeout(function(){replay()}, 6000);
            } else {
                if (life === 2) {
                    lostLife();
                    life--;
                    spriteBalloon.setAttribute('src', 'src/img/sprite-crazy-orange-80x134.png'); //balloon changes color
                    document.getElementById('star2').style.display = "none"; //life star disappears
                    setTimeout(function(){player.style.display = 'block';}, 3000);
                    
                } else {
                    if (life === 3) {
                        lostLife();
                        life--;
                        spriteBalloon.setAttribute('src', 'src/img/sprite-crazy-purple-80x134.png');
                        document.getElementById('star3').style.display = "none";
                        setTimeout(function(){player.style.display = 'block';}, 3000);
                    }
                }
            }
        }
        return this;
    }
    return function() {
        return new DroneConstructor();
    }
}()); //end of factory
}(); //end of code