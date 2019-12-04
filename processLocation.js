const locationComplete = (function() {
    
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    
    var DIST = 20; // 更新POI的最短距离
    
    // 当前位置
    var cpoint = null; //查询POI的中心点坐标
    
    // 查询POI
    function searchPOI() {
        AMap.service(["AMap.PlaceSearch"], function() {
            
            //构造地点查询类
            var placeSearch = new AMap.PlaceSearch({ 
                type: '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施', // 兴趣点类别
            });
            placeSearch.searchNearBy('', cpoint, 2000, function(status, result) {
                if(status=='complete'){
                    let pois = result.poiList.pois
                    let names = pois.map( poi => poi.name )
                    const originCoords = {longitude:cpoint.getLng(),latitude:cpoint.getLat()};
                    pois.forEach(place => {
                        const currentCoords = {longitude:place.location.lng,latitude:place.location.lat};
                        const position = calcVirtualPosition(originCoords, currentCoords);

                        var cube = new THREE.Mesh( geometry, material );
                        cube.position.set(position.x, position.y, position.z);
                        store.scene.add( cube );
                        store.poi.push( cube );
                    })
                }else{

                }
            });
        });
    }
    
    return function(data) {
        // api返回的坐标
        cpoint = data.position; //中心点坐标
        const currentCoords = {longitude:cpoint.getLng(),latitude:cpoint.getLat()};
        if(!store.originCoords) { // 如果是初次定位
            store.originCoords = currentCoords;
            searchPOI();
        } else { // 更新定位的情况
            // 物理相机在当前虚拟坐标系内的坐标
            const position = calcVirtualPosition(store.originCoords, currentCoords);
            // 与虚拟坐标系原点的距离
            const dist = Math.sqrt(position.x*position.x + position.z*position.z);
            if(dist > DIST) { // 走出去一定距离了，重新查询poi
                store.originCoords = currentCoords;
                store.camera.position.set(0, 0, 0); // 虚拟坐标系原点挪到当前位置
                // 清空poi
                store.poi.forEach( poi => {
                    store.scene.remove(poi);
                })
                store.poi.length = 0;
                searchPOI();
            } else { // 走不远，只更新虚拟相机虚拟坐标
                store.camera.position.set(position.x, position.y, position.z)
            }
        }
        

    }
})()

//解析定位错误信息
function onError(data) {
    document.getElementById('status').innerHTML='定位失败'
    document.getElementById('result').innerHTML = '失败原因排查信息:'+data.message;
}

/**
     * Returns distance in meters between source and destination inputs.
     *
     *  Calculate distance, bearing and more between Latitude/Longitude points
     *  Details: https://www.movable-type.co.uk/scripts/latlong.html
     *
     * @param {Position} src
     * @param {Position} dest
     * @param {Boolean} isPlace
     *
     * @returns {number} distance
     */
function computeDistanceMeters (src, dest, isPlace) {
    var dlongitude = THREE.Math.degToRad(dest.longitude - src.longitude);
    var dlatitude = THREE.Math.degToRad(dest.latitude - src.latitude);

    var a = (Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2)) + Math.cos(THREE.Math.degToRad(src.latitude)) * Math.cos(THREE.Math.degToRad(dest.latitude)) * (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = angle * 6378160;

    // if function has been called for a place, and if it's too near and a min distance has been set,
    // set a very high distance to hide the object
    if (isPlace && this.data.minDistance && this.data.minDistance > 0 && distance < this.data.minDistance) {
        return Number.MAX_SAFE_INTEGER;
    }

    return distance;
}
    
function calcVirtualPosition(originCoords,currentCoords) {
    var position = {
        x: 0,
        y: 0,
        z: 0
    }
    // compute position.x
    var dstCoords = {
        longitude: currentCoords.longitude,
        latitude: originCoords.latitude,
    };
    position.x = computeDistanceMeters(originCoords, dstCoords);
    position.x *= currentCoords.longitude > originCoords.longitude ? 1 : -1;

    // compute position.z
    var dstCoords = {
        longitude: originCoords.longitude,
        latitude: currentCoords.latitude,
    }
    position.z = computeDistanceMeters(originCoords, dstCoords);
    position.z *= currentCoords.latitude > originCoords.latitude ? -1 : 1;
    
    return position;
}

function processLocation(mapcontainer) {
    if (!navigator.geolocation) {
    // 如果不支持定位
    } else {
        var map = new AMap.Map(mapcontainer, {
            resizeEnable: false,
            // pitch:75, // 地图俯仰角度，有效范围 0 度- 83 度
            // viewMode:'3D' // 地图模式
        });
        AMap.plugin('AMap.Geolocation', function() {
            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：5s
                buttonPosition:'RB',    //定位按钮的停靠位置
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: false,   //定位成功后是否自动调整地图视野到定位点

            });
            map.addControl(geolocation);
            
            // 间隔一段时间检测位置变化
            setInterval(function(){ 
                geolocation.getCurrentPosition(function(status,result){
                    if(status=='complete'){
                        // 初始化POI
                        locationComplete(result);
                    }else{
                        onError(result);
                    }
                });
            }, 2000);

        });


    }
}





