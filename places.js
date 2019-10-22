const loadPlaces = function(coords) {
    // COMMENT FOLLOWING LINE IF YOU WANT TO USE STATIC DATA AND ADD COORDINATES IN THE FOLLOWING 'PLACES' ARRAY
    const method = 'api';

    const PLACES = [
        {
            name: "Your place name",
            location: {
                lat: 0, // add here latitude if using static data
                lng: 0, // add here longitude if using static data

            }
        },
    ];

    if (method === 'api') {
        return loadPlaceFromAPIs(coords);
    }

    return Promise.resolve(PLACES);
};

// getting places from REST APIs
function loadPlaceFromAPIs(position) {
  
    var placeSearch = new AMap.PlaceSearch({});
    var cpoint = [116.405467, 39.907761]; //中心点坐标
    placeSearch.searchNearBy('', cpoint, 200, function(status, result) {

    });
    
    // 定位

    const params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'HZIJGI4COHQ4AI45QXKCDFJWFJ1SFHYDFCCWKPIJDWHLVQVZ',
        clientSecret: '',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};


window.onload = () => {
    const scene = document.querySelector('a-scene');
    var count = 0;
    const positionIndicator = document.getElementById("positionIndicator"); // 显示坐标
    var id; // 位置watcher 的id
    const options = {
        // maximumAge:0,//不使用缓存位置，必须获取当前真实值
        enableHighAccuracy: true, // 使用高精度位置
        // enableHighAccuracy: false,
    }
    
    if (!navigator.geolocation) {
        positionIndicator.innerHTML = "Geolocation is not supported by this browser.";
    } else {
        positionIndicator.innerHTML = "loading...";
        navigator.geolocation.getCurrentPosition(success, error, options);
        id = navigator.geolocation.watchPosition(success, error, options);
        // setInterval(navigator.geolocation.getCurrentPosition, 100, success, error, options);
        setInterval(gps, 300);
    }
    
    function gps() {
        navigator.geolocation.getCurrentPosition(success, error, options);
    }
    
    // 成功获取位置的回调函数
    function success(position) {
        positionIndicator.innerHTML =
            "count: " + (++count) +
            "<br />Latitude: " + position.coords.latitude +
            "<br />Longitude: " + position.coords.longitude;
        
    }
    //失败的回调函数
    function error(error){
        positionIndicator.innerHTML =
            "count: " + (++count)
        console.warn('ERROR(' + err.code + '): ' + err.message);
    }

    //清除watch1
    // window.navigator.geolocation.clearWatch(watch1);
    


    // first get current user location
//     return navigator.geolocation.getCurrentPosition(
//         function (position) {

//             // then use it to load from remote APIs some places nearby
//             loadPlaces(position.coords)
//                 .then((places) => {
//                     places.forEach((place) => {
//                         const latitude = place.location.lat;
//                         const longitude = place.location.lng;

//                         // add place icon
//                         const icon = document.createElement('a-image');
//                         icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
//                         icon.setAttribute('name', place.name);
//                         icon.setAttribute('src', '../assets/map-marker.png');

//                         // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
//                         icon.setAttribute('scale', '20, 20');

//                         icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));

//                         const clickListener = function(ev) {
//                             ev.stopPropagation();
//                             ev.preventDefault();

//                             const name = ev.target.getAttribute('name');

//                             const el = ev.detail.intersection && ev.detail.intersection.object.el;

//                             if (el && el === ev.target) {
//                                 const label = document.createElement('span');
//                                 const container = document.createElement('div');
//                                 container.setAttribute('id', 'place-label');
//                                 label.innerText = name;
//                                 container.appendChild(label);
//                                 document.body.appendChild(container);

//                                 setTimeout(() => {
//                                     container.parentElement.removeChild(container);
//                                 }, 1500);
//                             }
//                         };

//                         icon.addEventListener('click', clickListener);

//                         scene.appendChild(icon);
//                     });
//                 })
//         },
//         (err) => console.error('Error in retrieving position', err),
//         {
//             enableHighAccuracy: true,
//             maximumAge: 0,
//             timeout: 27000,
//         }
//     );
};
