const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
const categoryHeading = document.querySelector(".category__heading");
const categoryDropdown = document.getElementById("category");
const question = document.querySelector(".question h2");
const radioInputs = document.getElementsByName("option");
const labels = document.getElementsByTagName("label");
const startBtn = document.querySelector(".start");
const checkBtn = document.querySelector(".check");
const nextBtn = document.querySelector(".next");
let selectedCategory, rightAnswer;
let questionNumber = 0;
let score = 0;

const showModal = () => {
    modal.style.zIndex = "5";
    modal.style.opacity = "1";
};

const hideModal = () => {
    modal.style.zIndex = "-2";
    modal.style.opacity = "0";
};

const showBackdrop = () => {
    backdrop.classList.remove("hidden");
    document.body.style.overflowY = "hidden";
};

const hideBackdrop = () => {
    backdrop.classList.add("hidden");
};

const hideCategoryDropdown = () => {
    categoryDropdown.classList.add("hidden");
};

const categoryChecker = () => {
    selectedCategory = categoryDropdown.value;
    const selectedOption = document.querySelector(
        `option[value="${selectedCategory}"]`
    ).textContent;
    hideCategoryDropdown();
    categoryHeading.innerHTML = `<h3>${selectedOption}</h3>`;
};

const updateQuestionUI = (q) => {
    question.innerHTML = q;
};

const updateOptionsUI = (answers) => {
    const [first, second, third, fourth] = answers;
    labels[0].innerHTML = `<h4>${first}</h4>`;
    labels[1].innerHTML = `<h4>${second}</h4>`;
    labels[2].innerHTML = `<h4>${third}</h4>`;
    labels[3].innerHTML = `<h4>${fourth}</h4>`;
};

const getQuestions = async () => {
    if (questionNumber < 10) {
        try {
            const data = await fetch(
                `https://the-trivia-api.com/api/questions?categories=${selectedCategory}&limit=10`
            );
            const response = await data.json();
            const question = response[questionNumber].question;
            rightAnswer = response[questionNumber].correctAnswer;
            const options = response[questionNumber].incorrectAnswers;
            options.splice(
                Math.floor(Math.random() * 4),
                0,
                response[questionNumber].correctAnswer
            );
            updateQuestionUI(question);
            updateOptionsUI(options);
            questionNumber++;
        } catch (error) {
            modal.innerHTML = "";
            showBackdrop();
            showModal();
            modal.innerHTML = `
            <h2>Oops!! something went wrong</h2>
            <h2>"${error.message}"</h2>
            `;
        }
    } else {
        showScore();
    }
};

const clearInputs = () => {
    for (let i = 0; i < radioInputs.length; i++) {
        radioInputs[i].checked = false;
    }
    for (let i = 0; i < labels.length; i++) {
        labels[i].classList.remove("correct");
        labels[i].classList.remove("incorrect");
    }
};

const startBtnHandler = () => {
    categoryChecker();
    getQuestions();
    for (let i = 0; i < radioInputs.length; i++) {
        radioInputs[i].addEventListener("change", () => {
            startBtn.classList.add("hidden");
            checkBtn.classList.remove("hidden");
        });
    }
};

const checkBtnHandler = () => {
    checkBtn.classList.add("hidden");
    nextBtn.classList.remove("hidden");
    const givenAnswer = document.querySelector(
        `input[type="radio"]:checked + label`
    ).textContent;
    if (givenAnswer === rightAnswer) {
        score++;
        document
            .querySelector(`input[type="radio"]:checked + label`)
            .classList.add("correct");
    } else {
        document
            .querySelector(`input[type="radio"]:checked + label`)
            .classList.add("incorrect");
    }
    for (let i = 0; i < labels.length; i++) {
        if (labels[i].textContent === rightAnswer) {
            labels[i].classList.add("correct");
        }
    }
};

const nextBtnHandler = () => {
    nextBtn.classList.add("hidden");
    clearInputs();
    getQuestions();
};

const showScore = () => {
    let emoji;
    if (score < 5) {
        emoji = "😢😢😢";
    } else {
        emoji = "👏👏👏";
    }
    modal.innerHTML = "";
    showBackdrop();
    showModal();
    modal.innerHTML = `
    <h2>You scored ${score} out of 10</h2>
    <h2>${emoji}</h2>
    <h2>Play again!!</h2>`;
};

const backdropHandler = () => {
    hideModal();
    hideBackdrop();
    if (questionNumber === 10) {
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
};

startBtn.addEventListener("click", startBtnHandler);
checkBtn.addEventListener("click", checkBtnHandler);
nextBtn.addEventListener("click", nextBtnHandler);
backdrop.addEventListener("click", backdropHandler);
