let comic = 0;
let chapter = 0;
let page = 0;

let imgContainer;
let firstLoad = 5;

function getImageName(c, p) {
    return ('0' + c).slice(-2) + '_' + ('00' + p).slice(-3);
}

function changeContent(direction) {
    imgContainer.children[page-1].style.display = 'inline';
    imgContainer.children[page-1-direction].style.display = 'none';
}

function getCurrentParams() {
    let url = new URL(window.location.href);
    comic = Number(url.searchParams.get('s'));
    chapter = Number(url.searchParams.get('c'));
    page = Number(url.searchParams.get('p'));
}

function loadPage(p) {
    let pageElement = imgContainer.children[p-1];
    if (pageElement.getAttribute('data-src')) {
        pageElement.setAttribute('src', pageElement.getAttribute('data-src'));
        pageElement.removeAttribute('data-src');
    }
}

function checkParams() {
    if (comics[comic-1] != undefined) {
        let selectedChapter = comics[comic-1]['chapters'][chapter];
        if (selectedChapter != undefined) {
            let pageCount = selectedChapter['pages'];
            if (pageCount != undefined) {
                if (page > 0 && page <= pageCount) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

function firstLoadContent() {
    imgContainer = document.querySelector('.image-container');
    
    document.querySelector('.bottom h1').innerText = comics[comic-1]['title'];
    document.querySelector('.bottom h2').innerText = comics[comic-1]['chapters'][chapter]['heading'];
    
    let pageCount = comics[comic-1]['chapters'][chapter]['pages'];
    for (let i = 1; i <= pageCount; ++i) {
        let imgElement = document.createElement('img');
        imgElement.setAttribute('class', 'page-image');
        imgElement.setAttribute('data-src', `img/comics/${comic}/${getImageName(chapter, i)}.png`);
        imgElement.style.display = 'none';
        imgContainer.appendChild(imgElement);
    }
    
    for (let i = 0; i < firstLoad; ++i) {
        if (page+i <= pageCount) {
            loadPage(page+i);
        }
    }
    
    imgContainer.children[page-1].style.display = 'inline';
}

function postLoadContent() {
    let pageToLoad = page + firstLoad - 1;
    if (pageToLoad <= comics[comic-1]['chapters'][chapter]['pages']) {
        loadPage(pageToLoad);
    }
}

function turnChapter(direction) {
    chapter += direction;
    
    if (chapter >= 0 && chapter < comics[comic-1]['chapters'].length && comics[comic-1]['chapters'][chapter] != undefined) {
        if (direction > 0) {
            page = 1;
        } else {
            page = comics[comic-1]['chapters'][chapter]['pages'];
        }
        history.pushState('', `Comic ${comic}, Chapter ${chapter}, Page ${page}`, `reader.html?s=${comic}&c=${chapter}&p=${page}`);
        window.scroll(0, 0);
        while (imgContainer.firstChild) {
            imgContainer.removeChild(imgContainer.lastChild);
        }
        firstLoadContent();
    } else {
        window.open('voting.html', '_self');
    }
}

function turnPage(direction) {
    page += direction;

    if (page <= 0) {
        turnChapter(-1);
    } else if (page > comics[comic-1]['chapters'][chapter]['pages']){
        turnChapter(1);
    } else {
        history.pushState('', `Comic ${comic}, Chapter ${chapter}, Page ${page}`, `reader.html?s=${comic}&c=${chapter}&p=${page}`);
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

function topContainerOnClick(e) {
    if (event.clientX > document.body.clientWidth / 2) {
        turnPage(1);
    } else {
        turnPage(-1);
    }
}

let rightDown = false;
let leftDown = false;

function arrowKeyDown(e) {
    if (!rightDown && e.keyCode == 39) {
        rightDown = true;
    } else if (!leftDown && e.keyCode == 37) {
        leftDown = true;
    }
}

function arrowKeyUp(e) {
    if (rightDown && e.keyCode == 39) {
        turnPage(1);
        rightDown = false;
    } else if (leftDown && e.keyCode == 37) {
        turnPage(-1);
        leftDown = false;
    }
}

function fitModeOnChange(e) {
    imgContainer.className = 'image-container ' + e.target.value;
    localStorage.setItem('fit', e.target.getVariable('data-index'));
}

window.addEventListener('load', function() {
    getCurrentParams();
    if (checkParams()) {
        firstLoadContent();
    } else {
        window.open('voting.html', '_self');
    }

    document.querySelector('.top').addEventListener('click', topContainerOnClick);
    document.addEventListener('keydown', arrowKeyDown);
    document.addEventListener('keyup', arrowKeyUp);

    let radios = document.querySelectorAll('.fit input');
    for (let i = 0; i < radios.length; i++) {
        radios.item(i).addEventListener('change', fitModeOnChange);
    }

    let savedChoice = localStorage.getItem('fit');

    if (savedChoice == null) {
        savedChoice = 0;
        localStorage.setItem('fit', 0);
    }

    radios.item(savedChoice).checked = true;
    imgContainer.className = 'image-container ' + radios.item(savedChoice).value;
});

window.addEventListener('popstate', function (e) {
    window.open('voting.html', '_self');
});
