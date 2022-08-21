async function newsSite() {
  const url = "https://api.spaceflightnewsapi.net/v3/articles?_limit=300"; // Url API
  const response = await fetch(url);
  const dati = await response.json();

  const autori = await dati.map((authors) => authors.newsSite); // proprietà newsSite che indica l'autore di un articolo
  const orderedAuthor = [...new Set(autori.sort())]; // lista degli autori non ripetuti in ordine alfabetico

  const numeri = [];

  // ciclo che abbina gli autori di un articolo alla quantità pubblicata

  orderedAuthor.forEach((element) => {
    numeri.push(
      autori.filter((item) => {
        return item.toString() === element.toString();
      }).length
    );
  });

  let totaleArticoli = numeri.reduce((a, b) => a + b);

  // Grafico con la percentuale di articoli scritti per Autore
  const data = {
    labels: orderedAuthor,
    datasets: [
      {
        label: "",
        backgroundColor: [
          "rgba(255, 0, 0)",
          "rgba(255, 123, 25)",
          "rgba(99, 222, 12)",
          "rgba(255, 255, 0)",
          "rgba(255, 0, 85)",
          "rgba(15, 122, 172)",
          "rgba(234, 98, 172)",
          "rgba(134, 12, 172)",
          "rgba(34, 162, 172)",
          "rgba(4, 42, 72)",
          "rgba(134, 62, 112)",
          "rgba(4, 112, 72)",
        ],
        borderColor: [
          "rgb(255, 0, 0)",
          "rgba(255, 123, 25)",
          "rgba(99, 222, 12)",
          "rgba(255, 255, 0)",
          "rgba(255, 0, 85)",
          "rgba(15, 122, 172)",
          "rgba(234, 98, 172)",
          "rgba(134, 12, 172)",
          "rgba(34, 162, 172)",
          "rgba(4, 42, 72)",
          "rgba(134, 62, 112)",
          "rgba(4, 112, 72)",
        ],
        data: numeri,
      },
    ],
  };

  const config = {
    type: "pie",
    data: data,
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            title: function (context) {
              let percentuale = (
                (context[0].parsed / totaleArticoli) *
                100
              ).toFixed(1);
              return `${percentuale}%`;
            },
          },
        },
        legend: {
          labels: {
            color: "#fff",
          },
        },
        title: {
          display: true,
          text: "% Provenienza Articolo",
          font: {
            size: "22",
          },
          color: "#fff",
        },
      },
    },
  };

  const myChart = new Chart(document.getElementById("myChart"), config);
}
newsSite();

let nomiPublisher = [];
let dateMensili = [];
let mesi = [];

async function articoliPerMese() {
  const url = "https://api.spaceflightnewsapi.net/v3/info";
  const response = await fetch(url, {
    method: "GET",
    "Content-Type": "application/json",
  });
  const dati = await response.json();

  dati.newsSites.forEach((item) => {
    nomiPublisher.push(item);
  });

  let oggi = new Date();

  dateMensili.push(`${oggi.getMonth() + 1}/${oggi.getFullYear()}`);

  for (let i = 0; i < 11; i++) {
    if (oggi.getMonth() === 0) {
      dateMensili.unshift(`12/${oggi.getFullYear()}`);
      oggi.setMonth(oggi.getMonth() - 1);
    } else {
      dateMensili.unshift(`${oggi.getMonth()}/${oggi.getFullYear()}`);
      oggi.setMonth(oggi.getMonth() - 1);
    }
  }

  document
    .querySelector("div.container:last-child")
    .after(document.createElement("select"));
  document
    .querySelector("div.container + select")
    .appendChild(document.createElement("option"));
  document.querySelector(
    "div.container + select option:last-child"
  ).textContent = "Select a publisher..";
  document
    .querySelector("div.container + select option:last-child")
    .setAttribute("value", "nofilter");
  nomiPublisher.forEach((item, index) => {
    document
      .querySelector("div.container + select")
      .appendChild(document.createElement("option"));
    document
      .querySelector("div.container + select option:last-child")
      .setAttribute("value", `${index + 1}`);
    document.querySelector(
      "div.container + select option:last-child"
    ).textContent = `${item}`;
    document
      .querySelector("div.container + select option:last-child")
      .setAttribute("id", `${index + 1}`);
  });
  //const selection = document.querySelector("div.container select");

  //selection.classList.add("selection");
  // selection.style.alignSelf = "flex-end";
  const ctx = document.getElementById("myChart2").getContext("2d");

  const myChart2 = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dateMensili,
      datasets: [
        {
          label: "Numero di articoli",
          data: [],
          backgroundColor: ["rgba(255, 255, 255, 0.2)"],
          borderColor: ["rgba(255, 255, 255, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          ticks: {
            color: "#fff",
          },
        },
        y: {
          ticks: {
            color: "#fff",
          },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#fff",
          },
        },
      },
    },
  });

  document
    .querySelector("div.container + select")
    .addEventListener("change", async (e) => {
      mesi = [];
      if (e.target.value === "nofilter") {
        myChart2.data.datasets[0].data = [];
        myChart2.update();
      } else {
        const fetchDate = `${oggi.getFullYear()}${(
          "0" +
          (oggi.getMonth() + 1)
        ).slice(-2)}${("0" + oggi.getDate()).slice(-2)}`;

        const url = `https://api.spaceflightnewsapi.net/v3/articles?newsSite=${e.target.value}&publishedAt_gt=${fetchDate}&_limit=5000`;
        const fetchiamo = await fetch(url);
        const fetched = await fetchiamo.json();
        const contatoreMesi = new Date();

        for (let i = 0; i < 12; i++) {
          let contatore = 0;

          fetched.forEach((element) => {
            const publishedAt = new Date(element.publishedAt);
            let year = publishedAt.getFullYear();
            let month = publishedAt.getMonth();

            if (
              year == contatoreMesi.getFullYear() &&
              month == contatoreMesi.getMonth()
            ) {
              contatore++;
            }
          });

          contatoreMesi.setMonth(contatoreMesi.getMonth() - 1);

          mesi.unshift(contatore);
        }

        myChart2.data.datasets[0].data = [...mesi];
        myChart2.update();
      }
    });
}
articoliPerMese();
