const graphicsElements = Array.from(
  document.querySelectorAll(".graphic > canvas")
);

const graphics = new Map();

function createGraphic(element, title, labels, readings) {
  const ctx = element.getContext("2d");

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          data: readings,
          borderColor: "#006ffe",
          background: "#FFF",
          fill: false,
          // tension: 1,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 10,
            },
            autoSkip: true,
            maxTicksLimit: 7,
          },
        },
        y: {
          ticks: {
            font: {
              size: 10,
            },
            maxTicksLimit: 8,
          },
        },
      },
    },
  });
}

function updateGraphics(graphic, newLabels, newReadings) {
  graphic.data.labels = newLabels;
  graphic.data.datasets[0].data = newReadings;
  graphic.update();
}

function updateLabels(key, newValue, lastUpdate) {
  const containerEle = document.querySelector(
    `.sensorInformation[data-key='${key}']`
  );
  containerEle.querySelector(".value").innerHTML = newValue;
  containerEle.querySelector(".update > span:nth-child(2)").innerHTML =
    lastUpdate
      .toISOString()
      .split("T")
      .map((d, i) =>
        i === 0 ? d.split("-").reverse().join("/") : d.split(".")[0]
      )
      .join(" ");
}

function renderGraphics(data) {
  graphicsElements.forEach((canvas) => {
    const key = canvas.dataset.key;
    const title = canvas.dataset.title;
    const dataset = data[`${key}Data`];

    const labels = dataset.map(
      (data) =>
        new Date(data.timestamp).toISOString().split("T")[1].split(".")[0]
    );

    const readings = dataset.map((data) => data.value);

    if (!graphics.has(key)) {
      graphics.set(key, createGraphic(canvas, title, labels, readings));
      return;
    }

    updateGraphics(graphics.get(key), labels, readings);
    updateLabels(
      key,
      readings[readings.length - 1],
      new Date(dataset[dataset.length - 1].timestamp)
    );
  });
}

async function getData() {
  try {
    const response = await fetch("/api/query");
    const data = await response.json();
    renderGraphics(data.sensorData);
  } catch (error) {
    console.error(error.message);
  }
}

renderGraphics(sensorData);

setInterval(getData, 1000 * 60);
