
const xhr = new XMLHttpRequest();
xhr.open("GET", "./questions/question.json", true);

/**
 * Sends a GET request to fetch the question data from the question.json file.
 * Once the data is received, it is parsed and stored in the 'questions' variable.
 */
xhr.onload = function () {
  // Check if the request was successful (status code 200)
  if (xhr.status === 200) {
    /**
     * Parse the response text into a JavaScript object and store it in the 
     * 'questions' variable.
     * @type {Array}
     */
    questions = JSON.parse(xhr.responseText);
  }
};
xhr.send();



let timerEl = document.querySelector(".timer");
let countdown;
const questionTime = 30; // Temps en secondes pour chaque question


const startBtn = document.querySelector(".start-btn");
const popupInfo = document.querySelector(".popup-info");
const exitBtn = document.querySelector(".exit-btn");
const continueBtn = document.querySelector(".continue-btn");
const quizSection = document.querySelector(".quiz-section");
const main = document.querySelector(".main");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");
const tryAgainBtn = document.querySelector(".tryAgain-btn");
const goHomeBtn = document.querySelector(".goHome-btn");

let questionCount = 0;
let questionNumb = 1;
let userScore = 0;
const nextBtn = document.querySelector(".next-btn");
const previewBtn = document.querySelector(".preview-btn");
const optionList = document.querySelector(".option-list");

/**
 * Event handler function for the 'onclick' event of the 'startBtn' element.
 * It adds the 'active' class to the 'popupInfo' and 'main' elements.
 */
startBtn.onclick = () => {
    // Add the 'active' class to the 'popupInfo' element to show the popup
    popupInfo.classList.add("active");
    
    // Add the 'active' class to the 'main' element to show the main content
    main.classList.add("active");
    
}

exitBtn.onclick = () => {
    popupInfo.classList.remove("active");
    main.classList.remove("active");
};

/**
 * Event handler function for the 'onclick' event of the 'continueBtn' element.
 * It performs the following actions:
 * - Adds the 'active' class to the 'quizSection' element to show the quiz section.
 * - Removes the 'active' class from the 'popupInfo' and 'main' elements to hide the popup and main content.
 * - Adds the 'active' class to the 'quizBox' element to show the quiz box.
 * - Calls the 'showQuestion' function with an argument of 0 to display the first question.
 * - Calls the 'questionCounter' function with an argument of 1 to update the question counter.
 * - Calls the 'headerScore' function to update the header score.
 */
continueBtn.onclick = () => {
    // Add the 'active' class to the 'quizSection' element to show the quiz section
    quizSection.classList.add("active");
    
    // Remove the 'active' class from the 'popupInfo' and 'main' elements to hide the popup and main content
    popupInfo.classList.remove("active");
    main.classList.remove("active");
    
    // Add the 'active' class to the 'quizBox' element to show the quiz box
    quizBox.classList.add('active');
    
    // Display the first question
    showQuestion(0);
    
    // Update the question counter
    questionCounter(1);
    
    // Update the header score
    headerScore();
};

nextBtn.onclick = () => {
    if (questionCount < questions.length - 1) {
        questionCount++;
        showQuestion(questionCount);
        questionNumb++;
        questionCounter(questionNumb);
        nextBtn.classList.remove('active');

    } else {
        // desactiver le bouton de suivant
        //alert("Quiz completed");
        showResultBox();
    }
};

tryAgainBtn.onclick = () => {
    quizBox.classList.add('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');
    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
    showQuestion(questionCount);
    questionCounter(questionNumb);
    headerScore();
}


goHomeBtn.onclick = () => {
    quizSection.classList.remove('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');
    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
    showQuestion(questionCount);
    questionCounter(questionNumb);
}

previewBtn.onclick = () => {
    // Arrêter la minuterie avant de passer à la question précédente
    clearInterval(countdown);

    if (questionCount > 0) {
        const previousQuestion = questions[questionCount - 1];
        const previousAnswerIndex = previousQuestion.options.indexOf(previousQuestion.answer);
        const selectedOption = optionList.querySelector(".correct");
        const selectedOptionIndex = Array.from(optionList.children).indexOf(selectedOption);

        if (selectedOptionIndex !== previousAnswerIndex) {
            userScore--; // Déduire un point si la réponse précédente était incorrecte
        }

        questionCount--;
        showQuestion(questionCount);
        questionNumb--;
        questionCounter(questionNumb);
        headerScore(); // Mettre à jour le score affiché
    }
};


function showQuestion(index) {
    const questionText = document.querySelector(".question-text");
    questionText.textContent = `${questions[index].number}. ${questions[index].question}`;
    let optionTag = `<div class='option'><span> ${questions[index].option[0]}</span></div>
                    <div class='option'><span> ${questions[index].option[1]}</span></div>
                    <div class='option'><span> ${questions[index].option[2]}</span></div>
                    <div class='option'><span> ${questions[index].option[3]}</span></div>`;

    optionList.innerHTML = optionTag;
    const option = document.querySelectorAll(".option");
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }

    // Configuration de la minuterie pour cette question
    startTimer(questionTime);
}


function startTimer(duration, callback) {
    let timer = duration;
    countdown = setInterval(function () {
        // Mettre à jour l'affichage du timer
        timerEl.textContent = timer;

        // Vérifier si le temps est écoulé
        if (--timer == 0) {
            clearInterval(countdown);
            // Appeler la fonction de rappel lorsque le temps est écoulé
            callback();
        }
        // Mettre à jour le timer toutes les secondes
    }, 1000); 
}



function optionSelected(answer) {
    let userAnswer = answer.textContent.trim();
    let correctAnswer = questions[questionCount].answer.trim();
    let allOptions = optionList.children.length;

    // Arrêter la minuterie
    clearInterval(countdown);

    if (correctAnswer === userAnswer) {
        answer.classList.add("correct");
        userScore += 1;
        headerScore();
    } else {
        answer.classList.add("incorrect");

        // Si la réponse est incorrecte, sélectionner automatiquement l'option correcte
        /*for (let i = 0; i < allOptions; i++) {
            if (optionList.children[i].textContent.trim() === correctAnswer) {
                optionList.children[i].setAttribute("class", "option correct");
            }
        }*/
    }

    // Désactiver toutes les options
    for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add("disabled");
    }
    // Activer le bouton suivant
    nextBtn.classList.add('active');
    // Si aucune réponse n'est fournie (temps écoulé), marquer la réponse correcte
    if (!answer) {
        // Marquer la réponse correcte
        const correctAnswerIndex = questions[questionCount].option.indexOf(questions[questionCount].answer);
        optionList.children[correctAnswerIndex].classList.add("correct");
    }


}

// Fonction pour sélectionner automatiquement la bonne réponse et passer à la question suivante
function timeUp() {
    // Marquer la réponse correcte
    const correctAnswerIndex = questions[questionCount].option.indexOf(questions[questionCount].answer);
    optionList.children[correctAnswerIndex].classList.add("correct");

    // Désactiver toutes les options
    let allOptions = optionList.children.length;
    for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add("disabled");
    }

    // Activer le bouton suivant
    nextBtn.click(); // Simuler un clic sur le bouton suivant pour passer à la question suivante
}



function questionCounter(index) {
    const questionTotal = document.querySelector(".question-total");
    questionTotal.textContent = `${index} of ${questions.length} Questions`;
}


function headerScore() {
    const headerScoreText = document.querySelector(".header-score");
    headerScoreText.classList.add("active");
    headerScoreText.innerHTML = `Score : ${userScore} / ${questions.length}`;
    
}

function showResultBox() {
    const scoreText = document.querySelector(".score-text");
    const circularProgress = document.querySelector(".circular-progress");
    const progressValue = document.querySelector(".progress-value");

    scoreText.textContent = `Your Score : ${userScore} / ${questions.length}`;
    quizBox.classList.remove("active");
    resultBox.classList.add("active");

    const progressStartValue = 0;
    const progressEndValue = (userScore / questions.length) * 100;
    const speed = 30;

    let currentProgress = progressStartValue;

    function updateProgress() {
        progressValue.textContent = `${currentProgress}%`;
        circularProgress.style.background = `conic-gradient(#4db8ff ${currentProgress * 3.6}deg, #ededed 0deg)`;
        if (currentProgress >= progressEndValue) { // Utilisation de >= pour s'assurer que la progression atteint exactement la valeur finale
            clearInterval(progressInterval);
        } else {
            currentProgress++;
        }
    }

    const progressInterval = setInterval(updateProgress, speed);
}

