//basically the same just only check castling and en passant if fen allows it, also make moves = [x,y,detail]
//all mepLegal functions will take Fen dict
//for pawns check y position if they can move up two, no use of variable :)
//details for castling = "castle"
//details for en passant = "enP"
//details for promotion but do that later
//dont add pieces to pieces array when contructed
class pieces{ // basic outline for each piece
    constructor(x, y, white, player, board){
        this.x = x;
        this.y = y;
        this.white = white;
        this.player = player;
        this.board = board;
        this.legal = [];
        this.take = [];
        this.taken = false;
    }

    display(){} // displays piece
    mapLegal(){} // using different function to calculate legal moves for each piece without looking for checks
}

class king extends pieces{
    constructor(x, y, white, player, board){
        super(x, y, white, player, board);
        this.text = 'K';
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
    mapLegal(fen){ 
        this.legal = [];
        for (let i = -1; i < 2; i++){ // look at 3 by 3 square around king and check if friendly piece on squares
            for (let j = -1; j < 2; j++){
                let x = this.x + i;
                let y = this.y + j;
                if (x >= 0 && x < 8 && y>=0 && y < 8){
                    if (x != this.x || y != this.y){
                        if (this.board.pieceAt(x, y, this.player) != true){
                            this.legal.push([x, y, 'normal']);
                        }
                    }
                }
            }
        }
        
        this.take = this.legal;
        //castling based on fen
        if (this.white){
            if (fen['castling'].includes('K')){
                if (this.kCastle()){
                    this.legal.push([this.x + (2 * this.board.castleDir), this.y, 'castle']);
                }
            }
            if (fen['castling'].includes('Q')){
                if (this.qCastle()){
                    this.legal.push([this.x - (2 * this.board.castleDir), this.y, 'castle'])
                }
            }
        } else {
            if (fen['castling'].includes('k')){
                if (this.kCastle()){
                    this.legal.push([this.x + (2 * this.board.castleDir), this.y, 'castle']);
                }
            }
            if (fen['castling'].includes('q')){
                if (this.qCastle()){
                    this.legal.push([this.x - (2 * this.board.castleDir), this.y, 'castle'])
                }
            }
        }
    }
    kCastle(){ // check if pieces in way of castling  and rook has not moved
        if (this.board.pieceAt(this.x + this.board.castleDir * 1, this.y, this.player) != 'null' || this.board.pieceAt(this.x + this.board.castleDir * 2, this.y, this.player) != 'null'){
            return false;
        }
        return true;
    }
    qCastle(){ // check if pieces in way of castling  and rook has not moved
        if (this.board.pieceAt(this.x - this.board.castleDir * 1, this.y, this.player) != 'null' || this.board.pieceAt(this.x - this.board.castleDir * 2, this.y, this.player) != 'null' || this.board.pieceAt(this.x - this.board.castleDir * 3, this.y, this.player) != 'null'){
            return false;
        }
        return true;
    }
}

class queen extends pieces{
    constructor(x, y, white, player, board){
        super(x, y, white, player, board);
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
    mapLegal(fen){ // uses for loops to calculate legal moves in each direction
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
    }
    up(){
        for (let i = 0; i < this.y; i++){
            if (this.board.pieceAt(this.x, this.y - i - 1, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x, this.y - i - 1, this.player) == false){
                this.legal.push([this.x, this.y - i - 1, 'normal']);
                return;
            }
            this.legal.push([this.x, this.y - i - 1, 'normal']);
        }
    }
    down(){
        for (let i = 0; i < 7 - this.y; i++){
            if (this.board.pieceAt(this.x, this.y + i + 1, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x, this.y + i + 1, this.player) == false){
                this.legal.push([this.x, this.y + i + 1, 'normal']);
                return;
            }
            this.legal.push([this.x, this.y + i + 1, 'normal']);
        }
    }
    left(){
        for (let i = 0; i < this.x; i++){
            if (this.board.pieceAt(this.x - i - 1, this.y, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x - i - 1, this.y, this.player) == false){
                this.legal.push([this.x - i - 1, this.y, 'normal']);
                return;
            }
            this.legal.push([this.x - i - 1, this.y, 'normal']);
        }
    }
    right(){
        for (let i = 0; i < 7 - this.x; i++){
            if (this.board.pieceAt(this.x + i + 1, this.y, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x + i + 1, this.y, this.player) == false){
                this.legal.push([this.x + i + 1, this.y, 'normal']);
                return;
            }
            this.legal.push([this.x + i + 1, this.y, 'normal']);
        }
    }
    up_left(){
        const min = Math.min(this.x, this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x - i - 1, this.y - i - 1, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x - i - 1, this.y - i - 1, this.player) == false){
                this.legal.push([this.x - i - 1, this.y - i - 1, 'normal']);
                return;
            }
            this.legal.push([this.x - i - 1, this.y - i - 1, 'normal']);
        }
    }
    down_left(){
        const min = Math.min(this.x, 7 - this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x - i - 1, this.y + i + 1, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x - i - 1, this.y + i + 1, this.player) == false){
                this.legal.push([this.x - i - 1, this.y + i + 1, 'normal']);
                return;
            }
            this.legal.push([this.x - i - 1, this.y + i + 1, 'normal']);
        }
    }
    up_right(){
        const min = Math.min(7 - this.x, this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x + i + 1, this.y - i - 1, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x + i + 1, this.y - i - 1, this.player) == false){
                this.legal.push([this.x + i + 1, this.y - i - 1, 'normal']);
                return;
            }
            this.legal.push([this.x + i + 1, this.y - i - 1, 'normal']);
        }
    }
    down_right(){
        const min = Math.min(7 - this.x, 7 - this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x + i + 1, this.y + i + 1, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x + i + 1, this.y + i + 1, this.player) == false){
                this.legal.push([this.x + i + 1, this.y + i + 1, 'normal']);
                return;
            }
            this.legal.push([this.x + i + 1, this.y + i + 1, 'normal']);
        }
    }
}

class rook extends pieces{
    constructor(x, y, white, player, board){
        super(x, y, white, player, board);
        this.text = 'R';
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
    mapLegal(fen){ // uses for loops to calculate legal moves in each direction
        this.legal = [];
        this.up();
        this.down();
        this.left();
        this.right();
        this.take = this.legal;
    }
    up(){
        for (let i = 0; i < this.y; i++){
            if (this.board.pieceAt(this.x, this.y - i - 1, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x, this.y - i - 1, this.player) == false){
                this.legal.push([this.x, this.y - i - 1, 'normal']);
                return;
            }
            this.legal.push([this.x, this.y - i - 1, 'normal']);
        }
    }
    down(){
        for (let i = 0; i < 7 - this.y; i++){
            if (this.board.pieceAt(this.x, this.y + i + 1, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x, this.y + i + 1, this.player) == false){
                this.legal.push([this.x, this.y + i + 1, 'normal']);
                return;
            }
            this.legal.push([this.x, this.y + i + 1, 'normal']);
        }
    }
    left(){
        for (let i = 0; i < this.x; i++){
            if (this.board.pieceAt(this.x - i - 1, this.y, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x - i - 1, this.y, this.player) == false){
                this.legal.push([this.x - i - 1, this.y, 'normal']);
                return;
            }
            this.legal.push([this.x - i - 1, this.y, 'normal']);
        }
    }
    right(){
        for (let i = 0; i < 7 - this.x; i++){
            if (this.board.pieceAt(this.x + i + 1, this.y, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x + i + 1, this.y, this.player) == false){
                this.legal.push([this.x + i + 1, this.y, 'normal']);
                return;
            }
            this.legal.push([this.x + i + 1, this.y, 'normal']);
        }
    }
}

class bishop extends pieces{
    constructor(x, y, white, player, board){
        super(x, y, white, player, board);
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
    mapLegal(fen){ // uses for loops to calculate legal moves in each direction
        this.legal = [];
        this.up_left();
        this.down_left();
        this.up_right();
        this.down_right();
        this.take = this.legal;
    }
    up_left(){
        const min = Math.min(this.x, this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x - i - 1, this.y - i - 1, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x - i - 1, this.y - i - 1, this.player) == false){
                this.legal.push([this.x - i - 1, this.y - i - 1, 'normal']);
                return;
            }
            this.legal.push([this.x - i - 1, this.y - i - 1, 'normal']);
        }
    }
    down_left(){
        const min = Math.min(this.x, 7 - this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x - i - 1, this.y + i + 1, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x - i - 1, this.y + i + 1, this.player) == false){
                this.legal.push([this.x - i - 1, this.y + i + 1, 'normal']);
                return;
            }
            this.legal.push([this.x - i - 1, this.y + i + 1, 'normal']);
        }
    }
    up_right(){
        const min = Math.min(7 - this.x, this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x + i + 1, this.y - i - 1, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x + i + 1, this.y - i - 1, this.player) == false){
                this.legal.push([this.x + i + 1, this.y - i - 1, 'normal']);
                return;
            }
            this.legal.push([this.x + i + 1, this.y - i - 1, 'normal']);
        }
    }
    down_right(){
        const min = Math.min(7 - this.x, 7 - this.y);
        for (let i = 0; i < min; i++){
            if (this.board.pieceAt(this.x + i + 1, this.y + i + 1, this.player) == true){
                return;
            } else if (this.board.pieceAt(this.x + i + 1, this.y + i + 1, this.player) == false){
                this.legal.push([this.x + i + 1, this.y + i + 1, 'normal']);
                return;
            }
            this.legal.push([this.x + i + 1, this.y + i + 1, 'normal']);
        }
    }
}

class knight extends pieces{
    constructor(x, y, white, player, board){
        super(x, y, white, player, board);
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
    mapLegal(fen){ // uses change in position in each direction to check for legal moves
        this.legal = [];
        const moves = [[-2, -1], [-2, 1], [-1, -2], [1, -2], [2, -1], [2, 1], [-1, 2], [1, 2]];
        for (let i = 0; i < moves.length; i++){
            let x = this.x + moves[i][0];
            let y = this.y + moves[i][1];
            if (x >= 0 && x < 8 && y>=0 && y < 8){
                if(this.board.pieceAt(x, y, this.player) != true){
                    this.legal.push([x, y, 'normal']);
                }
            }
        }
        this.take = this.legal;
    }
}

class pawn extends pieces{
    constructor(x, y, white, player, board){
        super(x, y, white, player, board);
        this.text = '';
        this.displayedText = 'P';
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
    mapLegal(fen){ // calculate legal moves forwards and also diagonally if pawn can take a piece
        this.legal = [];
        this.take = [];
        var dir = 1;
        if (this.player){
            dir = -1
        }
        let len = 1;
        if (this.player && this.y == 6){
            len = 2;
        } else if (!this.player && this.y == 1){
            len = 2;
        }

        let promotionY;
        if (this.player){
            promotionY = 0;
        } else {
            promotionY = 7;
        }

        for (let i = 0; i < len; i++){
            let y = this.y + (i + 1) * dir;
            if (this.x >= 0 && this.x < 8 && y>=0 && y < 8){
                if (this.board.pieceAt(this.x, y, this.player) == 'null'){
                    if (y == promotionY){
                        this.legal.push([this.x, y, 'queen']);
                        this.legal.push([this.x, y, 'rook']);
                        this.legal.push([this.x, y, 'bishop']);
                        this.legal.push([this.x, y, 'knight']);
                    } else {
                        this.legal.push([this.x, y, 'normal']);
                    }
                } else{
                    break;
                }
            }
        }
        
        

        let y = this.y + (1*dir)
        if (this.board.pieceAt(this.x - 1, y, this.player) == false){
            if (y == promotionY){
                this.legal.push([this.x - 1, y, 'queen']);
                this.legal.push([this.x - 1, y, 'rook']);
                this.legal.push([this.x - 1, y, 'bishop']);
                this.legal.push([this.x - 1, y, 'knight']);
                this.take.push([this.x - 1, y, 'queen']);
                this.take.push([this.x - 1, y, 'rook']);
                this.take.push([this.x - 1, y, 'bishop']);
                this.take.push([this.x - 1, y, 'knight']);
            } else {
                this.legal.push([this.x - 1, y, 'normal']);
                this.take.push([this.x - 1, y, 'normal']);
            }
        } else if (this.board.pieceAt(this.x - 1, y, this.player) == 'null'){
            if (y == promotionY){
                this.take.push([this.x - 1, y, 'queen']);
                this.take.push([this.x - 1, y, 'rook']);
                this.take.push([this.x - 1, y, 'bishop']);
                this.take.push([this.x - 1, y, 'knight']);
            } else {
                this.take.push([this.x - 1, y, 'normal']);
            }
        }
        if (this.board.pieceAt(this.x + 1, y, this.player) == false){
            if (y == promotionY){
                this.legal.push([this.x + 1, y, 'queen']);
                this.legal.push([this.x + 1, y, 'rook']);
                this.legal.push([this.x + 1, y, 'bishop']);
                this.legal.push([this.x + 1, y, 'knight']);
                this.take.push([this.x + 1, y, 'queen']);
                this.take.push([this.x + 1, y, 'rook']);
                this.take.push([this.x + 1, y, 'bishop']);
                this.take.push([this.x + 1, y, 'knight']);
            } else {
                this.legal.push([this.x + 1, y, 'normal']);
                this.take.push([this.x + 1, y, 'normal']);
            }
            
        } else if (this.board.pieceAt(this.x + 1, y, this.player) == 'null'){
            if (y == promotionY){
                this.take.push([this.x + 1, y, 'queen']);
                this.take.push([this.x + 1, y, 'rook']);
                this.take.push([this.x + 1, y, 'bishop']);
                this.take.push([this.x + 1, y, 'knight']);
            } else {
                this.take.push([this.x + 1, y, 'normal']);
            }
        }

        //write for en passant using fen
        if(fen['enP'] != '-'){
            let x, y;
            if (this.board.isPlayerWhite){
                x = this.board.letters.indexOf(fen['enP'][0]);
                y = 8 - parseInt(fen['enP'][1]);
            } else {
                x = 7 - this.board.letters.indexOf(fen['enP'][0]);
                y = parseInt(fen['enP'][1]) - 1;
            }
            let change;
            if (this.player){
                change = -1;
            } else {
                change = 1;
            }
            if ((this.x == x + 1  || this.x == x - 1) && (this.y + change == y)){   
                this.legal.push([x, y, 'enP']);
            }
        }


    }
    /*diaganol(dir){ // check if pieces can take diagonally and for en passant
        let y = this.y + (1*dir)
        if (this.board.pieceAt(this.x - 1, y, this.player) == false){
            this.legal.push([this.x - 1, y]);
            this.take.push([this.x - 1, y]);
        }
        if (this.board.pieceAt(this.x + 1, y, this.player) == false){
            this.legal.push([this.x + 1, y]);
            this.take.push([this.x + 1, y]);
        }
        if(this.player){
            if(this.y == 3){
                let arr = [-1, 1];
                for (let i = 0; i < arr.length; i++){
                    let x = arr[i];
                    for (let i = 0; i<this.board.c.pieces.length; i++){
                        if (this.board.c.pieces[i].x == this.x + x && this.board.c.pieces[i].y == this.y){
                            try{
                                if (this.board.c.pieces[i].justMoved == true){
                                    this.legal.push([this.x + x, this.y - 1]);
                                    if (x == -1){
                                        return ['enP-left', [this.x + x, this.y - 1]];
                                    } else {
                                        return ['enP-right', [this.x + x, this.y - 1]];
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
                    for (let i = 0; i<this.board.p.pieces.length; i++){
                        if (this.board.p.pieces[i].x == this.x + x && this.board.p.pieces[i].y == this.y){
                            try{
                                if (this.board.p.pieces[i].justMoved == true){
                                    this.legal.push([this.x + x, this.y + 1]);
                                    if (x == -1){
                                        return ['enP-left', [this.x + x, this.y + 1]];
                                    } else {
                                        return ['enP-right', [this.x + x, this.y + 1]];
                                    }
                                }
                            }catch{}
                        }
                    }
                }
            }
        }
        return false;
    }*/
}