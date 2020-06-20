
let pages = [
	[34, 32, 32, 32]
];

let comic = 0;
let chapter = 0;
let page = 0;

let imgContainer;
let firstLoad = 5;

function changeContent(direction) {
	imgContainer.children[page-1-direction].style.display = "none";
	imgContainer.children[page-1].style.display = "inline";
}

function getCurrentParams() {
	let params = new URLSearchParams(location.search);
	comic = Number(params.get('s'));
	chapter = Number(params.get('c'));
	page = Number(params.get('p'));
}

function loadPage(p) {
	let pageElement = imgContainer.children[p-1];
	if (pageElement.getAttribute("data-src")) {
		pageElement.setAttribute("src", pageElement.getAttribute("data-src"));
		pageElement.removeAttribute("data-src");
	}
}

function checkParams() {
	if (pages[comic-1] != undefined) {
		let pageCount = pages[comic-1][chapter-1];
		if (pageCount != undefined) {
			if (page > 0 && page <= pageCount) {
				return true;
			}
		}
	}
	
	return false;
}

function firstLoadContent() {
	imgContainer = document.querySelector(".imageContainer");
	
	for (let i = 1; i <= pages[comic-1][chapter-1]; ++i) {
		let imgElement = document.createElement("img");
		imgElement.setAttribute("class", "comicPage");
		imgElement.setAttribute("data-src", `img/comics/${comic}/${chapter}/${i}.png`);
		imgElement.style.display = 'none';
		imgContainer.appendChild(imgElement);
	}
	
	for (let i = 0; i < firstLoad; ++i) {
		if (page+i <= pages[comic-1][chapter-1]) {
			loadPage(page+i);
		}
	}
	
	imgContainer.children[page-1].style.display = "inline";
}

function postLoadContent() {
	let pageToLoad = page + firstLoad - 1;
	if (pageToLoad <= pages[comic-1][chapter-1]) {
		loadPage(pageToLoad);
	}
}

window.onload = function() {
	getCurrentParams();
	if (checkParams()) {
		firstLoadContent();
	} else {
		window.open("comics.html", "_self");
	}
};

window.addEventListener("popstate", function (e) {
	window.open("comics.html", "_self");
});

function turnChapter(direction) {
	chapter += direction;
	
	if (chapter > 0 && chapter <= pages[comic-1].length) {
		if (direction > 0) {
			page = 1;
		} else {
			page = pages[comic-1][chapter-1];
		}
		history.pushState("", `Comic ${comic}, Chapter ${chapter}, Page ${page}`, `reader.html?s=${comic}&c=${chapter}&p=${page}`);
		window.scroll(0, 0);
		while (imgContainer.firstChild) {
			imgContainer.removeChild(imgContainer.lastChild);
		}
		firstLoadContent();
	} else {
		window.open("comics.html", "_self");
	}
	
}

function turnPage(direction) {
	page += direction;
	
	if (page <= 0) {
		turnChapter(-1);
	} else if (page > pages[comic-1][chapter-1]){
		turnChapter(1);
	} else {
		history.pushState("", `Comic ${comic}, Chapter ${chapter}, Page ${page}`, `reader.html?s=${comic}&c=${chapter}&p=${page}`);
		window.scroll(0, 0);
		if (direction > 0) {
			changeContent(direction);
			postLoadContent();
		} else {
			loadPage(page);
			changeContent(direction);
		}
	}
	
}
