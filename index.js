let quizScore = 0;
let questionCounter = 0;
let puzzleCorrectCount = 0;

const quizQuestions = [
	{
		que: 'Who is often referred to as the "Father of the Nation"?',
		ans: "Mahatma Gandhi",
		options: [
			"Mahatma Gandhi",
			"Jawaharlal Nehru",
			"Subhas Chandra Bose",
			"Bhagat Singh",
		],
	},
	{
		que: "Which song is often considered the unofficial national anthem of India due to its patriotic significance?",
		ans: "Vande Mataram",
		options: [
			"Jana Gana Mana",
			"Vande Mataram",
			"Saare Jahan Se Achha",
			"Ae Mere Watan Ke Logon",
		],
	},
	{
		que: "What is the national emblem of India?",
		ans: "Lion Capital",
		options: ["Peacock", "Tiger", "Lotus", "Lion Capital"],
	},
	{
		que: 'Who wrote the famous patriotic song "Vande Mataram," often referred to as the "Song of Motherland"?',
		ans: "Bankim Chandra Chattopadhyay",
		options: [
			"Rabindranath Tagore",
			"Bankim Chandra Chattopadhyay",
			"Subramania Bharati",
			"Jawaharlal Nehru",
		],
	},
];

const puzzleFormat = {
	drop1: "row-1-column-1",
	drop2: "row-1-column-2",
	drop3: "row-1-column-3",
	drop4: "row-2-column-1",
	drop5: "row-2-column-2",
	drop6: "row-2-column-3",
	drop7: "row-3-column-1",
	drop8: "row-3-column-2",
	drop9: "row-3-column-3",
};

// Game start
const startGame = (level) => {
	if (level === "1") {
		// Set up the game for level 1
		window.location.href = "/quiz.html";
	}

	if (level === "2") {
		if (!document.referrer.includes("index.html")) {
			alert("Please complete level 1 🧐");
			return;
		}

		if (quizScore <= 2) {
			alert("You didn't passed the quiz round!");
			return;
		}

		// Set up the board for level 2
		window.location.href = "/puzzle.html";
	}

	if (level === "3") {
		if (!document.referrer.includes("quiz.html")) {
			alert("Please complete level 1 🧐and level 2 🧩");
			return;
		}

		if (puzzleCorrectCount !== 9) {
			alert(
				"Oh ho! Puzzle is not yet completed correctly. You cannot go to next round!"
			);
			return;
		}

		// Set up the game board for level 3
		window.location.href = "/flaghoisting.html";
	}
};

// Quiz
const createQuizQuestions = (quiz) => {
	const questionEl = document.querySelector(".questionTitle");
	const optionContainerEl = document.querySelector(".optionContainer");

	questionEl.textContent = quiz.que;
	quiz.options.forEach((opt) => {
		const label = document.createElement("label");
		const radio = document.createElement("input");
		radio.type = "radio";
		radio.name = "options";
		radio.addEventListener("click", (ev) => {
			if (questionCounter === quizQuestions.length) {
				return;
			}
			if (ev.target.value !== quiz.ans) {
				alert("Oh no! You were incorrect.");
			} else {
				quizScore++;
			}

			questionCounter++;
			if (questionCounter === quizQuestions.length) {
				if (quizScore > 2)
					alert(
						`You got ${quizScore} out of ${quizQuestions.length} correct answers. Click next to go to the next round!`
					);
				else
					alert(
						`You only got ${quizScore} out of ${quizQuestions.length} correct answer. Sorry, but you cannot go to the next round!`
					);
				return;
			}
			removeInputEls();
			createQuizQuestions(quizQuestions[questionCounter]);
		});

		radio.value = opt; // Use a unique value for each option
		label.appendChild(radio);
		label.appendChild(document.createTextNode(opt));
		optionContainerEl.appendChild(label);
		optionContainerEl.appendChild(document.createElement("br"));
	});
};

const removeInputEls = () => {
	const labelEls = document.querySelectorAll("label");
	const brEls = document.querySelectorAll("br");
	labelEls.forEach((el) => el.remove());
	brEls.forEach((el) => el.remove());
};

if (window.location.href.includes("quiz.html")) {
	createQuizQuestions(quizQuestions[questionCounter]);
}

// Puzzle
const allowDrop = (ev) => {
	ev.preventDefault();
};

const drag = (ev) => {
	ev.dataTransfer.setData("text", ev.target.id);
};

const drop = (ev) => {
	ev.preventDefault();
	const currentDraggedElementId = ev.dataTransfer.getData("text");
	const currentDraggedElement = document.getElementById(
		currentDraggedElementId
	);

	const parentElOfDraggedElement = currentDraggedElement.parentElement;
	const currentDroppingParentElement = ev.currentTarget;

	/* return if puzzle piece is dragged from remaining puzzle pieces to already filled puzzle piece */
	if (
		parentElOfDraggedElement &&
		parentElOfDraggedElement.className === "cardContainer" &&
		currentDroppingParentElement.childNodes &&
		currentDroppingParentElement.childNodes.length
	) {
		return;
	}

	let cardElSplit;
	let rowColumnNumber;

	/* Decrement the `puzzleCorrectCount` when a puzzle piece is moved from its correct position to a different position 
	or when an already filled puzzle piece is moved to another already filled puzzle piece. */
	if (
		currentDroppingParentElement.classList[1] !==
			parentElOfDraggedElement.classList[1] &&
		parentElOfDraggedElement.className !== "cardContainer"
	) {
		cardElSplit = currentDraggedElement.src.split("/");
		rowColumnNumber = cardElSplit[cardElSplit.length - 1];

		if (
			rowColumnNumber.includes(
				puzzleFormat[parentElOfDraggedElement.classList[1]]
			)
		) {
			puzzleCorrectCount--;
		}

		cardElSplit = currentDroppingParentElement.childNodes[0]
			? currentDroppingParentElement.childNodes[0].src.split("/")
			: [];
		rowColumnNumber = cardElSplit.length
			? cardElSplit[cardElSplit.length - 1]
			: "";

		if (
			rowColumnNumber.includes(
				puzzleFormat[ev.currentTarget.classList[1]]
			)
		) {
			puzzleCorrectCount--;
		}
	}

	/* if already filled puzzle piece is dropped to another already filled puzzle piece, 
	then interchange the puzzle piece */
	if (
		currentDroppingParentElement.childNodes &&
		currentDroppingParentElement.childNodes.length
	) {
		const currentDroppingChildElement =
			currentDroppingParentElement.childNodes[0];

		const cardElSplit =
			currentDroppingParentElement.childNodes[0].src.split("/");
		const rowColumnNumber = cardElSplit[cardElSplit.length - 1];

		/* increment puzzle piece count */
		if (
			rowColumnNumber.includes(
				puzzleFormat[parentElOfDraggedElement.classList[1]]
			)
		) {
			/* Check if the puzzle piece being dragged is the same as the puzzle piece
			already present in the target drop container. If they are the same, return and do not
			perform any further action. This prevents the puzzle piece from being dropped on itself and
			avoids unnecessary swapping of puzzle pieces. */
			if (
				parentElOfDraggedElement.childNodes &&
				parentElOfDraggedElement.childNodes[0].src.split("/")
			) {
				const childNodeOfParentDraggedElSplit =
					parentElOfDraggedElement.childNodes[0].src.split("/");
				const rowColumnNumberOfExistingEl =
					childNodeOfParentDraggedElSplit[
						childNodeOfParentDraggedElSplit.length - 1
					];
				if (rowColumnNumberOfExistingEl === rowColumnNumber) {
					return;
				}
			}
			puzzleCorrectCount++;
		}
		parentElOfDraggedElement.appendChild(currentDroppingChildElement);
	}

	let targetDroppedEl = ev.target;

	/* use target dropped element as currently dropped element and append it with currently dragged element. 
    Note: This case is to replace already filled puzzle piece with another one */
	if (
		targetDroppedEl.parentElement &&
		targetDroppedEl.parentElement.className !== "dropContainer"
	) {
		targetDroppedEl = currentDroppingParentElement;
	}

	const targetDroppedChildEl = targetDroppedEl.classList[1];
	cardElSplit = currentDraggedElement.src.split("/");
	rowColumnNumber = cardElSplit[cardElSplit.length - 1];

	/* increment puzzle piece count */
	if (rowColumnNumber.includes(puzzleFormat[targetDroppedChildEl])) {
		puzzleCorrectCount++;
	}

	currentDroppingParentElement.appendChild(currentDraggedElement);
};

// Flag hoisting
const hoistflag = () => {
	/* Select elements from the HTML document using the `document.querySelector()` 
	and modify their styles and properties. */

	const flagHoistTitle = document.querySelector(".flagHoistTitle");
	flagHoistTitle.style.display = "none";
	const flagEl = document.querySelector(".flagBox");
	flagEl.style.top = "20px";

	const crowdEl = document.querySelector(".crowdImg");
	const audioEl = document.querySelector(".crowdClappingAudio");

	setTimeout(() => {
		/* Animate the flag hoisting process and play audio */
		const flagEl = document.querySelector(".flagImg");
		const independenceDayEl = document.querySelector(".independenceDay");
		audioEl.src = "/assets/audio/crowd-clapping.mp3";
		flagEl.style.opacity = 1;
		crowdEl.style.opacity = 1;
		flagEl.classList.add("flagAnim");
		independenceDayEl.classList.add("flagAnim");
		audioEl.play();
		independenceDayEl.style.display = "block";
	}, 1000);

	setTimeout(() => {
		crowdEl.style.opacity = 0; // hide crowd el once audio is completed after 7.5s
	}, 7500);
};
