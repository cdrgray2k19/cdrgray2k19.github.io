class board{
    constructor(){
        this.playing = true;
        /* canvas initialisation*/
        this.canvas = document.querySelector('#c');
        this.ctx = this.canvas.getContext("2d");
        this.resizeCanvas();
        /* --------- */
        
        this.width = 640; // set html sizes which will be used when drawing pieces
        this.height = 640;
        this.sqSize = this.height/8;
        
        /*this.whitePieces = []; // create arrays which will stores all pieces on board
        this.blackPieces = [];*/
        
        this.playerPieces = [];
        this.computerPieces = [];

        this.playerMove = true;

        this.isPlayerWhite = true;
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
        let val = 0
        if (this.isPlayerWhite){
            val = 0;
        } else {
            val = 1;
        }
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){
                if ((x+y) % 2 == val){
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
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){

                let color_block = this.squares[x][y].block;
                let color_coord = this.squares[x][y].coord;
                this.ctx.fillStyle = color_block;
                this.ctx.fillRect(x * this.sqSize, y * this.sqSize, this.sqSize, this.sqSize);
                if (x == 0){
                    this.ctx.fillStyle = color_coord;
                    this.ctx.font = this.smallFont;
                    let value = 8 - y;
                    this.ctx.fillText(String(value), x * this.sqSize, y * this.sqSize + this.sqSize/6);
                }
                if (y == 7){
                    this.ctx.fillStyle = color_coord;
                    this.ctx.font = this.smallFont;
                    let value = this.letters[x];
                    this.ctx.fillText(value, x * this.sqSize + this.sqSize * 9/10, y * this.sqSize + this.sqSize* 14/15);
                }
            }
        }
    }
    createPieces(){ // add peices to piece arrays
        let FENcode = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'; // starting position
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
        for (let i = 0; i < this.playerPieces.length; i++){
            this.playerPieces[i].display();
        }
        for (let i = 0; i < this.computerPieces.length; i++){
            this.computerPieces[i].display();
        }
    }

    mousePress1(){ // search pieces to see if mouse over any when clicked
        for (let i = 0; i < this.playerPieces.length; i++){
            let piece = this.playerPieces[i];
            if (piece.x == Math.floor(this.mouse[0]/(this.canvas_width/8)) && piece.y == Math.floor(this.mouse[1]/(this.canvas_width/8))){
                this.movingPiece = piece;
                this.piecePressed();
            }
        }
    }
    piecePressed(){ // update legal then change color of legal move squares to make obvious to player
        this.pieceUpdateLegal();
        
        //update squares
        if (this.squares[this.movingPiece.x][this.movingPiece.y].block == this.lightSqCol){
            this.squares[this.movingPiece.x][this.movingPiece.y].block = this.lightPrevCol;
        } else {
            this.squares[this.movingPiece.x][this.movingPiece.y].block = this.darkPrevCol;
        }

        this.squares[this.movingPiece.x][this.movingPiece.y].coord = this.changedCoordCol;
        
        for(let i = 0; i < this.movingPiece.legal.length;i++){
            if ((this.movingPiece.legal[i][0] + this.movingPiece.legal[i][1]) % 2 == 0){
                this.squares[this.movingPiece.legal[i][0]][this.movingPiece.legal[i][1]].block = this.lightLegalCol;
            } else {
                this.squares[this.movingPiece.legal[i][0]][this.movingPiece.legal[i][1]].block = this.darkLegalCol;
            }
            this.squares[this.movingPiece.legal[i][0]][this.movingPiece.legal[i][1]].coord = this.changedCoordCol;
        }
    }
    randomMove(){
        this.getMovablePiece();
        let index = Math.floor(Math.random() * this.movingPiece.legal.length)
        let move = this.movingPiece.legal[index];
        let x = move[0];
        let y = move[1];
        this.movingPiece.x = x;
        this.movingPiece.y = y;

        this.movingVariableHandle(); // change piece.moved and justMoved variables

        this.notation = ''; // reset notation

        this.msgHandle(); // handle move if message is not normal for castling and en passant

        this.afterPromotion();

    }
    getMovablePiece(){
        let index = Math.floor(Math.random() * this.computerPieces.length)
        let piece = this.computerPieces[index];

        this.movingPiece = piece;
        this.pieceUpdateLegal();
        if (this.movingPiece.legal.length == 0){
            this.getMovablePiece();
        }
    }
    pieceUpdateLegal(){ // reference mapLegal which gets legal depending on rules and other pieces and then add checking logic to the moves
        this.msg = this.movingPiece.mapLegal(); // get legal moves depending on board and store msg which stores any other info about the legal moves
        if (this.msg == []){
            this.msg = [0];
        }
        this.originalX = this.movingPiece.x; // store original x and y positoin
        this.originalY = this.movingPiece.y;
        let arr = this.movingPiece.legal; // make it easier to manipulate array
        let arr2 = []; // open array to store legal moves after checks analysed
        let takenPiece = 0; // temporarily holds a taken piece to evaluate boards for checks so it can be pushed back into array
        for(let i = 0; i < arr.length;i++){
            this.movingPiece.x = arr[i][0]; // temporarily move pieces
            this.movingPiece.y = arr[i][1]; // temporarily move pieces
            if (this.msg[0] == 'castle'){ // if the message is not an empty string then legalise the moves differently
                if (this.inArr([this.movingPiece.x, this.movingPiece.y], this.msg)){ // check if in this.msg
                    let result = this.castle();
                    if(result!=false){
                        arr2.push([arr[i][0], arr[i][1]]);
                    }
                    continue;
                }
            } else if (this.msg[0] == 'enP-left' || this.msg[0] == 'enP-right'){
                takenPiece = this.pieceTake(this.movingPiece.x, this.originalY, this.movingPiece.white);
            }else{
                takenPiece = this.pieceTake(this.movingPiece.x, this.movingPiece.y, this.movingPiece.white);
            }
            this.updateTakeArr(!this.playerMove) // update opposite color available taking moves
            if(this.isCheck(this.playerMove) == 0){
                arr2.push([arr[i][0], arr[i][1]]); // if no checks are found for this move then append to new legal moves array
            }
            if (takenPiece != 0){ // if piece was taken, now the evaluation of the board is done the piece can be pushed back into the nescessary array to be stored on the board
                if (this.movingPiece.player){
                    this.computerPieces.push(takenPiece);
                } else {
                    this.playerPieces.push(takenPiece);
                }
            }
        }

        this.movingPiece.legal = arr2; // change legal array to new check legal array
        this.movingPiece.x = this.originalX; // change x and y position back
        this.movingPiece.y = this.originalY;
    }
    pieceAt(x, y, player){ // returns true if a friendly piece in square, false if enemy piece on square, and 'null' if no pieces on square

        for (let i = 0; i < this.playerPieces.length; i++){
            if (this.playerPieces[i].x == x && this.playerPieces[i].y == y){
                if(player){
                    return true;
                } else {
                    return false;
                }
            }
        }

        for (let i = 0; i < this.computerPieces.length; i++){
            if (this.computerPieces[i].x == x && this.computerPieces[i].y == y){
                if(player){
                    return false;
                } else {
                    return true;
                }
            }
        }
        return 'null';
    }
    mousePress2(){

        this.clearGrid();

        let x = Math.floor(this.mouse[0]/(this.canvas_width/8)); // evaluate board coordinates of mouse position
        let y = Math.floor(this.mouse[1]/(this.canvas_width/8));
        let pos = [x, y];
        let value = this.inArr(pos, this.movingPiece.legal); // check if move in legal move of selected piece

        if (value){
            /*let this.originalX = this.movingPiece.x; // store original values
            let this.originalY = this.movingPiece.y;*/
            this.movingPiece.x = x; // move
            this.movingPiece.y = y; // move
            
            this.movingVariableHandle(); // change piece.moved and justMoved variables

            this.notation = ''; // reset notation

            this.msgHandle(); // handle move if message is not normal for castling and en passant

            let promotionResult = this.promotionHandle(); // handle piece promotion
            
            if (!promotionResult){
                this.afterPromotion();
                if (this.playing){
                    this.randomMove();
                }
            }

        } else { // if square not in legal moves then reset moving peice and check if other peice selected
            this.movingPiece = 0;
            this.mousePress1(); // check if same color piece has been clicked which would restart process
        }
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
            for (let i = 0; i < this.playerPieces.length; i++){
                try{
                    if (this.playerPieces[i].justMoved == true){
                        this.playerPieces[i].justMoved = false;
                    }
                }catch{}
            }
        } else {
            for (let i = 0; i < this.computerPieces.length; i++){
                try{
                    if (this.computerPieces[i].justMoved == true){
                        this.computerPieces[i].justMoved = false;
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
        //change way loop handles special messages by saving special move coords then checking if a legal move is a special move
        if (this.msg[0] == 'castle'){ // gets rook and moves it to otherside of king
            if (this.movingPiece.x - this.originalX == 2){
                let piece = this.getRook(true);
                piece.x = this.movingPiece.x - 1;
                piece.moved = true;
                this.notation = 'O-O';
            } else if (this.movingPiece.x - this.originalX == -2){
                let piece = this.getRook(false);
                piece.x = this.movingPiece.x + 1;
                piece.moved = true;
                this.notation = 'O-O-O';
            }
        } else if (this.msg[0] == 'enP-left' || this.msg[0] == 'enP-right' && (this.movingPiece.x != this.originalX && this.pieceTake(this.movingPiece.x, this.movingPiece.y, this.movingPiece.player) == 0)){ // takes piece to the side of the pawn not diagonally
            let takenPiece = this.pieceTake(this.movingPiece.x, this.originalY, this.movingPiece.player);
            let el = document.createElement('img')
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
                let el = document.createElement('img')
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
    castle(){
        let holdX = this.movingPiece.x;
        if (this.originalX - this.movingPiece.x == 2){
            //queen side castle
            if(this.inCheck){
                return false;
            }
            for (let i = 1; i<3; i++){
                this.movingPiece.x = this.originalX - i;
                this.updateTakeArr(!this.playerMove);
                if (this.isCheck(this.playerMove) != 0){
                    return false;
                }
            }
            return [holdX, this.movingPiece.y];
        } else if (this.originalX - this.movingPiece.x == -2){
            //king side castle
            if(this.inCheck){
                return false;
            }
            for (let i = 1; i<3; i++){
                this.movingPiece.x = this.originalX + i;
                this.updateTakeArr(!this.playerMove);
                if (this.isCheck(this.playerMove) != 0){
                    return false;
                }
            }
            return [holdX, this.movingPiece.y];
        }
    }
    getRook(king){ // castle kingside or queenside
        if (king){
            if (this.playerMove){
                for (let i = 0; i < this.playerPieces.length; i++){
                    if (this.playerPieces[i].x == 7 && this.playerPieces[i].y == this.movingPiece.y){
                        return this.playerPieces[i];
                    }
                }
            } else {
                for (let i = 0; i < this.computerPieces.length; i++){
                    if (this.computerPieces[i].x == 7 && this.computerPieces[i].y == this.movingPiece.y){
                        return this.computerPieces[i];
                    }
                }
            }
        } else {
            if (this.playerMove){
                for (let i = 0; i < this.playerPieces.length; i++){
                    if (this.playerPieces[i].x == 0 && this.playerPieces[i].y == this.movingPiece.y){
                        return this.playerPieces[i];
                    }
                }
            } else {
                for (let i = 0; i < this.computerPieces.length; i++){
                    if (this.computerPieces[i].x == 0 && this.computerPieces[i].y == this.movingPiece.y){
                        return this.computerPieces[i];
                    }
                }
            }
        }
    }
    pieceTake(x, y, player){ // returns piece if taken and 0 if not
        if(player){
            for(let i = 0; i < this.computerPieces.length; i++){
                if (this.computerPieces[i].x == x && this.computerPieces[i].y == y){
                    let piece = this.computerPieces[i];
                    this.computerPieces.splice(i, 1);
                    return piece;
                }
            }
        } else {
            for(let i = 0; i < this.playerPieces.length; i++){
                if (this.playerPieces[i].x == x && this.playerPieces[i].y == y){
                    let piece = this.playerPieces[i];
                    this.playerPieces.splice(i, 1);
                    return piece;
                }
            }
        }
        return 0;
    }
    promotionHandle(){ // handles promotion notation and logic
        if (this.movingPiece.text == '' && (this.movingPiece.y == 0 || this.movingPiece.y == 7)){
            document.querySelector('#replacement').style.display = "block";
            return true;
        }
        return false;
    }
    replaceForPiece(newPiece){
        if (this.movingPiece.player){
            this.playerPieces.push(newPiece);
            let index = this.playerPieces.indexOf(this.movingPiece);
            this.playerPieces.splice(index, 1);
        } else {
            this.computerPieces.push(newPiece);
            let index = this.computerPieces.indexOf(this.movingPiece);
            this.computerPieces.splice(index, 1);
        }
        document.getElementById("replacement").style.display = "none";
        this.afterPromotion();
        if (this.playing){
            this.randomMove();
        }
    }
    afterPromotion(){
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
        if (!this.playerMove){ //append notation to correct html element
            document.querySelector('#white-moves').appendChild(element);
        } else {
            document.querySelector('#black-moves').appendChild(element);
        }

        element.innerHTML += this.notation;
        this.updateScroll(); //make scroll of notation div to lowest to show most recent moves          
            
        if(checkValue != 0){ // check new color for checks before anything else
            let x = this.isCheck(this.playerMove)[0];
            let y = this.isCheck(this.playerMove)[1];
            this.inCheck = [x, y];
            this.squares[x][y].block = this.checkCol;
            this.squares[x][y].coord = this.changedCoordCol;
            if(this.hasMoves(this.playerMove) == false){
                this.endMsg = 'checkmate';
                this.playing = false;
                if (this.playerMove){
                    this.winnerMsg = 'computer wins';
                } else {
                    this.winnerMsg = 'player wins';
                }
            }
        } else {
            if(this.hasMoves(this.playerMove) == false){
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
            for (let i = 0; i < this.playerPieces.length; i++){
                this.playerPieces[i].mapLegal();
                for (let j = 0; j < this.playerPieces[i].take.length; j++){
                    this.playerTakeMoves.push(this.playerPieces[i].take[j]);
                }
            }
        } else {
            this.computerTakeMoves = [];
            for (let i = 0; i < this.computerPieces.length; i++){
                this.computerPieces[i].mapLegal();
                for (let j = 0; j < this.computerPieces[i].take.length; j++){
                    this.computerTakeMoves.push(this.computerPieces[i].take[j]);
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
            for (let i = 0; i < this.playerPieces.length; i++){
                if (this.playerPieces[i].constructor.name == king.name){
                    var x = this.playerPieces[i].x;
                    var y = this.playerPieces[i].y;
                }
            }
            for (let i = 0; i < this.computerTakeMoves.length; i++){
                if (this.computerTakeMoves[i][0] == x && this.computerTakeMoves[i][1] == y){
                    return [x, y];
                }
            }
        } else {
            for (let i = 0; i < this.computerPieces.length; i++){
                if (this.computerPieces[i].constructor.name == king.name){
                    var x = this.computerPieces[i].x;
                    var y = this.computerPieces[i].y;
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
    hasMoves(player){ // check if any legal moves available for any pieces to see if position is in checkmate or stalemate
        if (player){
            for (let i = 0; i < this.playerPieces.length; i++){
                let piece = this.playerPieces[i];
                piece.mapLegal();
                let originalX = piece.x;
                let originalY = piece.y;
                let arr = piece.legal;
                for(let i = 0; i < arr.length;i++){
                    piece.x = arr[i][0];
                    piece.y = arr[i][1];
                    let takenPiece = this.pieceTake(piece.x, piece.y, piece.player);
                    this.updateTakeArr(!this.playerMove)
                    if(this.isCheck(this.playerMove) == 0){
                        if (takenPiece != 0){
                            if (piece.player){
                                this.computerPieces.push(takenPiece);
                            } else {
                                this.playerPieces.push(takenPiece);
                            }
                        }
                        piece.x = originalX;
                        piece.y = originalY;
                        return true
                    }
                    if (takenPiece != 0){
                        if (piece.player){
                            this.computerPieces.push(takenPiece);
                        } else {
                            this.playerPieces.push(takenPiece);
                        }
                    }
                }
                piece.x = originalX;
                piece.y = originalY;
            }
        } else {
            for (let i = 0; i < this.computerPieces.length; i++){
                let piece = this.computerPieces[i];
                piece.mapLegal();
                let originalX = piece.x;
                let originalY = piece.y;
                let arr = piece.legal;
                for(let i = 0; i < arr.length;i++){
                    piece.x = arr[i][0];
                    piece.y = arr[i][1];
                    let takenPiece = this.pieceTake(piece.x, piece.y, piece.player);
                    this.updateTakeArr(!this.playerMove)
                    if(this.isCheck(this.playerMove) == 0){
                        if (takenPiece != 0){
                            if (piece.player){
                                this.computerPieces.push(takenPiece);
                            } else {
                                this.playerPieces.push(takenPiece);
                            }
                        }
                        piece.x = originalX;
                        piece.y = originalY;
                        return true
                    }
                    if (takenPiece != 0){
                        if (piece.player){
                            this.computerPieces.push(takenPiece);
                        } else {
                            this.playerPieces.push(takenPiece);
                        }
                    }
                }
                piece.x = originalX;
                piece.y = originalY;
            }
        }
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
        if (this.playerMove){
            this.winnerMsg = 'computer won';
        } else {
            this.winnerMsg = 'you won';
        }
    }
    draw(){ // ends game loop and changes values to display
        this.endMsg = 'draw agreed';
        this.playing = false;
        this.winnerMsg = 'draw';
    }
}