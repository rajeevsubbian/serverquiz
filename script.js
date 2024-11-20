let names = [];
let questions = [];
let currentQuestionIndex = 0;

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
}

function handleAnswer(isCorrect) {
    const happyAnimation = document.getElementById('happy-animation');
    const sadAnimation = document.getElementById('sad-animation');

    if (isCorrect) {
        happyAnimation.classList.remove('hidden');
        sadAnimation.classList.add('hidden');
    } else {
        sadAnimation.classList.remove('hidden');
        happyAnimation.classList.add('hidden');
    }

    setTimeout(() => {
        happyAnimation.classList.add('hidden');
        sadAnimation.classList.add('hidden');
        currentQuestionIndex++;
        displayQuestion();
    }, 2000);
}
