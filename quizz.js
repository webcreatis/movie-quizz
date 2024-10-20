import { Questions } from "./questions";

const buttonStart = document.querySelector("#start");
const wrapper = document.querySelector("#wrapper");
let score = 0;
let currentQuestion = 0;

console.log(Questions);

// evenement click pour démarrer le quizz
buttonStart.addEventListener("click", startQuiz);

// function qui efface le contenu de wrapper
function clean() {
  while (wrapper.firstElementChild) {
    wrapper.firstElementChild.remove();
  }
}

// function qui crée le html du titre de la question
function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerText = text;
  return title;
}

// function qui crée le player audio de la question
function getAudioElement(url) {
  const playerAudio = document.createElement("audio");
  playerAudio.classList.add("audio", "hidden");
  playerAudio.setAttribute("src", url);
  console.log("playerAudio", playerAudio);
  return playerAudio;
}

function formatId(text) {
  return text.replaceAll("", "-").toLowerCase();
}

// function qui crée le label des questions
function getAnswerElement(text) {
  const label = document.createElement("label");
  label.innerText = text;
  const input = document.createElement("input");
  const id = formatId(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);
  label.appendChild(input);
  return label;
}

// function qui change le style du wrapper suivant la question
function changeStyleWrapper(bg) {
  wrapper.style.backgroundImage = `url(${bg})`;
  wrapper.style.width = "60%";
  wrapper.style.height = "auto";
  wrapper.style.top = "30%";
  wrapper.style.height = "500px";
  wrapper.style.backgroundPosition = "50px 50%";
  wrapper.style.backgroundSize = "200px";
}

// function qui affiche les réponses
function createAnswers(answers) {
  const answerContainer = document.createElement("div");
  answerContainer.classList.add("flex", "flex-col");

  for (const answer of answers) {
    const label = getAnswerElement(answer);
    label.classList.add(
      "w-[350px]",
      "p-[12px]",
      "block",
      "flex",
      "border",
      "border-2",
      "border-[#64748b]",
      "rounded-xl",
      "items-center",
      "justify-between",
      "text-xl",
      "mt-5",
      "has-[:checked]:border-tomato",
      "bg-green"
    );
    answerContainer.appendChild(label);
  }
  return answerContainer;
}

// function qui crée le bouton de validation
function getSubmitButton() {
  const submitButton = document.createElement("button");
  submitButton.innerText = "Je valide";
  submitButton.classList.add(
    "flex",
    "justify-center",
    "items-center",
    "bg-tomato",
    "outline-none",
    "cursor-pointer",
    "rounded-sm",
    "text-base",
    "text-white",
    "p-4",
    "border-none",
    "rounded-2xl",
    "mt-10",
    "min-w-[250px]",
    "h-[38px]",
    "min-[320px]:mb-5"
  );
  return submitButton;
}

//function submit (bouton validation)
function submitAnswer(button, question) {
  button.addEventListener("click", () => {
    const selectedAnswer = wrapper.querySelector(
      'input[name="answer"]:checked'
    );
    const valueSelected = selectedAnswer.value;

    const isCorrectAnswer = question.correct === valueSelected;

    if (isCorrectAnswer) {
      score++;
    }

    showFeedBack(isCorrectAnswer, question.correct, valueSelected);

    button.remove();

    const nextButton = getNextButton();
    wrapper.appendChild(nextButton);

    nextButton.addEventListener("click", submitNextAnswer(nextButton));
  });
}

// showFeedBack (modifie les backgrounds des inputs)
function showFeedBack(isCorrect, correct, value) {
  const correctAnswerId = formatId(correct);
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  );

  const selectedAnswerId = formatId(value);
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerId}"]`
  );

  correctElement.classList.add("bg-lime-300");
  correctElement.style.color = "black";
  selectedElement.classList.add(isCorrect ? "bg-lime-300" : "bg-red-700");
  selectedElement.style.color = isCorrect ? "black" : "white";

  wrapper.appendChild(getFeedBackMessage(isCorrect, correct));
}

// function ajoute la question au wrapper
function displayQuestion(index) {
  clean();
  const question = Questions[index];
  if (!question) {
    displayFinishMessage();
    return;
  }

  const title = getTitleElement(question.question);
  const answersDiv = createAnswers(question.answers);
  const player = getAudioElement(question.audioUrl);

  const validationButton = getSubmitButton();

  changeStyleWrapper(question.bg);

  wrapper.appendChild(title);
  wrapper.appendChild(answersDiv);
  wrapper.appendChild(validationButton);
  wrapper.appendChild(player);
  getSubmitButton(validationButton);

  // Jouer la musique du film
  player.play();

  submitAnswer(validationButton, question);
}

// function qui affiche un message
function getFeedBackMessage(isCorrect, correctAnswer) {
  const message = document.createElement("p");
  message.innerText = isCorrect
    ? "Bravo vous avez trouvé la bonne réponse"
    : `Désolé ! la bonne réponse était ${correctAnswer}`;
  message.style.color = "black";
  return message;
}

// Création du quizz
function startQuiz(event) {
  event.stopPropagation();
  displayQuestion(currentQuestion);
}

// Message de fin du quiz
function displayFinishMessage() {
  const title = document.createElement("h2");
  title.innerText = "Bravo vous avez Terminé le quiz";
  const message = document.createElement("p");
  message.innerText = `Votre score est de ${score} sur ${Questions.length} points...`;

  wrapper.appendChild(title);
  wrapper.appendChild(message);
}

// affichage de la progress Bar
function displayProgressBar(max, value) {
  const bar = document.createElement("progress");
  bar.setAttribute("max", max);
  bar.setAttribute("value", value);
}

// function qui crée le bouton Next questions
function getNextButton() {
  const nextButton = document.createElement("button");
  nextButton.innerText = "Question suivante";
  nextButton.classList.add(
    "flex",
    "justify-center",
    "items-center",
    "bg-tomato",
    "outline-none",
    "cursor-pointer",
    "rounded-sm",
    "text-base",
    "text-white",
    "p-4",
    "border-none",
    "rounded-2xl",
    "mt-10",
    "min-w-[250px]",
    "h-[38px]",
    "min-[320px]:mb-5"
  );
  return nextButton;
}

//function voir question suivante
function submitNextAnswer(button) {
  button.addEventListener("click", () => {
    currentQuestion++;
    displayQuestion(currentQuestion);
  });
}
