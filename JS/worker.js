onmessage = function(board){
    tick(board);
    postMessage('end of game');
}

function tick(board){
    b = board;
    b.ctx.clearRect(0, 0, b.width, b.height); // clear board
    
    b.drawGrid(); // draw grid
    b.drawPieces(); // draw pieces
    if (b.playing){
        requestAnimationFrame(frame);
    } else {
        return;
    }
}