let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions;
//CONSTANTS
const MAX_QUESTIONS = 10;
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const questionCounterTxt = document.getElementById("questionCounter");
const scoreTxt = document.getElementById("score");
const gamediv = document.getElementById("game");
const loader = document.getElementById("loader");


fetch(
    'https://opentdb.com/api.php?amount=40&category=9&difficulty=easy&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        gamediv.hidden = true;
        loader.hidden = false;
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    loader.hidden = true;
    gamediv.hidden = false;

};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        //go to the end page
        localStorage.setItem("mostRecentScore",score);
        return window.location.assign('https://cdog5.github.io/Quiz App/end.html');
    }
    questionCounter++;
    questionCounterTxt.innerText = questionCounter + "/"+MAX_QUESTIONS;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        const questionResult = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        if (questionResult == "correct"){
            score++;
            scoreTxt.innerText = score;
        }
        selectedChoice.parentElement.classList.add(questionResult);
        let correctone = document.getElementById(currentQuestion.answer);
        correctone.parentElement.classList.add("correct");
        setTimeout(()=>{
            getNewQuestion();
            selectedChoice.parentElement.classList.remove(questionResult);
            correctone.parentElement.classList.remove("correct");
        },1200);
        
    });
});

