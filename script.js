// ゲームの状態管理
class HiraganaFishingGame {
    constructor() {
        this.score = 0;
        this.targetHiragana = '';
        this.fishes = [];
        this.isGameActive = true;
        this.isCasting = false;
        
        // ひらがな一覧（子ども向けに基本的なもの）
        this.hiraganaList = [
            'あ', 'い', 'う', 'え', 'お',
            'か', 'き', 'く', 'け', 'こ',
            'さ', 'し', 'す', 'せ', 'そ',
            'た', 'ち', 'つ', 'て', 'と',
            'な', 'に', 'ぬ', 'ね', 'の',
            'は', 'ひ', 'ふ', 'へ', 'ほ',
            'ま', 'み', 'む', 'め', 'も',
            'や', 'ゆ', 'よ',
            'ら', 'り', 'る', 'れ', 'ろ',
            'わ', 'を', 'ん'
        ];
        
        // 魚のSVGデータ
        this.fishSVGs = [
            // 赤い魚
            `<svg width="80" height="60" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="30" rx="25" ry="15" fill="#FF6B6B" stroke="#E55555" stroke-width="2"/>
                <path d="M15 30 L5 20 L5 40 Z" fill="#FF6B6B" stroke="#E55555" stroke-width="2"/>
                <path d="M35 15 L40 5 L45 15 Z" fill="#FF5555"/>
                <circle cx="50" cy="25" r="6" fill="white" stroke="#333" stroke-width="1"/>
                <circle cx="52" cy="25" r="3" fill="#333"/>
                <circle cx="53" cy="23" r="1" fill="white"/>
                <ellipse cx="62" cy="30" rx="3" ry="2" fill="#FF5555"/>
            </svg>`,
            // 青い魚
            `<svg width="80" height="60" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="30" rx="25" ry="15" fill="#4ECDC4" stroke="#3BB5AD" stroke-width="2"/>
                <path d="M15 30 L5 20 L5 40 Z" fill="#4ECDC4" stroke="#3BB5AD" stroke-width="2"/>
                <path d="M35 15 L40 5 L45 15 Z" fill="#3BB5AD"/>
                <circle cx="50" cy="25" r="6" fill="white" stroke="#333" stroke-width="1"/>
                <circle cx="52" cy="25" r="3" fill="#333"/>
                <circle cx="53" cy="23" r="1" fill="white"/>
                <ellipse cx="62" cy="30" rx="3" ry="2" fill="#3BB5AD"/>
            </svg>`,
            // 黄色い魚
            `<svg width="80" height="60" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="30" rx="25" ry="15" fill="#FFE66D" stroke="#E6CC5A" stroke-width="2"/>
                <path d="M15 30 L5 20 L5 40 Z" fill="#FFE66D" stroke="#E6CC5A" stroke-width="2"/>
                <path d="M35 15 L40 5 L45 15 Z" fill="#E6CC5A"/>
                <circle cx="50" cy="25" r="6" fill="white" stroke="#333" stroke-width="1"/>
                <circle cx="52" cy="25" r="3" fill="#333"/>
                <circle cx="53" cy="23" r="1" fill="white"/>
                <ellipse cx="62" cy="30" rx="3" ry="2" fill="#E6CC5A"/>
            </svg>`,
            // 緑の魚
            `<svg width="80" height="60" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="30" rx="25" ry="15" fill="#95E1A3" stroke="#7BC47F" stroke-width="2"/>
                <path d="M15 30 L5 20 L5 40 Z" fill="#95E1A3" stroke="#7BC47F" stroke-width="2"/>
                <path d="M35 15 L40 5 L45 15 Z" fill="#7BC47F"/>
                <circle cx="50" cy="25" r="6" fill="white" stroke="#333" stroke-width="1"/>
                <circle cx="52" cy="25" r="3" fill="#333"/>
                <circle cx="53" cy="23" r="1" fill="white"/>
                <ellipse cx="62" cy="30" rx="3" ry="2" fill="#7BC47F"/>
            </svg>`,
            // 紫の魚
            `<svg width="80" height="60" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="30" rx="25" ry="15" fill="#B19CD9" stroke="#9B7BC7" stroke-width="2"/>
                <path d="M15 30 L5 20 L5 40 Z" fill="#B19CD9" stroke="#9B7BC7" stroke-width="2"/>
                <path d="M35 15 L40 5 L45 15 Z" fill="#9B7BC7"/>
                <circle cx="50" cy="25" r="6" fill="white" stroke="#333" stroke-width="1"/>
                <circle cx="52" cy="25" r="3" fill="#333"/>
                <circle cx="53" cy="23" r="1" fill="white"/>
                <ellipse cx="62" cy="30" rx="3" ry="2" fill="#9B7BC7"/>
            </svg>`,
            // オレンジの魚
            `<svg width="80" height="60" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="30" rx="25" ry="15" fill="#FF9F43" stroke="#E6883A" stroke-width="2"/>
                <path d="M15 30 L5 20 L5 40 Z" fill="#FF9F43" stroke="#E6883A" stroke-width="2"/>
                <path d="M35 15 L40 5 L45 15 Z" fill="#E6883A"/>
                <circle cx="50" cy="25" r="6" fill="white" stroke="#333" stroke-width="1"/>
                <circle cx="52" cy="25" r="3" fill="#333"/>
                <circle cx="53" cy="23" r="1" fill="white"/>
                <ellipse cx="62" cy="30" rx="3" ry="2" fill="#E6883A"/>
            </svg>`,
            // ピンクの魚
            `<svg width="80" height="60" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="30" rx="25" ry="15" fill="#FF8A9B" stroke="#E67284" stroke-width="2"/>
                <path d="M15 30 L5 20 L5 40 Z" fill="#FF8A9B" stroke="#E67284" stroke-width="2"/>
                <path d="M35 15 L40 5 L45 15 Z" fill="#E67284"/>
                <circle cx="50" cy="25" r="6" fill="white" stroke="#333" stroke-width="1"/>
                <circle cx="52" cy="25" r="3" fill="#333"/>
                <circle cx="53" cy="23" r="1" fill="white"/>
                <ellipse cx="62" cy="30" rx="3" ry="2" fill="#E67284"/>
            </svg>`
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.newGame();
    }
    
    setupEventListeners() {
        const castButton = document.getElementById('cast-button');
        const newGameButton = document.getElementById('new-game-button');
        
        castButton.addEventListener('click', () => this.castFishingLine());
        newGameButton.addEventListener('click', () => this.newGame());
        
        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isCasting) {
                e.preventDefault();
                this.castFishingLine();
            } else if (e.code === 'KeyR') {
                e.preventDefault();
                this.newGame();
            }
        });
    }
    
    newGame() {
        this.score = 0;
        this.isGameActive = true;
        this.isCasting = false;
        this.updateScore();
        this.clearFishes();
        this.generateNewTarget();
        this.spawnFishes();
        this.resetFishingLine();
        
        const castButton = document.getElementById('cast-button');
        castButton.disabled = false;
        castButton.textContent = '🎣 つりざおを投げる';
    }
    
    generateNewTarget() {
        this.targetHiragana = this.hiraganaList[Math.floor(Math.random() * this.hiraganaList.length)];
        document.getElementById('target-hiragana').textContent = this.targetHiragana;
    }
    
    spawnFishes() {
        const fishContainer = document.getElementById('fish-container');
        const numberOfFishes = 6;
        
        // ターゲットのひらがなを持つ魚を1匹は必ず生成
        this.createFish(this.targetHiragana, true);
        
        // 残りの魚をランダムに生成
        for (let i = 1; i < numberOfFishes; i++) {
            const randomHiragana = this.hiraganaList[Math.floor(Math.random() * this.hiraganaList.length)];
            this.createFish(randomHiragana, false);
        }
    }
    
    createFish(hiragana, isTarget) {
        const fishContainer = document.getElementById('fish-container');
        const fish = document.createElement('div');
        fish.className = 'fish';
        
        const fishSVG = this.fishSVGs[Math.floor(Math.random() * this.fishSVGs.length)];
        
        fish.innerHTML = `
            <div class="fish-body">
                ${fishSVG}
                <div class="hiragana-text">${hiragana}</div>
            </div>
        `;
        
        // ランダムな位置に配置
        const maxX = fishContainer.offsetWidth - 100;
        const maxY = fishContainer.offsetHeight - 150;
        const x = Math.random() * maxX;
        const y = Math.random() * maxY + 50;
        
        fish.style.left = x + 'px';
        fish.style.top = y + 'px';
        
        // アニメーション遅延をランダムに設定
        fish.style.animationDelay = Math.random() * 2 + 's';
        
        // クリックイベント
        fish.addEventListener('click', () => this.catchFish(fish, hiragana));
        
        fishContainer.appendChild(fish);
        this.fishes.push({ element: fish, hiragana: hiragana, isTarget: isTarget });
    }
    
    castFishingLine() {
        if (this.isCasting || !this.isGameActive) return;
        
        this.isCasting = true;
        const castButton = document.getElementById('cast-button');
        const fishingLine = document.getElementById('fishing-line');
        
        castButton.disabled = true;
        castButton.textContent = '🎣 つり中...';
        
        // 釣り糸を下ろす
        fishingLine.style.height = '400px';
        
        // 魚をクリック可能にする（釣り糸が下りた時のみ）
        setTimeout(() => {
            this.enableFishCatching();
        }, 500);
        
        // 一定時間後に釣り糸を戻す
        setTimeout(() => {
            this.retractFishingLine();
        }, 3000);
    }
    
    enableFishCatching() {
        this.fishes.forEach(fish => {
            fish.element.style.pointerEvents = 'auto';
        });
    }
    
    disableFishCatching() {
        this.fishes.forEach(fish => {
            fish.element.style.pointerEvents = 'none';
        });
    }
    
    catchFish(fishElement, hiragana) {
        if (!this.isCasting) return;
        
        this.disableFishCatching();
        fishElement.classList.add('caught');
        
        if (hiragana === this.targetHiragana) {
            // 正解
            this.score += 10;
            this.showFeedback('やったね！ 🎉', 'success');
            this.playSuccessSound();
        } else {
            // 不正解
            this.showFeedback('ざんねん... 😅', 'miss');
        }
        
        this.updateScore();
        
        // 魚を削除
        setTimeout(() => {
            fishElement.remove();
            this.fishes = this.fishes.filter(fish => fish.element !== fishElement);
        }, 500);
        
        // 次のラウンドの準備
        setTimeout(() => {
            this.retractFishingLine();
            this.prepareNextRound();
        }, 1500);
    }
    
    retractFishingLine() {
        const fishingLine = document.getElementById('fishing-line');
        fishingLine.style.height = '0px';
        
        setTimeout(() => {
            this.isCasting = false;
            const castButton = document.getElementById('cast-button');
            if (this.isGameActive) {
                castButton.disabled = false;
                castButton.textContent = '🎣 つりざおを投げる';
            }
        }, 500);
    }
    
    prepareNextRound() {
        if (!this.isGameActive) return;
        
        // 新しいターゲットを生成
        this.generateNewTarget();
        
        // 既存の魚をクリア
        this.clearFishes();
        
        // 新しい魚を生成
        setTimeout(() => {
            this.spawnFishes();
        }, 500);
    }
    
    clearFishes() {
        const fishContainer = document.getElementById('fish-container');
        fishContainer.innerHTML = '';
        this.fishes = [];
    }
    
    resetFishingLine() {
        const fishingLine = document.getElementById('fishing-line');
        fishingLine.style.height = '0px';
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
    }
    
    showFeedback(message, type) {
        // 既存のフィードバックを削除
        const existingFeedback = document.querySelector('.feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        const feedback = document.createElement('div');
        feedback.className = `feedback ${type}`;
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
    
    playSuccessSound() {
        // Web Audio APIを使用した簡単な成功音
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('音声再生に対応していません');
        }
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    const game = new HiraganaFishingGame();
    
    // ゲームの説明を表示
    setTimeout(() => {
        const instructions = document.querySelector('.instructions');
        instructions.style.animation = 'pulse 2s ease-in-out';
    }, 1000);
});

// パルスアニメーション用CSS（動的に追加）
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
`;
document.head.appendChild(style);
