//nodes need move notation to work out start position and end position after move i.e. 23-53 - rook moving to the right - once again 0-7 index for x,y positions
//nodes also need Fen position (after move made)
//nodes need reference to parent
//nodes need children array
//nodes need reference to movedpiece and takenpiece
//nodes need value
//nodes need copy of the other colours arrray - if takenpiece is sliced and not self.taken = true


class computer{
    constructor(board){
        this.board = board;
        this.depth = 3;
        this.pieces = [];
        this.val = 0;
    }

    findMove(){
        //reference tree which will reference minimax search
        //of all moves that are best select on randomly to show variety
        //return a move
        this.t = new tree(this.depth, this);
        
        let values = [];
        for (let child of this.t.root.children){
            values.push(child.val)
        }
        let best = this.t.root.val;
        let possibleNodes = [];
        for (let child of this.t.root.children){
            if (child.val == best){
                possibleNodes.push(child);
            }
        }
        let currentValues = [];
        for (let pos of possibleNodes){
            currentValues.push(pos.currentVal)
        }
        let bestVal;
        if (this.board.isPlayerWhite){
            bestVal = this.t.getMin(currentValues)
        } else {
            bestVal = this.t.getMax(currentValues)
        }
        let revisedNodes = [];
        for (let pos of possibleNodes){
            if (pos.currentVal == bestVal){
                revisedNodes.push(pos);
            }
        }
        let index = Math.floor(Math.random() * revisedNodes.length);
        let n = revisedNodes[index];
        this.move(n);
    }

    move(node){
        //move piece
        //take piece
        //reference board to complete move
        this.board.movingPiece = node.movedPiece
        this.board.originalX = this.board.movingPiece.x;
        this.board.originalY = this.board.movingPiece.y;
        this.board.movingPiece.x = node.move[0]
        this.board.movingPiece.y = node.move[1]


        let rookX, rookY, change;
        if (node.move[2] == 'castle'){
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
        } else if (node.move[2] == 'enP'){
            this.board.takenPiece = this.board.pieceTake(this.board.movingPiece.x, this.board.originalY, this.board.movingPiece.player);
        } else {
            
            if (node.move[2] == 'queen'){
                                
                let i = this.pieces.indexOf(this.board.movingPiece);
                this.pieces[i] = new queen(this.board.movingPiece.x, this.board.movingPiece.y, this.board.movingPiece.white, this.board.movingPiece.player, this.board);
                this.board.movingPiece = this.pieces[i];
            
            } else if (node.move[2] == 'rook'){
                
                let i = this.pieces.indexOf(this.board.movingPiece);
                this.pieces[i] = new rook(this.board.movingPiece.x, this.board.movingPiece.y, this.board.movingPiece.white, this.board.movingPiece.player, this.board);
                this.board.movingPiece = this.pieces[i];
            
            } else if (node.move[2] == 'bishop'){
                
                let i = this.pieces.indexOf(this.board.movingPiece);
                this.pieces[i] = new bishop(this.board.movingPiece.x, this.board.movingPiece.y, this.board.movingPiece.white, this.board.movingPiece.player, this.board);
                this.board.movingPiece = this.pieces[i];
            
            } else if (node.move[2] == 'knight'){
                
                let i = this.pieces.indexOf(this.board.movingPiece);
                this.pieces[i] = new knight(this.board.movingPiece.x, this.board.movingPiece.y, this.board.movingPiece.white, this.board.movingPiece.player, this.board);
                this.board.movingPiece = this.pieces[i];
            
            }
            
            
            this.board.takenPiece = this.board.pieceTake(this.board.movingPiece.x, this.board.movingPiece.y, this.board.movingPiece.player);
        }
        this.board.completeMove();


    }
}

class node{
    constructor(fen = null, originalPosition = null, parent = null, movedPiece = null, takenPiece = null, notation = null, move = null, isCheck = 0){
        this.originalPosition = originalPosition;
        this.fen = fen;
        this.parent = parent;
        this.movedPiece = movedPiece;
        this.takenPiece = takenPiece;
        this.notation = notation;
        this.children = [];
        this.val = 0;
        this.Apositions = 0;
        this.positionChildren = [];
        this.move = move;
        this.isCheck = isCheck;
        this.currentVal = evalPos(this.fen, this.isCheck); // current val allows any good moves to be made as computer was randomly stumbling upon good move order as it saw it had time - this helps it to acheive best position quicker
    }
}

class tree{
    
    constructor(depth, computer){
        //reference minimax search
        this.depth = depth;
        this.c = computer;
        this.root = new node(this.c.board.fen);
        this.minimax(this.depth, this.root);
        console.log(this.root);
        console.log(this.c.val);

    }
    
    minimax(depth, parent){
        /*if depth == 0
            evaluate position and save value
        else
            using parent fen get array of pieces that are going to be moved
            for each piece in the array
                if they are not taken
                    save original position
                    updateLegal
                    hardcopy move array
                    for each move in arrary
                        move piece to x and y position
                        if detail is en passant
                            takenpiece = one behind from where piece is moving to
                        else if detail is castle
                            if change in x is positive
                                get rook at (7, same y position)
                                rook goes to one left of king
                            else
                                get rook at (0, same y position)
                                rook goes to 1 right of king
                        else
                            takenpiece is where piece is moving to

                        if promotion:
                            change to queen

                        create new fen string for new node
                        
                        create new node with necessary info

                        minimax(depth-1, new node as parent)

                        push new node to parent's children array

                        if detail is castle
                            rook goes back to starting position
                        if just promoted
                            change piece back to pawn
                        
                        undoMove()

        
        */
        if (depth == 0){
            let n = parent;
            this.c.board.updateTakeArr(n.movedPiece.player) // update opposite color available taking moves
            if (this.c.board.hasMoves(!n.movedPiece.player) == false){
                if(this.c.board.isCheck(!n.movedPiece.player) != 0){
                    if (n.movedPiece.white){
                        n.val = Infinity;
                    } else {
                        n.val = -Infinity
                    }
                } else {
                    n.val = 0;
                }
                n.currentVal = n.val;
            } else {
                n.val = n.currentVal;
            }
            this.c.val += 1;
            n.Apositions = 1;
        } else {
            let movingArr, takenPiece, rookPiece, rookX, rookY, change, tempPiece, moved;
            if ((this.depth - depth)%2 == 0){
                movingArr = this.c.pieces;
            } else {
                movingArr = this.c.board.p.pieces;
            }
            moved = false;
            for (let piece of movingArr){
                if (!piece.taken){
                    let originalX = piece.x;
                    let originalY = piece.y;
                    this.c.board.pieceUpdateLegal(piece, parent.fen);
                    let legalMoves = [];
                    for (let m of piece.legal){
                        legalMoves.push(m);
                    }
                    for (let move of legalMoves){
                        if (!moved){
                            moved = true;
                        }
                        let notation = '';
                        let promoted = false;
                        piece.x = move[0];
                        piece.y = move[1];
                        if (this.c.board.isPlayerWhite){
                            notation += this.c.board.letters[originalX] + String(8-originalY);
                        } else {
                            notation += this.c.board.letters[7 - originalX] + String(originalY + 1);
                        }
                        if (this.c.board.isPlayerWhite){
                            notation += this.c.board.letters[move[0]] + String(8-move[1]);
                        } else {
                            notation += this.c.board.letters[7 - move[0]] + String(move[1] + 1);
                        }
                        let detail = move[2];
                        if (detail == 'enP'){
                            takenPiece = this.c.board.pieceTake(piece.x, originalY, piece.player);
                        } else if (detail == 'castle'){
                            if (piece.x - originalX > 0){
                                rookX = 7;
                                change = -1;
                            } else {
                                rookX = 0;
                                change = 1;
                            }
                            if ((this.depth - depth)%2 == 1){ // if player pieces are being moved
                                rookY = 7;
                            } else {
                                rookY = 0;
                            }
                            rookPiece = this.c.board.posGet(rookX, rookY);
                            rookPiece.x = piece.x + change;
                            takenPiece = 0;
                        } else {

                            
                            if (detail == 'queen'){
                                
                                let i = movingArr.indexOf(piece);
                                movingArr[i] = new queen(piece.x, piece.y, piece.white, piece.player, this.c.board);
                                //piece = movingArr[i];
                                tempPiece = movingArr[i];
                                promoted = true;
                                notation += 'q';
                            
                            } else if (detail == 'rook'){
                                
                                let i = movingArr.indexOf(piece);
                                movingArr[i] = new rook(piece.x, piece.y, piece.white, piece.player, this.c.board);
                                //piece = movingArr[i];
                                tempPiece = movingArr[i];
                                promoted = true;
                                notation += 'r';
                            
                            } else if (detail == 'bishop'){
                                
                                let i = movingArr.indexOf(piece);
                                movingArr[i] = new bishop(piece.x, piece.y, piece.white, piece.player, this.c.board);
                                //piece = movingArr[i];
                                tempPiece = movingArr[i];
                                promoted = true;
                                notation += 'b';
                            
                            } else if (detail == 'knight'){
                                
                                let i = movingArr.indexOf(piece);
                                movingArr[i] = new knight(piece.x, piece.y, piece.white, piece.player, this.c.board);
                                //piece = movingArr[i];
                                tempPiece = movingArr[i];
                                promoted = true;
                                notation += 'n';
                            
                            }
                            
                            
                            
                            takenPiece = this.c.board.pieceTake(piece.x, piece.y, piece.player);
                        }
                        let newFen = this.c.board.createFen(parent.fen, piece, piece.x, piece.y, originalX, originalY, takenPiece);
                        let originalPosition = String(originalX) + String(originalY)
                        this.c.board.updateTakeArr(piece.player);
                        let isCheck = 0; // returns 0 if no checks and true or false depending on which colour has checked the other with true being white
                        if (this.c.board.isCheck(!piece.player) != 0){
                            isCheck = piece.white;
                        }
                        let n = new node(newFen, originalPosition, parent, piece, takenPiece, notation, move, isCheck);
                        this.minimax(depth - 1, n);
                        parent.children.push(n);
                        parent.positionChildren.push(n.notation);
                        parent.positionChildren.push(String(n.Apositions));
                        if (detail == 'castle'){
                            rookPiece.x = rookX;
                            rookPiece.y = rookY;
                        }
                        if (promoted){
                            let i = movingArr.indexOf(tempPiece);
                            movingArr[i] = piece;
                        }
                        this.undoMove(n);
                    }
                }
            }
            if (!moved){
                this.c.board.updateTakeArr(parent.movedPiece.player) // update opposite color available taking moves
                if(this.c.board.isCheck(!parent.movedPiece.player) != 0){
                    if (parent.movedPiece.white){
                        parent.val = Infinity;
                    } else {
                        parent.val = -Infinity
                    }
                } else {
                    parent.val = 0;
                }
                parent.currentVal = parent.val;
            } else {
                let values = [];
                let numOfPositions = 0;
                for (let child of parent.children){
                    values.push(child.val)
                    numOfPositions += child.Apositions;
                }
                parent.Apositions = numOfPositions;
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

    undoMove(node){
        /*if takenpiece != 0:
            takenPiece.taken = false
        
        
        move node.piece back to original position
    */
        if (node.takenPiece != 0){
            node.takenPiece.taken = false
        }
        node.movedPiece.x = parseInt(node.originalPosition[0]);
        node.movedPiece.y = parseInt(node.originalPosition[1]);

    }
}

function evalPos(fen, isCheck){
    let fenPos = fen['position'];
    let val = 0;
    let colorFactor = 0;
    for (let c of fenPos){
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
    if (isCheck != 0){
        if (isCheck == true){
            if (val > 0){
                val *= 1.05
            } else {
                val /= 1.05
            }
        } else {
            if (val > 0){
                val /= 1.05
            } else {
                val *= 1.05
            }
        }
    }
    return val;
}