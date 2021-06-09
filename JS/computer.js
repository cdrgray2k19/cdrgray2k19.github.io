class computer{ // add functions which will use general function in board.js to move AI
    constructor(board){ // need to use functions which will allow computer to move, then change variables, hangle msgs, update take arr, scan for check, checkmate, and stalemate
        this.board = board;
        this.depth = 2;
        this.pieces = [];
        this.val = 0;
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
        this.t = new tree(this.depth, this);
        let values = [];
        for (let child of this.t.masterNode.children){
            values.push(child.val)
        }
        let best = this.t.masterNode.val;
        let possibleNodes = [];
        for (let child of this.t.masterNode.children){
            if (child.val == best){
                possibleNodes.push(child);
            }
        }
        let index = Math.floor(Math.random() * possibleNodes.length);
        let n = possibleNodes[index];
        
        this.board.movingPiece = n.piece;
        return [n.x, n.y];
    }
}
class node{
    constructor(fen, computer, x = 0, y = 0, piece = 0, originalX = 0, originalY = 0, takenPiece = 0, parent = 0, index = 0){
        this.fen = fen;
        this.c = computer;
        this.x = x;
        this.y = y;
        this.piece = piece;
        this.originalX = originalX;
        this.originalY = originalY;
        this.takenPiece = takenPiece;
        this.val = 0;
        this.children = [];
        this.parent = parent;
        this.index = index;
    }
}

class tree{
    constructor(depth, computer){//create node depending on depth
        this.depth = depth;
        this.c = computer;
        this.masterNode = new node(this.c.board.createFen(), this.c);
        this.depthFunc(this.depth, this.masterNode);
        console.log(this.c.val);
        console.log(this.masterNode);
    }

    depthFunc(depth, parent){
        if (depth == 0){
            let n = parent;
            n.val = (evalPos(n.fen));
            this.c.val += 1; // for testing
        } else {
            let arr, altArr, takenPiece;
            if ((this.depth-depth) % 2 == 0){
                arr = this.c.pieces;
                altArr = this.c.board.p.pieces;
            } else {
                arr = this.c.board.p.pieces;
                altArr = this.c.pieces;
            }
            for (let piece of arr){
                let x = piece.x;
                let y = piece.y;
                this.c.board.pieceUpdateLegal(piece);
                for (let move of piece.legal){
                    piece.x = move[0];
                    piece.y = move[1];
                    for(let i = 0; i < altArr.length; i++){
                        if (altArr[i].x == move[0] && altArr[i].y == move[1]){
                            console.log(i);
                        }
                    }
                    takenPiece = this.c.board.pieceTake(move[0], move[1], piece.player);
                    let n = new node(this.c.board.createFen(), this.c, move[0], move[1], piece, x, y, takenPiece, parent)
                    parent.children.push(n);
                    this.depthFunc(depth-1, n);
                    this.reMove(n)
                }
            }
            let values = [];
            for (let child of parent.children){
                values.push(child.val)
            }
            if ((this.depth - depth)%2 == 0){
                if (this.c.board.isPlayerWhite){
                    parent.val = this.getMin(values);
                } else {
                    parent.val = this.getMax(values);
                }
            } else {
                if (this.c.board.isPlayerWhite){
                    parent.val = this.getMax(values);
                } else {
                    parent.val = this.getMin(values);
                }
            }  
        }
    }

    getMax(arr){
        let max = 0;
        for (let i = 0; i < arr.length; i++){
            if (i == 0){
                max = arr[i];
            } else {
                if (arr[i] > max){
                    max = arr[i];
                }
            }
        }
        return max
    }

    getMin(arr){
        let min = 0;
        for (let i = 0; i < arr.length; i++){
            if (i == 0){
                min = arr[i];
            } else {
                if (arr[i] < min){
                    min = arr[i];
                }
            }
        }
        return min
    }
    
    reMove(node){
        let piece = node.piece;
        piece.x = node.originalX;
        piece.y = node.originalY;
        let takenPiece = node.takenPiece;
        if (takenPiece != 0){
            if (takenPiece.player){
                this.c.board.p.pieces.splice(0, 0, takenPiece);
                //this.c.board.p.pieces.push(takenPiece);
            } else {
                this.c.pieces.splice(0, 0, takenPiece);
                //this.c.pieces.push(takenPiece);
            }
        }
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