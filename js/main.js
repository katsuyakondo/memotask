//document.getElementById("startButton").addEventListener("click", startGame); 


document.getElementById('startButton').addEventListener('click', function() {
    // ゲームの初期化
    questionCount = 0;
    startGame();
});

    // 都道府県のリスト
const prefectures = [
     "hokkaido", "aomori", "iwate", "miyagi", "akita", "yamagata", "fukushima",
    "ibaraki", "tochigi", "gunma", "saitama", "chiba", "tokyo", "kanagawa",
    "niigata", "toyama", "ishikawa", "fukui", "yamanashi", "nagano", "gifu",
    "shizuoka", "aichi", "mie", "shiga", "kyoto", "osaka", "hyogo", "nara",
    "wakayama", "tottori", "shimane", "okayama", "hiroshima", "yamaguchi",
    "tokushima", "kagawa", "ehime", "kochi", "fukuoka", "saga", "nagasaki",
    "kumamoto", "oita", "miyazaki", "kagoshima", "okinawa"
];

let timer;
let startTime;
let correctAnswer; // 正解の都道府県名を保持する変数
let score = 0; // スコア
let questionCount = 0; // 問題数カウンター
const totalQuestions = 5; // 合計問題数
let lastPrefecture = null; // 前回表示された都道府県を記録する変数

// ゲームのスタート関数
function startGame() {
    // 新しいゲームの開始時に前回の間違った回答をリセット
    localStorage.removeItem('incorrectAnswers');


     // 前回の間違った回答を取得
    const lastIncorrectAnswer = localStorage.getItem('lastIncorrectAnswer');

    if (lastIncorrectAnswer) {
        console.log("前回の間違った回答: ", lastIncorrectAnswer);
    }

      //スタート画面を隠す
    document.getElementById('startScreen').style.display = 'none';
    
    // 問題画面を表示
    document.getElementById('gameScreen').style.display = 'block';


    

    // タイマーのリセットと開始
    resetTimer();
    startTimer();

    // ランダムな都道府県の選択
    const selectedPrefecture = selectRandomPrefecture();

    // 地図の表示
    showMap(selectedPrefecture);

    // 選択肢の生成
    generateChoices(selectedPrefecture);
}

function selectRandomPrefecture() {
    let randomPrefecture;
    do {
        const randomIndex = Math.floor(Math.random() * prefectures.length);
        randomPrefecture = prefectures[randomIndex];
    } while (randomPrefecture === lastPrefecture); // 前回の都道府県と異なるまでループ

    lastPrefecture = randomPrefecture; // 選択された都道府県を記録
    return randomPrefecture;
}

function showMap(prefecture) {
    correctAnswer = prefecture;
  // 保存された間違えた都道府県のリストを取得
  let incorrectPrefectures = JSON.parse(localStorage.getItem('incorrectPrefectures')) || [];

  // 現在の都道府県がリストに含まれているかチェック
  if (incorrectPrefectures.includes(prefecture)) {
      alert("注意: これは前回間違えた問題です！");
  }
 
        const mapContainer = document.getElementById("mapContainer");
        mapContainer.innerHTML = `<img src="img/${prefecture}.png" alt="${prefecture}">`;
        correctAnswer = prefecture;

    }
// };

//選択肢の生成
function generateChoices(selectedPrefecture) {
    const choices = [];
    choices.push(selectedPrefecture);

        // 正解以外の都道府県を追加
    while (choices.length < 4) {
        const randomPrefecture = selectRandomPrefecture();
        if (!choices.includes(randomPrefecture)) {
            choices.push(randomPrefecture);
        }
    }

    // 選択肢のシャッフル
    shuffle(choices);

    // 選択肢の表示
    const choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = '';
    choices.forEach(prefecture => {
        const button = document.createElement("button");
        button.textContent = prefecture;
        button.onclick = () => checkAnswer(prefecture);
        choicesContainer.appendChild(button);
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    startTime = new Date();
    timer = setInterval(updateTimer, 1000);
}

function resetTimer() {
    if (timer) clearInterval(timer);
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    document.getElementById("timer").textContent = `経過時間: ${elapsedTime} 秒`;
}

function checkAnswer(userChoice) {
    questionCount++;
    if (userChoice === correctAnswer) {
        score++;
        alert("正解！");
    } else {
        alert("不正解。正解は " + correctAnswer + " です。");
    }

    if (userChoice !== correctAnswer) {
        // 間違った回答をlocalStorageに保存
        saveIncorrectPrefecture(correctAnswer);    }
   
     // すべての問題が終了したかチェック
    if (questionCount >= totalQuestions) {
        endGame();
    } else {
        // 次の問題へ進む
        startGame();
    }

}   
 
function saveIncorrectPrefecture(prefecture) {
    // 既存のデータを取得
    let incorrectPrefectures = JSON.parse(localStorage.getItem('incorrectPrefectures')) || [];

      // 新しい間違えた都道府県をリストに追加
      if (!incorrectPrefectures.includes(prefecture)) {
        incorrectPrefectures.push(prefecture);
    }
    
    // // 新しいデータを追加
    // incorrectPrefectures.push(prefecture);

    // JSON形式で保存
    localStorage.setItem('incorrectPrefectures', JSON.stringify(incorrectPrefectures));
}

function getIncorrectPrefectures() {
    // JSON形式の文字列を取得
    let data = localStorage.getItem('incorrectPrefectures');

    // 文字列をオブジェクトに変換（パース）
    return JSON.parse(data) || [];
}




function endGame() {
    // タイマーの停止
    resetTimer();
    // 結果の表示
    alert("ゲーム終了！あなたのスコアは " + score + " / " + questionCount + " です。");
     // スタート画面を表示
    document.getElementById('startScreen').style.display = 'block';
    
    // 問題画面を隠す
    document.getElementById('gameScreen').style.display = 'none';

    // カウンタをリセット
    questionCount = 0;

    // 現在のスコアを取得
    let currentScore = score;

    // 既存のスコアをlocalStorageから取得
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    
    // 新しいスコアを追加
    scores.push(currentScore);
    
    // スコアを保存
    localStorage.setItem('scores', JSON.stringify(scores));

    // ランキングの更新
    updateRanking();


}

function updateRanking() {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.sort((a, b) => b - a); // スコアを降順にソート

    // ランキング表示
    let ranking = document.getElementById('ranking');
    ranking.innerHTML = '<h2>ランキング</h2>';
    scores.slice(0, 5).forEach((score, index) => { // トップ5のみ表示
        ranking.innerHTML += `<p>${index + 1}位. ${score}点</p>`;
    });
}



