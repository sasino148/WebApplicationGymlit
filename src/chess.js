// Minimal self-contained chess implementation (UI + rules)
// Supports: legal move generation, turns, check/checkmate, castling, en-passant, pawn promotion (prompt), basic UI

export class ChessGame {
    constructor(container) {
        this.container = container; // DOM element to render into
        this.size = 480;
        this.squareSize = this.size / 8;
        this.turn = 'w';
        this.selected = null;
        this.board = this.createStartingBoard();
        this.history = [];
        this.enPassant = null; // coordinate like 'e3' where en-passant capture is possible
        this.buildUI();
        this.render();
    }

    createStartingBoard() {
        const emptyRow = () => Array(8).fill(null);
        // We'll use objects {t:'p',c:'w'} type and color
        const board = Array.from({length:8}, (_,r) => emptyRow());
        const back = ['r','n','b','q','k','b','n','r'];
        for (let c=0;c<8;c++) board[0][c] = {t: back[c], c:'b', moved:false};
        for (let c=0;c<8;c++) board[1][c] = {t: 'p', c:'b', moved:false};
        for (let c=0;c<8;c++) board[6][c] = {t: 'p', c:'w', moved:false};
        for (let c=0;c<8;c++) board[7][c] = {t: back[c], c:'w', moved:false};
        return board;
    }

    buildUI() {
        this.container.innerHTML = '';
        this.boardEl = document.createElement('div');
        this.boardEl.style.width = this.size + 'px';
        this.boardEl.style.height = this.size + 'px';
        this.boardEl.style.position = 'relative';
        this.boardEl.style.border = '2px solid #333';
        this.boardEl.style.background = '#eee';
        this.container.appendChild(this.boardEl);

        this.statusEl = document.createElement('div');
        this.container.appendChild(this.statusEl);

        this.boardEl.addEventListener('click', (e) => {
            const rect = this.boardEl.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / this.squareSize);
            const y = Math.floor((e.clientY - rect.top) / this.squareSize);
            if (x<0||x>7||y<0||y>7) return;
            this.onSquareClick(y,x);
        });
    }

    coordToAlgebraic(r,c) { return 'abcdefgh'[c] + (8-r); }
    algebraicToCoord(s) { const c = 'abcdefgh'.indexOf(s[0]); const r = 8-parseInt(s[1]); return [r,c]; }

    onSquareClick(r,c) {
        const piece = this.board[r][c];
        if (this.selected) {
            const [sr,sc] = this.selected;
            if (sr===r && sc===c) { this.selected = null; this.render(); return; }
            const legal = this.getLegalMoves(sr,sc);
            const found = legal.find(m => m.r===r && m.c===c);
            if (found) {
                this.makeMove(sr,sc,r,c, found);
                this.selected = null;
                this.render();
                return;
            }
        }
        if (piece && piece.c === this.turn) {
            this.selected = [r,c];
            this.render();
        }
    }

    cloneBoard() { return this.board.map(row => row.map(cell => cell ? {...cell} : null)); }

    makeMove(sr,sc,tr,tc, meta={}) {
        const piece = this.board[sr][sc];
        // move and history
        const prev = {board: this.cloneBoard(), turn:this.turn, enPassant:this.enPassant};
        this.history.push(prev);

        // handle en-passant capture
        if (piece.t === 'p' && meta.enPassantCapture) {
            // captured pawn is the one that moved two squares and sits on the same rank as the mover's source and in the target column
            this.board[sr][tc] = null;
        }

        // castling
        if (piece.t === 'k' && Math.abs(tc-sc) === 2) {
            // king side or queen side
            const dir = tc>sc?1:-1;
            // move rook
            const rookCol = dir>0?7:0;
            const rook = this.board[sr][rookCol];
            this.board[sr][rookCol] = null;
            this.board[sr][sc+dir] = rook;
            rook.moved = true;
        }

        // pawn promotion
        if (piece.t === 'p' && (tr===0 || tr===7)) {
            const promoteTo = prompt('Promote to (q/r/b/n)', 'q') || 'q';
            piece.t = promoteTo[0].toLowerCase();
        }

        // move piece
        this.board[tr][tc] = piece;
        this.board[sr][sc] = null;
        piece.moved = true;

        // set enPassant target
        this.enPassant = null;
        if (piece.t === 'p' && Math.abs(tr-sr) === 2) {
            // square behind pawn
            const behindR = (tr+sr)/2;
            this.enPassant = this.coordToAlgebraic(behindR, tc);
        }

        // flip turn
        this.turn = this.turn === 'w' ? 'b' : 'w';

        // detect checkmate/stalemate
        const state = this.getGameState();
        if (state !== 'playing') {
            setTimeout(() => alert('Game over: ' + state), 10);
        }
    }

    inBounds(r,c){ return r>=0 && r<8 && c>=0 && c<8 }

    getLegalMoves(r,c) {
        const piece = this.board[r][c];
        if (!piece) return [];
        const moves = [];
        const color = piece.c;
        const add = (rr,cc,meta={}) => { if (!this.inBounds(rr,cc)) return; const target = this.board[rr][cc]; if (!target || target.c!==color) moves.push({r:rr,c:cc,meta}); };

        if (piece.t === 'p') {
            const dir = piece.c === 'w' ? -1 : 1;
            const startRow = piece.c === 'w' ? 6 : 1;
            // forward
            if (this.inBounds(r+dir,c) && !this.board[r+dir][c]) moves.push({r:r+dir,c: c});
            // double
            if (!piece.moved && this.inBounds(r+2*dir,c) && !this.board[r+dir][c] && !this.board[r+2*dir][c]) moves.push({r:r+2*dir,c:c});
            // captures
            for (const dc of [-1,1]) {
                const rr = r+dir, cc = c+dc;
                if (!this.inBounds(rr,cc)) continue;
                const t = this.board[rr][cc];
                if (t && t.c !== piece.c) moves.push({r:rr,c:cc});
                // en-passant
                if (this.enPassant) {
                    const [er,ec] = this.algebraicToCoord(this.enPassant);
                    if (er === rr && ec === cc) moves.push({r:rr,c:cc, enPassantCapture:true});
                }
            }
        }

        if (piece.t === 'n') {
            const deltas = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
            for (const [dr,dc] of deltas) add(r+dr,c+dc);
        }

        if (piece.t === 'b' || piece.t === 'r' || piece.t === 'q') {
            const dirs = [];
            if (piece.t === 'b' || piece.t === 'q') dirs.push(...[[-1,-1],[-1,1],[1,-1],[1,1]]);
            if (piece.t === 'r' || piece.t === 'q') dirs.push(...[[-1,0],[1,0],[0,-1],[0,1]]);
            for (const [dr,dc] of dirs) {
                let i=1; while(true){ const rr=r+dr*i, cc=c+dc*i; if(!this.inBounds(rr,cc)) break; const t = this.board[rr][cc]; if(!t){ moves.push({r:rr,c:cc}); } else { if(t.c!==piece.c) moves.push({r:rr,c:cc}); break; } i++; }
            }
        }

        if (piece.t === 'k') {
            for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++) if (dr||dc) add(r+dr,c+dc);
            // castling
            if (!piece.moved) {
                // king side
                const canCastleSide = (rookCol) => {
                    const rook = this.board[r][rookCol];
                    if (!rook || rook.t!=='r' || rook.c!==piece.c || rook.moved) return false;
                    const dir = rookCol>c ? 1 : -1;
                    for (let i=1;i<Math.abs(rookCol-c);i++) if (this.board[r][c+i*dir]) return false;
                    // TODO: ensure no squares are attacked
                    return true;
                };
                if (canCastleSide(7)) moves.push({r:r,c:c+2});
                if (canCastleSide(0)) moves.push({r:r,c:c-2});
            }
        }

        // filter out moves that leave king in check
        const legal = moves.filter(m => {
            const snapshot = this.cloneBoard();
            const pieceCopy = snapshot[r][c];
            snapshot[m.r][m.c] = pieceCopy;
            snapshot[r][c] = null;
            // handle en-passant kill in snapshot
            if (piece.t === 'p' && m.enPassantCapture) {
                // remove the pawn that was jumped over in the snapshot: it's on the original row and in the target column
                snapshot[r][m.c] = null;
            }
            const kingPos = this.findKingPos(piece.c, snapshot);
            const inChk = this.isSquareAttacked(kingPos.r, kingPos.c, piece.c === 'w' ? 'b' : 'w', snapshot);
            return !inChk;
        });

        return legal;
    }

    findKingPos(color, board) {
        for (let r=0;r<8;r++) for (let c=0;c<8;c++) { const p = board[r][c]; if (p && p.t==='k' && p.c===color) return {r,c}; }
        return null;
    }

    isSquareAttacked(r,c, byColor, boardOverride=null) {
        const b = boardOverride || this.board;
        // naive: iterate all opponent pieces and see if they can move to r,c ignoring checks
        for (let rr=0;rr<8;rr++) for (let cc=0;cc<8;cc++) {
            const p = b[rr][cc]; if (!p || p.c!==byColor) continue;
            if (this.pieceAttacksSquare(rr,cc,r,c,p,b)) return true;
        }
        return false;
    }

    pieceAttacksSquare(sr,sc,tr,tc,piece,board) {
        const dr = tr-sr, dc = tc-sc;
        const abs = Math.abs;
        if (piece.t==='p') {
            const dir = piece.c==='w' ? -1 : 1; return dr===dir && abs(dc)===1;
        }
        if (piece.t==='n') {
            const d = [abs(dr),abs(dc)].sort(); return d[0]===1 && d[1]===2;
        }
        if (piece.t==='b' || piece.t==='q' || piece.t==='r') {
            const dirs = [];
            if (piece.t==='b' || piece.t==='q') dirs.push(...[[-1,-1],[-1,1],[1,-1],[1,1]]);
            if (piece.t==='r' || piece.t==='q') dirs.push(...[[-1,0],[1,0],[0,-1],[0,1]]);
            for (const [drr, dcc] of dirs) {
                let i=1; while(true){ const rr=sr+drr*i, cc=sc+dcc*i; if(!this.inBounds(rr,cc)) break; if(rr===tr && cc===tc) return true; if(board[rr][cc]) break; i++; }
            }
            return false;
        }
        if (piece.t==='k') return Math.max(abs(dr),abs(dc))===1;
        return false;
    }

    getGameState() {
        // check if current player has legal moves
        for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
            const p = this.board[r][c]; if (!p || p.c !== this.turn) continue;
            const moves = this.getLegalMoves(r,c);
            if (moves.length>0) return 'playing';
        }
        // no legal moves -> check or stalemate
        const kingPos = this.findKingPos(this.turn, this.board);
        const inChk = this.isSquareAttacked(kingPos.r, kingPos.c, this.turn==='w'?'b':'w');
        return inChk ? 'checkmate' : 'stalemate';
    }

    render() {
        this.boardEl.innerHTML = '';
        for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
            const sq = document.createElement('div');
            sq.style.width = this.squareSize + 'px';
            sq.style.height = this.squareSize + 'px';
            sq.style.position = 'absolute';
            sq.style.left = (c*this.squareSize)+'px';
            sq.style.top = (r*this.squareSize)+'px';
            const light = (r+c)%2===0;
            sq.style.background = light ? '#f0d9b5' : '#b58863';
            this.boardEl.appendChild(sq);
            const piece = this.board[r][c];
            if (piece) {
                const pEl = document.createElement('div');
                pEl.style.width = '100%'; pEl.style.height = '100%';
                pEl.style.display = 'flex'; pEl.style.alignItems='center'; pEl.style.justifyContent='center';
                pEl.style.fontSize = (this.squareSize*0.6) + 'px';
                pEl.style.cursor = 'pointer';
                pEl.innerText = this.pieceToChar(piece);
                pEl.style.userSelect = 'none';
                sq.appendChild(pEl);
            }
            if (this.selected && this.selected[0]===r && this.selected[1]===c) {
                sq.style.outline = '3px solid yellow';
            }
        }
        this.statusEl.innerText = `Turn: ${this.turn === 'w' ? 'White' : 'Black'}` + (this.enPassant?(' | en-passant: '+this.enPassant):'');
    }

    pieceToChar(p) {
        // use distinct glyphs for white and black pieces
        const whiteMap = {p:'♙',r:'♖',n:'♘',b:'♗',q:'♕',k:'♔'};
        const blackMap = {p:'♟',r:'♜',n:'♞',b:'♝',q:'♛',k:'♚'};
        const ch = p.c === 'w' ? (whiteMap[p.t] || '?') : (blackMap[p.t] || '?');
        return ch;
    }
}

// small helper to mount the game
export function mountChess(container) { return new ChessGame(container); }
