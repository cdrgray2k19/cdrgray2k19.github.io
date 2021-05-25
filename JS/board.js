class board{
    constructor(playerWhite){
        this.playing = true;
        /* canvas initialisation*/
        this.canvas = document.querySelector('#c');
        this.ctx = this.canvas.getContext("2d");
        this.resizeCanvas();
        /* --------- */
        
        this.width = 640; // set html sizes which will be used when drawing pieces
        this.height = 640;
        this.sqSize = this.height/8;
        
        this.p = new player(this);
        this.c = new computer(this);


        this.isPlayerWhite = playerWhite;

        if (this.isPlayerWhite){
            this.playerMove = true;
        } else {
            this.playerMove = false;
        }

        if (this.isPlayerWhite){ // reverses coordinates tested if player at bottom with black pieces
            this.castleDir = 1;
        } else {
            this.castleDir = -1;
        }

        this.mouse = []; // stores array of x,y position in canvas
        this.movingPiece = 0; // stores piece information if cliked on, else it stores 0 to indicate no pieces have been clicked on
        this.originalX = 0; // stores oringinal position of currently moving piecs
        this.originalY = 0;
        this.inCheck = 0; // if color which is being moved is not in check it stores 0 if it is then it stores an array with the king x,y pos in it to color its square
        this.msg = 0; // stores message that is received from maplegal function which can tell mousepress2 how to behave if different move called like castling or en passant
        this.prev = []; // stores squares of oringinal and moved to squares
        this.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        this.notation = '';
        
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
        this.startTime = new Date().getTime();
        this.endTime = 0;
        
        if (this.playerMove){ //configure clocks according to which color is first to move
            document.querySelector('#playerTime').className = 'moving';
            document.querySelector('#computerTime').className = 'waiting';
        } else {
            document.querySelector('#playerTime').className = 'waiting';
            document.querySelector('#computerTime').className = 'moving';
        }

        if (!this.playerMove){
            this.c.move();
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

    initTime(){
        let value = Math.floor(this.playerTime); // display time
        let min = Math.floor(value/60);
        let sec = String(value % 60);
        if (sec.length < 2){
            sec = "0" + sec;
        }
        document.querySelector('#playerTime').innerHTML = String(min) + ":" + String(sec);

        value = Math.floor(this.computerTime);
        min = Math.floor(value/60);
        sec = String(value % 60);
        if (sec.length < 2){
            sec = "0" + sec;
        }
        document.querySelector('#computerTime').innerHTML = String(min) + ":" + String(sec);
    }
    
    inArr(arr1, arr2){ // had problem comparing 2d array values so made this function which has a very general application
        for (let i = 0; i < arr2.length; i++){
            if(arr1[0] == arr2[i][0] && arr1[1] == arr2[i][1]){
                return true;
            }
        }
        return false;
    }

    createGrid(){ // go through an 8 by 8 2d array which stores the square color and coordinate color of the square
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

    drawGrid(){ // go through this.squares and draw each depending on their dictionary values
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

    createPieces(){ // add peices to piece arrays
        let FENcode;
        if (this.isPlayerWhite){
            FENcode = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'; // starting position white bottom
        } else {
            FENcode = 'RNBKQBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbkqbnr'; // starting position black bottom
        }
        let x = 0;
        let y = 0;
        let white = 0;
        let player = 0;
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
            switch(c){
                case 'k':
                    new king(x, y, white, player, this);
                    break;
                case 'q':
                    new queen(x, y, white, player, this);
                    break;
                case 'r':
                    new rook(x, y, white, player, this);
                    break;
                case 'b':
                    new bishop(x, y, white, player, this);
                    break;
                case 'n':
                    new knight(x, y, white, player, this);
                    break;
                case 'p':
                    new pawn(x, y, white, player, this);
                    break;
            }
            x += 1;
        }
    }

    drawPieces(){ // reference display function of all pieces in arrays
        this.ctx.font = this.bigFont;
        for (let i = 0; i < this.p.pieces.length; i++){
            this.p.pieces[i].display();
        }
        for (let i = 0; i < this.c.pieces.length; i++){
            this.c.pieces[i].display();
        }
    }

    createFen(){
        let allPieces = this.p.pieces.concat(this.c.pieces);
        let empty = 0;
        let text = '';
        let fen = '';
        for (let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                let piece = this.posGet(x, y, allPieces);
                if (piece != 0){
                    if (empty > 0){
                        fen += String(empty);
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
                    fen += text;
                } else {
                    empty += 1;
                }
            }
            if (empty > 0){
                fen += String(empty);
                empty = 0;
            }
            if (y < 7){
                fen += '/';
            }
        }
        return fen;
    }

    posGet(x, y, allPieces){
        for (let i = 0; i < allPieces.length; i++){
            if (allPieces[i].x == x && allPieces[i].y == y){
                return allPieces[i];
            }
        }
        return 0;
    }

    pieceUpdateLegal(piece){ // reference mapLegal which gets legal depending on rules and other pieces and then add checking logic to the moves
        this.msg = piece.mapLegal(); // get legal moves depending on board and store msg which stores any other info about the legal moves
        if (this.msg == []){
            this.msg = [0];
        }
        this.originalX = piece.x; // store original x and y positoin
        this.originalY = piece.y;
        let arr = piece.legal; // make it easier to manipulate array
        let arr2 = []; // open array to store legal moves after checks analysed
        let takenPiece = 0; // temporarily holds a taken piece to evaluate boards for checks so it can be pushed back into array
        for(let i = 0; i < arr.length;i++){
            piece.x = arr[i][0]; // temporarily move pieces
            piece.y = arr[i][1]; // temporarily move pieces
            if (this.msg[0] == 'castle' && this.inArr([piece.x, piece.y], this.msg)){ // if the message is not an empty string then legalise the moves differently
                if(this.castle(piece)){
                    arr2.push([arr[i][0], arr[i][1]]);
                }
                continue;
            
            } else if (this.msg[0] == 'enP-left' || this.msg[0] == 'enP-right' && this.inArr([piece.x, piece.y], this.msg)){
                takenPiece = this.pieceTake(piece.x, this.originalY, piece.player);
            }else{
                takenPiece = this.pieceTake(piece.x, piece.y, piece.player);
            }
            this.updateTakeArr(!this.playerMove) // update opposite color available taking moves
            if(this.isCheck(this.playerMove) == 0){
                arr2.push([arr[i][0], arr[i][1]]); // if no checks are found for this move then append to new legal moves array
            }
            if (takenPiece != 0){ // if piece was taken, now the evaluation of the board is done the piece can be pushed back into the nescessary array to be stored on the board
                if (piece.player){
                    this.c.pieces.push(takenPiece);
                } else {
                    this.p.pieces.push(takenPiece);
                }
            }
        }
        piece.legal = arr2; // change legal array to new check legal array
        piece.x = this.originalX; // change x and y position back
        piece.y = this.originalY;
    }

    castle(piece){
        if (this.originalX - piece.x == 2){
            //queen side castle
            if(this.inCheck){
                return false;
            }
            for (let i = 1; i<3; i++){
                piece.x = this.originalX - i;
                this.updateTakeArr(!this.playerMove);
                if (this.isCheck(this.playerMove) != 0){
                    return false;
                }
            }
            return true;
        } else if (this.originalX - piece.x == -2){
            //king side castle
            if(this.inCheck){
                return false;
            }
            for (let i = 1; i<3; i++){
                piece.x = this.originalX + i;
                this.updateTakeArr(!this.playerMove);
                if (this.isCheck(this.playerMove) != 0){
                    return false;
                }
            }
            return true;
        }
    }

    pieceAt(x, y, player){ // returns true if a friendly piece in square, false if enemy piece on square, and 'null' if no pieces on square

        for (let i = 0; i < this.p.pieces.length; i++){
            if (this.p.pieces[i].x == x && this.p.pieces[i].y == y){
                if(player){
                    return true;
                } else {
                    return false;
                }
            }
        }

        for (let i = 0; i < this.c.pieces.length; i++){
            if (this.c.pieces[i].x == x && this.c.pieces[i].y == y){
                if(player){
                    return false;
                } else {
                    return true;
                }
            }
        }
        return 'null';
    }

    canMove(){
        let x = Math.floor(this.mouse[0]/(this.canvas_width/8)); // evaluate board coordinates of mouse position
        let y = Math.floor(this.mouse[1]/(this.canvas_width/8));
        let pos = [x, y];
        let value = this.inArr(pos, this.movingPiece.legal);
        return [value, x, y];
    }

    clearGrid(){
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

    movingVariableHandle(){ // if justmoved and moved variables apply to piece, change as needed
        if (this.playerMove){
            for (let i = 0; i < this.p.pieces.length; i++){
                try{
                    if (this.p.pieces[i].justMoved == true){
                        this.p.pieces[i].justMoved = false;
                    }
                }catch{}
            }
        } else {
            for (let i = 0; i < this.c.pieces.length; i++){
                try{
                    if (this.c.pieces[i].justMoved == true){
                        this.c.pieces[i].justMoved = false;
                    }
                }catch{}
            }
        }


        try{
            if (this.movingPiece.moved == false){
                this.movingPiece.moved = true; // tell pieces that need to now that they have moved
                try{
                    this.movingPiece.justMoved = true;
                }catch{}
            }
        }catch{}
    }
    msgHandle(){ // handle notation and move differently if special move
        if (this.msg[0] == 'castle' && (this.inArr([this.movingPiece.x, this.movingPiece.y], this.msg))){ // gets rook and moves it to otherside of king
            if (this.movingPiece.x - this.originalX == this.castleDir * 2){    
                let piece = this.getRook(true);
                piece.x = this.movingPiece.x - this.castleDir * 1;
                piece.moved = true;
                this.notation = 'O-O';
            } else if (this.movingPiece.x - this.originalX == this.castleDir * -2){
                let piece = this.getRook(false);
                piece.x = this.movingPiece.x + this.castleDir * 1;
                piece.moved = true;
                this.notation = 'O-O-O';
            }
        
        } else if (this.msg[0] == 'enP-left' || this.msg[0] == 'enP-right' && (this.inArr([this.movingPiece.x, this.movingPiece.y], this.msg))){ // takes piece to the side of the pawn not diagonally
            
            let takenPiece = this.pieceTake(this.movingPiece.x, this.originalY, this.movingPiece.player);
            let el = document.createElement('img');
            el.className = 'takenPieces';
            el.src = takenPiece.image.src;
            if (this.playerMove){
                document.querySelector('#computerTakenPieces').appendChild(el);
            } else {
                document.querySelector('#playerTakenPieces').appendChild(el);
            }
            this.notation = 'x' + this.letters[this.movingPiece.x] + String(8-this.movingPiece.y) + 'e.p.';
            
        } else {
            
            this.notation = this.movingPiece.text;
            let takenPiece = this.pieceTake(this.movingPiece.x, this.movingPiece.y, this.movingPiece.player)
            if (takenPiece != 0){
                let el = document.createElement('img');
                el.className = 'takenPieces';
                el.src = takenPiece.image.src;
                if (this.playerMove){
                    document.querySelector('#computerTakenPieces').appendChild(el);
                } else {
                    document.querySelector('#playerTakenPieces').appendChild(el);
                }
                this.notation += 'x';
            }
            this.notation += this.letters[this.movingPiece.x] + String(8-this.movingPiece.y);
        
        }
    }
    getRook(king){ // castle kingside or queenside
        let kingRookX, queenRookX;
        if (this.castleDir == 1){
            kingRookX = 7;
            queenRookX = 0;
        } else {
            kingRookX = 0;
            queenRookX = 7;
        }
        if (king){
            if (this.playerMove){
                for (let i = 0; i < this.p.pieces.length; i++){
                    if (this.p.pieces[i].x == kingRookX && this.p.pieces[i].y == this.movingPiece.y){
                        return this.p.pieces[i];
                    }
                }
            } else {
                for (let i = 0; i < this.c.pieces.length; i++){
                    if (this.c.pieces[i].x == kingRookX && this.c.pieces[i].y == this.movingPiece.y){
                        return this.c.pieces[i];
                    }
                }
            }
        } else {
            if (this.playerMove){
                for (let i = 0; i < this.p.pieces.length; i++){
                    if (this.p.pieces[i].x == queenRookX && this.p.pieces[i].y == this.movingPiece.y){
                        return this.p.pieces[i];
                    }
                }
            } else {
                for (let i = 0; i < this.c.pieces.length; i++){
                    if (this.c.pieces[i].x == queenRookX && this.c.pieces[i].y == this.movingPiece.y){
                        return this.c.pieces[i];
                    }
                }
            }
        }
    }
    pieceTake(x, y, player){ // returns piece if taken and 0 if not
        if(player){
            for(let i = 0; i < this.c.pieces.length; i++){
                if (this.c.pieces[i].x == x && this.c.pieces[i].y == y){
                    let piece = this.c.pieces[i];
                    this.c.pieces.splice(i, 1);
                    return piece;
                }
            }
        } else {
            for(let i = 0; i < this.p.pieces.length; i++){
                if (this.p.pieces[i].x == x && this.p.pieces[i].y == y){
                    let piece = this.p.pieces[i];
                    this.p.pieces.splice(i, 1);
                    return piece;
                }
            }
        }
        return 0;
    }

    completeMove(){
        this.updateTakeArr(this.playerMove); // update current colors for taking moves

        this.inCheck = 0; // reset values for next move

        this.msg = 0;

        this.prev = [];

        this.createGrid(); // completely resets grid
        this.updatePrev(); // update prev array to show most recent move

        this.movingPiece = 0; // refresh moving piece variable for next go
        this.playerMove = !(this.playerMove); // change move color

        if (this.playerMove){
            document.querySelector('#playerTime').className = 'moving';
            document.querySelector('#computerTime').className = 'waiting';
        } else {
            document.querySelector('#playerTime').className = 'waiting';
            document.querySelector('#computerTime').className = 'moving';
        }
            
        let checkValue = this.isCheck(this.playerMove); //use checkvalue to evaluate position and last bits of notation

        if(checkValue != 0){
            this.notation += '+';
        }

        let element = document.createElement('li');
        if (this.isPlayerWhite){
            if (!this.playerMove){ //append notation to correct html element
                document.querySelector('#white-moves').appendChild(element);
            } else {
                document.querySelector('#black-moves').appendChild(element);
            }
        } else {
            if (!this.playerMove){ //append notation to correct html element
                document.querySelector('#black-moves').appendChild(element);
            } else {
                document.querySelector('#white-moves').appendChild(element);
            }
        }

        element.innerHTML += this.notation;
        this.updateScroll(); //make scroll of notation div to lowest to show most recent moves          
            
        let hasMoves = this.hasMoves();
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
        this.startTime = new Date().getTime();
    }
    updateTakeArr(player){ // update possible taking squares of a color
        if(player){
            this.playerTakeMoves = [];
            for (let i = 0; i < this.p.pieces.length; i++){
                this.p.pieces[i].mapLegal();
                for (let j = 0; j < this.p.pieces[i].take.length; j++){
                    this.playerTakeMoves.push(this.p.pieces[i].take[j]);
                }
            }
        } else {
            this.computerTakeMoves = [];
            for (let i = 0; i < this.c.pieces.length; i++){
                this.c.pieces[i].mapLegal();
                for (let j = 0; j < this.c.pieces[i].take.length; j++){
                    this.computerTakeMoves.push(this.c.pieces[i].take[j]);
                }
            }
        }
    }
    updatePrev(){ //update most recent moves and their square colors
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
    isCheck(player){ // evaluate checks in a position using opposite sides taking moves
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
    updateScroll(){ // make div scroll when new move added to notation
        let div = document.querySelector('#notation-board');
        div.scrollTop = div.scrollHeight;
    }
    hasMoves(){ // check if any legal moves available for any pieces to see if position is in checkmate or stalemate
        if (this.playerMove){
            for (let i = 0; i < this.p.pieces.length; i++){
                this.movingPiece = this.p.pieces[i];
                this.pieceUpdateLegal(this.movingPiece);
                if (this.movingPiece.legal.length > 0){
                    this.movingPiece = 0;
                    this.msg = 0;
                    return true;
                }
            }
        } else {
            for (let i = 0; i < this.c.pieces.length; i++){
                this.movingPiece = this.c.pieces[i];
                this.pieceUpdateLegal(this.movingPiece);
                if (this.movingPiece.legal.length > 0){
                    this.movingPiece = 0;
                    this.msg = 0;
                    return true;
                }
            }
        }
        this.movingPiece = 0;
        this.msg = 0;
        return false;
    }
    timeHandle(){ // gets time between last reading and changes html values accordingly
        this.endTime = new Date().getTime();
        let difference = (this.endTime - this.startTime)/1000;
        if (this.playerMove){
            this.playerTime -= difference;
            if (this.playerTime <= 0){
                document.querySelector('#playerTime').innerHTML = "0:00";
                this.playing = false;
                this.endMsg = 'time out';
                this.winnerMsg = 'black wins';
            } else {
                let value = Math.floor(this.playerTime);
                let min = Math.floor(value/60);
                let sec = String(value % 60);
                if (sec.length < 2){
                    sec = "0" + sec;
                }
                document.querySelector('#playerTime').innerHTML = String(min) + ":" + String(sec);
            }
        } else{
            this.computerTime -= difference;
            if (this.computerTime <= 0){
                document.querySelector('#computerTime').innerHTML = "0:00";
                this.playing = false;
                this.endMsg = 'time out';
                this.winnerMsg = 'white wins';
            } else {
                let value = Math.floor(this.computerTime);
                let min = Math.floor(value/60);
                let sec = String(value % 60);
                if (sec.length < 2){
                    sec = "0" + sec;
                }
                document.querySelector('#computerTime').innerHTML = String(min) + ":" + String(sec);
            }
        }
        this.startTime = new Date().getTime();
    }
    resign(){ // ends game loop and changes values to display
        this.endMsg = 'resignation';
        this.playing = false;
        this.winnerMsg = 'computer won';
    }
}