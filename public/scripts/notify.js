document.addEventListener("DOMContentLoaded", function () {
  const options = {
    temperature: ["Temperatura", ["É maior que", "É menor que"]],
    humidity: ["Umidade", ["Umidade crítica", "Umidade Baixa", "Umidade Alta"]],
    rain: ["Chuva", ["Sem chuva", "Sereno", "Chuva Moderada", "Chuva Forte"]],
    qoa: ["Qualidade do Ar", ["Boa", "Ruim", "Muito Ruim"]],
    smoke: ["Presença de Fumaça", ["Moderada", "Forte", "Critica"]],
  };

  const selectMain = document.getElementById("mainSelect");
  const selectSub = document.getElementById("subSelect");
  const tempInput = document.getElementById("tempInput");
  const valueTemp = document.getElementById("valueTemp");

  selectMain.addEventListener("change", function () {
    const selectedValue = selectMain.value;
    selectSub.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecionar";
    selectSub.appendChild(defaultOption);

    if (options[selectedValue]) {
      options[selectedValue][1].forEach((option) => {
        let opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        selectSub.appendChild(opt);
      });
    }

    if (selectedValue == "temperature") {
      valueTemp.classList.remove("hidden");
      tempInput.setAttribute("required", "true");
    } else {
      valueTemp.classList.add("hidden");
      tempInput.removeAttribute("required");
    }
  });
});
