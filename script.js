//OpenStreetMap
let map = L.map('map').setView([0, 118.9414], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
map.doubleClickZoom.disable();

// BMKG API
// https://data.bmkg.go.id/
let apiUrl = 'https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json';

class DataGempa {
    static async listGempa(){
        const response = await fetch(apiUrl);
        const responseJson = await response.json();
        return responseJson.Infogempa.gempa;
    }
}
//Layer / Marker

let markers = [];
let marker;
let group = L.featureGroup();

async function MenampilkanMarkerGempa() {
    const gempa = await DataGempa.listGempa();
    let iconUrl = 'assets/image/icons/gempa.png';

    gempa.forEach((marker) => {
        let getLongLat = marker['Coordinates'];
        let split = getLongLat.split(",");
        let getLong = split[0];
        let getLat = split[1];

        let popups = `
                <h4>Gempa Bumi</h4>
                <p><strong>${marker.Wilayah}</strong></p>
                <p>Tanggal : ${marker.Tanggal}</p>
         `;

        markers.push({
            pos: [getLong, getLat],
            popup:popups
        });
    });

    markers.forEach((markerGempa) => {
        marker = L.marker(markerGempa.pos, {
            icon: L.icon({
                iconUrl: iconUrl,
                iconSize: [100, 100],
                iconAnchor: [25, 25]
            })
        })
        .addTo(group),
        popUp = new L.Popup({ autoClose: false, closeOnClick: false })
                .setContent(markerGempa.popup)
                .setLatLng(markerGempa.pos);
        marker.bindPopup(popUp);
    });
}

MenampilkanMarkerGempa();
map.addLayer(group);

// Memunculkan icon sesuai checkbox
const checkbox = document.getElementById("checkBoxEarthQuake");
checkbox.addEventListener('change', function() {
  if (this.checked) {
    map.addLayer(group);
  } else {
    map.removeLayer(group);
  }
});

//Megubah sidebar menjadi detail bencana

group.on("click", function (event) {
    detailBencana(event);
});

async function detailBencana(event) {
    const gempa = await DataGempa.listGempa();
    let clickedMarker = event.latlng;
    let iconCoordinate = clickedMarker.lat +',' + clickedMarker.lng;

    gempa.forEach((marker) => {
        let getLongLat = marker['Coordinates'];
        if (iconCoordinate == getLongLat) {
            if (body.classList.contains("sidebar-collapse")) {
                body.classList.remove("sidebar-collapse");
            }
            newSideBar.classList.add("detailSideBar");
            newSideBar.innerHTML = `
                <h2 class="header p-2">Gempa Bumi</h2>
                <hr>
                <p><strong>Tanggal:</strong> ${marker.Tanggal}</p>
                <p><strong>Jam:</strong>  ${marker.Jam}</p>
                <p><strong>DateTime:</strong> ${marker.DateTime}</p>
                <p><strong>Coordinates:</strong> ${marker.Coordinates}</p>
                <p><strong>Lintang:</strong> ${marker.Lintang}</p>
                <p><strong>Bujur:</strong> ${marker.Bujur}</p>
                <p><strong>Magnitude:</strong> ${marker.Magnitude}</p>
                <p><strong>Kedalaman:</strong> ${marker.Kedalaman}</p>
                <p><strong>Wilayah:</strong> ${marker.Wilayah}</p>
                <p><strong>Potensi:</strong> ${marker.Potensi}</p>
            `;
        }
    });
}

//Mengembalikan ke default sidebar
const defaultSideBar = document.getElementById("sidebar").innerHTML;
const newSideBar = document.getElementById("sidebar");
const body = document.getElementsByTagName("BODY")[0];
const hamburgerButton = document.getElementById("hamburgerButton");

hamburgerButton.addEventListener("click", function() {
    if (!body.classList.contains("sidebar-collapse")) {
        if (newSideBar.classList.contains("detailSideBar")) {
            newSideBar.innerHTML = defaultSideBar;
        }
    }
});