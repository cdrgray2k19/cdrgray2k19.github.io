//same just different loop about moving
class player{ // add functions which will use general function in board.js to move player
    constructor(board){ // need to run function when piece pressed - then check if move is in legal array then change variables hangle msgs, update take arr, scan for check, checkmate, and stalemate
        this.board = board;
        this.pieces = [];
    }
    pickUp(){ // search pieces to see if mouse over any when clicked
        for (let i = 0; i < this.pieces.length; i++){
            let piece = this.pieces[i];
            if (piece.x == Math.floor(this.board.mouse[0]/(this.board.canvas_width/8)) && piece.y == Math.floor(this.board.mouse[1]/(this.board.canvas_width/8)) && piece.taken == false){
                this.board.movingPiece = piece;
                this.board.pieceUpdateLegal(this.board.movingPiece, this.board.fen);
                this.showLegal();
            }
        }
    }
    showLegal(){
        if (this.board.squares[this.board.movingPiece.x][this.board.movingPiece.y].block == this.board.lightSqCol){
            this.board.squares[this.board.movingPiece.x][this.board.movingPiece.y].block = this.board.lightPrevCol;
        } else {
            this.board.squares[this.board.movingPiece.x][this.board.movingPiece.y].block = this.board.darkPrevCol;
        }

        this.board.squares[this.board.movingPiece.x][this.board.movingPiece.y].coord = this.board.changedCoordCol;
        
        for(let i = 0; i < this.board.movingPiece.legal.length;i++){
            if ((this.board.movingPiece.legal[i][0] + this.board.movingPiece.legal[i][1]) % 2 == 0){
                this.board.squares[this.board.movingPiece.legal[i][0]][this.board.movingPiece.legal[i][1]].block = this.board.lightLegalCol;
            } else {
                this.board.squares[this.board.movingPiece.legal[i][0]][this.board.movingPiece.legal[i][1]].block = this.board.darkLegalCol;
            }
            this.board.squares[this.board.movingPiece.legal[i][0]][this.board.movingPiece.legal[i][1]].coord = this.board.changedCoordCol;
        }
    }
    drop(){
        this.board.clearGrid();
        let move = this.board.canMove();
        if (move != 0){
            this.board.originalX = this.board.movingPiece.x;
            this.board.originalY = this.board.movingPiece.y;
            this.board.movingPiece.x = move[0];
            this.board.movingPiece.y = move[1];

            let rookX, rookY, change;
            if (move[2] == 'castle'){
                if (this.board.movingPiece.x - this.board.originalX > 0){
                    rookX = 7;
                    change = -1;
                } else {
                    rookX = 0;
                    change = 1;
                }
                if (this.board.playerMove){
                    rookY = 7;
                } else {
                    rookY = 0;
                }
                let rook = this.board.posGet(rookX, rookY);
                rook.x = this.board.movingPiece.x + change;
                this.board.takenPiece = 0;
            } else if (move[2] == 'enP'){
                this.board.takenPiece = this.board.pieceTake(this.board.movingPiece.x, this.board.originalY, this.board.movingPiece.player);
            } else {
                this.board.takenPiece = this.board.pieceTake(this.board.movingPiece.x, this.board.movingPiece.y, this.board.movingPiece.player);
            }

            if (this.promotionHandle() == false){
                this.board.completeMove();
                if (this.board.playing){
                    this.board.c.findMove();
                }
            }
        } else {
            this.board.movingPiece = 0;
            this.pickUp(); // check if same color piece has been clicked which would restart process
        }
    }
    promotionHandle(){ // handles promotion notation and logic
        if ((this.board.movingPiece.constructor.name == pawn.name) && (this.board.movingPiece.y == 0)){
            document.querySelector('#replacement').style.display = "block";
            return true;
        }
        return false;
    }
    replaceForPiece(){
        /*let index = this.pieces.indexOf(this.board.movingPiece);
        this.pieces.splice(index, 1);*/
        document.getElementById("replacement").style.display = "none";
        this.board.completeMove();
        if (this.board.playing){
            this.board.c.findMove();
        }
    }
}