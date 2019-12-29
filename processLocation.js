const locationComplete = (function() {
    
    var DIST = 20; // 更新POI的最短距离
    var FIELD = 75; // 最大可视距离
    
    // 当前位置
    var cpoint = null; //查询POI的中心点坐标
    
    var geometry = new THREE.CylinderGeometry(4, 0, 10, 4, 1);
    
    // 查询POI
    function searchPOI() {
        AMap.service(["AMap.PlaceSearch"], function() {
            
            //构造地点查询类
            var placeSearch = new AMap.PlaceSearch({ 
                type: '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施', // 兴趣点类别
            });
            placeSearch.searchNearBy('', cpoint, 75, function(status, result) {
                if(status=='complete'){
                    let pois = result.poiList.pois
                    let names = pois.map( poi => poi.name )
                    const originCoords = {longitude:cpoint.getLng(),latitude:cpoint.getLat()};
               
                    pois.forEach(place => {
                        const currentCoords = {longitude:place.location.lng,latitude:place.location.lat};
                        const position = calcVirtualPosition(originCoords, currentCoords);
                        
                        var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                        var mesh = new THREE.Mesh( geometry, material );
                        mesh.position.set(position.x, position.y, position.z);        
                        
                        mesh.updateMatrix();
                        mesh.matrixAutoUpdate = false;
                        
                        // poi 的label（HTML）
                        var text = createTextLabel();
                        text.setHTML(place);
                        text.setParent(mesh);
                        store.textlabels.push(text);
                        store.container.appendChild(text.element);
                        
                        store.scene.add( mesh );
                        store.poi.push( mesh );
                    })
                }else{

                }
            });
        });
    }
    
    function createTextLabel() {
        var div = document.createElement('div');
        div.className = 'text-label';
        div.style.position = 'absolute';
        div.style.width = 100;
        div.style.height = 100;
        div.innerHTML = "hi there!";
        div.style.top = -1000;
        div.style.left = -1000;

        return {
            element: div,
            parent: false,
            position: new THREE.Vector3(0,0,0),
            setHTML: function(html) {
                this.element.innerHTML = `<div>${html.name}</div><div>${html.address}</div><div>距离${html.distance}m</div>`;
            },
            setParent: function(threejsobj) {
                this.parent = threejsobj;
            },
            updatePosition: function() {
                if(parent) {
                    this.position.copy(this.parent.position);
                    let t1 = new THREE.Vector3(),t2 = new THREE.Vector3();
                    t1.copy(this.parent.position);
                    t1.sub(store.camera.position);// 相机到poi的向量
                    this.distance = t1.length(); // 当前相机到poi的距离
                    store.camera.getWorldDirection(t2);// 相机朝向


                    if (t1.angleTo(t2) > Math.PI/2) {
                        // 在视野外了
                        this.element.style.visibility = 'hidden';
                        return;
                    }else {
                        this.element.style.visibility = 'visible';
                    }
                }


                var coords2d = this.get2DCoords(this.position, store.camera);
                this.element.style.left = coords2d.x + 'px';
                this.element.style.top = coords2d.y - 3*(FIELD - this.distance) + 'px'; // 越近位置越高，越远越低(接近地平线)
                this.element.style.transform = `scale(${0.1*(FIELD/this.distance)+1}) rotateZ(${-store.roll}deg) translate(-50%,-50%) translateZ(0) `;
                // translateY,越远的离地平线越近
                // scale 越近的越大
                if(coords2d.x < (window.innerWidth/2 + 25) && coords2d.x > (window.innerWidth/2 - 2)) {
                    this.element.style.zIndex = 1000; // 如果POI在视图的中心，就把他放在最上层
                    this.element.style.opacity = 1;
                } else {
                    this.element.style.zIndex = Math.round(FIELD - this.distance); // 越近的在越上层
                    this.element.style.opacity = 0.75;
                }
                this.element.children[2].innerHTML = `距离${Math.round(this.distance)}m`;

            },
            get2DCoords: function(position, camera) {
                var vector = position.project(camera);
                vector.x = (vector.x + 1)/2 * window.innerWidth;
                vector.y = -(vector.y - 1)/2 * window.innerHeight;
                return vector;
            }
        };
    }
    
    // 定位成功后调用
    return function(data) {
        // api返回的坐标
        cpoint = data.position; //中心点坐标
        const currentCoords = {longitude:cpoint.getLng(),latitude:cpoint.getLat()};
        if(!store.originCoords) { // 如果是初次定位
            store.originCoords = currentCoords;
            searchPOI();
        } else { // 更新定位的情况
            // 物理相机在当前虚拟坐标系内的坐标
            var position = calcVirtualPosition(store.originCoords, currentCoords);
            // 与虚拟坐标系原点的距离
            const dist = Math.sqrt(position.x*position.x + position.z*position.z);
            if(dist > DIST) { // 走出去一定距离了，重新查询poi
                // store.originCoords = currentCoords;
                // store.camera.position.set(0, 0, 0); // 虚拟坐标系原点挪到当前位置
                // 清空poi (three Object3D)
                store.poi.forEach( poi => {
                    store.scene.remove(poi);
                })
                store.poi.length = 0;
                // 清空poi label (html)
                store.textlabels.forEach( text => {
                    store.container.remove(text.element);
                })
                store.textlabels.length = 0;
                
                searchPOI();
            } else { // 走不远，只更新虚拟相机虚拟坐标
                store.camera.position.set(position.x, position.y, position.z)
                // 使poi的label跟随poi，并始终保持水平
                for(let i = 0; i<store.textlabels.length; i++) {
                    store.textlabels[i].updatePosition();
                }
            }
        }
        
        // 留下定位标记
        if(position) {
            
            let record = {};
            record.timestamp=new Date().getTime();
            record.yaw = store.yaw;
            record.pitch = store.pitch;
            record.roll = store.roll;
            record.position = position;
            record.gps = data
            
            store.record.push(record);
            
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

const getIntersects = (function(){
    var mouseVector = new THREE.Vector3();
    var raycaster = new THREE.Raycaster();
    return function ( x, y ) {
        x = ( x / window.innerWidth ) * 2 - 1;
        y = - ( y / window.innerHeight ) * 2 + 1;
        mouseVector.set( x, y, 0.95 );
        raycaster.setFromCamera( mouseVector, store.camera );
        return raycaster.intersectObject( store.scene, true );
    }
})()

function onDocumentTouchEnd(event) {
    event.preventDefault();
    if ( store.selectedObject ) {
        selectedObject.material.color.set( '#69f' );
        selectedObject = null;
    }
    const touch = event.changedTouches[0]
    var intersects = getIntersects( touch.pageX, touch.pageY );
    if ( intersects.length > 0 ) {
        var res = intersects.filter( function ( res ) {
            return res && res.object;
        } )[ 0 ];
        if ( res && res.object ) {
            selectedObject = res.object;
            selectedObject.material.color.set( '#f00' );
        }
    }
}









