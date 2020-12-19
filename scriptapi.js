function findFormation() {
  fetch("/apiexample.json")
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log(response.response[0].formation);
    });
}

function findPlayers() {
  fetch("/apiexample.json")
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      response.response[0].startXI.forEach((element) => {
        console.log(
          element.player.number,
          element.player.name,
          element.player.pos
        );
      });
    });
}

findPlayers();
findFormation();
