export class Tetris {
    /*constructor(parent, x = 400, y = 20, cellSize = 24, cols = 10, rows = 20) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.cols = cols;
        this.rows = rows;
        this.grid = Array.from({length: rows}, () => Array(cols).fill(0));
        this.colors = {
            1: "#00f0f0", // I
            2: "#0000f0", // J
            3: "#f0a000", // L
            4: "#f0f000", // O
            5: "#00f000", // S
            6: "#a000f0", // T
            7: "#f00000"  // Z
        };
        this.shapes = [
            // I
            [[[0,1],[1,1],[2,1],[3,1]], [[2,0],[2,1],[2,2],[2,3]]],
            // J
            [[[0,0],[0,1],[1,1],[2,1]], [[1,0],[2,0],[1,1],[1,2]], [[0,1],[1,1],[2,1],[2,2]], [[1,0],[1,1],[0,2],[1,2]]],
            // L
            [[[2,0],[0,1],[1,1],[2,1]], [[1,0],[1,1],[1,2],[2,2]], [[0,1],[1,1],[2,1],[0,2]], [[0,0],[1,0],[1,1],[1,2]]],
            // O
            [[[1,0],[2,0],[1,1],[2,1]]],
            // S
            [[[1,0],[2,0],[0,1],[1,1]], [[1,0],[1,1],[2,1],[2,2]]],
            // T
            [[[1,0],[0,1],[1,1],[2,1]], [[1,0],[1,1],[2,1],[1,2]], [[0,1],[1,1],[2,1],[1,2]], [[1,0],[0,1],[1,1],[1,2]]],
            // Z
            [[[0,0],[1,0],[1,1],[2,1]], [[2,0],[1,1],[2,1],[1,2]]]
        ];

        this.container = document.createElement("div");
        Object.assign(this.container.style, {
            position: "absolute",
            left: `${x}px`,
            top: `${y}px`,
            width: `${cols * cellSize}px`,
            height: `${rows * cellSize}px`,
            background: "#111",
            border: "2px solid white",
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            gap: "1px",
            boxSizing: "content-box",
            zIndex: 1000
        });

        // create cell elements
        this.cells = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const el = document.createElement("div");
                Object.assign(el.style, {
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    background: "#0b0b0b"
                });
                this.container.appendChild(el);
                this.cells.push(el);
            }
        }

        // inject minimal styles for active piece border
        if (!document.getElementById("tetris-styles")) {
            const s = document.createElement("style");
            s.id = "tetris-styles";
            s.textContent = `.tetris-flash { box-shadow: 12px 12px 12px white; }`;
            document.head.appendChild(s);
        }

        parent.appendChild(this.container);

        this.score = 0;
        this.level = 1;
        this.tickInterval = 150;
        this.current = null;
        this.running = false;

        this.spawn();
        this.bindKeys();
        this.start();
        this.render();
    }

    index(r,c){ return r * this.cols + c; }

    spawn() {
        const id = Math.floor(Math.random() * this.shapes.length);
        const rotations = this.shapes[id];
        const rotIndex = 0;
        const shape = { id: id + 1, rotations, rotIndex, x: Math.floor((this.cols - 4) / 2), y: -1 };
        this.current = shape;
        if (!this.canPlace(0,0,0)) {
            this.gameOver();
        }
    }

    canPlace(dx=0,dy=0,drot=0) {
        const rIndex = (this.current.rotIndex + drot) % this.current.rotations.length;
        const blocks = this.current.rotations[rIndex];
        for (const b of blocks) {
            const cx = this.current.x + b[0] + dx;
            const cy = this.current.y + b[1] + dy;
            if (cx < 0 || cx >= this.cols || cy >= this.rows) return false;
            if (cy >= 0 && this.grid[cy][cx]) return false;
        }
        return true;
    }

    lockPiece() {
        const blocks = this.current.rotations[this.current.rotIndex];
        for (const b of blocks) {
            const cx = this.current.x + b[0];
            const cy = this.current.y + b[1];
            if (cy >= 0 && cy < this.rows && cx >= 0 && cx < this.cols) {
                this.grid[cy][cx] = this.current.id;
            }
        }
        this.clearLines();
        this.spawn();
    }

    clearLines() {
        let cleared = 0;
        for (let r = this.rows - 1; r >= 0; r--) {
            if (this.grid[r].every(v => v !== 0)) {
                this.grid.splice(r, 1);
                this.grid.unshift(Array(this.cols).fill(0));
                cleared++;
                r++; // re-check same row index after splice
            }
        }
        if (cleared) {
            this.score += cleared * 100;
            this.level = 1 + Math.floor(this.score / 500);
            this.tickInterval = Math.max(100, 600 - (this.level -1) * 50);
            this.flash();
        }
    }

    flash() {
        this.container.classList.add("tetris-flash");
        setTimeout(()=> this.container.classList.remove("tetris-flash"), 160);
    }

    tick() {
        if (!this.running) return;
        if (this.canPlace(0,1,0)) {
            this.current.y++;
        } else {
            this.lockPiece();
        }
        this.render();
    }

    start() {
        this.running = true;
        if (this._interval) clearInterval(this._interval);
        this._interval = setInterval(()=> this.tick(), this.tickInterval);
    }

    stop() {
        this.running = false;
        if (this._interval) clearInterval(this._interval);
    }

    rotate() {
        if (this.canPlace(0,0,1)) {
            this.current.rotIndex = (this.current.rotIndex + 1) % this.current.rotations.length;
        } else {
            // try wall kicks (left/right)
            if (this.canPlace(-1,0,1)) { this.current.x--; this.current.rotIndex = (this.current.rotIndex + 1) % this.current.rotations.length; }
            else if (this.canPlace(1,0,1)) { this.current.x++; this.current.rotIndex = (this.current.rotIndex + 1) % this.current.rotations.length; }
        }
    }

    move(dx) {
        if (this.canPlace(dx,0,0)) this.current.x += dx;
    }

    drop() {
        while(this.canPlace(0,1,0)) this.current.y++;
        this.lockPiece();
    }

    bindKeys() {
        window.addEventListener("keydown", (e) => {
            if (!this.running) return;
            if (e.key === "ArrowLeft") { this.move(-1); this.render(); e.preventDefault(); }
            if (e.key === "ArrowRight") { this.move(1); this.render(); e.preventDefault(); }
            if (e.key === "ArrowDown") { if (this.canPlace(0,1,0)) { this.current.y++; this.render(); } e.preventDefault(); }
            if (e.key === "ArrowUp" || e.key === "x") { this.rotate(); this.render(); e.preventDefault(); }
            if (e.key === " ") { this.drop(); this.render(); e.preventDefault(); }
        });
    }

    render() {
        // reset visuals
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const v = this.grid[r][c];
                const el = this.cells[this.index(r,c)];
                el.style.background = v ? this.colors[v] : "#0b0b0b";
            }
        }
        // draw current piece
        const blocks = this.current.rotations[this.current.rotIndex];
        for (const b of blocks) {
            const cx = this.current.x + b[0];
            const cy = this.current.y + b[1];
            if (cy >= 0 && cy < this.rows && cx >= 0 && cx < this.cols) {
                const el = this.cells[this.index(cy,cx)];
                el.style.background = this.colors[this.current.id];
            }
        }
        // optionally show score by title
        this.container.title = `Score: ${this.score}  Level: ${this.level}`;
    }

    gameOver() {
        this.stop();
        alert(`Game Over\nScore: ${this.score}`);
        // reset
        this.grid = Array.from({length: this.rows}, () => Array(this.cols).fill(0));
        this.score = 0;
        this.level = 1;
        this.tickInterval = 600;
        this.spawn();
        this.start();
        this.render();
    }*/
}