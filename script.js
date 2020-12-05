var teamColor = "blue";
var playerNumber = 1;
var yPosition = 150; // Used by several functions
var xPosition = 80; // Used by several functions
var xOrigin = 0; // Used by several functions
var yOrigin = 0; // Used by several functions
var holdsPlayer = false;
var playerHeld = 0;
var selectionBegun = false;
var selectionStop = true;
var circlesSelected = false;

function AttributesSetting(target, attributesList) {
  for (let i = 0; i < attributesList.length; i++) {
    target.setAttribute(attributesList[i][0], attributesList[i][1]);
  }
}

// Creates a player with team colored circle and number grouped.
// Presently without id, which could be added in another stage of the design.
function createPlayer() {
  let createGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  createGroup.setAttribute(
    "transform",
    "translate(" + xPosition + " " + yPosition + ")"
  );
  document.getElementById("players").appendChild(createGroup);

  let createCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  AttributesSetting(createCircle, [
    ["cy", "0"],
    ["cx", "0"],
    ["r", "15"],
    ["fill", teamColor],
  ]);

  createGroup.appendChild(createCircle);

  let createNumber = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  createNumber.textContent = playerNumber;
  if (playerNumber < 10) {
    createNumber.setAttribute("transform", "translate(-5 6)");
  } else {
    createNumber.setAttribute("transform", "translate(-11 6)");
  }
  createGroup.appendChild(createNumber);
}

// Creates 22 players in a single group with the id "players"
function createTeams() {
  let createPlayerGroup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  createPlayerGroup.setAttribute("id", "players");
  document.getElementsByTagName("svg")[0].appendChild(createPlayerGroup);
  for (let team = 1; team < 3; team++) {
    for (let index = 1; index < 12; index++) {
      createPlayer();
      playerNumber++;
      yPosition += 40;
    }
    playerNumber = 1;
    yPosition = 150;
    teamColor = "red";
    xPosition = 1220;
  }
}

// To keep the SVG organized.
// The groups then provide an essential function in getting elements.
function createSVGGroup(title) {
  let createGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  createGroup.setAttribute("id", title);
  document.getElementsByTagName("svg")[0].appendChild(createGroup);
}

function drawLine() {
  let createLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );

  AttributesSetting(createLine, [
    ["x1", "320"],
    ["y1", "320"],
    ["x2", "590"],
    ["y2", "340"],
  ]);
  document.getElementById("analytics").appendChild(createLine);
}

// Checks if the space is free from another player.
// If occupied, the moved player continues to be held.
function checkSpace() {
  let spaceFree = true;
  let playerList = document.getElementById("players").children;
  for (let player = 0; player < 22; player++) {
    let distanceX =
      playerList[player].transform.animVal[0].matrix.e - xPosition;
    let distanceY =
      playerList[player].transform.animVal[0].matrix.f - yPosition;
    if (
      Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)) < 31 &&
      playerHeld != playerList[player]
    ) {
      spaceFree = false;
    }
  }
  return spaceFree;
}

// Checks if a mouse event is within the bounds of the SVG viewport
function inBounds(e) {
  if (e.pageX < 1300 && e.pageX > 0) {
    if (e.pageY < 700 && e.pageY > 0) {
      return true;
    }
    return false;
  }
  return false;
}

function selectionBox() {
  if (selectionBegun && selectionStop) {
    let createSelection = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    let startPoint = fourCorners();
    AttributesSetting(createSelection, [
      ["id", "selection_box"],
      ["points", startPoint],
    ]);
    document.getElementById("selection").appendChild(createSelection);
  } else if (selectionBegun && !selectionStop) {
    document
      .getElementById("selection_box")
      .setAttribute("points", fourCorners());
  } else {
    document
      .getElementById("selection")
      .removeChild(document.getElementById("selection_box"));
    grabSelectedPlayers();
    circlesSelected = true;
  }
}

function fourCorners() {
  return (
    "" +
    xOrigin +
    ", " +
    yOrigin +
    " " +
    xPosition +
    ", " +
    yOrigin +
    " " +
    xPosition +
    ", " +
    yPosition +
    " " +
    xOrigin +
    ", " +
    yPosition
  );
}

function grabSelectedPlayers() {
  let playerList = document.getElementById("players").children;
  if (xPosition < xOrigin) {
    let temp = xOrigin;
    xOrigin = xPosition;
    xPosition = temp;
  }
  if (yPosition < yOrigin) {
    let temp = yOrigin;
    yOrigin = yPosition;
    yPosition = temp;
  }
  for (let player = 0; player < 22; player++) {
    let xPoint = playerList[player].transform.animVal[0].matrix.e;
    if (xPoint > xOrigin - 14 && xPoint < xPosition + 14) {
      let yPoint = playerList[player].transform.animVal[0].matrix.f;
      if (yPoint > yOrigin - 14 && yPoint < yPosition + 14) {
        playerList[player].firstElementChild.setAttribute(
          "class",
          "circle_selected"
        );
        circlesSelected = true;
      }
    }
  }
}

function clearSelected() {
  circlesSelected = false;
  let playerList = document.getElementById("players").children;
  for (let player = 0; player < 22; player++) {
    if (playerList[player].firstElementChild.getAttribute("class") != null) {
      playerList[player].firstElementChild.removeAttribute("class");
    }
  }
}

createSVGGroup("analytics");
createTeams();
createSVGGroup("selection");
drawLine();

window.addEventListener("mousedown", function (e) {
  if (inBounds(e)) {
    if (
      e.target.tagName != "rect" &&
      e.target.parentElement.parentElement.tagName == "g"
    ) {
      if (e.target.parentElement.firstChild.getAttribute("class") == null) {
        clearSelected();
      }
      if (!holdsPlayer) {
        playerHeld = e.target.parentElement;
      }
      holdsPlayer = true;
    } else if (e.target.tagName == "rect" && !selectionBegun) {
      selectionBegun = true;
      xOrigin = e.pageX;
      xPosition = xOrigin + 1;
      yOrigin = e.pageY;
      yPosition = yOrigin + 1;
      selectionBox();
    }
  }
});

window.addEventListener("mousemove", function (e) {
  if (holdsPlayer) {
    playerHeld.setAttribute(
      "transform",
      "translate(" + e.pageX + " " + e.pageY + ")"
    );
  } else if (selectionBegun) {
    selectionStop = false;
    xPosition = e.pageX;
    yPosition = e.pageY;
    selectionBox();
  }
});

window.addEventListener("mouseup", function (e) {
  if (inBounds(e)) {
    if (holdsPlayer) {
      xPosition = e.pageX;
      yPosition = e.pageY;
      if (checkSpace()) {
        holdsPlayer = false;
      }
    } else if (selectionBegun) {
      selectionBegun = false;
      selectionStop = true;
      xPosition = e.pageX;
      yPosition = e.pageY;
      if (circlesSelected) {
        clearSelected();
      }
      selectionBox();
    }
  }
});

window.addEventListener("keydown", function (e) {
  console.log(e.key);
  switch (e.key) {
    case "n":
      if (circlesSelected) {
        let namedSelection = window.prompt(
          "Name the group of players you have selected:"
        );
        let selection = document.getElementsByClassName("circle_selected");
        for (let index = 0; index < selection.length; index++) {
          AttributesSetting(selection[index].parentElement, [
            ["class", namedSelection],
          ]);
        }
      }
      break;
    case "ArrowLeft":
      e.preventDefault();
      if (circlesSelected) {
        let selection = document.getElementsByClassName("circle_selected");
        for (let index = 0; index < selection.length; index++) {
          let target = selection[index].parentElement;
          let position = target.getAttribute("transform");
          console.log(position);
          AttributesSetting(target, [
            ["transform", "translate(70 " + 150 + ")"],
          ]);
        }
      }

    default:
      break;
  }
});
