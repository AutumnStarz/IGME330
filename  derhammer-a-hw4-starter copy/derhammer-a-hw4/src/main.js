import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let geojson;
let favoriteIds = storage.readFromLocalStorage("favoriteIds") || ["p20", "p79", "p180", "p43"];
let currentParkId; //var to hold current id sp it can be used to favorite or delete


// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatNYS);
	}

	// NYS isometric view
	document.querySelector("#btn2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45, 0);
		map.flyTo(lnglatNYS);
	}

	// World zoom 0
	document.querySelector("#btn3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatUSA);
	}

	refreshFavorites();

	document.querySelector("#fav-btn").addEventListener("click", favoritePark);
    document.querySelector("#delete-btn").addEventListener("click", deleteFavorite);

	//grab the park markers to add event listener to check what park is clicked and grab its id
	//so we can stpore it in the currentParkId variable and use it to favorite or delete
	const parkMarkers = document.querySelectorAll('.poi');
    parkMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const parkId = marker.id;
            currentParkId = parkId;
            console.log("Current park ID:", currentParkId);
        });
    });

}

//favorite park
const favoritePark = () => {
    if (currentParkId) {
        if (!favoriteIds.includes(currentParkId)) {
            favoriteIds.push(currentParkId);
			storage.writeToLocalStorage("favoriteIds", favoriteIds); //save to local storage
            refreshFavorites();
        }
    }
}

//delete favorite
const deleteFavorite = () => {
    if (currentParkId) {
        const index = favoriteIds.indexOf(currentParkId);
        if (index !== -1) {
            favoriteIds.splice(index, 1);
			storage.writeToLocalStorage("favoriteIds", favoriteIds); //save chnanges to local storage
            refreshFavorites();
        }
    }
}

const refreshFavorites = () => {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	for (const id of favoriteIds){
		favoritesContainer.appendChild(createFavoriteElement(id));
	}
}



const createFavoriteElement = (id) => {
	const feature = getFeatureById(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () =>{
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	}
	a.innerHTML = `
		<span class="panel-icon">
			<i class - "fas fa-map-pin"></i>
		</span>
		${feature.properties.title}
	`;
	return a;
}

const getFeatureById = (id) => {
	return geojson.features.find(feature => feature.id === id);
}

const showFeatureDetails = (id) => {
	console.log(`showFeatureDetails - id=${id}`);
	const feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
	
	const details = `
		<p><b>Address</b>: ${feature.properties.address}</p>
		<p><b>Phone</b>: <a href = "tel:${feature.properties.phone}">${feature.properties.phone}</a></p>
		<p><b>Website</b>: <a href="${feature.properties.url}" target="_blank">${feature.properties.url}</a></p>
	`;
	document.querySelector("#details-2").innerHTML = details;

	const description = feature.properties.description;
	document.querySelector("#details-3").innerHTML = description;

};

const init = () => {
	map.initMap(lnglatNYS);
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	});

};

init();