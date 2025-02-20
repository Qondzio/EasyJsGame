let xp=0;
let health=100;
let gold=0;
let currentWeapon=0;
let inventory=["Stick"];
let monsterHealth=0;
let monsterNumber=0;
let randomNumber=0;
let randomPlayerAttackNumber=0;
let randomMonsterAttackNumber=0;

const button1=document.querySelector("#button1");
const button2=document.querySelector("#button2");
const button3=document.querySelector("#button3");
const text=document.querySelector(".text");
const xpText=document.getElementById("xpText");
const healthText=document.getElementById("healthText");
const goldText=document.getElementById("goldText");
const monsterStats=document.querySelector(".battle");
const monsterNameText=document.getElementById("monsterName");
const monsterHealthText=document.getElementById("monsterHealth");
const locations=[
    {
        name:"town square",
        buttonText:["Go to store", "Go to cave", "Fight dragon"],
        buttonFunction:[goStore, goCave, fightDragon],
        text:"You must defeat the dragon which prevents people from leaving safe in their own town. You are in town square. What do you want to do?"
    },
    {
        name:"store",
        buttonText:["Buy 30 health (10 gold)", "Buy new weapon (50 gold)", "Go to town square"],
        buttonFunction:[buyHealth, buyWeapon, goSquare],
        text:"You are in the shop. What do you want to do? <br> Your current weapon is: " + inventory[0]
    },
    {
        name:"cave",
        buttonText:["Fight with slime (easy)", "Fight with beast (hard)", "Go back to town"],
        buttonFunction:[fightSlime, fightBeast, goSquare],
        text:"You entered the cave. There are some monsters nearby."
    },
    {
        name:"fight",
        buttonText:["Attack", "Escape to town"],
        buttonFunction:[attack, escapeFight],
        text:"You are fighting a monster. Face him by attacking him or escape.",
    },
    {
        name:"game over",
        buttonText:["REPLAY?","REPLAY?","REPLAY?"],
        buttonFunction:[restart,restart,restart],
        text:"YOU DIED. GAME OVER 💀."
    },
    {
        name:"monster killed",
        buttonText:["GO TO TOWN","GO TO TOWN","GO TO TOWN"],
        buttonFunction:[goSquare,goSquare,goSquare],
        text:'The monster screams "Arg!" as it dies. You gained experience points and find some gold.'
    },
    {
        name:"game finished",
        buttonText:["GG","GG","GG"],
        buttonFunction:[restart,restart,restart],
        text:"CONGRATULATIONS !!! YOU FINISHED THE GAME !!! THANKS FOR PLAYING 🎉🎉🎉"
    }
];

const weapons=[
    {
        name:"Stick",
        power:5
    },
    {
        name:" Dagger",
        power:12
    },
    {
        name:" Hammer",
        power:25
    },
    {
        name:" Eternal sword",
        power:60
    }
];

const monsters=[
    {
        name:"Slime",
        level:1,
        health:50,
        power:5
    },
    {
        name:"Beast",
        level:3,
        health:100,
        power:15
    },
    {
        name:"Dragon",
        level:10,
        health:500,
        power:50
    }
]


button1.onclick=goStore;
button2.onclick=goCave;
button3.onclick=fightDragon;


function update(location)
{
    monsterStats.style.display="none";
    button1.innerHTML=location.buttonText[0];
    button2.innerHTML=location.buttonText[1];
    button3.innerHTML=location.buttonText[2];
    text.innerHTML=location.text;

    button1.onclick=location.buttonFunction[0];
    button2.onclick=location.buttonFunction[1];
    button3.onclick=location.buttonFunction[2];

}

function goSquare()
{
    update(locations[0]);
}

function goStore()
{
    update(locations[1]);
}

function goCave()
{
    update(locations[2]);
}

function buyHealth()
{
    if (gold >= 10) 
    {
        gold -= 10;
        health += 30;
        healthText.innerHTML=health;
        goldText.innerHTML=gold;
        text.innerHTML="You just bought some health!";
    }
    else
    {
        text.innerHTML="You do not have enough gold for that.";
    }
}

function buyWeapon()
{
    if (currentWeapon < weapons.length-1) 
    {
        if (gold>=50) 
        {
            gold-=50;
            goldText.innerHTML=gold;
            currentWeapon++;
            text.innerHTML="You just bought a new weapon! <br>Your current weapon is: " + weapons[currentWeapon].name;
            inventory.push(weapons[currentWeapon].name);
            locations[1].text="You are in the shop. What do you want to do? <br> Your current weapon is: " + inventory[inventory.length-1]+ "<br> In your inventory you have: " + inventory;
        }
        else
        {
            text.innerHTML="You do not have enough gold for that.";
        }
    }
    else
    {
        text.innerHTML="You now have the most powerful weapon."
        button2.innerHTML="Sell all other weapons for 45 gold."
        button2.onclick=sellWeapon;
    }
}


function sellWeapon() {
    if (inventory.length>1) 
    {
        gold+=45;
        goldText.innerHTML=gold;
        while (inventory.length>1) 
        {
            inventory.shift(); 
        }
        locations[1].text="You are in the shop. What do you want to do? <br> Your current weapon is: " + inventory[inventory.length-1]+ "<br> In your inventory you have: " + inventory;
        text.innerHTML="You just sold your other weapons.";
    }
    else
    {
        text.innerHTML="You cannot sell your only weapon."
    }
    
}


function fightSlime()
{
    fight(monsters[0]);
    monsterNumber=0;
}

function fightBeast()
{
    fight(monsters[1]);
    monsterNumber=1;
}

function fightDragon()
{
    fight(monsters[2]);
    monsterNumber=2;
    text.innerText="YOU ARE FIGHTING THE DRAGON !!! FIGHT FOR LIFE AND DEATH ⚔️.";
}

function fight(monster)
{
    update(locations[3]);
    button3.style.display="none";
    monsterStats.style.display = "block";
    
    monsterNameText.innerText=monster.name;
    monsterHealthText.innerText=monster.health;
    monsterHealth=monster.health;

    button1.onclick=attack;
    button2.onclick=escapeFight;
}


function attack()
{
    randomPlayerAttackNumber=((Math.floor(Math.random()*10))+weapons[currentWeapon].power)+xp;
    randomMonsterAttackNumber=((Math.floor(Math.random()*3))+monsters[monsterNumber].power);

    monsterHealth-=randomPlayerAttackNumber;
    monsterHealthText.innerText=monsterHealth;

    health-=randomMonsterAttackNumber;
    healthText.innerText=health;

    if (health<=0) 
    {
        lose();
    }
    else if (monsterHealth<=0)
    {
        if (monsterNumber==2) 
        {
            winGame();
        } 
        else 
        {
            monsterKilled();
        }
    }
    else
    {
        text.innerText="You hit a "+monsters[monsterNumber].name+" for "+randomPlayerAttackNumber+". He hits you for "+randomMonsterAttackNumber;
    }
}


function monsterKilled()
{
    update(locations[5]);
    monsterStats.style.display = "block";
    button3.style.display="inline-block";

    gold+=20*monsters[monsterNumber].level;
    goldText.innerText=gold;

    xp+=monsters[monsterNumber].level;
    xpText.innerText=xp;
}

function escapeFight()
{
    button3.style.display="inline-block";
    update(locations[0]);
}

function lose()
{
    update(locations[4]);
    monsterStats.style.display = "block";
    button3.style.display="inline-block";
}

function restart()
{
    xp=0;
    health=100;
    gold=0;
    currentWeapon=0;
    inventory=["Stick"];

    xpText.innerText="0";
    healthText.innerText="100";
    goldText.innerText="0";

    goSquare();
}

function winGame()
{
    update(locations[6]);
    button3.style.display="inline-block"
    text.innerText="CONGRATULATIONS !!! YOU FINISHED THE GAME !!! THANKS FOR PLAYING 🎉🎉🎉"
}