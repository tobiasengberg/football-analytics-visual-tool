let teamColor = "blue";
let playerNumber = 1;
let yPosition = 150; // Used by several functions
let xPosition = 80; // Used by several functions
let xOrigin = 0; // Used by several functions
let yOrigin = 0; // Used by several functions
let holdsPlayer = false;
let playerHeld = 0;
let selectionBegun = false;
let selectionStop = true;
let drawBegun = false;
let drawStop = true;
let circlesSelected = false;
let pen = false;
let dashed = false;

const createSvg = (kind) => document.createElementNS("http://www.w3.org/2000/svg", kind);

const AttributesSetting = (target, attributes) =>
  attributes.forEach((attr) => {
    target.setAttribute(attr[0], attr[1]);
  });

// Creates a player with team colored circle and number grouped.
// Presently without id, which could be added in another stage of the design.
function createPlayer() {
  let createGroup = createSvg("g");
  createGroup.setAttribute("transform", `translate(${xPosition} ${yPosition})`);
  document.getElementById("players").appendChild(createGroup);

  let createCircle = createSvg("circle");
  AttributesSetting(createCircle, [
    ["cy", "0"],
    ["cx", "0"],
    ["r", "15"],
    ["fill", teamColor],
  ]);
  createGroup.appendChild(createCircle);

  let createNumber = createSvg("text");
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
  let createPlayerGroup = createSvg("g");
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
  let createGroup = createSvg("g");
  createGroup.setAttribute("id", title);
  document.getElementsByTagName("svg")[0].appendChild(createGroup);
}

function drawLine() {
  if (!drawBegun && !drawStop) {
    let createLine = createSvg("line");
    AttributesSetting(createLine, [
      ["x1", xOrigin - 7],
      ["y1", yOrigin + 7],
      ["x2", xOrigin - 7],
      ["y2", yOrigin + 7],
      ["marker-end", "url(#arrowhead)"],
      ["stroke-dasharray", dashed ? "5" : "0"],
    ]);
    document.getElementById("analytics").appendChild(createLine);
    drawBegun = true;
  } else if (drawBegun && !drawStop) {
    AttributesSetting(document.getElementById("analytics").lastElementChild, [
      ["x2", xPosition - 7],
      ["y2", yPosition + 7],
    ]);
  } else if (drawBegun && drawStop) {
    drawBegun = false;
    drawStop = false;
  }
}

// Checks if the space is free from another player.
// If occupied, the moved player continues to be held.
function checkSpace() {
  let spaceFree = true;
  let playerList = document.getElementById("players").children;
  for (let player = 0; player < 22; player++) {
    let distanceX = playerList[player].transform.animVal[0].matrix.e - xPosition;
    let distanceY = playerList[player].transform.animVal[0].matrix.f - yPosition;
    if (Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)) < 31 && playerHeld != playerList[player]) {
      spaceFree = false;
    }
  }
  return spaceFree;
}

// Checks if a mouse event is within the bounds of the SVG viewport
function inBounds(e) {
  return e.pageX < 1300 && e.pageX > 0 && e.pageY < 700 && e.pageY > 0 ? true : false;
}

function selectionBox() {
  if (selectionBegun && selectionStop) {
    let createSelection = createSvg("polygon");
    let startPoint = fourCorners();
    AttributesSetting(createSelection, [
      ["id", "selection_box"],
      ["points", startPoint],
    ]);
    document.getElementById("selection").appendChild(createSelection);
  } else if (selectionBegun && !selectionStop) {
    document.getElementById("selection_box").setAttribute("points", fourCorners());
  } else {
    document.getElementById("selection").removeChild(document.getElementById("selection_box"));
    grabSelectedPlayers();
  }
}

function fourCorners() {
  return `${xOrigin}, ${yOrigin}, ${xPosition}, ${yOrigin}, ${xPosition}, ${yPosition}, ${xOrigin}, ${yPosition}`;
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
        playerList[player].firstElementChild.setAttribute("class", "circle_selected");
        circlesSelected = true;
      }
    }
  }
}

function moveSelected(direction) {
  let selection = document.getElementsByClassName("circle_selected");
  for (let index = 0; index < selection.length; index++) {
    playerHeld = selection[index].parentElement;
    let position = playerHeld.getAttribute("transform");
    let parameters = position.substring(10, position.length - 1).split(" ");
    playerHeld.setAttribute("transform", "translate(" + directionMove(direction, parameters[0], parameters[1]) + ")");
  }
}

const directionMove = (arrow, x, y) => {
  switch (arrow) {
    case "left":
      xPosition = Number(x) - 20;
      yPosition = Number(y);
      return checkSpace() ? `${Number(x) - 20} ${Number(y)}` : `${Number(x)} ${Number(y)}`;
    case "up":
      xPosition = Number(x);
      yPosition = Number(y) - 20;
      return checkSpace() ? `${Number(x)} ${Number(y) - 20}` : `${Number(x)} ${Number(y)}`;
    case "down":
      xPosition = Number(x);
      yPosition = Number(y) + 20;
      return checkSpace() ? `${Number(x)} ${Number(y) + 20}` : `${Number(x)} ${Number(y)}`;
    case "right":
      xPosition = Number(x) + 20;
      yPosition = Number(y);
      return checkSpace() ? `${Number(x) + 20} ${Number(y)}` : `${Number(x)} ${Number(y)}`;
  }
};

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

window.addEventListener("mousedown", function (e) {
  let item = e.target.parentElement;
  if (inBounds(e)) {
    if (e.target.tagName != "rect" && item.parentElement.tagName == "g" && !pen) {
      if (item.firstChild.getAttribute("class") == null) {
        clearSelected();
      }
      if (!holdsPlayer) {
        playerHeld = item;
      }
      holdsPlayer = true;
    } else if (e.target.tagName == "rect" && !selectionBegun && !pen) {
      selectionBegun = true;
      xOrigin = e.pageX;
      xPosition = xOrigin + 1;
      yOrigin = e.pageY;
      yPosition = yOrigin + 1;
      selectionBox();
    } else if (e.target.tagName == "rect" && !drawBegun && pen) {
      xOrigin = e.pageX;
      yOrigin = e.pageY;
      drawStop = false;
      drawLine();
    }
  }
});

window.addEventListener("mousemove", function (e) {
  if (holdsPlayer) {
    playerHeld.setAttribute("transform", "translate(" + e.pageX + " " + e.pageY + ")");
  } else if (selectionBegun) {
    selectionStop = false;
    xPosition = e.pageX;
    yPosition = e.pageY;
    selectionBox();
  } else if (drawBegun) {
    xPosition = e.pageX;
    yPosition = e.pageY;
    drawLine();
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
    } else if (drawBegun) {
      drawStop = true;
      drawLine();
    }
  }
});

window.addEventListener("keydown", function (e) {
  e.preventDefault();
  switch (true) {
    case e.key == "p" && !holdsPlayer && !circlesSelected:
      document.getElementById("general").classList.toggle("cursor");
      pen = pen ? false : true;
      break;
    case e.key == "Escape" && circlesSelected:
      clearSelected();
      circlesSelected = false;
      break;
    case e.key == "Backspace" && pen:
      document.getElementById("analytics").lastElementChild.remove();
      break;
    case e.key == "d":
      dashed = dashed ? false : true;
      break;
    case e.key == "ArrowLeft" && circlesSelected:
      moveSelected("left");
      break;
    case e.key == "ArrowRight" && circlesSelected:
      moveSelected("right");
      break;
    case e.key == "ArrowDown" && circlesSelected:
      moveSelected("down");
      break;
    case e.key == "ArrowUp" && circlesSelected:
      moveSelected("up");
      break;
    default:
      break;
  }
});
