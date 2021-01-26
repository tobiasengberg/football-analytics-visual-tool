function findFormation() {
  fetch("/apiexample.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data.response[0].formation);
    });
}

function findPlayers() {
  fetch("/apiexample.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.response[0].startXI.forEach((element) => {
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
