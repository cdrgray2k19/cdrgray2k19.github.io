//roughly the same
function game(){
    
    document.querySelector('#startElements').className = 'hidden';
    document.querySelector('#playingElements').className = 'shown';
    //let playerTimeVal = document.querySelector('#firstGamePlayerClock').value;
    //let computerTimeVal = document.querySelector('#firstGameComputerClock').value;
    let white = document.querySelector('#sliderInput')
    if (white.checked){
        white = true;
    } else {
        white = false;
    }

    addBoard(white);

    addEvtListeners();
    
    loop();

}

function addBoard(white){
    b = new board(white); // creates new board
    //b.playerTime = pTime;
    //b.computerTime = cTime;
    //b.initTime();
}

function addEvtListeners(){
    window.addEventListener('resize', function(){
        b.resizeCanvas();
    });

    b.canvas.addEventListener('mousemove', function(evt) { // listens for mousemove to append to mouse array
        let rect = b.canvas.getBoundingClientRect();
        let x = (evt.clientX - rect.left);
        let y = (evt.clientY - rect.top);
        b.mouse = [];
        b.mouse.push(x);
        b.mouse.push(y);
    });

    b.canvas.addEventListener('mousedown', function() { // listens for clicks to run mousePress1 or mousePress2 depending on whether or not a piece has been selected
        if (b.playerMove){
            if (b.movingPiece == 0){
                b.p.pickUp();
            } else {
                b.p.drop();
            }
        };
    });

    /*let resignBtn = document.querySelector('#resign'); // listen for resignation
    resignBtn.addEventListener('click', function(){
        b.resign()
    });*/

    let queenButton = document.querySelector('#qReplace');
    let rookButton = document.querySelector('#rReplace');
    let bishopButton = document.querySelector('#bReplace');
    let knightButton = document.querySelector('#kReplace');
        
    queenButton.addEventListener('click', function(){
        //b.notation += 'Q';
        let i = b.p.pieces.indexOf(b.movingPiece);
        b.p.pieces[i] = new queen(b.movingPiece.x, b.movingPiece.y, b.movingPiece.white, true, b);
        //let piece = new queen(b.movingPiece.x + 1, b.movingPiece.y, b.movingPiece.white, true, b); // send true as computer will evaluate best and add it itself so player is always true
        //b.movingPiece = piece;
        b.p.replaceForPiece();
    });
        
    rookButton.addEventListener('click', function(){
        //b.notation += 'R';
        let i = b.p.pieces.indexOf(b.movingPiece);
        b.p.pieces[i] = new rook(b.movingPiece.x, b.movingPiece.y, b.movingPiece.white, true, b);
        b.p.replaceForPiece();
    });
        
    bishopButton.addEventListener('click', function(){
        //b.notation += 'B';
        let i = b.p.pieces.indexOf(b.movingPiece);
        b.p.pieces[i] = new bishop(b.movingPiece.x, b.movingPiece.y, b.movingPiece.white, true, b);
        b.p.replaceForPiece();
    });
        
    knightButton.addEventListener('click', function(){
        //b.notation += 'N';
        let i = b.p.pieces.indexOf(b.movingPiece);
        b.p.pieces[i] = new knight(b.movingPiece.x, b.movingPiece.y, b.movingPiece.white, true, b);
        b.p.replaceForPiece();
    });
}

function frame(){ // call computer if playerMove = false;
    //b.timeHandle(); // handle time each frame
    b.ctx.clearRect(0, 0, b.width, b.height); // clear board
    
    b.drawGrid(); // draw grid
    b.drawPieces(); // draw pieces

    if (b.playing){ // create new frame if playing
        requestAnimationFrame(frame);
    } else { // update messages and listen for newgame and then play submitionss
        newGame();
    }
}


function loop(board){
    const frameWorker = new Worker('worker.js');
    frameWorker.postMessage(board);
    frameWorker.onmessage = function(evt){
        newGame();
    }
}

function newGame(){ // display box at end with info and wait for use to play again
    document.querySelector('#endMsg').innerHTML = b.endMsg;
    document.querySelector('#winnerMsg').innerHTML = b.winnerMsg;
    b.endMsgBox.className = 'shown';
    let playBtn = document.querySelector('#restartGame');
    playBtn.addEventListener('click', function(evt){
        evt.preventDefault();
        location.reload();//just reloaded the page to start a new game but may have to create a function to reinitilaise the board
    });
}

function wait(){
    document.querySelector('#firstGameForm').addEventListener('submit', function(evt){ // adds listener for submition of first form
        evt.preventDefault();
        game();
    });
}
window.onload = wait;