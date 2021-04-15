class pieces{ // basic outline for each piece
    constructor(x, y, white, board){
        this.x = x;
        this.y = y;
        this.white = white;
        this.board = board;
        this.legal = [];
        this.take = [];
    }

    display(){} // displays piece
    mapLegal(){} // using different function to calculate legal moves for each piece without looking for checks
}

class king extends pieces{
    constructor(x, y, white, board){
        super(x, y, white, board);
        this.text = 'K';
        this.moved = false;
        this.image = new Image();
        if (this.white){
            this.image.src = 'pieces/kingW.png';
        } else {
            this.image.src = 'pieces/kingB.png';
        }
    }
    display(){
        try{
            this.board.ctx.drawImage(this.image, this.x * this.board.sqSize + this.board.sqSize/8, this.y * this.board.sqSize + this.board.sqSize/8, this.board.sqSize - this.board.sqSize/4, this.board.sqSize - this.board.sqSize/4);
        } catch {
            if (this.white){
                this.board.ctx.fillStyle = '#808080';
            }else{
                this.board.ctx.fillStyle = '#000000';
            }
            this.board.ctx.fillText(this.text, this.x * this.board.sqSize + this.board.sqSize/2, this.y * this.board.sqSize + this.board.sqSize/2);
        }

    }
    mapLegal(){ 
        this.legal = [];
        for (let i = -1; i < 2; i++){ // look at 3 by 3 square around king and check if friendly piece on squares
            for (let j = -1; j < 2; j++){
                let x = this.x + i;
                let y = this.y + j;
                if (x >= 0 && x < 8 && y>=0 && y < 8){
                    if (x != this.x || y != this.y){
                        if (this.board.pieceAt(x, y, this.white) != true){
                            this.legal.push([x, y]);
                        }
                    }
                }
            }
        }
        this.take = this.legal;
        let returnMsg = '';
        if (this.kingSideCastle()){
            
            this.legal.push([this.x + 2, this.y]);
            returnMsg = 'castle'
        }
        if (this.queenSideCastle()){

            this.legal.push([this.x - 2, this.y]);
            returnMsg = 'castle'
        }
        return returnMsg;
    }
    kingSideCastle(){ // check if pieces in way of castling  and rook has not moved
        let x = this.x;
        let y = this.y;
        if (this.moved == true){
            return false;
        }
        if (this.board.pieceAt(x + 1, y, this.white) != 'null' || this.board.pieceAt(x + 2, y, this.white) != 'null'){
            return false;
        }
        if (this.white){
            for (let i = 0; i < this.board.whitePieces.length; i++){
                if (this.board.whitePieces[i].x == x + 3 && this.board.whitePieces[i].y == y){
                    let piece = this.board.whitePieces[i];
                    if (piece.constructor.name == rook.name){
                        if (piece.moved == false){
                            return true;
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i < this.board.blackPieces.length; i++){
                if (this.board.blackPieces[i].x == x + 3 && this.board.blackPieces[i].y == y){
                    let piece = this.board.blackPieces[i];
                    if (piece.constructor.name == rook.name){
                        if (piece.moved == false){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    queenSideCastle(){ // check if pieces in way of castling  and rook has not moved
        let x = this.x;
        let y = this.y;
        if (this.moved == true){
            return false;
        }
        if (this.board.pieceAt(x - 1, y, this.white) != 'null' || this.board.pieceAt(x - 2, y, this.white) != 'null' || this.board.pieceAt(x - 3, y, this.white) != 'null'){
            return false;
        }
        if (this.white){
            for (let i = 0; i < this.board.whitePieces.length; i++){
                if (this.board.whitePieces[i].x == x - 4 && this.board.whitePieces[i].y == y){
                    let piece = this.board.whitePieces[i];
                    if (piece.constructor.name == rook.name){
                        if (piece.moved == false){
                            return true;
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i < this.board.blackPieces.length; i++){
                if (this.board.blackPieces[i].x == x - 4 && this.board.blackPieces[i].y == y){
                    let piece = this.board.blackPieces[i];
                    if (piece.constructor.name == rook.name){
                        if (piece.moved == false){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}

class queen extends pieces{
    constructor(x, y, white, board){
        super(x, y, white, board);
        this.text = 'Q';
        this.image = new Image();
        if (this.white){
            this.image.src = 'pieces/queenW.png';
        } else {
            this.image.src = 'pieces/queenB.png';
        }
    }
    display(){
        try{
            this.board.ctx.drawImage(this.image, this.x * this.board.sqSize + this.board.sqSize/8, this.y * this.board.sqSize + this.board.sqSize/8, this.board.sqSize - this.board.sqSize/4, this.board.sqSize - this.board.sqSize/4);
        } catch {
            if (this.white){
                this.board.ctx.fillStyle = '#808080';
            }else{
                this.board.ctx.fillStyle = '#000000';
            }
            this.board.ctx.fillText(this.text, this.x * this.board.sqSize + this.board.sqSize/2, this.y * this.board.sqSize + this.board.sqSize/2);
        }
    }
    mapLegal(){ // uses for loops to calculate legal moves in each direction
        this.legal = [];
        this.up();
        this.down();
        this.left();
        this.right();
        this.up_left();
        this.down_left();
        this.up_right();
        this.down_right();
        this.take = this.legal;
        let returnMsg = '';
        return returnMsg;
    }
    up(){
        for (let i = 0; i < this.y; i++){
            if (this.board.pieceAt(this.x, this.y - i - 1, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x, this.y - i - 1, this.white) == false){
                this.legal.push([this.x, this.y - i - 1]);
                return;
            }
            this.legal.push([this.x, this.y - i - 1]);
        }
    }
    down(){
        for (let i = 0; i < 7 - this.y; i++){
            if (this.board.pieceAt(this.x, this.y + i + 1, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x, this.y + i + 1, this.white) == false){
                this.legal.push([this.x, this.y + i + 1]);
                return;
            }
            this.legal.push([this.x, this.y + i + 1]);
        }
    }
    left(){
        for (let i = 0; i < this.x; i++){
            if (this.board.pieceAt(this.x - i - 1, this.y, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x - i - 1, this.y, this.white) == false){
                this.legal.push([this.x - i - 1, this.y]);
                return;
            }
            this.legal.push([this.x - i - 1, this.y]);
        }
    }
    right(){
        for (let i = 0; i < 7 - this.x; i++){
            if (this.board.pieceAt(this.x + i + 1, this.y, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x + i + 1, this.y, this.white) == false){
                this.legal.push([this.x + i + 1, this.y]);
                return;
            }
            this.legal.push([this.x + i + 1, this.y]);
        }
    }
    up_left(){
        const min = Math.min(this.x, this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x - i - 1, this.y - i - 1, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x - i - 1, this.y - i - 1, this.white) == false){
                this.legal.push([this.x - i - 1, this.y - i - 1]);
                return;
            }
            this.legal.push([this.x - i - 1, this.y - i - 1]);
        }
    }
    down_left(){
        const min = Math.min(this.x, 7 - this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x - i - 1, this.y + i + 1, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x - i - 1, this.y + i + 1, this.white) == false){
                this.legal.push([this.x - i - 1, this.y + i + 1]);
                return;
            }
            this.legal.push([this.x - i - 1, this.y + i + 1]);
        }
    }
    up_right(){
        const min = Math.min(7 - this.x, this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x + i + 1, this.y - i - 1, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x + i + 1, this.y - i - 1, this.white) == false){
                this.legal.push([this.x + i + 1, this.y - i - 1]);
                return;
            }
            this.legal.push([this.x + i + 1, this.y - i - 1]);
        }
    }
    down_right(){
        const min = Math.min(7 - this.x, 7 - this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x + i + 1, this.y + i + 1, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x + i + 1, this.y + i + 1, this.white) == false){
                this.legal.push([this.x + i + 1, this.y + i + 1]);
                return;
            }
            this.legal.push([this.x + i + 1, this.y + i + 1]);
        }
    }
}

class rook extends pieces{
    constructor(x, y, white, board){
        super(x, y, white, board);
        this.text = 'R';
        this.moved = false;
        this.image = new Image();
        if (this.white){
            this.image.src = 'pieces/rookW.png';
        } else {
            this.image.src = 'pieces/rookB.png';
        }
    }
    display(){
        try{
            this.board.ctx.drawImage(this.image, this.x * this.board.sqSize + this.board.sqSize/8, this.y * this.board.sqSize + this.board.sqSize/8, this.board.sqSize - this.board.sqSize/4, this.board.sqSize - this.board.sqSize/4);
        } catch {
            if (this.white){
                this.board.ctx.fillStyle = '#808080';
            }else{
                this.board.ctx.fillStyle = '#000000';
            }
            this.board.ctx.fillText(this.text, this.x * this.board.sqSize + this.board.sqSize/2, this.y * this.board.sqSize + this.board.sqSize/2);
        }
    }
    mapLegal(){ // uses for loops to calculate legal moves in each direction
        this.legal = [];
        this.up();
        this.down();
        this.left();
        this.right();
        this.take = this.legal;
        let returnMsg = '';
        return returnMsg;
    }
    up(){
        for (let i = 0; i < this.y; i++){
            if (this.board.pieceAt(this.x, this.y - i - 1, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x, this.y - i - 1, this.white) == false){
                this.legal.push([this.x, this.y - i - 1]);
                return;
            }
            this.legal.push([this.x, this.y - i - 1]);
        }
    }
    down(){
        for (let i = 0; i < 7 - this.y; i++){
            if (this.board.pieceAt(this.x, this.y + i + 1, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x, this.y + i + 1, this.white) == false){
                this.legal.push([this.x, this.y + i + 1]);
                return;
            }
            this.legal.push([this.x, this.y + i + 1]);
        }
    }
    left(){
        for (let i = 0; i < this.x; i++){
            if (this.board.pieceAt(this.x - i - 1, this.y, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x - i - 1, this.y, this.white) == false){
                this.legal.push([this.x - i - 1, this.y]);
                return;
            }
            this.legal.push([this.x - i - 1, this.y]);
        }
    }
    right(){
        for (let i = 0; i < 7 - this.x; i++){
            if (this.board.pieceAt(this.x + i + 1, this.y, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x + i + 1, this.y, this.white) == false){
                this.legal.push([this.x + i + 1, this.y]);
                return;
            }
            this.legal.push([this.x + i + 1, this.y]);
        }
    }
}

class bishop extends pieces{
    constructor(x, y, white, board){
        super(x, y, white, board);
        this.text = 'B';
        this.image = new Image();
        if (this.white){
            this.image.src = 'pieces/bishopW.png';
        } else {
            this.image.src = 'pieces/bishopB.png';
        }
    }
    display(){
        try{
            this.board.ctx.drawImage(this.image, this.x * this.board.sqSize + this.board.sqSize/8, this.y * this.board.sqSize + this.board.sqSize/8, this.board.sqSize - this.board.sqSize/4, this.board.sqSize - this.board.sqSize/4);
        } catch {
            if (this.white){
                this.board.ctx.fillStyle = '#808080';
            }else{
                this.board.ctx.fillStyle = '#000000';
            }
            this.board.ctx.fillText(this.text, this.x * this.board.sqSize + this.board.sqSize/2, this.y * this.board.sqSize + this.board.sqSize/2);
        }
    }
    mapLegal(){ // uses for loops to calculate legal moves in each direction
        this.legal = [];
        this.up_left();
        this.down_left();
        this.up_right();
        this.down_right();
        this.take = this.legal;
        let returnMsg = '';
        return returnMsg;
    }
    up_left(){
        const min = Math.min(this.x, this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x - i - 1, this.y - i - 1, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x - i - 1, this.y - i - 1, this.white) == false){
                this.legal.push([this.x - i - 1, this.y - i - 1]);
                return;
            }
            this.legal.push([this.x - i - 1, this.y - i - 1]);
        }
    }
    down_left(){
        const min = Math.min(this.x, 7 - this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x - i - 1, this.y + i + 1, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x - i - 1, this.y + i + 1, this.white) == false){
                this.legal.push([this.x - i - 1, this.y + i + 1]);
                return;
            }
            this.legal.push([this.x - i - 1, this.y + i + 1]);
        }
    }
    up_right(){
        const min = Math.min(7 - this.x, this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x + i + 1, this.y - i - 1, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x + i + 1, this.y - i - 1, this.white) == false){
                this.legal.push([this.x + i + 1, this.y - i - 1]);
                return;
            }
            this.legal.push([this.x + i + 1, this.y - i - 1]);
        }
    }
    down_right(){
        const min = Math.min(7 - this.x, 7 - this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x + i + 1, this.y + i + 1, this.white) == true){
                return;
            } else if (this.board.pieceAt(this.x + i + 1, this.y + i + 1, this.white) == false){
                this.legal.push([this.x + i + 1, this.y + i + 1]);
                return;
            }
            this.legal.push([this.x + i + 1, this.y + i + 1]);
        }
    }
}

class knight extends pieces{
    constructor(x, y, white, board){
        super(x, y, white, board);
        this.text = 'N';
        this.image = new Image();
        if (this.white){
            this.image.src = 'pieces/knightW.png';
        } else {
            this.image.src = 'pieces/knightB.png';
        }
    }
    display(){
        try{
            this.board.ctx.drawImage(this.image, this.x * this.board.sqSize + this.board.sqSize/8, this.y * this.board.sqSize + this.board.sqSize/8, this.board.sqSize - this.board.sqSize/4, this.board.sqSize - this.board.sqSize/4);
        } catch {
            if (this.white){
                this.board.ctx.fillStyle = '#808080';
            }else{
                this.board.ctx.fillStyle = '#000000';
            }
            this.board.ctx.fillText(this.text, this.x * this.board.sqSize + this.board.sqSize/2, this.y * this.board.sqSize + this.board.sqSize/2);
        }
    }
    mapLegal(){ // uses change in position in each direction to check for legal moves
        this.legal = [];
        const moves = [[-2, -1], [-2, 1], [-1, -2], [1, -2], [2, -1], [2, 1], [-1, 2], [1, 2]];
        for (let i = 0; i < moves.length; i++){
            let x = this.x + moves[i][0];
            let y = this.y + moves[i][1];
            if (x >= 0 && x < 8 && y>=0 && y < 8){
                if(this.board.pieceAt(x, y, this.white != true)){
                    this.legal.push([x, y]);
                }
            }
        }
        this.take = this.legal;
        let returnMsg = '';
        return returnMsg;
    }
}

class pawn extends pieces{
    constructor(x, y, white, board){
        super(x, y, white, board);
        this.text = '';
        this.displayedText = 'P';
        this.moved = false;
        this.justMoved = false;
        this.image = new Image();
        if (this.white){
            this.image.src = 'pieces/pawnW.png';
        } else {
            this.image.src = 'pieces/pawnB.png';
        }
    }
    display(){
        try{
            this.board.ctx.drawImage(this.image, this.x * this.board.sqSize + this.board.sqSize/4, this.y * this.board.sqSize + this.board.sqSize/4, this.board.sqSize - this.board.sqSize/2, this.board.sqSize - this.board.sqSize/2);
        } catch {
            if (this.white){
                this.board.ctx.fillStyle = '#808080';
            }else{
                this.board.ctx.fillStyle = '#000000';
            }
            this.board.ctx.fillText(this.displayedText, this.x * this.board.sqSize + this.board.sqSize/2, this.y * this.board.sqSize + this.board.sqSize/2);
        }
    }
    mapLegal(){ // calculate legal moves forwards and also diagonally if pawn can take a piece
        this.legal = [];
        this.take = [];
        var dir = 1;
        if (this.white){
            dir = -1
        }
        let returnMsg = '';
        this.forward(dir);
        let result = this.diaganol(dir);
        if (result != false){
            returnMsg = result
        }
        return returnMsg;
    }
    forward(dir){
        let len = 1;
        if (this.moved == false){
            len = 2;
        }
        for (let i = 0; i < len; i++){
            let y = this.y + (i + 1) * dir;
            if (this.board.pieceAt(this.x, y, this.white) != 'null'){
                return;
            }
            this.legal.push([this.x, y]);
        }
    }
    diaganol(dir){ // check if pieces can take diagonally and for en passant
        let y = this.y + (1*dir)
        if (this.board.pieceAt(this.x - 1, y, this.white) == false){
            this.legal.push([this.x - 1, y]);
            this.take.push([this.x - 1, y]);
        }
        if (this.board.pieceAt(this.x + 1, y, this.white) == false){
            this.legal.push([this.x + 1, y]);
            this.take.push([this.x + 1, y]);
        }
        if(this.white){
            if(this.y == 3){
                let arr = [-1, 1];
                for (let i = 0; i < arr.length; i++){
                    let x = arr[i];
                    for (let i = 0; i<this.board.blackPieces.length; i++){
                        if (this.board.blackPieces[i].x == this.x + x && this.board.blackPieces[i].y == this.y){
                            try{
                                if (this.board.blackPieces[i].justMoved == true){
                                    this.legal.push([this.x + x, this.y - 1]);
                                    if (x == -1){
                                        return 'enP-left';
                                    } else {
                                        return 'enP-right';
                                    }
                                }
                            }catch{}
                        }
                    }
                }
            }
        } else {
            if(this.y == 4){
                let arr = [-1, 1];
                for (let i = 0; i < arr.length; i++){
                    let x = arr[i];
                    for (let i = 0; i<this.board.whitePieces.length; i++){
                        if (this.board.whitePieces[i].x == this.x + x && this.board.whitePieces[i].y == this.y){
                            try{
                                if (this.board.whitePieces[i].justMoved == true){
                                    this.legal.push([this.x + x, this.y + 1]);
                                    if (x == -1){
                                        return 'enP-left';
                                    } else {
                                        return 'enP-right';
                                    }
                                }
                            }catch{}
                        }
                    }
                }
            }
        }
        return false;
    }
}


class board{
    constructor(){
        this.playing = true;
        /* canvas initialisation*/
        this.canvas = document.querySelector('#c');
        this.ctx = this.canvas.getContext("2d");
        this.resizeCanvas();
        /* --------- */
        
        this.width = 640; // set html sizes which will be used when drawing pieces
        this.height = 640;
        this.sqSize = this.height/8;
        this.whitePieces = []; // create arrays which will stores all pieces on board
        this.blackPieces = [];
        this.whiteMove = true;
        this.mouse = []; // stores array of x,y position in canvas
        this.movingPiece = 0; // stores piece information if cliked on, else it stores 0 to indicate no pieces have been clicked on
        this.inCheck = 0; // if color which is being moved is not in check it stores 0 if it is then it stores an array with the king x,y pos in it to color its square
        this.msg = 0; // stores message that is received from maplegal function which can tell mousepress2 how to behave if different move called like castling or en passant
        this.prev = []; // stores squares of oringinal and moved to squares
        this.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        this.notation = '';
        this.lightSqCol = '#f1d9c0'; // colors for squares depending on what actions are taking place
        this.darkSqCol = '#a97a65';
        this.checkCol = '#f54c4c';
        this.lightPrevCol = '#e4d00a';
        this.darkPrevCol = '#d4af37';
        this.lightLegalCol = '#aae346';
        this.darkLegalCol = '#87d620';
        this.changedCoordCol = '#000000';
        this.createGrid(); // create grid and pices and update both black and whites takeArrs to start
        this.createPieces();
        this.updateTakeArr(true);
        this.updateTakeArr(false);
        this.endMsgBox = document.querySelector('#canvasMsgBox'); // link html elements to javascript
        this.endMsg = '';
        this.winnerMsg = '';
        this.whiteTime = 600; // default to 10 mins if html info not received
        this.blackTime = 600; // default to 10 mins if html info not received
        this.startTime = new Date().getTime();
        this.endTime = 0;
        this.initTime();
    }

    resizeCanvas(){
        this.canvas_width = (window.innerWidth) * 0.7; // resize canvas to 0.7 of the minimum measurement
        this.canvas_height = (window.innerHeight) * 0.7;
        if (this.canvas_height > this.canvas_width){
            this.canvas_height = this.canvas_width;
        } else{
            this.canvas_width = this.canvas_height;
        }
        this.ctx.textAlgin = 'center'; // restore canvas elements as each time you resize canvas they are lost
        this.smallFont = "15px Georgia";
        this.bigFont = "30px Georgia";

        this.canvas.style.width = '' + String(this.canvas_width) + 'px';
        this.canvas.style.height = '' + String(this.canvas_height) + 'px';
    }

    initTime(){
        let value = Math.floor(this.whiteTime); // display time
        let min = Math.floor(value/60);
        let sec = String(value % 60);
        if (sec.length < 2){
            sec = "0" + sec;
        }
        document.querySelector('#whiteTime').innerHTML = String(min) + ":" + String(sec);

        value = Math.floor(this.blackTime);
        min = Math.floor(value/60);
        sec = String(value % 60);
        if (sec.length < 2){
            sec = "0" + sec;
        }
        document.querySelector('#blackTime').innerHTML = String(min) + ":" + String(sec);
    }
    
    
    inArr(arr1, arr2){ // had problem comparing 2d array values so made this function which has a very general application
        for (let i = 0; i < arr2.length; i++){
            if(arr1[0] == arr2[i][0] && arr1[1] == arr2[i][1]){
                return true;
            }
        }
        return false;
    }


    createGrid(){ // go through an 8 by 8 2d array which stores the square color and coordinate color of the square
        this.squares = [];
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){
                if ((x+y) % 2 == 0){
                    var block_num = this.lightSqCol;
                    var coord_num = this.darkSqCol;
                } else {
                    var block_num = this.darkSqCol;
                    var coord_num = this.lightSqCol;
                }
                if (y == 0){
                    this.squares.push([]);
                }
                this.squares[x].push({block: block_num, coord: coord_num})
            }
        }
    }
    drawGrid(){ // go through this.squares and draw each depending on their dictionary values
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){

                let color_block = this.squares[x][y].block;
                let color_coord = this.squares[x][y].coord;
                this.ctx.fillStyle = color_block;
                this.ctx.fillRect(x * this.sqSize, y * this.sqSize, this.sqSize, this.sqSize);
                if (x == 0){
                    this.ctx.fillStyle = color_coord;
                    this.ctx.font = this.smallFont;
                    let value = 8 - y;
                    this.ctx.fillText(String(value), x * this.sqSize, y * this.sqSize + this.sqSize/6);
                }
                if (y == 7){
                    this.ctx.fillStyle = color_coord;
                    this.ctx.font = this.smallFont;
                    let value = this.letters[x];
                    this.ctx.fillText(value, x * this.sqSize + this.sqSize * 9/10, y * this.sqSize + this.sqSize* 14/15);
                }
            }
        }
    }
    createPieces(){ // add peices to piece arrays
        this.whitePieces.push(new king(4, 7, true, this));
        this.whitePieces.push(new queen(3, 7, true, this));
        this.whitePieces.push(new rook(0, 7, true, this));
        this.whitePieces.push(new rook(7, 7, true, this));
        this.whitePieces.push(new bishop(2, 7, true, this));
        this.whitePieces.push(new bishop(5, 7, true, this));
        this.whitePieces.push(new knight(1, 7, true, this));
        this.whitePieces.push(new knight(6, 7, true, this));
        for (let i = 0; i < 8; i++){
            this.whitePieces.push(new pawn(i, 6, true, this));
        }

        this.blackPieces.push(new king(4, 0, false, this));
        this.blackPieces.push(new queen(3, 0, false, this));
        this.blackPieces.push(new rook(0, 0, false, this));
        this.blackPieces.push(new rook(7, 0, false, this));
        this.blackPieces.push(new bishop(2, 0, false, this));
        this.blackPieces.push(new bishop(5, 0, false, this));
        this.blackPieces.push(new knight(1, 0, false, this));
        this.blackPieces.push(new knight(6, 0, false, this));
        for (let i = 0; i < 8; i++){
            this.blackPieces.push(new pawn(i, 1, false, this));
        }
    }
    drawPieces(){ // reference display function of all pieces in arrays
        this.ctx.font = this.bigFont;
        for (let i = 0; i < this.whitePieces.length; i++){
            this.whitePieces[i].display();
        }
        for (let i = 0; i < this.blackPieces.length; i++){
            this.blackPieces[i].display();
        }
    }

    mousePress1(){ // search pieces to see if mouse over any when clicked
        if (this.whiteMove){
            for (let i = 0; i < this.whitePieces.length; i++){
                let piece = this.whitePieces[i];
                if (piece.x == Math.floor(this.mouse[0]/(this.canvas_width/8)) && piece.y == Math.floor(this.mouse[1]/(this.canvas_width/8))){
                    this.piecePressed(piece);
                }
            }
        } else {
            for (let i = 0; i < this.blackPieces.length; i++){
                let piece = this.blackPieces[i];
                if (piece.x == Math.floor(this.mouse[0]/(this.canvas_width/8)) && piece.y == Math.floor(this.mouse[1]/(this.canvas_width/8))){
                    this.piecePressed(piece);
                }
            }
        }
    }
    piecePressed(piece){ // update legal then change color of legal move squares to make obvious to player
        this.pieceUpdateLegal(piece);
        
        //update squares
        if (this.squares[this.movingPiece.x][this.movingPiece.y].block == this.lightSqCol){
            this.squares[this.movingPiece.x][this.movingPiece.y].block = this.lightPrevCol;
        } else {
            this.squares[this.movingPiece.x][this.movingPiece.y].block = this.darkPrevCol;
        }
        this.squares[this.movingPiece.x][this.movingPiece.y].coord = this.changedCoordCol;
        for(let i = 0; i < this.movingPiece.legal.length;i++){
            if ((this.movingPiece.legal[i][0] + this.movingPiece.legal[i][1]) % 2 == 0){
                this.squares[this.movingPiece.legal[i][0]][this.movingPiece.legal[i][1]].block = this.lightLegalCol;
            } else {
                this.squares[this.movingPiece.legal[i][0]][this.movingPiece.legal[i][1]].block = this.darkLegalCol;
            }
            this.squares[this.movingPiece.legal[i][0]][this.movingPiece.legal[i][1]].coord = this.changedCoordCol;
        }
    }
    pieceUpdateLegal(piece){ // reference mapLegal which gets legal depending on rules and other pieces and then add checking logic to the moves
        this.movingPiece = piece;
        this.msg = this.movingPiece.mapLegal(); // get legal moves depending on board and store msg which stores any other info about the legal moves
        let originalX = this.movingPiece.x; // store original x and y positoin
        let originalY = this.movingPiece.y;
        let arr = this.movingPiece.legal; // make it easier to manipulate array
        let arr2 = []; // open array to store legal moves after checks analysed
        for(let i = 0; i < arr.length;i++){
            this.movingPiece.x = arr[i][0]; // temporarily move pieces
            this.movingPiece.y = arr[i][1]; // temporarily move pieces
            if (this.msg == 'castle'){ // if the message is not an empty string then legalise the moves differently
                let result = this.castle(this.movingPiece.x,originalX);
                if(result != false){
                    if (result != true){
                        arr2.push([result[0], result[1]]);
                    }
                    continue;
                }
            } else if (this.msg == 'enP-left'){
                let result = this.enPLeft(this.movingPiece.x, originalX, originalY);
                if(result != false){
                    if (result != 'fail'){
                        arr2.push([arr[i][0], arr[i][1]]);
                    }
                    continue;
                }
            } else if (this.msg == 'enP-right'){
                let result = this.enPRight(this.movingPiece.x, originalX, originalY);
                if(result != false){
                    if (result != 'fail'){
                        arr2.push([arr[i][0], arr[i][1]]);
                    }
                    continue;
                }
            }
            let takenPiece = this.pieceTake(this.movingPiece.x, this.movingPiece.y, this.movingPiece.white); // check if piece was taken whilst moving to square temporarily
            this.updateTakeArr(!this.whiteMove) // update opposite color available taking moves
            if(this.isCheck(this.whiteMove) == 0){
                arr2.push([arr[i][0], arr[i][1]]); // if no checks are found for this move then append to new legal moves array
            }
            if (takenPiece != 0){ // if piece was taken, now the evaluation of the board is done the piece can be pushed back into the nescessary array to be stored on the board
                if (this.movingPiece.white){
                    this.blackPieces.push(takenPiece);
                } else {
                    this.whitePieces.push(takenPiece);
                }
            }
        }

        this.movingPiece.legal = arr2; // change legal array to new check legal array
        this.movingPiece.x = originalX; // change x and y position back
        this.movingPiece.y = originalY;
    }
    pieceAt(x, y, white){ // returns true if a friendly piece in square, false if enemy piece on square, and 'null' if no pieces on square

        for (let i = 0; i < this.whitePieces.length; i++){
            if (this.whitePieces[i].x == x && this.whitePieces[i].y == y){
                if(white){
                    return true;
                } else {
                    return false;
                }
            }
        }

        for (let i = 0; i < this.blackPieces.length; i++){
            if (this.blackPieces[i].x == x && this.blackPieces[i].y == y){
                if(white){
                    return false;
                } else {
                    return true;
                }
            }
        }
        return 'null';
    }
    mousePress2(){

        this.clearGrid();

        let x = Math.floor(this.mouse[0]/(this.canvas_width/8)); // evaluate board coordinates of mouse position
        let y = Math.floor(this.mouse[1]/(this.canvas_width/8));
        let pos = [x, y];
        let value = this.inArr(pos, this.movingPiece.legal); // check if move in legal move of selected piece

        if (value){
            let originalX = this.movingPiece.x; // store original values
            let originalY = this.movingPiece.y;
            this.movingPiece.x = x; // move
            this.movingPiece.y = y; // move
            
            this.movingVariableHandle(); // change piece.moved and justMoved variables

            this.notation = ''; // reset notation

            this.msgHandle(originalX, originalY); // handle move if message is not normal for castling and en passant

            this.promotionHandle(); // handle piece promotion
            
            this.updateTakeArr(this.whiteMove); // update current colors for taking moves

            this.inCheck = 0; // reset values for next move

            this.msg = 0;

            this.prev = [];

            this.createGrid(); // completely resets grid

            this.updatePrev(originalX, originalY); // update prev array to show most recent move

            this.movingPiece = 0; // refresh moving piece variable for next go
            
            this.whiteMove = !(this.whiteMove); // change move color

            if (this.whiteMove){
                document.querySelector('#whiteTime').className = 'moving';
                document.querySelector('#blackTime').className = 'waiting';
            } else {
                document.querySelector('#whiteTime').className = 'waiting';
                document.querySelector('#blackTime').className = 'moving';
            }
            
            let checkValue = this.isCheck(this.whiteMove); //use checkvalue to evaluate position and last bits of notation

            if(checkValue != 0){
                this.notation += '+';
            }
            //console.log(this.notation);

            let element = document.createElement('li');
            if (!this.whiteMove){ //append notation to correct html element
                document.querySelector('#white-moves').appendChild(element);
            } else {
                document.querySelector('#black-moves').appendChild(element);
            }

            element.innerHTML += this.notation;
            this.updateScroll(); //make scroll of notation div to lowest to show most recent moves          
            
            if(checkValue != 0){ // check new color for checks before anything else
                let x = this.isCheck(this.whiteMove)[0];
                let y = this.isCheck(this.whiteMove)[1];
                this.inCheck = [x, y];
                this.squares[x][y].block = this.checkCol;
                this.squares[x][y].coord = this.changedCoordCol;
                if(this.hasMoves(this.whiteMove) == false){
                    this.endMsg = 'checkmate';
                    this.playing = false;
                    if (this.whiteMove){
                        this.winnerMsg = 'black wins';
                    } else {
                        this.winnerMsg = 'white wins';
                    }
                }
            } else {
                if(this.hasMoves(this.whiteMove) == false){
                    this.endMsg = 'stalemate';
                    this.playing = false;
                    this.winnerMsg = 'draw';
                }
            }
            this.startTime = new Date().getTime();


        } else { // if square not in legal moves then reset moving peice and check if other peice selected
            this.movingPiece = 0;
            this.mousePress1(); // check if same color piece has been clicked which would restart process
        }
    }
    clearGrid(){
        this.createGrid(); // remove any green legal blocks

        if (this.inCheck != 0){ // keep any red check blocks
            let king_x = this.inCheck[0];
            let king_y = this.inCheck[1];
            this.squares[king_x][king_y].block = this.checkCol;
            this.squares[king_x][king_y].coord = this.changedCoordCol;
        }
        for (let i = 0; i < this.prev.length; i++){
            let x = this.prev[i][0];
            let y = this.prev[i][1];
            if (this.squares[x][y].block == this.lightSqCol){
                this.squares[x][y].block = this.lightPrevCol;
            } else {
                this.squares[x][y].block = this.darkPrevCol;
            }
            this.squares[x][y].coord = this.changedCoordCol;
        }
    }
    movingVariableHandle(){ // if justmoved and moved variables apply to piece, change as needed
        if (this.whiteMove){
            for (let i = 0; i < this.whitePieces.length; i++){
                try{
                    if (this.whitePieces[i].justMoved == true){
                        this.whitePieces[i].justMoved = false;
                    }
                }catch{}
            }
        } else {
            for (let i = 0; i < this.blackPieces.length; i++){
                try{
                    if (this.blackPieces[i].justMoved == true){
                        this.blackPieces[i].justMoved = false;
                    }
                }catch{}
            }
        }


        try{
            if (this.movingPiece.moved == false){
                this.movingPiece.moved = true; // tell pieces that need to now that they have moved
                try{
                    this.movingPiece.justMoved = true;
                }catch{}
            }
        }catch{}
    }
    msgHandle(originalX, originalY){ // handle notation and move differently if special move
        if (this.msg == 'castle'){ // gets rook and moves it to otherside of king
            if (this.movingPiece.x - originalX == 2){
                let piece = this.getRook(true);
                piece.x = this.movingPiece.x - 1;
                piece.moved = true;
                this.notation = 'O-O';
            } else if (this.movingPiece.x - originalX == -2){
                let piece = this.getRook(false);
                piece.x = this.movingPiece.x + 1;
                piece.moved = true;
                this.notation = 'O-O-O';
            }
        } else if (this.msg == 'enP-left' || this.msg == 'enP-right'){ // takes piece to the side of the pawn not diagonally
            this.pieceTake(this.movingPiece.x, originalY, this.movingPiece.white);
            this.notation = 'x' + this.letters[this.movingPiece.x] + String(8-this.movingPiece.y) + 'e.p.';
        } else {
            this.notation = this.movingPiece.text;
            if (this.pieceTake(this.movingPiece.x, this.movingPiece.y, this.movingPiece.white) != 0){
                this.notation += 'x';
            }
            this.notation += this.letters[this.movingPiece.x] + String(8-this.movingPiece.y);
        }
    }
    castle(x,startX){
        this.movingPiece.x = startX;
        if (startX - x == 2){
            //queen side castle
            if(this.inCheck){
                return true;
            }
            for (let i = 1; i<3; i++){
                this.movingPiece.x = startX - i;
                this.updateTakeArr(!this.whiteMove);
                if (this.isCheck(this.whiteMove) != 0){
                    return true
                }
            }
            return [x, this.movingPiece.y];
        } else if (startX - x == -2){
            //king side castle
            if(this.inCheck){
                return true;
            }
            for (let i = 1; i<3; i++){
                this.movingPiece.x = startX + i;
                this.updateTakeArr(!this.whiteMove);
                if (this.isCheck(this.whiteMove) != 0){
                    return true
                }
            }
            return [x, this.movingPiece.y];
        } else {
            this.movingPiece.x = x;
            return false;
        }
    }
    getRook(king){
        if (king){
            if (this.whiteMove){
                for (let i = 0; i < this.whitePieces.length; i++){
                    if (this.whitePieces[i].x == 7 && this.whitePieces[i].y == this.movingPiece.y){
                        return this.whitePieces[i];
                    }
                }
            } else {
                for (let i = 0; i < this.blackPieces.length; i++){
                    if (this.blackPieces[i].x == 7 && this.blackPieces[i].y == this.movingPiece.y){
                        return this.blackPieces[i];
                    }
                }
            }
        } else {
            if (this.whiteMove){
                for (let i = 0; i < this.whitePieces.length; i++){
                    if (this.whitePieces[i].x == 0 && this.whitePieces[i].y == this.movingPiece.y){
                        return this.whitePieces[i];
                    }
                }
            } else {
                for (let i = 0; i < this.blackPieces.length; i++){
                    if (this.blackPieces[i].x == 0 && this.blackPieces[i].y == this.movingPiece.y){
                        return this.blackPieces[i];
                    }
                }
            }
        }
    }
    enPLeft(x, startX, startY){
        if (startX - x == 1){
            let takenPiece = this.pieceTake(this.movingPiece.x, startY, this.movingPiece.white);
            this.updateTakeArr(!this.whiteMove);

            if(this.isCheck(this.whiteMove) == 0){
                if (this.movingPiece.white){
                    this.blackPieces.push(takenPiece);
                } else {
                    this.whitePieces.push(takenPiece);
                }
                return 'success';
            } else {
                if (this.movingPiece.white){
                    this.blackPieces.push(takenPiece);
                } else {
                    this.whitePieces.push(takenPiece);
                }
                return 'fail';
            }
        }else{
            return false;
        }
    }
    enPRight(x, startX, startY){
        if (startX - x == -1){
            let takenPiece = this.pieceTake(this.movingPiece.x, startY, this.movingPiece.white);
            this.updateTakeArr(!this.whiteMove);

            if(this.isCheck(this.whiteMove) == 0){
                if (this.movingPiece.white){
                    this.blackPieces.push(takenPiece);
                } else {
                    this.whitePieces.push(takenPiece);
                }
                return 'success';
            } else {
                if (this.movingPiece.white){
                    this.blackPieces.push(takenPiece);
                } else {
                    this.whitePieces.push(takenPiece);
                }
                return 'fail';
            }
        }else{
            return false;
        }
    }
    pieceTake(x, y, white){ // returns piece if taken and 0 if not
        if(white){
            for(let i = 0; i < this.blackPieces.length; i++){
                if (this.blackPieces[i].x == x && this.blackPieces[i].y == y){
                    let piece = this.blackPieces[i];
                    this.blackPieces.splice(i, 1);
                    return piece;
                }
            }
        } else {
            for(let i = 0; i < this.whitePieces.length; i++){
                if (this.whitePieces[i].x == x && this.whitePieces[i].y == y){
                    let piece = this.whitePieces[i];
                    this.whitePieces.splice(i, 1);
                    return piece;
                }
            }
        }
        return 0;
    }
    promotionHandle(){ // handles promotion notation and logic
        if (this.movingPiece.text == '' && (this.movingPiece.y == 0 || this.movingPiece.y == 7)){
            if (this.movingPiece.white){
                this.whitePieces.push(new queen(this.movingPiece.x, this.movingPiece.y, this.movingPiece.white, this));
                let index = this.whitePieces.indexOf(this.movingPiece);
                this.whitePieces.splice(index, 1);
            } else {
                this.blackPieces.push(new queen(this.movingPiece.x, this.movingPiece.y, this.movingPiece.white, this));
                let index = this.blackPieces.indexOf(this.movingPiece);
                this.blackPieces.splice(index, 1);
            }
            this.notation += 'Q';
        }
    }
    updateTakeArr(white){ // update possible taking squares of a color
        if(white){
            this.whiteTakeMoves = [];
            for (let i = 0; i < this.whitePieces.length; i++){
                this.whitePieces[i].mapLegal();
                for (let j = 0; j < this.whitePieces[i].take.length; j++){
                    this.whiteTakeMoves.push(this.whitePieces[i].take[j]);
                }
            }
        } else {
            this.blackTakeMoves = [];
            for (let i = 0; i < this.blackPieces.length; i++){
                this.blackPieces[i].mapLegal();
                for (let j = 0; j < this.blackPieces[i].take.length; j++){
                    this.blackTakeMoves.push(this.blackPieces[i].take[j]);
                }
            }
        }
    }
    updatePrev(originalX, originalY){ //update most recent moves and their square colors
        this.prev.push([originalX, originalY]);
            this.prev.push([this.movingPiece.x, this.movingPiece.y]);

            for (let i = 0; i < this.prev.length; i++){
                let x = this.prev[i][0];
                let y = this.prev[i][1];
                if (this.squares[x][y].block == this.lightSqCol){
                    this.squares[x][y].block = this.lightPrevCol;
                } else {
                    this.squares[x][y].block = this.darkPrevCol;
                }
                this.squares[x][y].coord = this.changedCoordCol;
            }
    }
    isCheck(white){ // evaluate checks in a position using opposite sides taking moves
        if (white){
            for (let i = 0; i < this.whitePieces.length; i++){
                if (this.whitePieces[i].constructor.name == king.name){
                    var x = this.whitePieces[i].x;
                    var y = this.whitePieces[i].y;
                }
            }
            for (let i = 0; i < this.blackTakeMoves.length; i++){
                if (this.blackTakeMoves[i][0] == x && this.blackTakeMoves[i][1] == y){
                    return [x, y];
                }
            }
        } else {
            for (let i = 0; i < this.blackPieces.length; i++){
                if (this.blackPieces[i].constructor.name == king.name){
                    var x = this.blackPieces[i].x;
                    var y = this.blackPieces[i].y;
                }
            }
            for (let i = 0; i < this.whiteTakeMoves.length; i++){
                if (this.whiteTakeMoves[i][0] == x && this.whiteTakeMoves[i][1] == y){
                    return [x, y];
                }
            }
        }
        return 0;
    }
    updateScroll(){ // make div scroll when new move added to notation
        let div = document.querySelector('#notation-board');
        div.scrollTop = div.scrollHeight;
    }
    hasMoves(white){ // check if any legal moves available for any pieces to see if position is in checkmate or stalemate
        if (white){
            for (let i = 0; i < this.whitePieces.length; i++){
                let piece = this.whitePieces[i];
                piece.mapLegal();
                let originalX = piece.x;
                let originalY = piece.y;
                let arr = piece.legal;
                for(let i = 0; i < arr.length;i++){
                    piece.x = arr[i][0];
                    piece.y = arr[i][1];
                    let takenPiece = this.pieceTake(piece.x, piece.y, piece.white);
                    this.updateTakeArr(!this.whiteMove)
                    if(this.isCheck(this.whiteMove) == 0){
                        if (takenPiece != 0){
                            if (piece.white){
                                this.blackPieces.push(takenPiece);
                            } else {
                                this.whitePieces.push(takenPiece);
                            }
                        }
                        piece.x = originalX;
                        piece.y = originalY;
                        return true
                    }
                    if (takenPiece != 0){
                        if (piece.white){
                            this.blackPieces.push(takenPiece);
                        } else {
                            this.whitePieces.push(takenPiece);
                        }
                    }
                }
                piece.x = originalX;
                piece.y = originalY;
            }
        } else {
            for (let i = 0; i < this.blackPieces.length; i++){
                let piece = this.blackPieces[i];
                piece.mapLegal();
                let originalX = piece.x;
                let originalY = piece.y;
                let arr = piece.legal;
                for(let i = 0; i < arr.length;i++){
                    piece.x = arr[i][0];
                    piece.y = arr[i][1];
                    let takenPiece = this.pieceTake(piece.x, piece.y, piece.white);
                    this.updateTakeArr(!this.whiteMove)
                    if(this.isCheck(this.whiteMove) == 0){
                        if (takenPiece != 0){
                            if (piece.white){
                                this.blackPieces.push(takenPiece);
                            } else {
                                this.whitePieces.push(takenPiece);
                            }
                        }
                        piece.x = originalX;
                        piece.y = originalY;
                        return true
                    }
                    if (takenPiece != 0){
                        if (piece.white){
                            this.blackPieces.push(takenPiece);
                        } else {
                            this.whitePieces.push(takenPiece);
                        }
                    }
                }
                piece.x = originalX;
                piece.y = originalY;
            }
        }
        return false;
    }
    timeHandle(){ // gets time between last reading and changes html values accordingly
        this.endTime = new Date().getTime();
        let difference = (this.endTime - this.startTime)/1000;
        if (this.whiteMove){
            this.whiteTime -= difference;
            if (this.whiteTime <= 0){
                document.querySelector('#whiteTime').innerHTML = "0:00";
                this.playing = false;
                this.endMsg = 'time out';
                this.winnerMsg = 'black wins';
            } else {
                let value = Math.floor(this.whiteTime);
                let min = Math.floor(value/60);
                let sec = String(value % 60);
                if (sec.length < 2){
                    sec = "0" + sec;
                }
                document.querySelector('#whiteTime').innerHTML = String(min) + ":" + String(sec);
            }
        } else{
            this.blackTime -= difference;
            if (this.blackTime <= 0){
                document.querySelector('#blackTime').innerHTML = "0:00";
                this.playing = false;
                this.endMsg = 'time out';
                this.winnerMsg = 'white wins';
            } else {
                let value = Math.floor(this.blackTime);
                let min = Math.floor(value/60);
                let sec = String(value % 60);
                if (sec.length < 2){
                    sec = "0" + sec;
                }
                document.querySelector('#blackTime').innerHTML = String(min) + ":" + String(sec);
            }
        }
        this.startTime = new Date().getTime();
    }
    resign(){ // ends game loop and changes values to display
        this.endMsg = 'resignation';
        this.playing = false;
        if (this.whiteMove){
            this.winnerMsg = 'black wins';
        } else {
            this.winnerMsg = 'white wins';
        }
    }
    draw(){ // ends game loop and changes values to display
        this.endMsg = 'draw agreed';
        this.playing = false;
        this.winnerMsg = 'draw';
    }
}
function main(){
    
    document.querySelector('#firstGameForm').addEventListener('submit', function(evt){ // adds listener for submition of first form
        evt.preventDefault();
        document.querySelector('#welcomeElements').className = 'hidden';
        document.querySelector('#playingElements').className = 'shown';
        let whiteTimeVal = document.querySelector('#firstGameWhiteClock').value;
        let blackTimeVal = document.querySelector('#firstGameBlackClock').value;
        b = new board(); // creates new board
        b.whiteTime = whiteTimeVal;
        b.blackTime = blackTimeVal;
        b.initTime();

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

        frame();
    })


    function frame(){
        b.timeHandle(); // handle time each frame
        b.ctx.clearRect(0, 0, b.width, b.height); // clear board
        
        b.drawGrid(); // draw grid
        b.drawPieces(); // draw pieces

        if (b.playing){ // create new frame if playing
            requestAnimationFrame(frame);
        } else { // update messages and listen for newgame and then play submitionss
            document.querySelector('#endMsg').innerHTML = b.endMsg;
            document.querySelector('#winnerMsg').innerHTML = b.winnerMsg;
            b.endMsgBox.className = 'shown';
            let newGame = document.querySelector('#newGame');
            newGame.addEventListener('click', function(){
                newGame.className = 'hidden';
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
                    newGame.className = '';
                    document.querySelector('#white-moves').innerHTML = "";
                    document.querySelector('#black-moves').innerHTML = "";
                    b = new board();
                    b.whiteTime = whiteTimeVal;
                    b.blackTime = blackTimeVal;
                    b.initTime();
                    frame();
                });
            });
        }
    }
}

window.onload = main;

function replace_pawn(){
    document.getElementById("replacement").style.display = "block";
}