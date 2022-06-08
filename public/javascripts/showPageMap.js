mapboxgl.accessToken = mapToken; //this map object gets populated on each campground in 'shows.ejs'
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    //center: [-119.5383, 37.8651], --testing to make sure it's not the object's issue.
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        //shows name of the campground when you click on the marker 
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h4>${campground.title}</h4><p>${campground.location}</p>`
        )
    )
    .addTo(map);