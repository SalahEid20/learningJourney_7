
let chooseCategory = document.querySelector(".choose-category"),
    htmlBtn = document.querySelector(".html"),
    jsBtn = document.querySelector(".js"),
    cssBtn = document.querySelector(".css"),
    quizApp = document.querySelector(".quiz-app"),
    category = document.querySelector(".category span"),
    qCountSpan = document.querySelector(".quiz-info .questions-count span"),
    questionContainer = document.querySelector('.quiz-app .question-txt'),
    choicesContainer = document.querySelector('.quiz-app .choices-container'),
    submitBtn = document.querySelector('.submit'),
    bulletsContainer = document.querySelector(".footer .bullets-prog"),
    footer = document.querySelector('.footer'),
    result = document.querySelector('.result'),
    countDownElement = document.querySelector('.countdown');

let categoryLink = '',
    currentIndex = 0,
    noOfChoices = 4,
    correctCount = 0,
    qCount,
    countDownInterval;

htmlBtn.onclick = () => {
    categoryLink = "html_questions.json";
    chooseCategory.classList.add('done');
    quizApp.classList.add('visible');
    category.innerHTML = "HTML";
    getQuestions();
};

jsBtn.onclick = () => {
    categoryLink = "html_questions_1.json";
    chooseCategory.classList.add('done');
    quizApp.classList.add('visible');
    category.innerHTML = "JavaScript";
    getQuestions();
};

cssBtn.onclick = () => {
    categoryLink = "html_questions_2.json";
    chooseCategory.classList.add('done');
    quizApp.classList.add('visible');
    category.innerHTML = "CSS";
    getQuestions();
};

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
                qCount = questionsObject.length;
            createBullets(qCount);
            addQuestionData(questionsObject[currentIndex]);
            timer(30);
            submitBtn.onclick = () => {
                if (currentIndex < qCount) {
                    let correctAnswer = questionsObject[currentIndex].right_answer;
                    checkAnswer(correctAnswer);
                    questionContainer.innerHTML = '';
                    choicesContainer.innerHTML = '';
                    currentIndex++;
                    if (currentIndex < qCount) {
                        addQuestionData(questionsObject[currentIndex]);
                        bulletsContainer.children[currentIndex].className = "on";
                        clearInterval(countDownInterval);
                        timer(30);
                    };
                    showResult();
                };
            };
        };
    };
    myRequest.open("GET", categoryLink, true);
    myRequest.send();
};

function createBullets(num) {
    qCountSpan.innerHTML = num;
    for (let i = 0; i < num; i++) {
        let bullet = document.createElement('span');
        if (i === 0) bullet.className = 'on';
        bulletsContainer.appendChild(bullet);
    };
};

function addQuestionData(obj) {
    let question = document.createElement("h2"),
        questionTxt = document.createTextNode(obj.title);
    question.appendChild(questionTxt);
    questionContainer.appendChild(question);
    for (let i = 1; i <= noOfChoices; i++) {
        let div = document.createElement("div"),
            radio = document.createElement("input"),
            label = document.createElement("label"),
            labelTxt = document.createTextNode(obj[`answer_${i}`]);

        radio.type = "radio";
        radio.id = `answer_${i}`;
        radio.name = "choices";
        radio.dataset.answer = obj[`answer_${i}`];
        label.setAttribute("for", `answer_${i}`);
        // label.htmlFor = `answer_${i}`; // other way to set the For attribute of a label element
        // if (i === 1) radio.checked = true; // if we want to make te first choice checked by default
        label.appendChild(labelTxt);
        div.appendChild(radio);
        div.appendChild(label);
        choicesContainer.appendChild(div);
    };
};

function checkAnswer(correctAnswer) {
    let allChoices = document.getElementsByName("choices");
    for (let i = 0; i < noOfChoices; i++) {
        if (allChoices[i].checked) {
            if (correctAnswer === allChoices[i].dataset.answer) {
                correctCount++;
            };
        };
    };
};

function showResult () {
    let theResult;
    if (currentIndex === qCount) {
        questionContainer.remove();
        choicesContainer.remove();
        submitBtn.remove();
        footer.remove();

        if (correctCount > (qCount/2) && correctCount < qCount) {
            theResult = `<span class="good">Good</span>, ${correctCount} of ${qCount} are correct.`;
        } else if (correctCount === qCount) {
            theResult = `<span class="perfect">Excellent</span>, ${correctCount} of ${qCount} are correct.`;
        } else {
            theResult = `<span class="bad">Bad</span>, ${correctCount} of ${qCount} are correct.`;
        };

        result.style.cssText = 'background-color: white; padding: 20px; margin-top: 15px;';
        result.innerHTML = theResult;
    };
};

function timer(timeAllowed) {
let minutes, seconds;
countDownInterval = setInterval(function () {
    minutes = parseInt(timeAllowed / 60);
    seconds = parseInt(timeAllowed % 60);

    minutes = minutes < 10 ? `0${minutes}`: minutes;
    seconds = seconds < 10 ? `0${seconds}`: seconds;

    countDownElement.innerHTML = `${minutes}:${seconds}`;

    if (--timeAllowed < 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
    };
    console.log(timeAllowed);

}, 1000)};