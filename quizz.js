import { Questions } from "./questions";

const buttonStart = document.querySelector("#start");
const wrapper = document.querySelector("#wrapper");
let score = 0;
let currentQuestion = 0;

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
  title.style.color = "white";
  title.innerText = text;
  title.style.fontSize = "20px";
  return title;
}

// function qui crée le player audio de la question
function getAudioElement(url) {
  const playerAudio = document.createElement("audio");
  playerAudio.classList.add("audio", "hidden");
  playerAudio.setAttribute("src", url);
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
  input.classList.add("appearance-none");
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);
  label.appendChild(input);
  return label;
}

// function qui change le style du wrapper suivant la question
function changeStyleWrapper(bg) {
  wrapper.style.backgroundImage = `url(${bg})`;
  wrapper.style.height = "auto";
  wrapper.classList.add(
    "smallMobile:top-[10%]",
    "smallMobile:w-full",
    "smallMobile:bg-none",
    "smallMobile:bg-cover",
    "tablet:bg-[center_left_2rem]",
    "tablet:bg-[length:150px_200px]",
    "largeTablet:bg-[length:150px_200px]",
    "largeTablet:top-[3%]",
    "laptop:bg-[center_left_3rem]",
    "largeDesktop:bg-[length:170px_220px]",
    "largeDesktop:bg-[center_left_2rem]",
    "largeDesktop:bg-[length:200px_250px]",
    "largeDesktop:w-[50%]",
    "largeDesktop:top-[20%]"
  );
}

// function qui affiche les réponses
function createAnswers(answers) {
  const answerContainer = document.createElement("div");
  answerContainer.classList.add(
    "flex",
    "flex-col",
    "smallMobile:w-full",
    "tablet:items-end",
    "tablet:w-[80%]",
    "laptop:w-[50%]",
    "largeDesktop:w-[100%]",
    "tablet:mt-10"
  );

  for (const answer of answers) {
    const label = getAnswerElement(answer);
    label.classList.add(
      "smallMobile:w-full",
      "smallMobile:text-base",
      "smallMobile:p-[8px]",
      "tablet:w-[250px]",
      "largeTablet:w-[350px]",
      "p-[12px]",
      "block",
      "flex",
      "border",
      "border-2",
      "border-[#414147]",
      "rounded-xl",
      "items-center",
      "justify-center",
      "text-xl",
      "mt-5",
      "has-[:checked]:border-tomato",
      "has-[:checked]:bg-tomato",
      "bg-white",
      "hover:cursor-pointer",
      "hover:bg-tomato"
    );
    answerContainer.appendChild(label);
  }
  return answerContainer;
}

// function qui crée le bouton de validation
function getSubmitButton() {
  const submitButton = createButton("Je valide");
  return submitButton;
}

//function submit (bouton validation)
function submitAnswer(button, question) {
  let errorMessage = null;

  button.addEventListener("click", () => {
    const selectedAnswer = wrapper.querySelector(
      'input[name="answer"]:checked'
    );

    if (!selectedAnswer) {
      // Vérifie si un message d'erreur n'existe pas déjà
      if (!errorMessage) {
        errorMessage = showErrorInputValidation();
        wrapper.appendChild(errorMessage);
      }
      return;
    } else {
      // Supprime le message d'erreur s'il existe
      if (errorMessage) {
        wrapper.removeChild(errorMessage);
      }
    }

    const valueSelected = selectedAnswer.value;

    const isCorrectAnswer = question.correct === valueSelected;

    if (isCorrectAnswer) {
      score++;
    }

    showFeedBack(isCorrectAnswer, question.correct, valueSelected);

    button.remove();

    const nextButton = getNextButton(currentQuestion);
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
  selectedElement.classList.remove("bg-white");
  selectedElement.classList.remove("has-[:checked]:bg-tomato");
  selectedElement.classList.remove("has-[:checked]:border-tomato");
  correctElement.classList.remove("bg-white");
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
  const answersDiv = createAnswers(question.answers, question.bg);
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

// function qui affiche les erreurs du formulaire
function showErrorInputValidation() {
  const messageError = document.createElement("p");
  messageError.innerText = "Veuillez selectionner une réponse";
  messageError.style.color = "white";
  messageError.classList.add("animate-fadeIn");
  return messageError;
}

// function qui affiche un message
function getFeedBackMessage(isCorrect, correctAnswer) {
  const message = document.createElement("p");
  message.innerText = isCorrect
    ? "Bravo vous avez trouvé la bonne réponse"
    : `Désolé ! la bonne réponse était ${correctAnswer}`;
  message.style.color = "white";
  message.style.width = "100%";
  message.classList.add(
    "flex",
    "justify-end",
    "mr-20",
    "mt-5",
    "smallMobile:text-center",
    "smallMobile:mr-0",
    "largeTablet:justify-center",
    "largeTablet:mr-0",
    "animate-fadeIn"
  );
  return message;
}

// Création du quizz
function startQuiz(event) {
  event.stopPropagation();
  displayQuestion(currentQuestion);
}

// Message de fin du quiz + bouton rechargement du quiz
function displayFinishMessage() {
  const title = document.createElement("h2");
  title.innerText = "Bravo vous êtes arrivé à la fin du quiz !";
  title.style.color = "white";
  const message = document.createElement("p");
  message.style.color = "white";
  message.innerText = `Votre score est de ${score} sur ${Questions.length} points...`;
  const felicitations = document.createElement("p");
  felicitations.innerText =
    score <= Math.floor(Questions.length / 2)
      ? "Peu mieux faire :("
      : "Pas mal du tout :)";
  felicitations.style.color = "white";

  const reloadButton = getreloadButton();

  wrapper.appendChild(title);
  wrapper.appendChild(message);
  wrapper.appendChild(felicitations);
  wrapper.appendChild(reloadButton);
  wrapper.style.backgroundImage = "none";

  reloadButton.addEventListener("click", () => {
    reloadPage();
  });
}

// function qui crée le bouton Next questions
function getNextButton(index) {
  const isLastQuestion = index === Questions.length - 1;
  const nextButton = createButton(
    isLastQuestion ? "Résultat" : "Question suivante"
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

//function pour créer le bouton de rechargement du quizz
function getreloadButton() {
  const reloadButton = createButton("Je recommence le quiz");
  reloadButton.classList.add("animate-fadeIn");
  return reloadButton;
}

// Fonction pour recharger la page aprés la fin du quiz
function reloadPage() {
  location.reload(); // Recharge la page
}

// création du bouton du quizz
function createButton(text) {
  const button = document.createElement("button");
  button.innerText = text;
  button.classList.add(
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
  return button;
}
