let title = document.querySelector('.title');
let turn = "x";
let squares = [];
function end(num1,num2,num3){
    title.innerHTML = squares[num1] + " winner";
    document.getElementById('item'+num1).style.background = 'red';
    document.getElementById('item'+num2).style.background = 'red';
    document.getElementById('item'+num3).style.background = 'red';
    setInterval(function(){title.innerHTML +=  '.'}, 1000);
    setTimeout(function(){location.reload()}, 4000);
}
function winnner()
{
    for (let i = 1; i <= 9; i++)
    {
        squares[i] = document.getElementById('item' + i).innerHTML;
    }
    if (squares[1] == squares[2] && squares[2] == squares[3] && squares[1] != '')
    {
        end(1,2,3);
    }
    else if(squares[4] == squares[5] && squares[5] == squares[6] && squares[5] != '')
    {
        end(4,5,6);
    }
    else if(squares[7] == squares[8] && squares[8] == squares[9] && squares[8] != '')
    {
        end(7,8,9);
    }
    else if(squares[1] == squares[4] && squares[4] == squares[7] && squares[1] != '')
    {
        end(1,4,7);
    }
    else if(squares[2] == squares[5] && squares[5] == squares[8] && squares[5] != '')
    {
        end(2,5,8);
    }
    else if(squares[3] == squares[6] && squares[6] == squares[9] && squares[1] != '')
    {
        end(3,6,9);
    }
    else if(squares[1] == squares[5] && squares[5] == squares[9] && squares[1] != '')
    {
        end(1,5,9);
    }
    else if(squares[3] == squares[5] && squares[5] == squares[7] && squares[3] != '')
    {
        end(3,5,7);
    }
}
function game(id) 
{
    let element=document.getElementById(id);
    if (turn ==='x' && element.innerHTML == '')
    {
        element.innerHTML = 'X';
        turn = 'o';
        title.innerHTML = 'O';
    }
    else if (turn === 'o' && element.innerHTML == '')
    {
     element.innerHTML = 'O';
     turn = 'x';
     title.innerHTML = 'X';   
    }
    winnner();
    checkDraw();
}
function checkDraw() {
  for (let i = 1; i <= 9; i++) {
    if (document.getElementById('item' + i).innerHTML === '') {
      return; 
    }
  }
  title.innerHTML = "Draw";
  setTimeout(function () {
    location.reload();
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {

  const screen = document.getElementById("screen");

  window.add = function(value){
    screen.value += value;
  }

  window.clearScreen = function(){
    screen.value = "";
  }

  window.calculate = function(){
    try{
      screen.value = eval(screen.value);
    }catch{
      screen.value = "Erreur";
    }
  }

});
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let fireworks = [];
let particles = [];

class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        this.targetY = Math.random() * canvas.height * 0.3 + 50;
        this.speed = 0.01 + Math.random() * 0.02;
        this.progress = 0;
        this.exploded = false;
        this.color = `hsl(${Math.random() * 60 + 10}, 100%, 70%)`;
        this.trail = [];
    }

    update() {
        if (!this.exploded) {
            this.progress += this.speed;
            if (this.progress >= 1) {
                this.explode();
            }
            const currentX = this.x + (this.targetX - this.x) * this.progress;
            const currentY = this.y + (this.targetY - this.y) * this.progress;
            this.trail.push({x: currentX, y: currentY, life: 1});
            if (this.trail.length > 10) this.trail.shift();
        } else {
            particles = particles.filter(p => p.life > 0);
        }
    }

    explode() {
        this.exploded = true;
        const particleCount = 120 + Math.random() * 60;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 4 + Math.random() * 4;
            particles.push(new Particle(
                this.targetX, 
                this.targetY, 
                Math.cos(angle) * velocity,
                Math.sin(angle) * velocity,
                this.color
            ));
        }
    }

    draw() {
        this.trail.forEach((point, index) => {
            const alpha = point.life;
            ctx.save();
            ctx.globalAlpha = alpha * 0.8;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2 + index * 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            point.life -= 0.1;
        });

        if (!this.exploded) {
            ctx.save();
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(
                this.x + (this.targetX - this.x) * this.progress,
                this.y + (this.targetY - this.y) * this.progress,
                2.5 + Math.sin(this.progress * Math.PI * 4) * 1,
                0, Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
        }
    }
}

class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = 1;
        this.color = color;
        this.size = 2 + Math.random() * 2;
        this.gravity = 0.08 + Math.random() * 0.04;
        this.airResistance = 0.98 + Math.random() * 0.01;
    }

    update() {
        this.vx *= this.airResistance;
        this.vy *= this.airResistance;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.015;
        this.size *= 0.99;
    }

    draw() {
        if (this.life > 0) {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0.5, this.size * this.life), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}

function animate() {
    ctx.fillStyle = "rgba(0, 0, 20, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach(fw => {
        fw.update();
        fw.draw();
    });

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    fireworks = fireworks.filter(fw => !fw.exploded || particles.length > 0);

    if (Math.random() < 0.12 && fireworks.length < 4) {
        fireworks.push(new Firework());
    }

    requestAnimationFrame(animate);
}

animate();

function createStars() {
    for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: ${1 + Math.random() * 2}px;
            height: ${1 + Math.random() * 2}px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: twinkle ${10 + Math.random() * 20}s infinite linear;
            box-shadow: 0 0 5px rgba(255,255,255,0.8);
        `;
        document.body.appendChild(star);
    }
}

createStars();

