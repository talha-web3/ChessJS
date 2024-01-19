const boardElem=document.getElementById('chessBoard');
const playerElem=document.getElementById('player');
const infoElem=document.getElementById('addInfo');
const allPieces=document.querySelectorAll('.piece');
const width=8;

let playerGo='white';
playerElem.innerText=playerGo;

const startPieces=[
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook,
]

// Creating the chess board
function createBoard(){
    startPieces.forEach((startPiece, i)=>{
    const square=document.createElement('div');
    square.classList.add('square');
    square.innerHTML=startPiece;
    if(square.firstChild){
        square.firstChild.setAttribute('draggable', true);
    }

    const row=Math.floor(((63-i) /8) +1);

    if(row%2===0){
        if(i%2===0){
        square.classList.add('beige');
        }
        else{
        square.classList.add('brown');
        }
    }
    else{
        if(i%2===0){
            square.classList.add('brown');
        }
        else{
            square.classList.add('beige');
        }
    }

    if(i<=15){
        square.firstChild.firstChild.classList.add('black');
    }

    if(i>=48){
        square.firstChild.firstChild.classList.add('white');
    }

    square.setAttribute('square-id', 63-i)

    boardElem.append(square);
})
}

createBoard();

const allSquares=document.querySelectorAll('.square');

allSquares.forEach((square)=>{
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
})

let startPositionId;
let draggedElement;

function dragStart(event){
    draggedElement=event.target;
    startPositionId=draggedElement.parentNode.getAttribute('square-id');
}


function dragOver(event){
    event.preventDefault();
}

let dropPosition;

function dragDrop(event){
    dropPosition=event.target;
    event.stopPropagation();

    const correctGo=draggedElement.firstChild.classList.contains(playerGo);
    const taken=event.target.classList.contains('piece');
    const opponentGo=playerGo==='white'?'black':'white';
    const takenByOpponent=event.target.firstChild?.classList.contains(opponentGo);

    if(correctGo){
        if(takenByOpponent && validMove()){
            event.target.parentNode.append(draggedElement);
            event.target.remove();
            checkForWin();
            playerGoChange();
            return;
        }
        if(taken && !takenByOpponent){
            infoElem.textContent='illegal move';
            setTimeout(()=>infoElem.textContent='', 2000);
            return;
        }
        if(validMove()){
            event.target.append(draggedElement);
            checkForWin();
            playerGoChange();
            return;
        }
    }
}

function playerGoChange(){
    if(playerGo==='white'){
        playerGo='black';
        playerElem.innerText=playerGo;
        reverseIds();
    }
    else{
        playerGo='white'
        playerElem.innerText=playerGo;
        revertIds();
    }
}

function reverseIds(){
    const allSquares=document.querySelectorAll('.square');
    allSquares.forEach((square, i)=>square.setAttribute('square-id', i));
}

function revertIds(){
    const allSquares=document.querySelectorAll('.square');
    allSquares.forEach((square, i)=>square.setAttribute('square-id', 63-i));
}

// Valid Moves
function validMove(){
    const opponentGo=playerGo==='white' ? 'black':'white';
    const startId=Number(startPositionId);
    const targetId=Number(dropPosition.parentNode.getAttribute('square-id')) || Number(dropPosition.getAttribute('square-id'));
    const piece=draggedElement.id;

    switch(piece){
    case 'pawn': 
    const starterRow=[8, 9, 10, 11, 12, 13, 14, 15];
    if(
    starterRow.includes(startId) && startId + width *2 === targetId && !document.querySelector(`[square-id="${targetId}"]`).firstChild
    || startId + width === targetId && !dropPosition.firstChild
    || startId + width -1 === targetId && document.querySelector(`[square-id="${startId + width -1}"]`).firstChild.firstChild.classList.contains(opponentGo)
    || startId + width +1 === targetId && document.querySelector(`[square-id="${startId + width +1}"]`).firstChild.firstChild.classList.contains(opponentGo)
    ){
    return true
    }
    break;

    case 'knight':
    if(
    startId + width *2 + 1=== targetId 
    || startId + width *2 - 1=== targetId
    || startId + width + 2 === targetId
    || startId + width - 2 === targetId
    || startId - width *2 + 1=== targetId
    || startId - width *2 - 1=== targetId
    || startId - width + 2 === targetId 
    || startId - width - 2 === targetId 
    ){
    return true
    }
    break;

    case 'bishop':
    if(
    startId+width+1===targetId
    || startId+width*2+2===targetId && !document.querySelector(`[square-id="${startId+width+1}"]`).firstChild
    || startId+width*3+3===targetId && !document.querySelector(`[square-id="${startId+width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2+2}"]`).firstChild
    || startId+width*4+4===targetId && !document.querySelector(`[square-id="${startId+width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3+3}"]`).firstChild
    || startId+width*5+5===targetId && !document.querySelector(`[square-id="${startId+width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3+3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4+4}"]`).firstChild 
    || startId+width*6+6===targetId && !document.querySelector(`[square-id="${startId+width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3+3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4+4}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*5+5}"]`).firstChild 
    || startId+width*7+7===targetId && !document.querySelector(`[square-id="${startId+width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3+3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4+4}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*5+5}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*6+6}"]`).firstChild
    //
    || startId-width-1===targetId
    || startId-width*2-2===targetId && !document.querySelector(`[square-id="${startId-width-1}"]`).firstChild
    || startId-width*3-3===targetId && !document.querySelector(`[square-id="${startId-width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2-2}"]`).firstChild
    || startId-width*4-4===targetId && !document.querySelector(`[square-id="${startId-width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3-3}"]`).firstChild
    || startId-width*5-5===targetId && !document.querySelector(`[square-id="${startId-width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3-3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4-4}"]`).firstChild 
    || startId-width*6-6===targetId && !document.querySelector(`[square-id="${startId-width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3-3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4-4}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*5-5}"]`).firstChild 
    || startId-width*7-7===targetId && !document.querySelector(`[square-id="${startId-width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3-3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4-4}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*5-5}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*6-6}"]`).firstChild
    //
    || startId-width+1===targetId
    || startId-width*2+2===targetId && !document.querySelector(`[square-id="${startId-width+1}"]`).firstChild
    || startId-width*3+3===targetId && !document.querySelector(`[square-id="${startId-width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2+2}"]`).firstChild
    || startId-width*4+4===targetId && !document.querySelector(`[square-id="${startId-width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3+3}"]`).firstChild
    || startId-width*5+5===targetId && !document.querySelector(`[square-id="${startId-width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3+3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4+4}"]`).firstChild 
    || startId-width*6+6===targetId && !document.querySelector(`[square-id="${startId-width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3+3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4+4}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*5+5}"]`).firstChild 
    || startId-width*7+7===targetId && !document.querySelector(`[square-id="${startId-width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3+3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4+4}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*5+5}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*6+6}"]`).firstChild
    //
    || startId+width-1===targetId
    || startId+width*2-2===targetId && !document.querySelector(`[square-id="${startId+width-1}"]`).firstChild
    || startId+width*3-3===targetId && !document.querySelector(`[square-id="${startId+width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2-2}"]`).firstChild
    || startId+width*4-4===targetId && !document.querySelector(`[square-id="${startId+width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3-3}"]`).firstChild
    || startId+width*5-5===targetId && !document.querySelector(`[square-id="${startId+width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3-3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4-4}"]`).firstChild 
    || startId+width*6-6===targetId && !document.querySelector(`[square-id="${startId+width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3-3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4-4}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*5-5}"]`).firstChild 
    || startId+width*7-7===targetId && !document.querySelector(`[square-id="${startId+width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3-3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4-4}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*5-5}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*6-6}"]`).firstChild
    ){
    return true
    }
    break;

    case 'rook':
    if(
    startId+width===targetId
    || startId+width*2===targetId && !document.querySelector(`[square-id="${startId+width}"]`).firstChild
    || startId+width*3===targetId && !document.querySelector(`[square-id="${startId+width}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2}"]`).firstChild
    || startId+width*4===targetId && !document.querySelector(`[square-id="${startId+width}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3}"]`).firstChild
    || startId+width*5===targetId && !document.querySelector(`[square-id="${startId+width}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4}"]`).firstChild
    || startId+width*6===targetId && !document.querySelector(`[square-id="${startId+width}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*5}"]`).firstChild
    || startId+width*7===targetId && !document.querySelector(`[square-id="${startId+width}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*5}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*6}"]`).firstChild
    //
    || startId-width===targetId
    || startId-width*2===targetId && !document.querySelector(`[square-id="${startId-width}"]`).firstChild
    || startId-width*3===targetId && !document.querySelector(`[square-id="${startId-width}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2}"]`).firstChild
    || startId-width*4===targetId && !document.querySelector(`[square-id="${startId-width}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3}"]`).firstChild
    || startId-width*5===targetId && !document.querySelector(`[square-id="${startId-width}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4}"]`).firstChild
    || startId-width*6===targetId && !document.querySelector(`[square-id="${startId-width}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*5}"]`).firstChild
    || startId-width*7===targetId && !document.querySelector(`[square-id="${startId-width}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*5}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*6}"]`).firstChild
    //
    || startId+1===targetId
    || startId+2===targetId && !document.querySelector(`[square-id="${startId+1}"]`).firstChild
    || startId+3===targetId && !document.querySelector(`[square-id="${startId+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+2}"]`).firstChild
    || startId+4===targetId && !document.querySelector(`[square-id="${startId+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+3}"]`).firstChild
    || startId+5===targetId && !document.querySelector(`[square-id="${startId+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+3}"]`).firstChild && !document.querySelector(`[square-id="${startId+4}"]`).firstChild
    || startId+6===targetId && !document.querySelector(`[square-id="${startId+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+3}"]`).firstChild && !document.querySelector(`[square-id="${startId+4}"]`).firstChild && !document.querySelector(`[square-id="${startId+5}"]`).firstChild
    || startId+7===targetId && !document.querySelector(`[square-id="${startId+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+3}"]`).firstChild && !document.querySelector(`[square-id="${startId+4}"]`).firstChild && !document.querySelector(`[square-id="${startId+5}"]`).firstChild && !document.querySelector(`[square-id="${startId+6}"]`).firstChild
    //
    || startId-1===targetId 
    || startId-2===targetId && !document.querySelector(`[square-id="${startId-1}"]`).firstChild
    || startId-3===targetId && !document.querySelector(`[square-id="${startId-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-2}"]`).firstChild
    || startId-4===targetId && !document.querySelector(`[square-id="${startId-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-3}"]`).firstChild
    || startId-5===targetId && !document.querySelector(`[square-id="${startId-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-3}"]`).firstChild && !document.querySelector(`[square-id="${startId-4}"]`).firstChild
    || startId-6===targetId && !document.querySelector(`[square-id="${startId-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-3}"]`).firstChild && !document.querySelector(`[square-id="${startId-4}"]`).firstChild && !document.querySelector(`[square-id="${startId-5}"]`).firstChild
    || startId-7===targetId && !document.querySelector(`[square-id="${startId-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-3}"]`).firstChild && !document.querySelector(`[square-id="${startId-4}"]`).firstChild && !document.querySelector(`[square-id="${startId-5}"]`).firstChild && !document.querySelector(`[square-id="${startId-6}"]`).firstChild   
    ){
    return true
    }
    break;

    case 'queen':
    if(
    //bishop moves
    startId+width+1===targetId
    || startId+width*2+2===targetId && !document.querySelector(`[square-id="${startId+width+1}"]`).firstChild
    || startId+width*3+3===targetId && !document.querySelector(`[square-id="${startId+width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2+2}"]`).firstChild
    || startId+width*4+4===targetId && !document.querySelector(`[square-id="${startId+width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3+3}"]`).firstChild
    || startId+width*5+5===targetId && !document.querySelector(`[square-id="${startId+width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3+3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4+4}"]`).firstChild 
    || startId+width*6+6===targetId && !document.querySelector(`[square-id="${startId+width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3+3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4+4}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*5+5}"]`).firstChild 
    || startId+width*7+7===targetId && !document.querySelector(`[square-id="${startId+width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3+3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4+4}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*5+5}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*6+6}"]`).firstChild
    //
    || startId-width-1===targetId
    || startId-width*2-2===targetId && !document.querySelector(`[square-id="${startId-width-1}"]`).firstChild
    || startId-width*3-3===targetId && !document.querySelector(`[square-id="${startId-width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2-2}"]`).firstChild
    || startId-width*4-4===targetId && !document.querySelector(`[square-id="${startId-width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3-3}"]`).firstChild
    || startId-width*5-5===targetId && !document.querySelector(`[square-id="${startId-width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3-3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4-4}"]`).firstChild 
    || startId-width*6-6===targetId && !document.querySelector(`[square-id="${startId-width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3-3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4-4}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*5-5}"]`).firstChild 
    || startId-width*7-7===targetId && !document.querySelector(`[square-id="${startId-width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3-3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4-4}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*5-5}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*6-6}"]`).firstChild
    //
    || startId-width+1===targetId
    || startId-width*2+2===targetId && !document.querySelector(`[square-id="${startId-width+1}"]`).firstChild
    || startId-width*3+3===targetId && !document.querySelector(`[square-id="${startId-width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2+2}"]`).firstChild
    || startId-width*4+4===targetId && !document.querySelector(`[square-id="${startId-width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3+3}"]`).firstChild
    || startId-width*5+5===targetId && !document.querySelector(`[square-id="${startId-width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3+3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4+4}"]`).firstChild 
    || startId-width*6+6===targetId && !document.querySelector(`[square-id="${startId-width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3+3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4+4}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*5+5}"]`).firstChild 
    || startId-width*7+7===targetId && !document.querySelector(`[square-id="${startId-width+1}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2+2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3+3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4+4}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*5+5}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*6+6}"]`).firstChild
    //
    || startId+width-1===targetId
    || startId+width*2-2===targetId && !document.querySelector(`[square-id="${startId+width-1}"]`).firstChild
    || startId+width*3-3===targetId && !document.querySelector(`[square-id="${startId+width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2-2}"]`).firstChild
    || startId+width*4-4===targetId && !document.querySelector(`[square-id="${startId+width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3-3}"]`).firstChild
    || startId+width*5-5===targetId && !document.querySelector(`[square-id="${startId+width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3-3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4-4}"]`).firstChild 
    || startId+width*6-6===targetId && !document.querySelector(`[square-id="${startId+width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3-3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4-4}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*5-5}"]`).firstChild 
    || startId+width*7-7===targetId && !document.querySelector(`[square-id="${startId+width-1}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2-2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3-3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4-4}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*5-5}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*6-6}"]`).firstChild
    //--- rook moves
    || startId+width===targetId
    || startId+width*2===targetId && !document.querySelector(`[square-id="${startId+width}"]`).firstChild
    || startId+width*3===targetId && !document.querySelector(`[square-id="${startId+width}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2}"]`).firstChild
    || startId+width*4===targetId && !document.querySelector(`[square-id="${startId+width}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3}"]`).firstChild
    || startId+width*5===targetId && !document.querySelector(`[square-id="${startId+width}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4}"]`).firstChild
    || startId+width*6===targetId && !document.querySelector(`[square-id="${startId+width}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*5}"]`).firstChild
    || startId+width*7===targetId && !document.querySelector(`[square-id="${startId+width}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*5}"]`).firstChild && !document.querySelector(`[square-id="${startId+width*6}"]`).firstChild
    //
    || startId-width===targetId
    || startId-width*2===targetId && !document.querySelector(`[square-id="${startId-width}"]`).firstChild
    || startId-width*3===targetId && !document.querySelector(`[square-id="${startId-width}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2}"]`).firstChild
    || startId-width*4===targetId && !document.querySelector(`[square-id="${startId-width}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3}"]`).firstChild
    || startId-width*5===targetId && !document.querySelector(`[square-id="${startId-width}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4}"]`).firstChild
    || startId-width*6===targetId && !document.querySelector(`[square-id="${startId-width}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*5}"]`).firstChild
    || startId-width*7===targetId && !document.querySelector(`[square-id="${startId-width}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*5}"]`).firstChild && !document.querySelector(`[square-id="${startId-width*6}"]`).firstChild
    //
    || startId+1===targetId
    || startId+2===targetId && !document.querySelector(`[square-id="${startId+1}"]`).firstChild
    || startId+3===targetId && !document.querySelector(`[square-id="${startId+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+2}"]`).firstChild
    || startId+4===targetId && !document.querySelector(`[square-id="${startId+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+3}"]`).firstChild
    || startId+5===targetId && !document.querySelector(`[square-id="${startId+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+3}"]`).firstChild && !document.querySelector(`[square-id="${startId+4}"]`).firstChild
    || startId+6===targetId && !document.querySelector(`[square-id="${startId+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+3}"]`).firstChild && !document.querySelector(`[square-id="${startId+4}"]`).firstChild && !document.querySelector(`[square-id="${startId+5}"]`).firstChild
    || startId+7===targetId && !document.querySelector(`[square-id="${startId+1}"]`).firstChild && !document.querySelector(`[square-id="${startId+2}"]`).firstChild && !document.querySelector(`[square-id="${startId+3}"]`).firstChild && !document.querySelector(`[square-id="${startId+4}"]`).firstChild && !document.querySelector(`[square-id="${startId+5}"]`).firstChild && !document.querySelector(`[square-id="${startId+6}"]`).firstChild
    //
    || startId-1===targetId
    || startId-2===targetId && !document.querySelector(`[square-id="${startId-1}"]`).firstChild
    || startId-3===targetId && !document.querySelector(`[square-id="${startId-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-2}"]`).firstChild
    || startId-4===targetId && !document.querySelector(`[square-id="${startId-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-3}"]`).firstChild
    || startId-5===targetId && !document.querySelector(`[square-id="${startId-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-3}"]`).firstChild && !document.querySelector(`[square-id="${startId-4}"]`).firstChild
    || startId-6===targetId && !document.querySelector(`[square-id="${startId-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-3}"]`).firstChild && !document.querySelector(`[square-id="${startId-4}"]`).firstChild && !document.querySelector(`[square-id="${startId-5}"]`).firstChild
    || startId-7===targetId && !document.querySelector(`[square-id="${startId-1}"]`).firstChild && !document.querySelector(`[square-id="${startId-2}"]`).firstChild && !document.querySelector(`[square-id="${startId-3}"]`).firstChild && !document.querySelector(`[square-id="${startId-4}"]`).firstChild && !document.querySelector(`[square-id="${startId-5}"]`).firstChild && !document.querySelector(`[square-id="${startId-6}"]`).firstChild
    ){
    return true;
    }
    break;

    case 'king':
    if(
    startId+1===targetId
    || startId-1===targetId
    || startId+width===targetId
    || startId-width===targetId
    || startId+width+1===targetId
    || startId+width-1===targetId
    || startId-width+1===targetId
    || startId-width-1===targetId
    ){
    return true;
    }
    break;
    }
}

// Checking for Win
function checkForWin(){
    const allKings=Array.from(document.querySelectorAll('#king'));

    if(!allKings.some((king)=>king.firstChild.classList.contains('white'))){
        infoElem.textContent='Black Wins';
        allSquares.forEach((square)=>square.firstChild?.setAttribute('draggable', false));
    }
    if(!allKings.some((king)=>king.firstChild.classList.contains('black'))){
        infoElem.textContent='White Wins';
        allSquares.forEach((square)=>square.firstChild?.setAttribute('draggable', false));
    }
}