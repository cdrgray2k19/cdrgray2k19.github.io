function game(){
    
    document.querySelector('#welcomeElements').className = 'hidden';
    document.querySelector('#playingElements').className = 'shown';
    let playerTimeVal = document.querySelector('#firstGamePlayerClock').value;
    let computerTimeVal = document.querySelector('#firstGameComputerClock').value;
    addBoard(playerTimeVal, computerTimeVal);

    addEvtListeners();

    frame();

}

function addBoard(pTime, cTime){
    b = new board(); // creates new board
    b.playerTime = pTime;
    b.computerTime = cTime;
    b.initTime();
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

    let resignBtn = document.querySelector('#resign'); // listen for resignation
    resignBtn.addEventListener('click', function(){
        b.resign()
    });

    let queenButton = document.querySelector('#qReplace');
    let rookButton = document.querySelector('#rReplace');
    let bishopButton = document.querySelector('#bReplace');
    let knightButton = document.querySelector('#kReplace');
        
    queenButton.addEventListener('click', function(){
        b.notation += 'Q';
        new queen(b.movingPiece.x, b.movingPiece.y, b.movingPiece.white, true, b); // send true as computer will evaluate best and add it itself so player is always true
        b.p.replaceForPiece();
    });
        
    rookButton.addEventListener('click', function(){
        b.notation += 'R';
        new rook(b.movingPiece.x, b.movingPiece.y, b.movingPiece.white, true, b);
        b.p.replaceForPiece();
    });
        
    bishopButton.addEventListener('click', function(){
        b.notation += 'B';
        new bishop(b.movingPiece.x, b.movingPiece.y, b.movingPiece.white, true, b);
        b.p.replaceForPiece();
    });
        
    knightButton.addEventListener('click', function(){
        b.notation += 'N';
        new knight(b.movingPiece.x, b.movingPiece.y, b.movingPiece.white, true, b);
        b.p.replaceForPiece();
    });
}

function frame(){ // call computer if playerMove = false;
    b.timeHandle(); // handle time each frame
    b.ctx.clearRect(0, 0, b.width, b.height); // clear board
    
    b.drawGrid(); // draw grid
    b.drawPieces(); // draw pieces

    if (b.playing){ // create new frame if playing
        requestAnimationFrame(frame);
    } else { // update messages and listen for newgame and then play submitionss
        newGame();
    }
}

function newGame(){ // display box at end with info and wait for use to play again
    document.querySelector('#endMsg').innerHTML = b.endMsg;
    document.querySelector('#winnerMsg').innerHTML = b.winnerMsg;
    b.endMsgBox.className = 'shown';
    let div = document.querySelector('#timeOption');
    div.className = 'shown';
    let playBtn = document.querySelector('#newGameForm');
    document.querySelector('#playerTimeInput').value = '';
    document.querySelector('#computerTimeInput').value = '';
    playBtn.addEventListener('submit', function(evt){
        evt.preventDefault();
        let playerTimeVal = document.querySelector('#playerTimeInput').value;
        let computerTimeVal = document.querySelector('#computerTimeInput').value;
        b.endMsgBox.className = 'hidden';
        div.className = 'hidden';
        document.querySelector('#white-moves').innerHTML = "";
        document.querySelector('#black-moves').innerHTML = "";
        document.querySelector('#computerTakenPieces').innerHTML = "";
        document.querySelector('#playerTakenPieces').innerHTML = "";
        addBoard(playerTimeVal, computerTimeVal);
        frame();
    });
}

function wait(){
    document.querySelector('#firstGameForm').addEventListener('submit', function(evt){ // adds listener for submition of first form
        evt.preventDefault();
        game();
    });
}

window.onload = wait;