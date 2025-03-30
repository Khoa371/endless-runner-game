// Khởi tạo điểm số trong localStorage nếu chưa có
if (!localStorage.getItem('dinoHighScores')) {
    localStorage.setItem('dinoHighScores', JSON.stringify([{score: 0, date: '-'}, {score: 0, date: '-'}, {score: 0, date: '-'}]));
}
if (!localStorage.getItem('coronaHighScores')) {
    localStorage.setItem('coronaHighScores', JSON.stringify([{score: 0, date: '-'}, {score: 0, date: '-'}, {score: 0, date: '-'}]));
}

// Hàm lưu điểm số mới
function saveHighScore(score, gameMode) {
    const today = new Date();
    const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    const newScore = {
        score: score,
        date: date
    };

    // Lấy danh sách điểm cao hiện tại
    let highScores = gameMode === 'dino' 
        ? JSON.parse(localStorage.getItem('dinoHighScores'))
        : JSON.parse(localStorage.getItem('coronaHighScores'));

    // Thêm điểm mới và sắp xếp
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 3); // Chỉ giữ top 3

    // Lưu lại vào localStorage
    localStorage.setItem(
        gameMode === 'dino' ? 'dinoHighScores' : 'coronaHighScores',
        JSON.stringify(highScores)
    );
}

// Hàm cập nhật hiển thị điểm số trong bảng xếp hạng
function updateLeaderboard() {
    const dinoScores = JSON.parse(localStorage.getItem('dinoHighScores'));
    const coronaScores = JSON.parse(localStorage.getItem('coronaHighScores'));

    // Cập nhật bảng điểm khủng long
    const dinoList = document.querySelectorAll('.mode-card:first-child .score-item');
    dinoScores.forEach((score, index) => {
        if (dinoList[index]) {
            dinoList[index].querySelector('.score').textContent = score.score + ' điểm';
            dinoList[index].querySelector('.date').textContent = score.date;
        }
    });

    // Cập nhật bảng điểm corona
    const coronaList = document.querySelectorAll('.mode-card:last-child .score-item');
    coronaScores.forEach((score, index) => {
        if (coronaList[index]) {
            coronaList[index].querySelector('.score').textContent = score.score + ' điểm';
            coronaList[index].querySelector('.date').textContent = score.date;
        }
    });
}

// Thêm vào phần kiểm tra game over trong game
function checkDead() {
    // ... code kiểm tra va chạm hiện có ...
    if(blockLeft<20 && blockLeft>0 && characterTop>=130){
        block.style.animation = "none";
        block.style.display = "none";
        const finalScore = Math.floor(counter/100);
        
        // Lưu điểm số mới
        saveHighScore(finalScore, currentMode);
        
        alert("Game Over. Score: " + finalScore);
        counter = 0;
        block.style.animation = "block 1s infinite linear";
        block.style.display = "block";
    }
}

// Gọi hàm cập nhật bảng xếp hạng khi trang leaderboard được tải
if (window.location.pathname.includes('leaderboard.html')) {
    document.addEventListener('DOMContentLoaded', updateLeaderboard);
} 

// Thêm hàm startGame để bắt đầu trò chơi
function startGame(gameType) {
    if (gameType === 'index.html') {
        // Chuyển đến trò chơi khủng long
        window.location.href = 'indexKL.html';
    } else if (gameType === 'corona') {
        // Chuyển đến trò chơi corona
        window.location.href = 'indexcorona.html';
    }
}

// Kiểm tra mode khi game bắt đầu
document.addEventListener('DOMContentLoaded', function() {
    // Chỉ chạy code này nếu đang ở trang game
    if (window.location.pathname.includes('game.html')) {
        const gameMode = localStorage.getItem('currentGameMode');
        
        // Set hình ảnh dựa theo mode
        if (gameMode === 'dino') {
            character.style.backgroundImage = "url('dino.png')";
            block.style.backgroundImage = "url('cactus.png')";
        } else if (gameMode === 'corona') {
            character.style.backgroundImage = "url('runner.png')";
            block.style.backgroundImage = "url('virus.png')";
        }
        
        // Bắt đầu game
        counter = 0;
        score.innerHTML = "0";
        block.style.animation = "block 1s infinite linear";
    }
});