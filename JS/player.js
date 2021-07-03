class player{ // add functions which will use general function in board.js to move player
    constructor(board){ // need to run function when piece pressed - then check if move is in legal array then change variables hangle msgs, update take arr, scan for check, checkmate, and stalemate
        this.board = board;
        this.pieces = [];
    }
    pickUp(){ // search pieces to see if mouse over any when clicked
        for (let i = 0; i < this.pieces.length; i++){
            let piece = this.pieces[i];
            if (piece.x == Math.floor(this.board.mouse[0]/(this.board.canvas_width/8)) && piece.y == Math.floor(this.board.mouse[1]/(this.board.canvas_width/8))){
                this.board.movingPiece = piece;
                this.board.pieceUpdateLegal(this.board.movingPiece);
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
        let movePos = this.board.canMove();
        if (movePos[0]){
            this.board.movingPiece.x = movePos[1];
            this.board.movingPiece.y = movePos[2];
            
            this.board.movingVariableHandle(this.board.movingPiece);
            
            this.board.notation = '';

            this.board.msgHandle();

            if (this.promotionHandle() == false){
                this.board.completeMove();
                if (this.board.playing){
                    this.board.c.move();
                }
            }
        } else {
            this.board.movingPiece = 0;
            this.pickUp(); // check if same color piece has been clicked which would restart process
        }

    }
    promotionHandle(){ // handles promotion notation and logic
        if (this.board.movingPiece.text == '' && (this.board.movingPiece.y == 0 || this.board.movingPiece.y == 7)){
            document.querySelector('#replacement').style.display = "block";
            return true;
        }
        return false;
    }
    replaceForPiece(){
        let index = this.pieces.indexOf(this.board.movingPiece);
        this.pieces.splice(index, 1);
        document.getElementById("replacement").style.display = "none";
        this.board.completeMove();
        if (this.board.playing){
            this.board.c.move();
        }
    }
}