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
                    moveScore += Math.max(5 * takenPieceVal - pieceVal, 0);
                }
                
                let detail = move[2];

                if (detail == 'queen'){ // promoting a pawn is likely to be a good move
                    moveScore += 90;
                } else if (detail == 'rook'){
                    moveScore += 50;
                } else if (detail == 'bishop' || detail == 'knight'){
                    moveScore += 30;
                }

                if (move[3]){
                    captureOrCheckMove = true;
                    moveScore += 10;
                }
                move.splice(3, 1);

                

                if (onlyCapOrCheck){
                    if (!captureOrCheckMove){
                        continue;
                    }
                }

                for(let i = 0; i<pawnTakes.length; i++){
                    if (pawnTakes[i][0] == move[0] && pawnTakes[i][1] == move[1]){
                        moveScore -= pieceVal;
                    }
                }

                //store original position so piece can be accessed when moving in search func
                move.push(piece.x);
                move.push(piece.y);

                move.push(moveScore);
                moves.push(move);
            }
        }
        return moves;
    }
    
    search(depth, parent, maximisingPlayer, alpha, beta, computer){
        
        let movingArr;
        
        if (depth == 0){
            
            return this.captureCheckOnlySearch(2, parent, maximisingPlayer, alpha, beta, computer);

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

                let n = this.makeMove(move, parent, movingArr);

                let pruned = this.search(depth - 1, n, !maximisingPlayer, alpha, beta, !computer);

                if (!pruned){
                    parent.children.push(n);
                }
                
                //undo move for next move on this depth
                
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
        let movingArr;
        depth = 0;
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
                parent.val = this.evalPos(parent.fen)
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
                    parent.val = this.evalPos(parent.fen)
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

                let n = this.makeMove(move, parent, movingArr);

                let pruned = this.captureCheckOnlySearch(depth - 1, n, !maximisingPlayer, alpha, beta, !computer);

                if (!pruned){
                    parent.children.push(n);
                }
                
                //undo move for next move on this depth
                
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

    makeMove(move, parent, movingArr){
        let takenPiece, rookPiece, rookX, rookY, change;
        takenPiece = 0;
        let piece = this.c.board.posGet(move[3], move[4]);
        //console.log(move);
        //console.log(piece);
        //console.log(movingArr);
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
            if (piece.player){ // if player pieces are being moved
                rookY = 7;
            } else {
                rookY = 0;
            }
            rookPiece = this.c.board.posGet(rookX, rookY);
            rookPiece.x = piece.x + change;
        } else {

            
            if (detail == 'queen'){
                
                let i = movingArr.indexOf(piece);
                movingArr[i] = new queen(piece.x, piece.y, piece.white, piece.player, this.c.board);
                //piece = movingArr[i];
            
            } else if (detail == 'rook'){
                
                let i = movingArr.indexOf(piece);
                movingArr[i] = new rook(piece.x, piece.y, piece.white, piece.player, this.c.board);
                //piece = movingArr[i];
            
            } else if (detail == 'bishop'){
                
                let i = movingArr.indexOf(piece);
                movingArr[i] = new bishop(piece.x, piece.y, piece.white, piece.player, this.c.board);
                //piece = movingArr[i];
            
            } else if (detail == 'knight'){
                
                let i = movingArr.indexOf(piece);
                movingArr[i] = new knight(piece.x, piece.y, piece.white, piece.player, this.c.board);
                //piece = movingArr[i];
            
            }
            
            
            
            takenPiece = this.c.board.pieceTake(piece.x, piece.y, piece.player);
        }

        //create a newFen to send to child to determine moves allowed and board state

        let newFen = this.c.board.createFen(parent.fen, piece, piece.x, piece.y, move[3], move[4], takenPiece);
        let originalPosition = String(move[3]) + String(move[4]);
        //determine if in check to pass to eval func
        
        //create new node and start new search
        return new node(newFen, originalPosition, parent, piece, takenPiece, move);

    }

    undoMove(node){
        let originalX = parseInt(node.originalPosition[0]);
        let originalY = parseInt(node.originalPosition[1]);
        if (node.move[2] == 'castle'){
            //find rook by using left or right and added of subtracting 1 from king x and just use king y
            let change = node.movedPiece.x - originalX;
            let rookPiece;
            if (change > 0){
                rookPiece = this.c.board.posGet(node.movedPiece.x - 1, node.movedPiece.y);
                rookPiece.x = 7;
            } else {
                rookPiece = this.c.board.posGet(node.movedPiece.x + 1, node.movedPiece.y);
                rookPiece.x = 0;
            }
        }

        if (node.move[2] == 'queen' || node.move[2] == 'rook' || node.move[2] == 'bishop' || node.move[2] == 'knight'){
            //find piece and replace with piece should be easy enough
            let promotedPiece = this.c.board.posGet(node.movedPiece.x, node.movedPiece.y)
            let arr;
            if (promotedPiece.player){
                arr = this.c.board.p.pieces;
            } else {
                arr = this.c.pieces;
            }
            let i = arr.indexOf(promotedPiece);
            arr[i] = node.movedPiece;
        }

        if (node.takenPiece != 0){
            node.takenPiece.taken = false
        }
        node.movedPiece.x = originalX;
        node.movedPiece.y = originalY;

    }
    
    evalPos(fen){
        //get x and y then use PST
        //also find out how to determine start or end game
        
        let allPieces = this.c.pieces.concat(this.c.board.p.pieces);
        let materialCount = 0
        for (let i = 0; i < allPieces.length; i++){
            if (!allPieces[i].taken){
                materialCount += 1;
            }
        }

        let gameState;
        if (materialCount > 25){
            gameState = 'start';
        } else if (materialCount > 10){
            gameState = 'middle';
        } else {
            gameState = 'end';
        }

        let fenPos = fen['position'];
        let val = 0;
        let colorFactor = 0;
        let x = 0;
        let y = 0;
        for (let c of fenPos){
            if ((/[a-zA-Z]/).test(c)){
                if (c == c.toUpperCase()){
                    colorFactor = 1;
                    c = c.toLowerCase();
                } else if (c == c.toLowerCase()){
                    colorFactor = -1;
                }
                let playerPiece;
                if (colorFactor == 1){
                    if (this.c.board.isPlayerWhite){
                        playerPiece = true;
                    } else {
                        playerPiece = false;
                    }
                } else {
                    if (this.c.board.isPlayerWhite){
                        playerPiece = false;
                    } else {
                        playerPiece = true;
                    }
                }
                let PSTx;
                let PSTy;
                let pawnMultiplier;
                switch(c){
                    case 'k':
                        PSTx = x;
                        if (!playerPiece){
                            PSTy = 7 - y;
                        } else {
                            PSTy = y;
                        }
                        if (gameState == 'start' || gameState == 'middle'){
                            val += parseInt((900 * colorFactor * kingStartTable[PSTy][PSTx]).toFixed(5));
                        } else {
                            val += parseInt((900 * colorFactor * kingEndTable[PSTy][PSTx]).toFixed(5))
                        }
                        break;
                    case 'q':
                        val += 90 * colorFactor;
                        break;
                    case 'r':
                        val += 50 * colorFactor;
                        break;
                    case 'b':
                        PSTx = x;
                        if (!playerPiece){
                            PSTy = 7 - y;
                        } else {
                            PSTy = y;
                        }
                        val += parseInt((30 * colorFactor * bishopTable[PSTy][PSTx]).toFixed(5));
                        break;
                    case 'n':
                        PSTx = x;
                        if (!playerPiece){
                            PSTy = 7 - y;
                        } else {
                            PSTy = y;
                        }
                        val += parseInt((30 * colorFactor * knightTable[PSTy][PSTx]).toFixed(5));
                        break;
                    case 'p':
                        PSTx = x;
                        if (!playerPiece){
                            PSTy = 7 - y
                        } else {
                            PSTy = y;
                        }
                        if (gameState == 'start' || gameState == 'middle'){
                            pawnMultiplier = 1;
                        } else {
                            pawnMultiplier = 3;
                        }
                        val += parseInt((10 * pawnMultiplier * colorFactor * pawnTable[PSTy][PSTx]).toFixed(5));
                        break;
                }
                x += 1;
            } else if (c == '/'){
                y += 1;
                x = 0;
            } else if (c == parseInt(c)){
                x += parseInt(c);
            }
        }
        return val;
    }
}

const kingStartTable = [

    [0.7, 6, 0.6, 0.5, 0.5, 0.6, 0.6, 0.7],
    [0.7, 0.6, 0.6, 0.5, 0.5, 0.6, 0.6, 0.7],
    [0.7, 0.6, 0.6, 0.5, 0.5, 0.6, 0.6, 0.7],
    [0.7, 0.6, 0.6, 0.5, 0.5, 0.6, 0.6, 0.7],
    [0.8, 0.7, 0.7, 0.6, 0.6, 0.7, 0.7, 0.8],
    [0.9, 0.8, 0.8, 0.7, 0.7, 0.8, 0.8, 0.9],
    [1.2, 1.2, 1, 1, 1, 1, 1.2, 1.2],
    [1.2, 1.3, 1.2, 1.1, 1.1, 1.2, 1.3, 1.2]

];

const kingEndTable = [

    [0.5, 0.6, 0.7, 0.8, 0.8, 0.7, 0.6, 0.5],
    [0.7, 0.8, 0.9, 1, 1, 1.9, 0.8, 0.7],
    [0.7, 0.9, 1.2, 1.3, 1.3, 1.2, 0.9, 0.7],
    [0.7, 0.9, 1.3, 1.4, 1.4, 1.3, 0.9, 0.7],
    [0.7, 0.9, 1.3, 1.4, 1.4, 1.3, 0.9, 0.7],
    [0.7, 0.9, 1.2, 1.3, 1.3, 1.2, 0.9, 0.7],
    [0.7, 0.7, 1, 1, 1, 1, 0.7, 0.7],
    [0.5, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.5]

];

const pawnTable = [

    [0, 0, 0, 0, 0, 0, 0, 0],
    [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
    [1.1, 1.1, 1.2, 1.3, 1.3, 1.2, 1.1, 1.1],
    [1.05, 1.05, 1.1, 1.27, 1.27, 1.1, 1.05, 1.05],
    [1.0, 1.0, 1.0, 1.25, 1.25, 1.0, 1.0, 1.0],
    [1.05, 0.95, 0.9, 1, 1, 0.9, 0.95, 1.05,],
    [1.05, 1.10, 1.10,0.75,0.75, 1.10, 1.10,  1.05],
    [0, 0, 0, 0, 0, 0, 0, 0]

];

const bishopTable = [
    
    [0.8,0.9,0.9,0.9,0.9,0.9,0.9,0.8],
    [0.9, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,0.9],
    [0.9, 1.0,  1.05,1.10,1.10,  1.05,  0,0.9],
    [0.9,  1.05,  1.05,1.10,1.10,  1.05,  1.05,0.9],
    [0.9, 1.0,1.10,1.10,1.10,1.10, 1.0,0.9],
    [0.9,1.10,1.10,1.10,1.10,1.10,1.10,0.9],
    [0.9,  1.05, 1.0, 1.0, 1.0, 1.0,  1.05,0.9],
    [0.8,0.9,0.6,0.9,0.9,0.6,0.9,0.8]

]

const knightTable = [

    [0.5,0.6,0.7,0.7,0.7,0.7,0.6,0.5],
    [0.6,0.8,  1.0,  1.0,  1.0,  1.0,0.8,0.6],
    [0.7,  1.0, 1.10, 1.15, 1.15, 1.10,  1.0,0.7],
    [0.7,  1.05, 1.15, 1.20, 1.20, 1.15,  1.05,0.7],
    [0.7,  1.0, 1.15, 1.20, 1.20, 1.15,  1.0,0.7],
    [0.7,  1.05, 1.10, 1.15, 1.15, 1.10,  1.05,0.7],
    [0.6,0.8,  1.0,  1.05,  1.05,  1.0,0.8,0.6],
    [0.5,0.6,0.8,0.7,0.7,0.8,0.6,0.5]

];



//with pawn square table just make value more for endgame - can just be done in eval function















