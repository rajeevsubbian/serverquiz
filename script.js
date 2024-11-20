let names = [];
let questions = [];
let currentQuestionIndex = 0;
let timerInterval;
let timeLeft = 120; // 2 minutes in seconds

// Load names from names.txt
fetch('names.txt')
    .then(response => response.text())
    .then(data => {
        names = data.split('\n').map(name => name.trim()).filter(name => name);
    });

// Load questions from questions.json
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        displayQuestion();
    });

document.getElementById('pick-name').addEventListener('click', () => {
    if (names.length === 0) {
        alert('No names available!');
        return;
    }
    const randomIndex = Math.floor(Math.random() * names.length);
    const selectedName = names[randomIndex];
    document.getElementById('selected-name').textContent = selectedName;
});

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        alert('Quiz completed!');
        clearInterval(timerInterval);
        return;
    }

    const question = questions[currentQuestionIndex];
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');

    questionElement.textContent = question.question;
    optionsElement.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => handleAnswer(index === question.answer));
        optionsElement.appendChild(button);
    });

    resetTimer(); // Reset and start the timer for the new question
}

function handleAnswer(isCorrect) {
    clearInterval(timerInterval); // Stop the timer when the user answers

    const happyAnimation = document.getElementById('happy-animation');
    const sadAnimation = document.getElementById('sad-animation');
    const timeoutWarning = document.getElementById('timeout-warning');

    if (isCorrect) {
        happyAnimation.classList.remove('hidden');
        sadAnimation.classList.add('hidden');
        timeoutWarning.classList.add('hidden');
    } else {
        sadAnimation.classList.remove('hidden');
        happyAnimation.classList.add('hidden');
        timeoutWarning.classList.add('hidden');
    }

    setTimeout(() => {
        happyAnimation.classList.add('hidden');
        sadAnimation.classList.add('hidden');
        timeoutWarning.classList.add('hidden');
        currentQuestionIndex++;
        displayQuestion();
    }, 2000);
}

// Timer logic
function resetTimer() {
    clearInterval(timerInterval); // Clear any existing timer
    timeLeft = 120; // 2 minutes for each question
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function handleTimeout() {
    const timeoutWarning = document.getElementById('timeout-warning');
    timeoutWarning.classList.remove('hidden');

    setTimeout(() => {
        timeoutWarning.classList.add('hidden');
        currentQuestionIndex++;
        displayQuestion();
    }, 2000); // Show "Time's Up!!!" message for 2 seconds before moving to the next question
}
