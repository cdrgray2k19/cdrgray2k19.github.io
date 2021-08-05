class board{
    constructor(playerWhite){
        this.playing = true;

        this.fen;

        this.canvas = document.querySelector('#c');
        this.ctx = this.canvas.getContext("2d");
        this.resizeCanvas();

        this.width = 640; // set html sizes which will be used when drawing pieces
        this.height = 640;
        this.sqSize = this.height/8;

        this.p = new player(this);
        this.c = new computer(this);

        this.isPlayerWhite = playerWhite;

        if (this.isPlayerWhite){ // reverses coordinates tested if player at bottom with black pieces
            this.castleDir = 1;
        } else {
            this.castleDir = -1;
        }

        this.mouse = []; // stores array of x,y position in canvas
        this.movingPiece = 0; // stores piece information if cliked on, else it stores 0 to indicate no pieces have been clicked on
        this.takenPiece = 0;
        this.originalX = 0; // stores oringinal position of currently moving piecs
        this.originalY = 0;
        this.inCheck = 0; // if color which is being moved is not in check it stores 0 if it is then it stores an array with the king x,y pos in it to color its square
        //this.msg = 0; // stores message that is received from maplegal function which can tell mousepress2 how to behave if different move called like castling or en passant
        this.prev = []; // stores squares of oringinal and moved to squares
        this.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        //this.notation = '';

        this.lightSqCol = '#f1d9c0'; // colors for squares depending on what actions are taking place
        this.darkSqCol = '#a97a65';
        this.checkCol = '#f54c4c';
        this.lightPrevCol = '#e4d00a';
        this.darkPrevCol = '#d4af37';
        this.lightLegalCol = '#aae346';
        this.darkLegalCol = '#87d620';
        this.changedCoordCol = '#000000';

        this.createGrid(); // create grid and pieces and update both black and whites takeArrs to start
        this.createPieces();
        this.updateTakeArr(this.playerMove);
        this.updateTakeArr(!this.playerMove);

        this.endMsgBox = document.querySelector('#canvasMsgBox'); // link html elements to javascript
        this.endMsg = '';
        this.winnerMsg = '';

        if (this.fen['activeCol'] == 'w'){
            if (this.isPlayerWhite){
                this.playerMove = true;
            } else {
                this.playerMove = false;
            }
        } else {
            if (this.isPlayerWhite){
                this.playerMove = false;
            } else {
                this.playerMove = true;
            }
        }

        if (!this.playerMove){
            this.c.findMove();
        }
    }
    
    resizeCanvas(){
        this.canvas_width = (window.innerWidth) * 0.7; // resize canvas to 0.7 of the minimum measurement
        this.canvas_height = (window.innerHeight) * 0.7;
        if (this.canvas_height > this.canvas_width){
            this.canvas_height = this.canvas_width;
        } else{
            this.canvas_width = this.canvas_height;
        }
        this.ctx.textAlgin = 'center'; // restore canvas elements as each time you resize canvas they are lost
        this.smallFont = "15px Georgia";
        this.bigFont = "30px Georgia";

        this.canvas.style.width = '' + String(this.canvas_width) + 'px';
        this.canvas.style.height = '' + String(this.canvas_height) + 'px';
    }

    inArr(arr1, arr2){ // had problem comparing 2d array values so made this function which has a very general application
        for (let i = 0; i < arr2.length; i++){
            if(arr1[0] == arr2[i][0] && arr1[1] == arr2[i][1]){
                return true;
            }
        }
        return false;
    }

    createGrid(){
        this.squares = [];
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){
                if ((x+y) % 2 == 0){
                    var block_num = this.lightSqCol;
                    var coord_num = this.darkSqCol;
                } else {
                    var block_num = this.darkSqCol;
                    var coord_num = this.lightSqCol;
                }
                if (y == 0){
                    this.squares.push([]);
                }
                this.squares[x].push({block: block_num, coord: coord_num})
            }
        }
    }
    
    drawGrid(){
        let value;
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){

                let color_block = this.squares[x][y].block;
                let color_coord = this.squares[x][y].coord;
                this.ctx.fillStyle = color_block;
                this.ctx.fillRect(x * this.sqSize, y * this.sqSize, this.sqSize, this.sqSize);
                if (x == 0){
                    this.ctx.fillStyle = color_coord;
                    this.ctx.font = this.smallFont;
                    if (this.isPlayerWhite){
                        value = 8 - y;
                    } else {
                        value = y + 1;
                    }
                    this.ctx.fillText(String(value), x * this.sqSize, y * this.sqSize + this.sqSize/6);
                }
                if (y == 7){
                    this.ctx.fillStyle = color_coord;
                    this.ctx.font = this.smallFont;
                    if (this.isPlayerWhite){
                        value = this.letters[x];
                    } else {
                        value = this.letters[7-x];
                    }
                    this.ctx.fillText(value, x * this.sqSize + this.sqSize * 9/10, y * this.sqSize + this.sqSize* 14/15);
                }
            }
        }
    }
    
    createPieces(){
        //using new fen string to decide who moves
        let string = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1";
        string = string.split("");
        string = string.reverse();
        string = string.join("")
        
        if (this.isPlayerWhite){
            this.fen = {'position': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', 'activeCol': 'w', 'castling': 'KQkq', 'enP': '-'}; // starting position white bottom
        } else {
            this.fen = {'position': string, 'activeCol': 'w', 'castling': '-', 'enP': '-'};
        }
        let x = 0;
        let y = 0;
        let white = 0;
        let player = 0;
        let FENcode = this.fen['position']
        for (let c of FENcode){
            if (c == '/'){
                x = 0;
                y += 1;
                continue;
            } else if (c == parseInt(c)){
                x += parseInt(c)
                continue;
            } else if (c == c.toUpperCase()){ // if letter is uppercase
                white = true;
                c = c.toLowerCase();
            } else if (c == c.toLowerCase()){ // if letter is lowercase
                white = false;
            }
            if (this.isPlayerWhite){
                player = white;
            } else {
                player = !white;
            }
            let newPiece;
            switch(c){
                case 'k':
                    newPiece = new king(x, y, white, player, this);
                    break;
                case 'q':
                    newPiece = new queen(x, y, white, player, this);
                    break;
                case 'r':
                    newPiece = new rook(x, y, white, player, this);
                    break;
                case 'b':
                    newPiece = new bishop(x, y, white, player, this);
                    break;
                case 'n':
                    newPiece = new knight(x, y, white, player, this);
                    break;
                case 'p':
                    newPiece = new pawn(x, y, white, player, this);
                    break;
            }
            if (player){
                this.p.pieces.push(newPiece);
            } else {
                this.c.pieces.push(newPiece);
            }
            x += 1;
        }
    }
    
    drawPieces(){
        this.ctx.font = this.bigFont;
        for (let i = 0; i < this.p.pieces.length; i++){
            if (!this.p.pieces[i].taken){
                this.p.pieces[i].display();
            }
        }
        for (let i = 0; i < this.c.pieces.length; i++){
            if (!this.c.pieces[i].taken){
                this.c.pieces[i].display();
            }
        }
    }
    
    createFen(prevFen,piece, x, y, originalX, originalY, takenPiece){
        //using new fen string that will have to be split up usnig slicing into a dictionary i.e. {position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", activeCol: "w", castling: "KQkq", enPassant: "-"}
        //will take last move which will decide castling and en passant details for new fen string
        let fen;
        let empty = 0;
        let text = '';
        let fenPos = '';
        for (let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                let piece = this.posGet(x, y);
                if (piece != 0){
                    if (empty > 0){
                        fenPos += String(empty);
                        empty = 0;
                    }
                    if (piece.text != ''){
                        text = piece.text;
                    } else{
                        text = piece.displayedText;
                    }
                    if (!piece.white){
                        text = text.toLowerCase();
                    }
                    fenPos += text;
                } else {
                    empty += 1;
                }
            }
            if (empty > 0){
                fenPos += String(empty);
                empty = 0;
            }
            if (y < 7){
                fenPos += '/';
            }
        }
        let colour;
        if (prevFen['activeCol'] == 'w'){
            colour = 'b'
        } else {
            colour = 'w'
        }
        //need to use last move to decide about en passant and castling
        var castleRights = prevFen['castling'];
        let yPos;
        if (piece.player){
            yPos = 7;
        } else {
            yPos = 0;
        }
        if (piece.constructor.name == king.name){
            if(piece.white){
                castleRights = castleRights.replaceAll('K', '');
                castleRights = castleRights.replaceAll('Q', '');
            } else {
                castleRights = castleRights.replaceAll('k', '');
                castleRights = castleRights.replaceAll('q', '');
            }
        } else if (piece.constructor.name == rook.name){
            if (originalX == 0 && originalY == yPos){
                if (this.isPlayerWhite){
                    if (piece.white){
                        castleRights = castleRights.replaceAll('Q', '');
                    } else{
                        castleRights = castleRights.replaceAll('q', '');
                    }
                } else {
                    if (piece.white){
                        castleRights = castleRights.replaceAll('K', '');
                    } else{
                        castleRights = castleRights.replaceAll('k', '');
                    }
                }
            } else if (originalX == 7 && originalY == yPos){
                if (this.isPlayerWhite){
                    if (piece.white){
                        castleRights = castleRights.replaceAll('K', '');
                    } else{
                        castleRights = castleRights.replaceAll('k', '');
                    }
                } else {
                    if (piece.white){
                        castleRights = castleRights.replaceAll('Q', '');
                    } else{
                        castleRights = castleRights.replaceAll('q', '');
                    }
                }
            }
        }
        if (takenPiece.player){
            yPos = 7;
        } else {
            yPos = 0;
        }
        if (takenPiece.constructor.name == rook.name){
            if (takenPiece.x == 0 && takenPiece.y == yPos){
                if (this.isPlayerWhite){
                    if (takenPiece.white){
                        castleRights = castleRights.replaceAll('Q', '');
                    } else{
                        castleRights = castleRights.replaceAll('q', '');
                    }
                } else {
                    if (takenPiece.white){
                        castleRights = castleRights.replaceAll('K', '');
                    } else{
                        castleRights = castleRights.replaceAll('k', '');
                    }
                }
            } else if (takenPiece.x == 7 && takenPiece.y == yPos){
                if (this.isPlayerWhite){
                    if (takenPiece.white){
                        castleRights = castleRights.replaceAll('K', '');
                    } else{
                        castleRights = castleRights.replaceAll('k', '');
                    }
                } else {
                    if (takenPiece.white){
                        castleRights = castleRights.replaceAll('Q', '');
                    } else{
                        castleRights = castleRights.replaceAll('q', '');
                    }
                }
            }
        }

        let enPassant = '-'
        if (piece.constructor.name == pawn.name){
            if (piece.player){
                if (y == 4){
                    if (originalY == 6){
                        if (this.pieceAt(x - 1, y, piece.player) == false || this.pieceAt(x + 1, y, piece.player) == false){
                            let xTarget, yTarget;
                            if (this.isPlayerWhite){
                                yTarget = 3;
                                xTarget = this.letters[x];
                            } else {
                                yTarget = 6;
                                xTarget = this.letters[7-x];
                            }
                            enPassant = xTarget + yTarget;
                            
                        }
                    }
                }
            } else {
                if (y == 3){
                    if (originalY == 1){
                        if (this.pieceAt(x - 1, y, piece.player) == false || this.pieceAt(x + 1, y, piece.player) == false){
                            let xTarget, yTarget;
                            if (this.isPlayerWhite){
                                yTarget = 6;
                                xTarget = this.letters[x];
                            } else {
                                yTarget = 3;
                                xTarget = this.letters[7-x];
                            }
                            enPassant = xTarget + yTarget;
                        }
                    }
                }
            }
        }

        fen = {'position': fenPos, 'activeCol': colour, 'castling': castleRights, 'enP': enPassant};
        return fen;
    }
    
    posGet(x, y){
        //helps out with createFen
        let allPieces = this.p.pieces.concat(this.c.pieces);
        for (let i = 0; i < allPieces.length; i++){
            if (allPieces[i].x == x && allPieces[i].y == y && allPieces[i].taken == false){
                return allPieces[i];
            }
        }
        return 0;
    }
    
    pieceUpdateLegal(piece, fen){
        //using new method of the move being [x, y, detail]
        //detail allows flexibility whilst dealing with different types of moves
        piece.mapLegal(fen); // get legal moves depending on board and store msg which stores any other info about the legal moves
        let x = piece.x; // store original x and y positoin
        let y = piece.y;
        let arr = piece.legal; // make it easier to manipulate array
        let arr2 = []; // open array to store legal moves after checks analysed
        let takenPiece = 0; // temporarily holds a taken piece to evaluate boards for checks so it can be pushed back into array
        for(let i = 0; i < arr.length;i++){
            piece.x = arr[i][0]; // temporarily move pieces
            piece.y = arr[i][1]; // temporarily move pieces
            if (arr[i][2] == 'castle'){ // if the message is not an empty string then legalise the moves differently
                if(this.castleEval(piece, x, y)){
                    arr2.push([arr[i][0], arr[i][1], arr[i][2]]);
                }
                continue;
            
            } else if (arr[i][2] == 'enP'){
                takenPiece = this.pieceTake(piece.x, y, piece.player);
            }else{
                takenPiece = this.pieceTake(piece.x, piece.y, piece.player);
            }
            this.updateTakeArr(!piece.player) // update opposite color available taking moves
            if(this.isCheck(piece.player) == 0){
                arr2.push([arr[i][0], arr[i][1], arr[i][2]]); // if no checks are found for this move then append to new legal moves array
            }
            if (takenPiece != 0){ // if piece was taken, now the evaluation of the board is done the piece can be pushed back into the nescessary array to be stored on the board
                takenPiece.taken = false
                takenPiece = 0;
            }
        }
        piece.legal = arr2; // change legal array to new check legal array
        piece.x = x; // change x and y position back
        piece.y = y;
    }
    
    castleEval(piece, startX, startY){
        //sees if squares kings moving through are in takeArr
        let tempX = piece.x;
        let tempY = piece.y;
        piece.x = startX;
        piece.y = startY;
        this.updateTakeArr(!piece.player) // update opposite color available taking moves
        if(this.isCheck(piece.player) != 0){
            return false;
        }
        piece.x = tempX;
        piece.y = tempY;
        let dir;
        if (piece.x - startX > 0){
            dir = 1;
        } else {
            dir = -1;
        }
        for (let i = 1; i<3; i++){
            let x = startX + (i * dir);
            if (piece.player){
                for (let m of this.computerTakeMoves){
                    if (m[0] == x && m[1] == piece.y){
                        return false;
                    }
                }
            } else {
                for (let m of this.playerTakeMoves){
                    if (m[0] == x && m[1] == piece.y){
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    pieceAt(x, y, player){ // returns true if a friendly piece in square, false if enemy piece on square, and 'null' if no pieces on square
        //helps with all sorts like mapLegal of pieces
        for (let i = 0; i < this.p.pieces.length; i++){
            if (this.p.pieces[i].x == x && this.p.pieces[i].y == y){
                if(this.p.pieces[i].taken == false){
                    if(player){
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }

        for (let i = 0; i < this.c.pieces.length; i++){
            if (this.c.pieces[i].x == x && this.c.pieces[i].y == y){
                if(this.c.pieces[i].taken == false){
                    if(player){
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }
        return 'null';
    }
    
    canMove(){
        let x = Math.floor(this.mouse[0]/(this.canvas_width/8)); // evaluate board coordinates of mouse position
        let y = Math.floor(this.mouse[1]/(this.canvas_width/8));
        for (let move of this.movingPiece.legal){
            if (move[0] == x && move[1] == y){
                return move;
            }
        }
        return 0

    }
    
    clearGrid(){
        //changes board depending on gameplay i.e. checks and previous moves
        this.createGrid(); // remove any green legal blocks

        if (this.inCheck != 0){ // keep any red check blocks
            let king_x = this.inCheck[0];
            let king_y = this.inCheck[1];
            this.squares[king_x][king_y].block = this.checkCol;
            this.squares[king_x][king_y].coord = this.changedCoordCol;
        }
        for (let i = 0; i < this.prev.length; i++){ // keep any recent moves blocks
            let x = this.prev[i][0];
            let y = this.prev[i][1];
            if (this.squares[x][y].block == this.lightSqCol){
                this.squares[x][y].block = this.lightPrevCol;
            } else {
                this.squares[x][y].block = this.darkPrevCol;
            }
            this.squares[x][y].coord = this.changedCoordCol;
        }
    }
    
    pieceTake(x, y, player){
        //slices takenPiece from array
        // ALTERNATIVE
        // change variable self.taken and then change back in AI when you need - instead of using copy of arr
        // each time you reference pieces though you will have to check if its taken or not
        // for example in posGet it will only work if piece has not been taken
        if(player){
            for(let i = 0; i < this.c.pieces.length; i++){
                if (this.c.pieces[i].x == x && this.c.pieces[i].y == y){
                    let piece = this.c.pieces[i];
                    if (!piece.taken){
                        piece.taken = true;
                        return piece;
                    }
                }
            }
        } else {
            for(let i = 0; i < this.p.pieces.length; i++){
                if (this.p.pieces[i].x == x && this.p.pieces[i].y == y){
                    let piece = this.p.pieces[i];
                    if (!piece.taken){
                        piece.taken = true;
                        return piece;
                    }
                }
            }
        }
        return 0;
    }
    
    completeMove(){
        //updateTakeArr for other colour
        //reset any values for next move
        //createGrid which resets it
        //updatePrev to show last move on board
        //check for end of game - hasMoves
        //------- if not end of game -----
        //createFen() of new position which will tell next move details about board
        //call computer of just wait for player move
        this.fen = this.createFen(this.fen, this.movingPiece, this.movingPiece.x, this.movingPiece.y, this.originalX, this.originalY, this.takenPiece);
        this.updateTakeArr(this.playerMove)
        
        this.inCheck = 0;

        this.prev = [];

        this.createGrid(); // completely resets grid
        this.updatePrev();

        this.movingPiece = 0; // refresh moving piece variable for next go
        this.playerMove = !(this.playerMove); // change move color

        let checkValue = this.isCheck(this.playerMove);

        let hasMoves = this.hasMoves(this.playerMove);
        if(checkValue != 0){ // check new color for checks before anything else
            let x = checkValue[0];
            let y = checkValue[1];
            this.inCheck = [x, y];
            this.squares[x][y].block = this.checkCol;
            this.squares[x][y].coord = this.changedCoordCol;
            if(hasMoves == false){
                this.endMsg = 'checkmate';
                this.playing = false;
                if (this.playerMove){
                    this.winnerMsg = 'computer wins';
                } else {
                    this.winnerMsg = 'player wins';
                }
            }
        } else {
            if(hasMoves == false){
                this.endMsg = 'stalemate';
                this.playing = false;
                this.winnerMsg = 'draw';
            }
        }
    }
    
    updateTakeArr(player){
        //for each piece of chosen colour call mapLegal and reference Take Arr - this is to help with evaluating legal moves using checks next move and to see if a stalemate of checkmate has been reached
        if(player){
            this.playerTakeMoves = [];
            for (let i = 0; i < this.p.pieces.length; i++){
                if (this.p.pieces[i].taken == false){
                    this.p.pieces[i].mapLegal(this.fen);
                    for (let j = 0; j < this.p.pieces[i].take.length; j++){
                        this.playerTakeMoves.push(this.p.pieces[i].take[j]);
                    }
                }
            }
        } else {
            this.computerTakeMoves = [];
            for (let i = 0; i < this.c.pieces.length; i++){
                if (this.c.pieces[i].taken == false){
                    this.c.pieces[i].mapLegal(this.fen);
                    for (let j = 0; j < this.c.pieces[i].take.length; j++){
                        this.computerTakeMoves.push(this.c.pieces[i].take[j]);
                    }
                }
            }
        }
    }

    updatePrev(){
        //configur board to show previous moves using different colours
        this.prev.push([this.originalX, this.originalY]);
        this.prev.push([this.movingPiece.x, this.movingPiece.y]);

        for (let i = 0; i < this.prev.length; i++){
            let x = this.prev[i][0];
            let y = this.prev[i][1];
            if (this.squares[x][y].block == this.lightSqCol){
                this.squares[x][y].block = this.lightPrevCol;
            } else {
                this.squares[x][y].block = this.darkPrevCol;
            }
            this.squares[x][y].coord = this.changedCoordCol;
        }
    }

    isCheck(player){
        //see if king in check - used to evaluate legal moves
        if (player){
            for (let i = 0; i < this.p.pieces.length; i++){
                if (this.p.pieces[i].constructor.name == king.name){
                    var x = this.p.pieces[i].x;
                    var y = this.p.pieces[i].y;
                }
            }
            for (let i = 0; i < this.computerTakeMoves.length; i++){
                if (this.computerTakeMoves[i][0] == x && this.computerTakeMoves[i][1] == y){
                    return [x, y];
                }
            }
        } else {
            for (let i = 0; i < this.c.pieces.length; i++){
                if (this.c.pieces[i].constructor.name == king.name){
                    var x = this.c.pieces[i].x;
                    var y = this.c.pieces[i].y;
                }
            }
            for (let i = 0; i < this.playerTakeMoves.length; i++){
                if (this.playerTakeMoves[i][0] == x && this.playerTakeMoves[i][1] == y){
                    return [x, y];
                }
            }
        }
        return 0;
    }

    hasMoves(player){
        //check for stalemate and checkmate at end of move
        let piece;
        if (player){
            for (let i = 0; i < this.p.pieces.length; i++){
                piece = this.p.pieces[i];
                this.pieceUpdateLegal(piece, this.fen);
                if (piece.legal.length > 0){
                    return true;
                }
            }
        } else {
            for (let i = 0; i < this.c.pieces.length; i++){
                piece = this.c.pieces[i];
                this.pieceUpdateLegal(piece, this.fen);
                if (piece.legal.length > 0){
                    return true;
                }
            }
        }
        return false;
    }
    /*updateScroll(){ // make div scroll when new move added to notation
        let div = document.querySelector('#notation-board');
        div.scrollTop = div.scrollHeight;
    }*/
    /*resign(){ // ends game loop and changes values to display
        this.endMsg = 'resignation';
        this.playing = false;
        this.winnerMsg = 'computer won';
    }*/

}