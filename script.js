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

//OpenStreetMap
let map = L.map('map').setView([0, 118.9414], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
map.doubleClickZoom.disable();

//Layer / Marker

let markers = [];
let marker;
let group = L.layerGroup();

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
group.on("click", function(event) {
    let clickedMarker = event.layer;
    console.log(clickedMarker);
});

//Hamburger Button / Side Bar
const hamburgerButtonElement = document.querySelector("#hamburger");
const drawerElement = document.querySelector("#drawer");
const main = document.querySelector("#main");

hamburgerButtonElement.addEventListener("click", event => {
 drawerElement.classList.toggle("open");
 main.classList.toggle("open");
 event.stopPropagation();
});

//SideBar CheckBox Gempa Bumi
const gempaBumi = document.querySelector("#gempaBumi");
const checkbox = document.querySelector("input[name=gempaBumi]");

checkbox.addEventListener('change', function() {
  if (this.checked) {
    group.on('click', function(ev) {
        console.log(ev);
        });
    map.addLayer(group);
  } else {
    map.removeLayer(group);
  }
});

//popup detail
const icon = document.getElementsByClassName(".leaflet-marker-icon");
