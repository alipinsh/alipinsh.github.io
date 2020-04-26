function show(c) {
	document.getElementById(c).style.display = "block";
	document.getElementById("show" + c).style.display = "none";
	document.getElementById("hide" + c).style.display = "block";
}

function hide(c) {
	document.getElementById(c).style.display = "none";
	document.getElementById("show" + c).style.display = "block";
	document.getElementById("hide" + c).style.display = "none";
}