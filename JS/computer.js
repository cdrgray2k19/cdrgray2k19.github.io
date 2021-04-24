class computer{ // add functions which will use general function in board.js to move AI
    constructor(board){ // need to use functions which will allow computer to move, then change variables, hangle msgs, update take arr, scan for check, checkmate, and stalemate
        this.board = board;
        this.pieces = [];
    }
    move(){
        let move = this.pickPiece();
        let x = move[0];
        let y = move[1];
        this.board.originalX = this.board.movingPiece.x;
        this.board.originalY = this.board.movingPiece.y;
        this.board.movingPiece.x = x;
        this.board.movingPiece.y = y;

        this.board.movingVariableHandle(); // change piece.moved and justMoved variables

        this.board.notation = ''; // reset notation

        this.board.msgHandle(); // handle move if message is not normal for castling and en passant

        this.board.completeMove();

    }
    pickPiece(){
        let values = []
        this.t = new tree(1, this);
        for (let child of this.t.masterNode.children){
            values.push(child.val);
        }
        let max = 0;
        for (let i = 0; i < values.length; i++){
            let v = values[i]
            if (i == 0){
                max = v;
            } else {
                if (this.board.isPlayerWhite){
                    if (v < max){
                        max = v
                    }
                } else {
                    if (v > max){
                        max = v
                    }
                }
            }
        }
        let index, node;
        let currentMax = this.t.masterNode.val;
        if (max == currentMax){
            let possibleNodes = [];
            for (let child of this.t.masterNode.children){
                if (child.val == currentMax){
                    possibleNodes.push(child);
                }
            }
            index = Math.floor(Math.random() * possibleNodes.length);
            node = possibleNodes[index];
        } else {
            index = values.indexOf(max);
            node = this.t.masterNode.children[index];
        }
        this.board.movingPiece = node.piece;
        return [node.x, node.y];
    }
}
class node{
    constructor(fen, computer, x, y, piece){
        this.fen = fen;
        this.c = computer;
        this.x = x;
        this.y = y;
        this.piece = piece;
        this.val = evalPos(this.fen);
        this.children = [];
    }
}

class tree{
    constructor(depth, computer){//create node depending on depth
        this.depth = depth;
        this.c = computer;
        this.masterNode = new node(this.c.board.createFen(), this.c);
        for (let piece of this.c.pieces){
            let x = piece.x;
            let y = piece.y;
            this.c.board.movingPiece = piece;
            this.c.board.pieceUpdateLegal();
            for (let move of this.c.board.movingPiece.legal){
                this.c.board.movingPiece.x = move[0];
                this.c.board.movingPiece.y = move[1];
                let takenPiece = this.c.board.pieceTake(move[0], move[1], piece.player);
                this.masterNode.children.push(new node(this.c.board.createFen(), this.c, move[0], move[1], piece));
                if (takenPiece!=0){
                    this.c.board.p.pieces.push(takenPiece);
                }
            }
            this.c.board.movingPiece.x = x;
            this.c.board.movingPiece.y = y;
        }
        this.c.board.movingPiece = 0;
    }
}

//create evaluation for pieces + if white, - if black , 0 if draw
function evalPos(fen){
    let val = 0;
    let colorFactor = 0;
    for (let c of fen){
        if ((/[a-zA-Z]/).test(c)){
            if (c == c.toUpperCase()){
                colorFactor = 1;
                c = c.toLowerCase();
            } else if (c == c.toLowerCase()){
                colorFactor = -1;
            }
            switch(c){
                case 'k':
                    val += 900 * colorFactor
                    break;
                case 'q':
                    val += 90 * colorFactor
                    break;
                case 'r':
                    val += 50 * colorFactor
                    break;
                case 'b':
                    val += 30 * colorFactor
                    break;
                case 'n':
                    val += 30 * colorFactor
                    break;
                case 'p':
                    val += 10 * colorFactor
                    break;
            }
        }
    }
    return val;
}