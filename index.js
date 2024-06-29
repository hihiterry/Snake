
let playerHeadX_num = 8;
let playerHeadY_num = 8;
let bodyPosition_nums=[7,8,6,8];
let bodyLength_num=3;
let toward_str="right";
let gameState_num=-1;//-1遊戲尚未開始,0正在運行,1失敗,2勝利
let foodX_num,foodY_num;
let isGrow_bool=false;

//開啟時執行一次
addBlocksToHTML();
initialize();
displayMap();

//固定執行
setInterval(update, 200);

//刷新
function update() {
    if(gameState_num!==0){
        return;
    }
    movePlayer();
    eatFood();
    isWin();
    gameOverCheck();
    if(gameState_num===0){
        displayMap();
    }
    setScoreText();
}

//初始化
function initialize() {
    playerHeadX_num = 8;
    playerHeadY_num = 8;
    bodyPosition_nums=[7,8,6,8];
    bodyLength_num=3;
    toward_str="right";
    gameState_num=-1;
    isGrow_bool=false;
    generateFood();
    displayMap();
    setScoreText();
}

//遊戲勝利判定
function isWin() {
    if(bodyLength_num===289){
        gameState_num=2;
    }
}

//遊戲結束判定
function gameOverCheck(){
    if (playerHeadX_num < 0 || playerHeadX_num >= 17 || playerHeadY_num < 0 || playerHeadY_num >= 17) {
        gameState_num = 1;
    }
    for (let i_num = 0; i_num < bodyPosition_nums.length; i_num += 2) {
        if (bodyPosition_nums[i_num] === playerHeadX_num && bodyPosition_nums[i_num + 1] === playerHeadY_num) {
            gameState_num = 1;
        }
    }
}

//移動
function movePlayer(){
    if(isGrow_bool){
        bodyPosition_nums.unshift(-1);
        bodyPosition_nums.unshift(-1);
        isGrow_bool=false;
        bodyPosition_nums[0] = playerHeadX_num;
        bodyPosition_nums[1] = playerHeadY_num;
    }
    else{
        for (let i_num = bodyPosition_nums.length - 1; i_num > 0; i_num -= 2) {
            bodyPosition_nums[i_num] = bodyPosition_nums[i_num - 2];
            bodyPosition_nums[i_num - 1] = bodyPosition_nums[i_num - 3];
        }
    }
    bodyPosition_nums[0] = playerHeadX_num;
    bodyPosition_nums[1] = playerHeadY_num;
    switch (toward_str) {   
        case 'up':
            playerHeadY_num--;
            break;
        case 'down':
            playerHeadY_num++;
            break;
        case 'left':
            playerHeadX_num--;
            break;
        case 'right':
            playerHeadX_num++;
            break;
    }
}

//吃食物
function eatFood(){
    if(playerHeadX_num!==foodX_num || playerHeadY_num!==foodY_num){
        return;
    }
    isGrow_bool=true;
    bodyLength_num++;
    generateFood();
}

//生成食物
function generateFood(){
    let tempFoodX_num, tempFoodY_num;
    do {
        tempFoodX_num = Math.floor(Math.random() * 17);
        tempFoodY_num = Math.floor(Math.random() * 17);
    } while (isFoodOnSnake_check(tempFoodX_num, tempFoodY_num));
    document.getElementById(`Block${tempFoodX_num}-${tempFoodY_num}`).style.backgroundColor = "yellow";
    foodX_num = tempFoodX_num;
    foodY_num = tempFoodY_num;
}

//判斷食物是否與身體重疊
function isFoodOnSnake_check(x_num, y_num) {
    for (let i_num = 0; i_num < bodyPosition_nums.length; i_num += 2) {
        if (bodyPosition_nums[i_num] === x_num && bodyPosition_nums[i_num + 1] === y_num) {
            return true;
        }
    }
    return false;
}

//設定分數
function setScoreText() {
    if(gameState_num===1){
        document.getElementById("score").textContent=`LENGTH:${bodyLength_num} YOU DIED`;
    }
    else if(gameState_num===2){
        document.getElementById("score").textContent=`LENGTH:${bodyLength_num} YOU WIN`;
    }
    else{
        document.getElementById("score").textContent=`LENGTH:${bodyLength_num}`;
    }
}

//顯示地圖
function displayMap() {
    for(let i_num=0;i_num<289;i_num++){
        document.getElementById("Block"+String(Math.floor(i_num/17))+"-"+String(i_num%17)).style.backgroundColor= i_num%2===0 ? `rgb(0, 180, 0)` : `rgb(0, 220, 0)`;
    }
    document.getElementById(`Block${foodX_num}-${foodY_num}`).style.backgroundColor = "yellow";
    for (let i_num = 0; i_num < bodyPosition_nums.length; i_num += 2) {
        document.getElementById(`Block${bodyPosition_nums[i_num]}-${bodyPosition_nums[i_num+1]}`).style.backgroundColor = (i_num/2)%2===0 ?`rgb(0, 0, 200)`:`rgb(0, 0, 250)`;
    }
    document.getElementById(`Block${playerHeadX_num}-${playerHeadY_num}`).style.backgroundColor = "red";
    if(gameState_num===1){
        document.getElementById("score").textContent=`LENGTH:${bodyLength_num} YOU DIED`;
    }
    else if(gameState_num===2){
        document.getElementById("score").textContent=`LENGTH:${bodyLength_num} YOU WIN`;
    }
    else{
        document.getElementById("score").textContent=`LENGTH:${bodyLength_num}`;
    }
    
}


//生成背景方塊
function addBlocksToHTML(){
    for(let i_num=0;i_num<289;i_num++){
        let newBlock=document.createElement('div');
        newBlock.id="Block"+String(Math.floor(i_num/17))+"-"+String(i_num%17);
        newBlock.style.backgroundColor= i_num%2===0 ? `rgb(0, 180, 0)` : `rgb(0, 220, 0)`;
        newBlock.style.gridColumn=Math.floor(i_num/17)+1;
        newBlock.style.gridRow=i_num%17+1;
        newBlock.className='backGroundBlock';
        document.getElementById("gameBoard").appendChild(newBlock);
    }
}

//處理點擊事件
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', function(event) {
        if(gameState_num===0){
            switch(event.key) {
                case 'ArrowUp':
                    if (toward_str!="down") toward_str="up";
                    break;
                case 'ArrowDown':
                    if (toward_str!="up") toward_str="down";
                    break;
                case 'ArrowLeft':
                    if (toward_str!="right") toward_str="left";
                    break;
                case 'ArrowRight':
                    if (toward_str!="left") toward_str="right";
                    break;
            }
        }
        else{
            if(gameState_num===1 || gameState_num===2){
                gameState_num=-1;
                initialize();
            }
            else{
                gameState_num=0;
            }
        }
    });
});

//手機遊玩
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

let xStart_num = null;
let yStart_num = null;

function handleTouchStart(event) {
    if(gameState_num===0){
        const firstTouch = event.touches[0];
        xStart_num = firstTouch.clientX;
        yStart_num = firstTouch.clientY;
    }
    else{
        if(gameState_num===1 || gameState_num===2){
            gameState_num=-1;
            initialize();
        }
        else{
            gameState_num=0;
        }
    }
}

function handleTouchMove(event) {
    event.preventDefault();
    if(gameState_num===0){
        if (!xStart_num || !yStart_num) {
            return;
        }
    
        let xEnd_num = event.touches[0].clientX;
        let yEnd_num = event.touches[0].clientY;
    
        let xDiff_num = xStart_num - xEnd_num;
        let yDiff_num = yStart_num - yEnd_num;
    
        if (Math.abs(xDiff_num) > Math.abs(yDiff_num)) {
            if (xDiff_num > 0) {
                if (toward_str!="right") toward_str="left";
            } else {
                if (toward_str!="left") toward_str="right";
            }
        } else {
            if (yDiff_num > 0) {
                if (toward_str!="down") toward_str="up";
            } else {
                if (toward_str!="up") toward_str="down";
            }
        }
        xStart_num = null;
        yStart_num = null;
    }
    else{
        if(gameState_num===1 || gameState_num===2){
            gameState_num=-1;
            initialize();
        }
        else{
            gameState_num=0;
        }
    }
}