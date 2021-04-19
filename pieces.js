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
        if (this.moved == true){
            return false;
        }
        if (this.board.pieceAt(this.x + 1, this.y, this.white) != 'null' || this.board.pieceAt(this.x + 2, this.y, this.white) != 'null'){
            return false;
        }
        if (this.white){
            for (let i = 0; i < this.board.whitePieces.length; i++){
                if (this.board.whitePieces[i].x == this.x + 3 && this.board.whitePieces[i].y == this.y){
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
                if (this.board.blackPieces[i].x == this.x + 3 && this.board.blackPieces[i].y == this.y){
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
        if (this.moved == true){
            return false;
        }
        if (this.board.pieceAt(this.x - 1, this.y, this.white) != 'null' || this.board.pieceAt(this.x - 2, this.y, this.white) != 'null' || this.board.pieceAt(this.x - 3, this.y, this.white) != 'null'){
            return false;
        }
        if (this.white){
            for (let i = 0; i < this.board.whitePieces.length; i++){
                if (this.board.whitePieces[i].x == this.x - 4 && this.board.whitePieces[i].y == this.y){
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
                if (this.board.blackPieces[i].x == this.x - 4 && this.board.blackPieces[i].y == this.y){
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
            if (this.x >= 0 && this.x < 8 && y>=0 && y < 8){
                if (this.board.pieceAt(this.x, y, this.white) != 'null'){
                    return;
                }
                this.legal.push([this.x, y]);
            }
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