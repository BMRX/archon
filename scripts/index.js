const { ipcRenderer } = require("electron");
const remote = require("electron").remote;
const { fs } = require("fs");
var moment = require("moment");

let game;

// When document has loaded, initialise
document.onreadystatechange = () => {
	if (document.readyState == "complete") {
		handleWindowControls();
	}
};

function handleWindowControls() {
	let win = remote.getCurrentWindow();
	// Make minimise/maximise/restore/close buttons work when they are clicked
	document.getElementById("min-button").addEventListener("click", event => {
		win.minimize();
	});

	document.getElementById("max-button").addEventListener("click", event => {
		win.maximize();
	});

	document.getElementById("restore-button").addEventListener("click", event => {
		win.unmaximize();
	});

	document.getElementById("close-button").addEventListener("click", event => {
		win.close();
	});

	// Toggle maximise/restore buttons when maximisation/unmaximisation occurs
	toggleMaxRestoreButtons();

	win.on("maximize", toggleMaxRestoreButtons);
	win.on("unmaximize", toggleMaxRestoreButtons);

	function toggleMaxRestoreButtons() {
		if (win.isMaximized()) {
			document.body.classList.add("maximized");
		} else {
			document.body.classList.remove("maximized");
		}
	}
}

ipcRenderer.on("init", (event, arg) => {
	game = arg;
	// Hide loading
	document.getElementById("loading").style.setProperty("display", "none");
	// Show main screen
	document.getElementById("main").style.setProperty("display", "block");
	populateServers();
});

function populateServers() {
	console.log(game);
	if (game.servers.length > 0) {
		game.servers.forEach(server => {
			console.log(server);
		});
	}
}

function buildNewServer() {
	let newServer = {
		cores: 1,
		clock: 1000000,
		bus: 8,
		memory: 0,
		upgrades: 1,
	};

	game.servers.push(newServer);

	let server = document.createElement("div");
	server.setAttribute("class", "server");
	let clockRate = document.createElement("div");
	clockRate.setAttribute("class", "clockRate");
	server.appendChild(clockRate);
}

// Basic computation implementation, improve for cores, memory, bus, etc.
function cpu(instructions, server) {
	let instructionsComplete = 0;
	let cycles = 0;
	let clock = server.clock;
	let runCycle = setInterval(cycle, 1000);
	let curPrice;

	function cycle() {
		if (instructionsComplete < instructions) {
			console.log(moment().format("hh:mm:ss"));
			console.log(`${instructionsComplete} of ${instructions} total Instructions`)
			instructionsComplete += instructions / clock;
			game.curData += instructions / clock;
			// 5 cents 
			curPrice += formatMoney(0.05);
			cycles++;
		} else {
			clearInterval(runCycle);
			console.log(`Total Cycles: ${cycles}`);
			console.log(`Total Instructions: ${instructionsComplete}`);
			// Calculate price of total instructions, apply to game object
			game.money += formatMoney(curPrice);
		}
	}
}

function formatMoney(amt) {
	let mny = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD '}).format(amt);
	return mny;
}