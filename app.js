document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	const stopwatchEl = document.querySelector('.stopwatch');
	const remainingFlagsEl = document.getElementById('remainingFlags');

	let width = 10;
	let bombAmount = 20;
	let flags = 0;
	let squares = [];
	let isGameOver = false;
	const timer = new Stopwatch(stopwatchEl);

	// add listener for new game button
	document.getElementById('newGame').addEventListener('click', () => {
		if (squares.length > 0 && confirm('Start a new game ?')) {
			// Reinitialize all variables to start a new game
			const gameOverDiv = document.querySelector('.game-over');
			if (gameOverDiv) {
				gameOverDiv.remove();
			}

			flags = 0;
			squares = [];
			isGameOver = false;
			grid.innerHTML = '';
			remainingFlagsEl.innerHTML = '20 🚩';

			createBoard();
		} else {
			createBoard();
		}
	});

	// Create board
	function createBoard() {
		// Get shuffled game array with random bombs
		const bombsArray = Array(bombAmount).fill('bomb');
		const emptyArray = Array(width * width - bombAmount).fill('valid');
		const gameArray = emptyArray.concat(bombsArray);
		const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

		for (let i = 0; i < width * width; i++) {
			const square = document.createElement('div');
			square.setAttribute('id', i);
			square.classList.add(shuffledArray[i]);

			grid.appendChild(square);

			squares.push(square);

			// Normal click
			square.addEventListener('click', (e) => {
				click(square);
			});

			// CTRL and left click
			square.addEventListener('contextmenu', function (e) {
				e.preventDefault();

				addFlag(square);
			});
		}

		// Add Numbers
		for (let i = 0; i < squares.length; i++) {
			let total = 0;
			const isLeftEdge = i % width === 0;
			const isRightEdge = i % width === width - 1;

			if (squares[i].classList.contains('valid')) {
				if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) {
					total++;
				}
				if (
					i > 9 &&
					!isRightEdge &&
					squares[i + 1 - width].classList.contains('bomb')
				) {
					total++;
				}
				if (i > 10 && squares[i - width].classList.contains('bomb')) {
					total++;
				}
				if (
					i > 11 &&
					!isLeftEdge &&
					squares[i - 1 - width].classList.contains('bomb')
				) {
					total++;
				}
				if (
					i < 98 &&
					!isRightEdge &&
					squares[i + 1].classList.contains('bomb')
				) {
					total++;
				}
				if (
					i < 90 &&
					!isLeftEdge &&
					squares[i - 1 + width].classList.contains('bomb')
				) {
					total++;
				}
				if (
					i < 88 &&
					!isRightEdge &&
					squares[i + 1 + width].classList.contains('bomb')
				) {
					total++;
				}
				if (i < 89 && squares[i + width].classList.contains('bomb')) {
					total++;
				}
				squares[i].setAttribute('data', total);
			}
		}

		timer.reset();
		timer.start();
	}

	// Add Flag on right click
	function addFlag(square) {
		if (isGameOver) {
			return;
		}

		if (!square.classList.contains('checked') && flags < bombAmount) {
			if (!square.classList.contains('flag')) {
				square.classList.add('flag');
				square.innerHTML = '🚩';

				flags++;

				remainingFlagsEl.innerHTML = bombAmount - flags + ' 🚩';

				checkForWin();
			} else {
				square.classList.remove('flag');
				square.innerHTML = '';

				flags--;

				remainingFlagsEl.innerHTML = bombAmount - flags + ' 🚩';
			}
		}
	}

	// Click on square actions
	function click(square) {
		let currentId = square.id;
		if (isGameOver) {
			return;
		}
		if (
			square.classList.contains('checked') ||
			square.classList.contains('flag')
		) {
			return;
		}
		if (square.classList.contains('bomb')) {
			gameOver(square);
		} else {
			let total = square.getAttribute('data');
			if (total != 0) {
				square.classList.add('checked');
				square.innerHTML = total;

				if (total == 1) {
					square.classList.add('one');
				} else if (total == 2) {
					square.classList.add('two');
				} else if (total == 3) {
					square.classList.add('three');
				} else if (total == 4) {
					square.classList.add('four');
				}

				return;
			}

			checkSquare(square, currentId);
		}
		square.classList.add('checked');
	}

	function checkSquare(square, currentId) {
		const isLeftEdge = currentId % width === 0;
		const isRightEdge = currentId % width === width - 1;

		setTimeout(() => {
			if (currentId > 0 && !isLeftEdge) {
				const newId = squares[parseInt(currentId, 10) - 1].id;
				const newSquare = document.getElementById(newId);

				click(newSquare);
			}
			if (currentId > 9 && !isRightEdge) {
				const newId = squares[parseInt(currentId, 10) + 1 - width].id;
				const newSquare = document.getElementById(newId);

				click(newSquare);
			}
			if (currentId > 10) {
				const newId = squares[parseInt(currentId, 10) - width].id;
				const newSquare = document.getElementById(newId);

				click(newSquare);
			}
			if (currentId > 11 && !isLeftEdge) {
				const newId = squares[parseInt(currentId, 10) - 1 - width].id;
				const newSquare = document.getElementById(newId);

				click(newSquare);
			}
			if (currentId < 98 && !isRightEdge) {
				const newId = squares[parseInt(currentId, 10) + 1].id;
				const newSquare = document.getElementById(newId);

				click(newSquare);
			}
			if (currentId < 90 && !isLeftEdge) {
				const newId = squares[parseInt(currentId, 10) - 1 + width].id;
				const newSquare = document.getElementById(newId);

				click(newSquare);
			}
			if (currentId < 88 && !isLeftEdge) {
				const newId = squares[parseInt(currentId, 10) + 1 + width].id;
				const newSquare = document.getElementById(newId);

				click(newSquare);
			}
			if (currentId < 89) {
				const newId = squares[parseInt(currentId, 10) + width].id;
				const newSquare = document.getElementById(newId);

				click(newSquare);
			}
		}, 10);
	}

	// Game over
	function gameOver(square) {
		const sidebarEl = document.querySelector('.sidebar');
		const gameOverDiv = document.createElement('div');
		gameOverDiv.classList.add('game-over');
		gameOverDiv.innerHTML = 'BOOOOOOOOM! ';

		const loserSpan = document.createElement('span');
		loserSpan.style.color = 'red';
		loserSpan.innerHTML = 'Game Over.';

		gameOverDiv.append(loserSpan);
		sidebarEl.append(gameOverDiv);

		isGameOver = true;
		timer.stop();

		// Show all the bombs
		squares.forEach((square) => {
			if (square.classList.contains('bomb')) {
				square.innerHTML = '💣';
			}
		});
	}

	// Check for win
	function checkForWin() {
		let matches = 0;

		for (let i = 0; i < squares.length; i++) {
			if (
				squares[i].classList.contains('flag') &&
				squares[i].classList.contains('bomb')
			) {
				matches++;
			}
			if (matches === bombAmount && !isGameOver) {
				const sidebarEl = document.querySelector('.sidebar');
				const gameOverDiv = document.createElement('div');
				gameOverDiv.classList.add('game-over');
				gameOverDiv.innerHTML = 'You ';

				const winnerSpan = document.createElement('span');
				winnerSpan.style.color = 'green';
				winnerSpan.innerHTML = 'Win!';

				gameOverDiv.append(winnerSpan);
				sidebarEl.append(gameOverDiv);
				isGameOver = true;

				timer.stop();
			}
		}
	}
});

// Stopwatch
var Stopwatch = function (elem, options) {
	var timer = createTimer(),
		// startButton = createButton('start', start),
		// stopButton = createButton('stop', stop),
		// resetButton = createButton('reset', reset),
		offset,
		sec = 0,
		min = 0,
		hours = 0,
		interval;

	// default options
	options = options || {};
	options.delay = options.delay || 1;

	// append elements
	elem.appendChild(timer);
	// elem.appendChild(startButton);
	// elem.appendChild(stopButton);
	// elem.appendChild(resetButton);

	// initialize
	reset();

	// private functions
	function createTimer() {
		return document.createElement('span');
	}

	// function createButton(action, handler) {
	// 	var a = document.createElement('a');
	// 	a.href = '#' + action;
	// 	a.innerHTML = action;
	// 	a.addEventListener('click', function (event) {
	// 		handler();
	// 		event.preventDefault();
	// 	});
	// 	return a;
	// }

	function start() {
		if (!interval) {
			offset = Date.now();
			interval = setInterval(update, options.delay);
		}
	}

	function stop() {
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
	}

	function reset() {
		clock = 0;
		render();
	}

	function update() {
		clock += delta();
		render();
	}

	function render() {
		sec = Math.ceil(clock / 1000);

		timer.innerHTML = `${(hours < 10 ? '0' + hours : hours) || '00'} : ${
			(min < 10 ? '0' + min : min) || '00'
		} : ${(sec < 10 ? '0' + sec : sec) || '00'}`;
		if (sec > 59) {
			min++;
			clock = 0;
			return;
		}
		if (min > 59) {
			hours++;
			min = 0;
			return;
		}
	}

	function delta() {
		var now = Date.now(),
			d = now - offset;

		offset = now;
		return d;
	}

	// public API
	this.start = start;
	this.stop = stop;
	this.reset = reset;
};
