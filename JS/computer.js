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

        this.board.movingVariableHandle(this.board.movingPiece); // change piece.moved and justMoved variables

        this.board.notation = ''; // reset notation

        this.board.msgHandle(); // handle move if message is not normal for castling and en passant

        this.board.completeMove();

    }
    pickPiece(){
        this.t = new tree(this.depth, this);
        let positions = 0;
        for (let child of this.t.masterNode.children){
            for (let a of child.children){
                for (let b of a.children){
                    for (let c of b.children){
                        positions += 1;
                    }
                }
            }
            console.log(child.note + ': ' + positions)
            positions = 0
        }
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
    constructor(fen, computer, x = 0, y = 0, piece = 0, originalX = 0, originalY = 0, takenPiece = 0, parent = 0, array = [], note = "", moved){
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
        this.array = array;
        this.note = note;
        this.moved = moved;
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
            let copy = [];
            for (let p of altArr){
                copy.push(p);
            }
            for (let piece of arr){
                let x = piece.x;
                let y = piece.y;
                this.c.board.pieceUpdateLegal(piece);
                /*let moveArray = [];
                for (let m of piece.legal){
                    moveArray.push(m)
                }*/
                for (let move of piece.legal){
                    let notation = "";
                    piece.x = move[0];
                    piece.y = move[1];
                    if (this.c.board.isPlayerWhite){
                        notation += this.c.board.letters[x] + String(8-y);
                    } else {
                        notation += this.c.board.letters[7 - x] + String(y + 1);
                    }
                    if (this.c.board.msg[0] == 'enP-left' || this.c.board.msg[0] == 'enP-right' && this.c.board.inArr([move[0], move[1]], this.c.board.msg)){
                        takenPiece = this.c.board.pieceTake(move[0], y, piece.player);
                        console.log('en passant');
                    } else if (piece.text == 'K' && (Math.abs(piece.x - x) > 1)){
                        let rook;
                        if (move[0] - x == this.c.board.castleDir * 2){
                            rook = this.c.board.getRook(true, move[1], piece.player);
                            rook.x = piece.x - this.c.board.castleDir * 1;
                        } else if (move[0] - x == this.c.board.castleDir * -2){
                            rook = this.c.board.getRook(false, move[1], piece.player);
                            rook.x = piece.x + this.c.board.castleDir * 1;
                        }
                        rook.moved = true;
                        takenPiece = 'castle';
                        if (arr == this.c.board.p.pieces){
                            console.log('castle for player');
                        } else{
                            console.log('castle for computer');
                        }
                    } else {

                        takenPiece = this.c.board.pieceTake(move[0], move[1], piece.player);
                        if (this.c.board.isPlayerWhite){
                            notation += this.c.board.letters[move[0]] + String(8-move[1]);
                        } else {
                            notation += this.c.board.letters[7 - move[0]] + String(move[1] + 1);
                        }
                    }
                    let moved = this.c.board.movingVariableHandle(piece);
                    let n = new node(this.c.board.createFen(), this.c, move[0], move[1], piece, x, y, takenPiece, parent, copy, notation, moved);
                    this.depthFunc(depth-1, n);
                    parent.children.push(n);
                    this.reMove(n);
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
        let allPieces = this.c.board.p.pieces.concat(this.c.pieces);
        let piece = node.piece;
        let takenPiece = node.takenPiece;
        if (takenPiece != 0){
            if (takenPiece == 'castle'){
                let multiplier = (piece.x - node.originalX)/2;
                let rook = this.c.board.posGet(piece.x - multiplier, piece.y, allPieces);
                if (multiplier == 1){
                    rook.x = 7;
                } else {
                    rook.x = 0;
                }
                rook.moved = false;
                //console.log('reverse castle')
            } else {
                let newArr;
                if (takenPiece.player){
                    newArr = this.c.board.p.pieces;
                } else {
                    newArr = this.c.pieces;
                }
                for (let i=0; i<node.array.length; i++){
                    if (node.array[i] != newArr[i]){
                        newArr.splice(i, 0, takenPiece);
                        break;
                    }
                }
            }
        }
        piece.x = node.originalX;
        piece.y = node.originalY;
        if (node.moved){
            piece.moved = false;
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