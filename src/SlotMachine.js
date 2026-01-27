export class SlotMachine {
    constructor(parent, x = 0, y = 0) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.symbols = ['🍒','🍉','⭐',];

        // inject minimal CSS for animations
        if (!document.getElementById("slotmachine-styles")) {
            const s = document.createElement("style");
            s.id = "slotmachine-styles";
            s.textContent = `
            .slot-reel { transition: transform 120ms linear; }
            .slot-win { animation: slot-pulse 700ms ease forwards; box-shadow: 0 0 0 rgba(0,0,0,0); }
            .slot-lose { animation: slot-shake 600ms ease; }
            @keyframes slot-pulse {
                0% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
                50% { transform: scale(1.07); box-shadow: 0 10px 30px rgba(0,255,0,0.25); }
                100% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
            }
            @keyframes slot-shake {
                0% { transform: translateX(0); }
                20% { transform: translateX(-8px); }
                40% { transform: translateX(8px); }
                60% { transform: translateX(-6px); }
                80% { transform: translateX(6px); }
                100% { transform: translateX(0); }
            }
            .slot-confetti { position:absolute; pointer-events:none; width:8px; height:12px; border-radius:2px; opacity:0.95; animation: confetti-fall 1400ms linear forwards; }
            @keyframes confetti-fall {
                0% { transform: translateY(0) rotate(0deg); opacity:1; }
                100% { transform: translateY(300px) rotate(360deg); opacity:0; }
            }
            `;
            document.head.appendChild(s);
        }

        this.element = document.createElement('div');
        Object.assign(this.element.style, {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: '320px',
            padding: '12px',
            background: '#222',
            color: '#fff',
            borderRadius: '8px',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            fontFamily: 'sans-serif'
        });

        this.reels = [];
        for (let i = 0; i < 3; i++) {
            const r = document.createElement('div');
            r.className = 'slot-reel';
            Object.assign(r.style, {
                width: '80px',
                height: '90px',
                background: '#fff',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                borderRadius: '6px'
            });
            r.textContent = this.randomSymbol();
            this.element.appendChild(r);
            this.reels.push(r);
        }

        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.flexDirection = 'column';
        controls.style.gap = '6px';
        controls.style.marginLeft = '8px';

        const btn = document.createElement('button');
        btn.textContent = 'SPIN';
        Object.assign(btn.style, { padding: '8px 12px', cursor: 'pointer' });

        this.message = document.createElement('div');
        Object.assign(this.message.style, { minWidth: '120px', color: '#fff', textAlign: 'center' });

        controls.appendChild(btn);
        controls.appendChild(this.message);
        this.element.appendChild(controls);

        btn.addEventListener('click', () => this.spin());
        parent.appendChild(this.element);
    }

    randomSymbol() {
        return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }

    spin() {
        // reset classes/messages
        this.clearEffects();

        this.message.textContent = '';
        const durations = [900, 1400, 1900];
        const intervals = [];

        this.reels.forEach((r, idx) => {
            intervals[idx] = setInterval(() => r.textContent = this.randomSymbol(), 60);
            setTimeout(() => {
                clearInterval(intervals[idx]);
                r.textContent = this.randomSymbol();
                if (idx === this.reels.length - 1) this.checkWin();
            }, durations[idx]);
        });
    }

    checkWin() {
        const vals = this.reels.map(r => r.textContent);
        if (vals.every(v => v === vals[0])) {
            this.onWin(vals[0]);
        } else {
            this.onLose(vals);
        }
    }

    clearEffects() {
        this.element.classList.remove('slot-win','slot-lose');
        this.message.style.color = '#fff';
        // remove any existing confetti elements created earlier
        const conf = this.parent.querySelectorAll('.slot-confetti');
        conf.forEach(c => c.remove());
    }

    onWin(symbol) {
        // visual + text
        this.message.textContent = `WIN! ${symbol}${symbol}${symbol}`;
        this.message.style.color = 'lime';
        // add class for pulse/glow
        this.element.classList.remove('slot-lose');
        void this.element.offsetWidth; // force reflow to restart animation
        this.element.classList.add('slot-win');

        // spawn simple confetti
        this.spawnConfetti(30);
    }

    onLose(vals) {
        this.message.textContent = 'TRY AGAIN';
        this.message.style.color = '#ff6b6b';
        this.element.classList.remove('slot-win');
        void this.element.offsetWidth;
        this.element.classList.add('slot-lose');
    }

    spawnConfetti(count = 20) {
        const rect = this.element.getBoundingClientRect();
        for (let i = 0; i < count; i++) {
            const c = document.createElement('div');
            c.className = 'slot-confetti';
            const colors = ['#ff4757','#1dd1a1','#ffb84d','#70a1ff','#ff6b6b'];
            c.style.background = colors[Math.floor(Math.random()*colors.length)];
            // start position: random x within slot element
            const startX = rect.left + Math.random()*(rect.width - 10);
            c.style.left = `${startX}px`;
            c.style.top = `${rect.top + 8 + Math.random()*30}px`;
            // random horizontal drift using transform translateX via inline animation delay
            const delay = Math.random()*200;
            c.style.animationDelay = `${delay}ms`;
            c.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`;
            // append to body so falling isn't clipped
            document.body.appendChild(c);
            // auto remove
            setTimeout(() => c.remove(), 1800 + delay);
        }
    }
}