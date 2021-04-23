class computer{ // add functions which will use general function in board.js to move AI
    constructor(board){ // need to use functions which will allow computer to move, then change variables, hangle msgs, update take arr, scan for check, checkmate, and stalemate
        this.board = board;
        this.pieces = [];
    }
    randomMove(){
        this.getMovablePiece();
        let index = Math.floor(Math.random() * this.board.movingPiece.legal.length)
        let move = this.board.movingPiece.legal[index];
        let x = move[0];
        let y = move[1];
        this.board.movingPiece.x = x;
        this.board.movingPiece.y = y;

        this.board.movingVariableHandle(); // change piece.moved and justMoved variables

        this.board.notation = ''; // reset notation

        this.board.msgHandle(); // handle move if message is not normal for castling and en passant

        this.board.completeMove();

    }
    getMovablePiece(){
        let index = Math.floor(Math.random() * this.pieces.length)
        let piece = this.pieces[index];

        this.board.movingPiece = piece;
        this.board.pieceUpdateLegal();
        if (this.board.movingPiece.legal.length == 0){
            this.getMovablePiece();
        }
    }
}