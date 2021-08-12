class computer{
    constructor(board){
        this.board = board;
        this.depth = 4;
        this.pieces = [];
        this.val = 0;
    }

    findMove(){
        this.t = new tree(this.depth, this);
        
        let possibleNodes = [];
        for (let child of this.t.root.children){
            if (child.val == this.t.root.val){
                possibleNodes.push(child);
            }
        }
        //let index = Math.floor(Math.random() * revisedNodes.length);
        let index = 0; // for testing so moves between alpha beta pruning and not can be compared
        let n = possibleNodes[index];
        this.move(n);
    }

    move(node){
        //move piece
        //take piece
        //reference board to complete move
        this.board.movingPiece = node.movedPiece;
        this.board.originalX = this.board.movingPiece.x;
        this.board.originalY = this.board.movingPiece.y;
        this.board.movingPiece.x = node.move[0];
        this.board.movingPiece.y = node.move[1];


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
    constructor(fen = null, originalPosition = null, parent = null, movedPiece = null, takenPiece = null, move = null){
        this.originalPosition = originalPosition;
        this.fen = fen;
        this.parent = parent;
        this.movedPiece = movedPiece;
        this.takenPiece = takenPiece;
        this.move = move;
        this.children = [];
        this.val = 0;
    }
}

class tree{
    
    constructor(depth, computer){
        //reference minimax search
        this.depth = depth;
        this.c = computer;
        this.root = new node(this.c.board.fen);
        let maximisingPlayer;
        if (this.c.board.isPlayerWhite){
            maximisingPlayer = false;
        } else {
            maximisingPlayer = true;
        }
        let alpha = -Infinity;
        let beta = Infinity;
        this.minimax(this.depth, this.root, maximisingPlayer, alpha, beta);
        console.log(this.root);
        console.log(this.c.val);
        this.c.val = 0;

    }
    
    minimax(depth, parent, maximisingPlayer, alpha, beta){
        
        
        
        //check if end of game
        let n = parent;
        try{
            this.c.board.updateTakeArr(n.movedPiece.player); // update opposite color available taking moves
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
                if (depth == 0){
                    this.c.val += 1;
                }
                return;
            }
        } catch {}



        //if end of search evaluate position
        if (depth == 0){
            n.val = evalPos(n.fen);
            this.c.val += 1;
        } else {
            let movingArr, takenPiece, rookPiece, rookX, rookY, change, tempPiece, moved;
            if ((this.depth - depth)%2 == 0){
                movingArr = this.c.pieces;
            } else {
                movingArr = this.c.board.p.pieces;
            }
            let extremeVal;
            if (maximisingPlayer){
                extremeVal = -Infinity;
            } else {
                extremeVal = Infinity;
            }
            for (let piece of movingArr){
                if (!piece.taken){
                    //save original position and update legal
                    
                    let originalX = piece.x;
                    let originalY = piece.y;
                    this.c.board.pieceUpdateLegal(piece, parent.fen);
                    let legalMoves = [];
                    for (let m of piece.legal){
                        legalMoves.push(m);
                    }
                    for (let move of legalMoves){
                        //move piece whilst handling exception moves like castling and enP
                        
                        let promoted = false;
                        piece.x = move[0];
                        piece.y = move[1];
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
                            
                            } else if (detail == 'rook'){
                                
                                let i = movingArr.indexOf(piece);
                                movingArr[i] = new rook(piece.x, piece.y, piece.white, piece.player, this.c.board);
                                //piece = movingArr[i];
                                tempPiece = movingArr[i];
                                promoted = true;
                            
                            } else if (detail == 'bishop'){
                                
                                let i = movingArr.indexOf(piece);
                                movingArr[i] = new bishop(piece.x, piece.y, piece.white, piece.player, this.c.board);
                                //piece = movingArr[i];
                                tempPiece = movingArr[i];
                                promoted = true;
                            
                            } else if (detail == 'knight'){
                                
                                let i = movingArr.indexOf(piece);
                                movingArr[i] = new knight(piece.x, piece.y, piece.white, piece.player, this.c.board);
                                //piece = movingArr[i];
                                tempPiece = movingArr[i];
                                promoted = true;
                            
                            }
                            
                            
                            
                            takenPiece = this.c.board.pieceTake(piece.x, piece.y, piece.player);
                        }

                        //create a newFen to send to child to determine moves allowed and board state

                        let newFen = this.c.board.createFen(parent.fen, piece, piece.x, piece.y, originalX, originalY, takenPiece);
                        let originalPosition = String(originalX) + String(originalY)
                        //determine if in check to pass to eval func
                        
                        this.c.board.updateTakeArr(piece.player);
                        let isCheck = 0; // returns 0 if no checks and true or false depending on which colour has checked the other with true being white
                        if (this.c.board.isCheck(!piece.player) != 0){
                            isCheck = piece.white;
                        }
                        //create new node and start new search
                        let n = new node(newFen, originalPosition, parent, piece, takenPiece, move);
                        let pruned = this.minimax(depth - 1, n, !maximisingPlayer, alpha, beta);

                        if (!pruned){
                            parent.children.push(n);
                        }
                        
                        //undo move for next move on this depth
                        
                        if (detail == 'castle'){
                            rookPiece.x = rookX;
                            rookPiece.y = rookY;
                        }
                        if (promoted){
                            let i = movingArr.indexOf(tempPiece);
                            movingArr[i] = piece;
                        }
                        this.undoMove(n);

                        //calculate if value of child node is the best move at this depth using minimax

                        if (maximisingPlayer){
                            extremeVal = Math.max(extremeVal, n.val);
                            parent.val = extremeVal;
                            alpha = Math.max(alpha, n.val);
                        } else {
                            extremeVal = Math.min(extremeVal, n.val);
                            parent.val = extremeVal;
                            beta = Math.min(beta, n.val);
                        }
                        if (beta <= alpha){
                            //if best choice for maximiser earlier on in the tree is better or equal to the best choice for the minimizer so far then prune branch of tree without appending child to parent
                            return true; //pruned
                        }
                    }
                }
            }
        }
        return false;
    }

    undoMove(node){
        if (node.takenPiece != 0){
            node.takenPiece.taken = false
        }
        node.movedPiece.x = parseInt(node.originalPosition[0]);
        node.movedPiece.y = parseInt(node.originalPosition[1]);

    }
}

function evalPos(fen){
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
    return val;
}