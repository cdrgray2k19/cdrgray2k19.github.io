class pieces{
    constructor(x, y, white, board){
        this.x = x;
        this.y = y;
        this.white = white;
        this.board = board;
        this.legal = [];
        this.take = [];
    }

    display(){}
    mapLegal(){}
}

class king extends pieces{
    constructor(x, y, white, board){
        super(x, y, white, board);
        this.text = 'K';
        this.moved = false;
    }
    display(){
        if (this.white){
            this.board.ctx.fillStyle = '#808080';
        }else{
            this.board.ctx.fillStyle = '#000000';
        }
        this.board.ctx.fillText(this.text, this.x * this.board.sqSize + this.board.sqSize/2, this.y * this.board.sqSize + this.board.sqSize/2);
    }
    mapLegal(){ // add kingside and queenside castling function - check two squares for no knight and no bishop and then check that king hasnt been moved and rook hasnt been moved, then check for checks on all squares that king is at or crosses
        this.legal = [];
        for (let i = -1; i < 2; i++){
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
            // need to check all squares out of check including current
            this.legal.push([this.x + 2, this.y]);
            returnMsg = 'castle'
        }
        if (this.queenSideCastle()){
            // need to check all squares out of check including current
            this.legal.push([this.x - 2, this.y]);
            returnMsg = 'castle'
        }
        return returnMsg;
    }
    kingSideCastle(){
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
    queenSideCastle(){
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
    }
    display(){
        if (this.white){
            this.board.ctx.fillStyle = '#808080';
        }else{
            this.board.ctx.fillStyle = '#000000';
        }
        this.board.ctx.fillText(this.text, this.x * this.board.sqSize + this.board.sqSize/2, this.y * this.board.sqSize + this.board.sqSize/2);
    }
    mapLegal(){
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
    }
    display(){
        if (this.white){
            this.board.ctx.fillStyle = '#808080';
        }else{
            this.board.ctx.fillStyle = '#000000';
        }
        this.board.ctx.fillText(this.text, this.x * this.board.sqSize + this.board.sqSize/2, this.y * this.board.sqSize + this.board.sqSize/2);
    }
    mapLegal(){
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
    }
    display(){
        if (this.white){
            this.board.ctx.fillStyle = '#808080';
        }else{
            this.board.ctx.fillStyle = '#000000';
        }
        this.board.ctx.fillText(this.text, this.x * this.board.sqSize + this.board.sqSize/2, this.y * this.board.sqSize + this.board.sqSize/2);
    }
    mapLegal(){
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
    }
    display(){
        if (this.white){
            this.board.ctx.fillStyle = '#808080';
        }else{
            this.board.ctx.fillStyle = '#000000';
        }
        this.board.ctx.fillText(this.text, this.x * this.board.sqSize + this.board.sqSize/2, this.y * this.board.sqSize + this.board.sqSize/2);
    }
    mapLegal(){
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
        this.text = 'P';
        this.moved = false;
        this.justMoved = false;
    }
    display(){
        if (this.white){
            this.board.ctx.fillStyle = '#808080';
        }else{
            this.board.ctx.fillStyle = '#000000';
        }
        this.board.ctx.fillText(this.text, this.x * this.board.sqSize + this.board.sqSize/2, this.y * this.board.sqSize + this.board.sqSize/2);
    }
    mapLegal(){ // add varaible which allows pawn to indicate if its just been moved and then write function to check for en passant moves
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
    diaganol(dir){
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
        this.canvas = document.querySelector('#c');
        this.ctx = this.canvas.getContext("2d");
        this.ctx.textAlgin = 'center';
        this.smallFont = "15px Georgia";
        this.bigFont = "30px Georgia";
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.sqSize = this.width/8;
        this.whitePieces = [];
        this.blackPieces = [];
        this.whiteMove = true;
        this.mouse = [];
        this.movingPiece = 0;
        this.createGrid();
        this.createPieces();
        this.updateTakeArr(true);
        this.updateTakeArr(false);
        this.inCheck = 0; // if color which is being moved is not in check it stores 0 if it is then it stores an array with the king x,y pos in it to color its square
        this.msg = 0; // stores message that is received from maplegal function which can tell mousepress2 how to behave if different move called like castling or en passant
        this.prev = [];
    }
    createGrid(){
        this.squares = [];
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){
                if ((x+y) % 2 == 0){
                    var block_num = '#ffffff';
                    var coord_num = '#0000ff';
                } else {
                    var block_num = '#0000ff';
                    var coord_num = '#ffffff';
                }
                if (y == 0){
                    this.squares.push([]);
                }
                this.squares[x].push({block: block_num, coord: coord_num})
            }
        }
    }
    drawGrid(){
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

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
                    let value = letters[x];
                    this.ctx.fillText(value, x * this.sqSize + this.sqSize * 9/10, y * this.sqSize + this.sqSize* 14/15);
                }
            }
        }
    }
    createPieces(){
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
    drawPieces(){
        this.ctx.font = this.bigFont;
        for (let i = 0; i < this.whitePieces.length; i++){
            this.whitePieces[i].display();
        }
        for (let i = 0; i < this.blackPieces.length; i++){
            this.blackPieces[i].display();
        }
    }

    mousePress1(){
        if (this.whiteMove){
            for (let i = 0; i < this.whitePieces.length; i++){
                let piece = this.whitePieces[i];
                if (piece.x == Math.floor(this.mouse[0]/this.sqSize) && piece.y == Math.floor(this.mouse[1]/this.sqSize)){
                    this.piecePressed(piece);
                }
            }
        } else {
            for (let i = 0; i < this.blackPieces.length; i++){
                let piece = this.blackPieces[i];
                if (piece.x == Math.floor(this.mouse[0]/this.sqSize) && piece.y == Math.floor(this.mouse[1]/this.sqSize)){
                    this.piecePressed(piece);
                }
            }
        }
    }
    mousePress2(){
        this.createGrid(); // remove any green legal blocks

        if (this.inCheck != 0){ // keep any red check blocks
            let king_x = this.inCheck[0];
            let king_y = this.inCheck[1];
            this.squares[king_x][king_y].block = '#ff0000'
            this.squares[king_x][king_y].coord = '#000000'
        }
        for (let i = 0; i < this.prev.length; i++){
            let x = this.prev[i][0];
            let y = this.prev[i][1];
            if (this.squares[x][y].block == '#ffffff'){
                this.squares[x][y].block = '#ff9eff';
            } else {
                this.squares[x][y].block = '#ff00ff';
            }
            this.squares[x][y].coord = '#000000';
        }

        let x = Math.floor(this.mouse[0]/this.sqSize);
        let y = Math.floor(this.mouse[1]/this.sqSize);
        let pos = [x, y];
        let value = this.inArr(pos, this.movingPiece.legal);

        if (value){
            let originalX = this.movingPiece.x;
            let originalY = this.movingPiece.y;
            this.movingPiece.x = x; // move
            this.movingPiece.y = y; // move
            
            this.movingVariableHandle();

            if (this.msg == 'castle'){
                if (this.movingPiece.x - originalX == 2){
                    let piece = this.getRook(true);
                    piece.x = this.movingPiece.x - 1;
                    piece.moved = true;
                } else if (this.movingPiece.x - originalX == -2){
                    let piece = this.getRook(false);
                    piece.x = this.movingPiece.x + 1;
                    piece.moved = true;
                }
            } else if (this.msg == 'enP-left' || this.msg == 'enP-right'){
                this.pieceTake(this.movingPiece.x, originalY, this.movingPiece.white);
            }
            
            this.pieceTake(this.movingPiece.x, this.movingPiece.y, this.movingPiece.white); // check for piece take
            
            this.updateTakeArr(this.whiteMove); // update current colors for taking moves

            this.inCheck = 0;

            this.msg = 0;

            this.prev = [];

            this.createGrid(); // remove any red check blocks

            this.prev.push([originalX, originalY]);
            this.prev.push([this.movingPiece.x, this.movingPiece.y]);

            for (let i = 0; i < this.prev.length; i++){
                let x = this.prev[i][0];
                let y = this.prev[i][1];
                if (this.squares[x][y].block == '#ffffff'){
                    this.squares[x][y].block = '#ff9eff';
                } else {
                    this.squares[x][y].block = '#ff00ff';
                }
                this.squares[x][y].coord = '#000000';
            }

            this.movingPiece = 0; // refresh moving piece variable for next go
            
            this.whiteMove = !(this.whiteMove); // change move color
            
            if(this.isCheck(this.whiteMove) != 0){ // check new color for checks before anything else
                let x = this.isCheck(this.whiteMove)[0];
                let y = this.isCheck(this.whiteMove)[1];
                this.inCheck = [x, y];
                this.squares[x][y].block = '#ff0000'
                this.squares[x][y].coord = '#000000'
                if(this.hasMoves(this.whiteMove) == false){
                    console.log('checkmate!');
                }
            } else {
                if(this.hasMoves(this.whiteMove) == false){
                    console.log('stalemate!');
                }
            }


        } else {
            this.mousePress1(); // check if same color piece has been clicked which would restart process
        }
    }
    piecePressed(piece){
        this.pieceUpdateLegal(piece);
        this.movingPiece = piece;
        this.squares[this.movingPiece.x][this.movingPiece.y].block = '#6be2f9';
        this.squares[this.movingPiece.x][this.movingPiece.y].coord = '#000000';
        for(let i = 0; i < this.movingPiece.legal.length;i++){
            if (this.squares[this.movingPiece.legal[i][0]][this.movingPiece.legal[i][1]].block == '#ffffff'){
                this.squares[this.movingPiece.legal[i][0]][this.movingPiece.legal[i][1]].block = '#39ff14';
            } else {
                this.squares[this.movingPiece.legal[i][0]][this.movingPiece.legal[i][1]].block = '#22bc22';
            }
            this.squares[this.movingPiece.legal[i][0]][this.movingPiece.legal[i][1]].coord = '#000000';
        }
    }
    inArr(arr1, arr2){ // had problem comparing 2d array values so made this function which has a very general application
        for (let i = 0; i < arr2.length; i++){
            if(arr1[0] == arr2[i][0] && arr1[1] == arr2[i][1]){
                return true;
            }
        }
        return false;
    }
    pieceAt(x, y, white){

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
    pieceTake(x, y, white){
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
    updateTakeArr(white){
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
    isCheck(white){
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
    pieceUpdateLegal(piece){
        this.movingPiece = piece;
        this.msg = this.movingPiece.mapLegal(); // get legal moves depending on board and store msg which stores any other info about the legal moves
        let originalX = this.movingPiece.x; // store original x and y positoin
        let originalY = this.movingPiece.y;
        let arr = this.movingPiece.legal; // make it easier to manipulate array
        let arr2 = []; // open array to store legal moves after checks analysed
        for(let i = 0; i < arr.length;i++){
            this.movingPiece.x = arr[i][0]; // temporarily move pieces
            this.movingPiece.y = arr[i][1]; // temporarily move pieces
            if (this.msg == 'castle'){
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
    hasMoves(white){
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
    movingVariableHandle(){
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
}
function main(){
    b = new board();

    b.canvas.addEventListener('mousemove', function(evt) {
        let rect = b.canvas.getBoundingClientRect();
        let x = (evt.clientX - rect.left - 5);
        let y = (evt.clientY - rect.top - 5);
        b.mouse = [];
        b.mouse.push(x);
        b.mouse.push(y);
    });
    b.canvas.addEventListener('mousedown', function() {
        if (b.movingPiece == 0){
            b.mousePress1();
        } else {
            b.mousePress2();
        }
    });


    var img = new Image();
    img.src = '/heart_sprite.png';
    img.onload = function() {    
        b.ctx.clearRect(0, 0, canvas.width, canvas.height);
        b.ctx.drawImage(img, 320, 320, 50, 50);
    };
    
    //frame();


    function frame(){
        b.ctx.clearRect(0, 0, b.width, b.height);
        
        
        b.drawGrid();
        b.drawPieces();


        requestAnimationFrame(frame);
    }
}

window.onload = main;