function renderGraphic(element, dataset, title) {
  const labels = dataset.map(
    (data) => new Date(data.timestamp).toISOString().split("T")[1].split(".")[0]
  );

  const readings = dataset.map((data) => data.value);

  const ctx = element.getContext("2d");

  new Chart(ctx, {
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

const graphics = Array.from(document.querySelectorAll(".graphic > canvas"));

graphics.forEach((graphic) => {
  const key = graphic.dataset.key;
  const title = graphic.dataset.title;
  const dataset = sensorData[`${key}Data`];

  console.log({ key, dataset });

  renderGraphic(graphic, dataset, title);
});
