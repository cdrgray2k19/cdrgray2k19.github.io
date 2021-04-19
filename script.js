function game(){
    
    document.querySelector('#welcomeElements').className = 'hidden';
    document.querySelector('#playingElements').className = 'shown';
    let whiteTimeVal = document.querySelector('#firstGameWhiteClock').value;
    let blackTimeVal = document.querySelector('#firstGameBlackClock').value;
    addBoard(whiteTimeVal, blackTimeVal);

    addEvtListeners();

    frame();

}

function addBoard(wTime, bTime){
    b = new board(); // creates new board
    b.whiteTime = wTime;
    b.blackTime = bTime;
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
        if (b.movingPiece == 0){
            b.mousePress1();
        } else {
            b.mousePress2();
        }
    });

    let resignBtn = document.querySelector('#resign'); // listen for resignation
    resignBtn.addEventListener('click', function(){
        b.resign()
    });

    let drawBtn = document.querySelector('#draw'); // listen for draw
    drawBtn.addEventListener('click', function(){
        b.draw();
    });

    let queenButton = document.querySelector('#qReplace');
    let rookButton = document.querySelector('#rReplace');
    let bishopButton = document.querySelector('#bReplace');
    let knightButton = document.querySelector('#kReplace');
        
    queenButton.addEventListener('click', function(){
        b.notation += 'Q';
        let newPiece = new queen(b.movingPiece.x, b.movingPiece.y, b.movingPiece.white, b);
        b.replaceForPiece(newPiece);
    });
        
    rookButton.addEventListener('click', function(){
        b.notation += 'R';
        let newPiece = new rook(b.movingPiece.x, b.movingPiece.y, b.movingPiece.white, b);
        b.replaceForPiece(newPiece);
    });
        
    bishopButton.addEventListener('click', function(){
        b.notation += 'B';
        let newPiece = new bishop(b.movingPiece.x, b.movingPiece.y, b.movingPiece.white, b);
        b.replaceForPiece(newPiece);
    });
        
    knightButton.addEventListener('click', function(){
        b.notation += 'N';
        let newPiece = new knight(b.movingPiece.x, b.movingPiece.y, b.movingPiece.white, b);
        b.replaceForPiece(newPiece);
    });
}

function frame(){
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
    document.querySelector('#whiteTimeInput').value = '';
    document.querySelector('#blackTimeInput').value = '';
    playBtn.addEventListener('submit', function(evt){
        evt.preventDefault();
        let whiteTimeVal = document.querySelector('#whiteTimeInput').value;
        let blackTimeVal = document.querySelector('#blackTimeInput').value;
        b.endMsgBox.className = 'hidden';
        div.className = 'hidden';
        document.querySelector('#white-moves').innerHTML = "";
        document.querySelector('#black-moves').innerHTML = "";
        document.querySelector('#blackTakenPieces').innerHTML = "";
        document.querySelector('#whiteTakenPieces').innerHTML = "";
        addBoard(whiteTimeVal, blackTimeVal);
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