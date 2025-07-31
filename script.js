// 音声合成クラス
class VoiceSynthesizer {
    constructor(settings) {
        this.speechSynthesis = window.speechSynthesis;
        this.settings = settings;
        this.japaneseVoice = null;
        this.initializeVoice();
    }
    
    initializeVoice() {
        if (!this.speechSynthesis) return;
        
        const voices = this.speechSynthesis.getVoices();
        this.japaneseVoice = voices.find(voice => 
            voice.lang.includes('ja') || voice.name.includes('Japanese')
        );
        
        // 音声リストが読み込まれていない場合は待機
        if (voices.length === 0) {
            this.speechSynthesis.addEventListener('voiceschanged', () => {
                const newVoices = this.speechSynthesis.getVoices();
                this.japaneseVoice = newVoices.find(voice => 
                    voice.lang.includes('ja') || voice.name.includes('Japanese')
                );
            });
        }
    }
    
    createUtterance(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.settings.lang;
        utterance.rate = this.settings.rate;
        utterance.pitch = this.settings.pitch;
        utterance.volume = this.settings.volume;
        
        if (this.japaneseVoice) {
            utterance.voice = this.japaneseVoice;
        }
        
        return utterance;
    }
    
    speak(text, onEnd = null) {
        if (!this.speechSynthesis) {
            console.log('音声合成に対応していません');
            return;
        }
        
        const utterance = this.createUtterance(text);
        if (onEnd) {
            utterance.onend = onEnd;
        }
        
        this.speechSynthesis.speak(utterance);
    }
    
    cancel() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
    }
}

// ゲームの状態管理
class HiraganaFishingGame {
    constructor() {
        this.score = 0;
        this.targetHiragana = '';
        this.fishes = [];
        this.isGameActive = true;
        this.isCasting = false;
        
        // 音声合成の設定
        this.voiceSynthesizer = new VoiceSynthesizer({
            lang: 'ja-JP',
            rate: 0.5,  // ゆっくり
            pitch: 1.2,
            volume: 0.8
        });
        
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
        
        // 魚の画像ファイル
        this.fishImages = [
            'images/fish/character_fish_ika.png',
            'images/fish/fish_maguro.png',
            'images/fish/fish_mola2.png',
            'images/fish/fish_shark.png',
            'images/fish/fish_tako.png',
            'images/fish/shinkai_chouchinankou.png'
        ];
        
        // 使用済み魚画像のトラッキング
        this.usedFishImages = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.newGame();
    }
    
    setupEventListeners() {
        const newGameButton = document.getElementById('new-game-button');
        
        newGameButton.addEventListener('click', () => this.newGame());
        
        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyR') {
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
    }
    
    generateNewTarget() {
        this.targetHiragana = this.hiraganaList[Math.floor(Math.random() * this.hiraganaList.length)];
        document.getElementById('target-hiragana').textContent = this.targetHiragana;
        
        // 音声案内を再生
        this.announceTarget();
    }
    
    // 音声案内機能
    announceTarget() {
        // 既存の音声を停止
        this.voiceSynthesizer.cancel();
        
        // 1回目の音声を再生
        setTimeout(() => {
            this.voiceSynthesizer.speak(this.targetHiragana, () => {
                // 1回目の音声終了後に2回目を再生
                setTimeout(() => {
                    this.voiceSynthesizer.speak(this.targetHiragana);
                }, 2000); // 2秒間を空ける
            });
        }, 500); // 魚の生成後に遅延
    }
    
    
    spawnFishes() {
        const fishContainer = document.getElementById('fish-container');
        const numberOfFishes = 5;
        const usedHiragana = new Set();
        
        // 魚画像の使用済みリストをリセット
        this.usedFishImages = [];
        
        // ターゲットのひらがなを持つ魚を1匹は必ず生成
        this.createFish(this.targetHiragana, true);
        usedHiragana.add(this.targetHiragana);
        
        // 残りの魚をランダムに生成（重複なし）
        for (let i = 1; i < numberOfFishes; i++) {
            let randomHiragana;
            let attempts = 0;
            const maxAttempts = 50;
            
            // 重複しないひらがなを見つける
            do {
                randomHiragana = this.hiraganaList[Math.floor(Math.random() * this.hiraganaList.length)];
                attempts++;
            } while (usedHiragana.has(randomHiragana) && attempts < maxAttempts);
            
            // 見つからない場合は使用可能なひらがなから選択
            if (usedHiragana.has(randomHiragana)) {
                const availableHiragana = this.hiraganaList.filter(h => !usedHiragana.has(h));
                if (availableHiragana.length > 0) {
                    randomHiragana = availableHiragana[Math.floor(Math.random() * availableHiragana.length)];
                }
            }
            
            this.createFish(randomHiragana, false);
            usedHiragana.add(randomHiragana);
        }
    }
    
    getRandomFishImage() {
        // 全ての画像が使用された場合はリセット
        if (this.usedFishImages.length >= this.fishImages.length) {
            this.usedFishImages = [];
        }
        
        // 使用されていない画像から選択
        const availableImages = this.fishImages.filter(img => !this.usedFishImages.includes(img));
        const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
        
        // 使用済みリストに追加
        this.usedFishImages.push(selectedImage);
        
        return selectedImage;
    }
    
    createFish(hiragana, isTarget) {
        const fishContainer = document.getElementById('fish-container');
        const fish = document.createElement('div');
        fish.className = 'fish';
        
        const fishImageSrc = this.getRandomFishImage();
        
        fish.innerHTML = `
            <div class="fish-body">
                <img src="${fishImageSrc}" alt="魚" class="fish-image">
                <div class="hiragana-text">${hiragana}</div>
            </div>
        `;
        
        // 重ならない位置を見つける
        const position = this.findNonOverlappingPosition(fishContainer);
        
        fish.style.left = position.x + 'px';
        fish.style.top = position.y + 'px';
        
        // アニメーション遅延をランダムに設定
        fish.style.animationDelay = Math.random() * 2 + 's';
        
        // クリックイベント
        fish.addEventListener('click', () => this.catchFish(fish, hiragana));
        
        // モバイル端末ではタッチした瞬間に発火したい
        fish.addEventListener('touchstart', (event) => {
            this.catchFish(fish, hiragana);
            event.preventDefault();
        });

        fishContainer.appendChild(fish);
        this.fishes.push({ element: fish, hiragana: hiragana, isTarget: isTarget, x: position.x, y: position.y });
    }
    
    findNonOverlappingPosition(fishContainer) {
        const fishWidth = 140;
        const fishHeight = 105;
        const margin = 25; // 魚同士の最小間隔
        const uiAreaHeight = 130; // 上部UIエリアの高さ
        const maxX = fishContainer.offsetWidth - fishWidth;
        const maxY = fishContainer.offsetHeight - fishHeight - 50;
        const minY = uiAreaHeight + 20; // UIエリアの下から20px空ける
        
        let attempts = 0;
        const maxAttempts = 50;
        
        while (attempts < maxAttempts) {
            const x = Math.random() * maxX;
            const y = Math.random() * (maxY - minY) + minY;
            
            // 既存の魚と重ならないかチェック
            let overlapping = false;
            for (const existingFish of this.fishes) {
                const dx = Math.abs(x - existingFish.x);
                const dy = Math.abs(y - existingFish.y);
                
                if (dx < fishWidth + margin && dy < fishHeight + margin) {
                    overlapping = true;
                    break;
                }
            }
            
            if (!overlapping) {
                return { x, y };
            }
            
            attempts++;
        }
        
        // 最大試行回数に達した場合は、グリッド配置にフォールバック
        const gridCols = Math.floor(fishContainer.offsetWidth / (fishWidth + margin));
        const gridRows = Math.floor((maxY - minY) / (fishHeight + margin));
        const totalPositions = gridCols * gridRows;
        const fishIndex = this.fishes.length;
        
        if (fishIndex < totalPositions) {
            const col = fishIndex % gridCols;
            const row = Math.floor(fishIndex / gridCols);
            const x = col * (fishWidth + margin) + margin;
            const y = row * (fishHeight + margin) + minY;
            return { x, y };
        }
        
        // それでも配置できない場合はランダム位置（UIエリアを避ける）
        return {
            x: Math.random() * maxX,
            y: Math.random() * (maxY - minY) + minY
        };
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
        if (this.isCasting || !this.isGameActive) return;
        
        this.isCasting = true;
        this.disableFishCatching();
        
        // 魚の位置を取得
        const fishRect = fishElement.getBoundingClientRect();
        const gameAreaRect = document.querySelector('.game-area').getBoundingClientRect();
        const fishX = fishRect.left - gameAreaRect.left + fishRect.width / 2;
        const fishY = fishRect.top - gameAreaRect.top + fishRect.height / 2;
        
        // 釣り針を魚の位置まで移動
        this.moveHookToFish(fishX, fishY, () => {
            // 釣り針が魚に到達した後の処理
            fishElement.classList.add('caught');
            
            if (hiragana === this.targetHiragana) {
                // 正解
                this.score += 10;
                this.showFeedback('やったね！ 🎉', 'success');
                this.playSuccessSound();
            } else {
                // 不正解
                this.showFeedback('ざんねん... 😅', 'miss');
                this.playMissSound();
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
        });
    }
    
    moveHookToFish(fishX, fishY, callback) {
        const fishingLine = document.getElementById('fishing-line');
        const hook = document.getElementById('hook');
        
        // 釣り糸の長さを魚の位置まで延ばす
        fishingLine.style.height = fishY + 'px';
        
        // 釣り糸の位置を魚のX座標に移動
        fishingLine.style.left = fishX + 'px';
        fishingLine.style.transform = 'translateX(-50%)';
        
        // アニメーション完了後にコールバックを実行
        setTimeout(() => {
            callback();
        }, 800);
    }
    
    retractFishingLine() {
        const fishingLine = document.getElementById('fishing-line');
        
        // 釣り糸を元の位置に戻す
        fishingLine.style.height = '0px';
        fishingLine.style.left = '50%';
        fishingLine.style.transform = 'translateX(-50%)';
        
        setTimeout(() => {
            this.isCasting = false;
            this.enableFishCatching();
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
        
        // 成功時は3秒、失敗時は2秒表示
        const displayTime = type === 'success' ? 3000 : 2000;
        setTimeout(() => {
            feedback.remove();
        }, displayTime);
    }
    
    playSuccessSound() {
        try {
            const audio = new Audio('sound/dong-dong.mp3');
            audio.volume = 0.5;
            audio.play();
        } catch (error) {
            console.log('音声ファイルの再生に失敗しました');
        }
    }
    
    playMissSound() {
        try {
            const audio = new Audio('sound/buzzer.mp3');
            audio.volume = 0.5;
            audio.play();
        } catch (error) {
            console.log('音声ファイルの再生に失敗しました');
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
