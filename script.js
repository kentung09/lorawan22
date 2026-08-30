const GATEWAY_IP =
  "192.168.1.100";

const API_URL =
  `http://${GATEWAY_IP}/api/data`;


function updateClock() {

  const now = new Date();


  // JAM

  const hours =
    String(now.getHours())
      .padStart(2, "0");

  const minutes =
    String(now.getMinutes())
      .padStart(2, "0");

  const seconds =
    String(now.getSeconds())
      .padStart(2, "0");


  document
    .getElementById("clock")
    .innerText =
    `${hours}:${minutes}:${seconds}`;


  // TANGGAL

  const dateText =
    now.toLocaleDateString(
      "id-ID",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );


  document
    .getElementById("date")
    .innerText =
    dateText;
}


updateClock();


setInterval(
  updateClock,
  1000
);

const ctx =
  document
    .getElementById("weatherChart")
    .getContext("2d");


const weatherChart =
  new Chart(ctx, {

    type: "line",

    data: {

      labels: [],

      datasets: [

        {

          label: "Suhu °C",

          data: [],

          borderWidth: 2,

          tension: 0.4,

          fill: false

        },

        {

          label: "Kelembapan %",

          data: [],

          borderWidth: 2,

          tension: 0.4,

          fill: false

        }

      ]

    },

    options: {

      responsive: true,

      interaction: {

        intersect: false,

        mode: "index"

      },

      plugins: {

        legend: {

          labels: {

            color: "#94a3b8"

          }

        }

      },

      scales: {

        x: {

          ticks: {

            color: "#64748b"

          },

          grid: {

            color:
              "rgba(255,255,255,0.04)"

          }

        },

        y: {

          ticks: {

            color: "#64748b"

          },

          grid: {

            color:
              "rgba(255,255,255,0.04)"

          }

        }

      }

    }

  });

async function updateDashboard() {

  try {

    const response =
      await fetch(API_URL);


    if (!response.ok) {

      throw new Error(
        "Gateway tidak merespons"
      );

    }


    const data =
      await response.json();


    document
      .getElementById("suhu")
      .innerText =
      Number(data.temperature)
        .toFixed(1);


    document
      .getElementById("humidity")
      .innerText =
      Number(data.humidity)
        .toFixed(1);


    document
      .getElementById("pressure")
      .innerText =
      Number(data.pressure)
        .toFixed(1);


    document
      .getElementById("wind")
      .innerText =
      Number(data.windSpeed)
        .toFixed(1);


    document
      .getElementById("windDirection")
      .innerText =
      data.windDirection;


    document
      .getElementById("rainfall")
      .innerText =
      Number(data.rainfall)
        .toFixed(2);


    document
      .getElementById("rssi")
      .innerText =
      data.rssi + " dBm";

    const now =
      new Date();

    document
      .getElementById("updateTime")
      .innerText =
      now.toLocaleTimeString(
        "id-ID"
      );

    const sensorStatus =
      document
        .getElementById("sensorStatus");


    const loraStatus =
      document
        .getElementById("loraStatus");


    const systemStatus =
      document
        .getElementById("systemStatus");


    if (data.sensorOnline) {

      sensorStatus.innerText =
        "ONLINE";

      sensorStatus.className =
        "online";


      loraStatus.innerText =
        "CONNECTED";

      loraStatus.className =
        "online";


      systemStatus.innerHTML =
        '<span class="status-dot"></span>' +
        'SYSTEM ONLINE';


      systemStatus.className =
        "status online-status";

    }

    else {

      sensorStatus.innerText =
        "OFFLINE";

      sensorStatus.className =
        "offline";


      loraStatus.innerText =
        "DISCONNECTED";

      loraStatus.className =
        "offline";


      systemStatus.innerText =
        "● SENSOR OFFLINE";

      systemStatus.style.background =
        "rgba(251,113,133,.1)";

    }

    updateCondition(
      Number(data.rainfall),
      Number(data.humidity)
    );

    const waktu =
      now.toLocaleTimeString(
        "id-ID"
      );


    weatherChart
      .data
      .labels
      .push(waktu);


    weatherChart
      .data
      .datasets[0]
      .data
      .push(
        Number(data.temperature)
      );


    weatherChart
      .data
      .datasets[1]
      .data
      .push(
        Number(data.humidity)
      );


    // Maksimal 20 titik

    if (
      weatherChart.data.labels.length
      > 20
    ) {

      weatherChart
        .data
        .labels
        .shift();


      weatherChart
        .data
        .datasets[0]
        .data
        .shift();


      weatherChart
        .data
        .datasets[1]
        .data
        .shift();

    }


    weatherChart.update();

  }


  catch (error) {

    console.error(error);


    document
      .getElementById("systemStatus")
      .innerText =
      "● GATEWAY OFFLINE";


    document
      .getElementById("systemStatus")
      .style.background =
      "rgba(251,113,133,.1)";

  }

}


function updateCondition(
  rainfall,
  humidity
) {

  const condition =
    document
      .getElementById("condition");


  const icon =
    document
      .getElementById("weatherIcon");


  if (rainfall > 0) {

    condition.innerText =
      "HUJAN";

    icon.innerText =
      "🌧️";

  }

  else if (humidity >= 85) {

    condition.innerText =
      "BERAWAN";

    icon.innerText =
      "☁️";

  }

  else {

    condition.innerText =
      "CERAH";

    icon.innerText =
      "☀️";

  }

}

updateDashboard();

setInterval(
  updateDashboard,
  3000
);function logoutDashboard() {

  const konfirmasi = confirm(
    "Apakah Anda yakin ingin keluar dari dashboard?"
  );

  if (konfirmasi) {

    // Kembali ke halaman login
    window.location.href = "login.html";

  }

}