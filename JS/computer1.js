class computer{
    constructor(board){
        this.board = board;
        this.depth = 3;
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
        this.bestIndex = 0;
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
        let t0 = performance.now();
        this.search(this.depth, this.root, maximisingPlayer, alpha, beta, true);
        let t1 = performance.now();
        console.log(String(t1-t0) + 'milliseconds.');
        console.log(this.root);
        console.log(this.c.val);
        this.c.val = 0;

    }

    generateMoves(arr, parent, onlyCapOrCheck){
        let moves = [];
        for (let piece of arr){
            if(piece.taken){
                continue;
            }
            let pieceVal = this.c.board.getPieceVal(piece);
            this.c.board.pieceUpdateLegal(piece, parent.fen);
            this.c.board.updateTakeArr(!piece.player, parent.fen);
            let pawnTakes = [];
            if (piece.player){
                pawnTakes = this.c.board.computerPawnTakeMoves;
            } else {
                pawnTakes = this.c.board.playerPawnTakeMoves;
            }
            for (let move of piece.legal){
                let captureOrCheckMove = false;
                let takenPiece = this.c.board.posGet(move[0], move[1]);
                
                let moveScore = 0;
                
                if (takenPiece != 0){ // if piece is captured by move
                    captureOrCheckMove = true;
                    let takenPieceVal = this.c.board.getPieceVal(takenPiece);
                    moveScore += 5 * (takenPieceVal - pieceVal); // capturing pieces of greater value more likely to be a good move - this is a massive factor so will mulitply by 5 to emphasise its leveradge
                }
                
                let detail = move[2];

                if (detail == 'queen'){ // promoting a pawn is likely to be a good move
                    moveScore += 90;
                } else if (detail == 'rook'){
                    moveScore += 50;
                } else if (detail == 'bishop' || detail == 'knight'){
                    moveScore += 30;
                }

                this.c.board.updateTakeArr(piece.player, parent.fen);
                if (this.c.board.isCheck(!piece.player) != 0){
                    captureOrCheckMove = true;
                    moveScore += 10;
                }

                if (onlyCapOrCheck){
                    if (!captureOrCheckMove){
                        continue;
                    }
                }

                for(let i = 0; i<pawnTakes.length; i++){
                    if (pawnTakes[i][0] == move[0] && pawnTakes[i][1] == move[1]){
                        moveScore -= 10;
                    }
                }

                //store original position so piece can be accessed when moving in search func
                move.push(piece.x);
                move.push(piece.y);

                move.push(moveScore)
                moves.push(move);
            }
        }
        return moves;
    }
    
    search(depth, parent, maximisingPlayer, alpha, beta, computer){
        
        let movingArr, takenPiece, rookPiece, rookX, rookY, change, tempPiece;
        
        if (depth == 0){
            
            return this.captureCheckOnlySearch(3, parent, maximisingPlayer, alpha, beta, computer);

        } else{

            if (computer){
                movingArr = this.c.pieces;
            } else {
                movingArr = this.c.board.p.pieces;
            }
    
            
            let legalMoves = this.generateMoves(movingArr, parent, false);
    
            if (legalMoves.length == 0){
    
                this.c.board.updateTakeArr(parent.movedPiece.player, parent.fen); // update opposite color available taking moves
                
                if(this.c.board.isCheck(!parent.movedPiece.player) != 0){
                    if (parent.movedPiece.white){
                        parent.val = Infinity;
                    } else {
                        parent.val = -Infinity
                    }
                } else {
                    parent.val = 0;
                }
                this.c.val += 1;
                return;
            }

            let extremeVal;
            if (maximisingPlayer){
                extremeVal = -Infinity;
            } else {
                extremeVal = Infinity;
            }

            while (legalMoves.length > 0){

                let bestMove = 0;
                for (let i = 0; i<legalMoves.length; i++){
                    if (i == 0){
                        bestMove = legalMoves[i]
                    } else {
                        if (legalMoves[i][5] > bestMove[5]){
                            bestMove = legalMoves[i];
                        }
                    }
                }
                let move = bestMove;
                let index = legalMoves.indexOf(move);
                legalMoves.splice(index, 1);

                let piece = this.c.board.posGet(move[3], move[4]);

                let promoted = false;
                piece.x = move[0];
                piece.y = move[1];
                let detail = move[2];
                if (detail == 'enP'){
                    takenPiece = this.c.board.pieceTake(piece.x, move[4], piece.player);
                } else if (detail == 'castle'){
                    if (piece.x - move[3] > 0){
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

                let newFen = this.c.board.createFen(parent.fen, piece, piece.x, piece.y, move[3], move[4], takenPiece);
                let originalPosition = String(move[3]) + String(move[4])
                //determine if in check to pass to eval func
                
                //create new node and start new search
                let n = new node(newFen, originalPosition, parent, piece, takenPiece, move);
                let pruned = this.search(depth - 1, n, !maximisingPlayer, alpha, beta, !computer);

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
                    if (n.val > parent.val){
                        parent.bestIndex = parent.children.indexOf(n);
                    }
                    parent.val = extremeVal;
                    alpha = Math.max(alpha, n.val);
                } else {
                    extremeVal = Math.min(extremeVal, n.val);
                    if (n.val < parent.val){
                        parent.bestIndex = parent.children.indexOf(n);
                    }
                    parent.val = extremeVal;
                    beta = Math.min(beta, n.val);
                }
                if (beta <= alpha){
                    //if best choice for maximiser earlier on in the tree is better or equal to the best choice for the minimizer so far then prune branch of tree without appending child to parent
                    return true; //pruned
                }
            }
        }
        return false;
    }

    captureCheckOnlySearch(depth, parent, maximisingPlayer, alpha, beta, computer){
        let movingArr, takenPiece, rookPiece, rookX, rookY, change, tempPiece;

        if (depth == 0){
            if (this.c.board.hasMoves(!parent.movedPiece.player, parent.fen) == false){
                this.c.board.updateTakeArr(parent.movedPiece.player, parent.fen); // update opposite color available taking moves
                if(this.c.board.isCheck(!parent.movedPiece.player) != 0){
                    if (parent.movedPiece.white){
                        parent.val = Infinity;
                    } else {
                        parent.val = -Infinity
                    }
                } else {
                    parent.val = 0;
                }
            } else {
                parent.val = evalPos(parent.fen)
            }
            this.c.val += 1;
            return;
        } else {
            if (computer){
                movingArr = this.c.pieces;
            } else {
                movingArr = this.c.board.p.pieces;
            }
    
            
            let legalMoves = this.generateMoves(movingArr, parent, true);
    
            if (legalMoves.length == 0){
                //check for end of game
                if (this.c.board.hasMoves(!parent.movedPiece.player, parent.fen) == false){
                    this.c.board.updateTakeArr(parent.movedPiece.player, parent.fen); // update opposite color available taking moves
                    if(this.c.board.isCheck(!parent.movedPiece.player) != 0){
                        if (parent.movedPiece.white){
                            parent.val = Infinity;
                        } else {
                            parent.val = -Infinity
                        }
                    } else {
                        parent.val = 0;
                    }
                } else {
                    parent.val = evalPos(parent.fen)
                }
                this.c.val += 1;
                return;
            }
            
            let extremeVal;
            if (maximisingPlayer){
                extremeVal = -Infinity;
            } else {
                extremeVal = Infinity;
            }

            while (legalMoves.length > 0){

                let bestMove = 0;
                for (let i = 0; i<legalMoves.length; i++){
                    if (i == 0){
                        bestMove = legalMoves[i]
                    } else {
                        if (legalMoves[i][5] > bestMove[5]){
                            bestMove = legalMoves[i];
                        }
                    }
                }
                let move = bestMove;
                let index = legalMoves.indexOf(move);
                legalMoves.splice(index, 1);

                let piece = this.c.board.posGet(move[3], move[4]);

                let promoted = false;
                piece.x = move[0];
                piece.y = move[1];
                let detail = move[2];
                if (detail == 'enP'){
                    takenPiece = this.c.board.pieceTake(piece.x, move[4], piece.player);
                } else if (detail == 'castle'){
                    if (piece.x - move[3] > 0){
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

                let newFen = this.c.board.createFen(parent.fen, piece, piece.x, piece.y, move[3], move[4], takenPiece);
                let originalPosition = String(move[3]) + String(move[4])
                //determine if in check to pass to eval func
                
                //create new node and start new search
                let n = new node(newFen, originalPosition, parent, piece, takenPiece, move);
                let pruned = this.captureCheckOnlySearch(depth - 1, n, !maximisingPlayer, alpha, beta, !computer);

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
                    if (n.val > parent.val){
                        parent.bestIndex = parent.children.indexOf(n);
                    }
                    parent.val = extremeVal;
                    alpha = Math.max(alpha, n.val);
                } else {
                    extremeVal = Math.min(extremeVal, n.val);
                    if (n.val < parent.val){
                        parent.bestIndex = parent.children.indexOf(n);
                    }
                    parent.val = extremeVal;
                    beta = Math.min(beta, n.val);
                }
                if (beta <= alpha){
                    //if best choice for maximiser earlier on in the tree is better or equal to the best choice for the minimizer so far then prune branch of tree without appending child to parent
                    return true; //pruned
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