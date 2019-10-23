window.onload = () => {
    const scene = document.querySelector('a-scene');
    var count = 0;
    const positionIndicator = document.getElementById("positionIndicator"); // 显示坐标
    
    if (!navigator.geolocation) {
        positionIndicator.innerHTML = "Geolocation is not supported by this browser.";
    } else {
        positionIndicator.innerHTML = "loading...";
        
        var map = new AMap.Map('container', {
            resizeEnable: false
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
            geolocation.getCurrentPosition(function(status,result){
                if(status=='complete'){
                    locationComplete(result)
                }else{
                    onError(result)
                }
            });
        });
        //解析定位结果
        function locationComplete(data) {
            positionIndicator.innerHTML='定位成功'
            var str = [];
            str.push('定位结果：' + data.position);
            str.push('定位类别：' + data.location_type);
            if(data.accuracy){
                 str.push('精度：' + data.accuracy + ' 米');
            }//如为IP精确定位结果则没有精度信息
            str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
            positionIndicator.innerHTML += str.join('<br>');
            
         
            AMap.service(["AMap.PlaceSearch"], function() {
                //构造地点查询类
                var placeSearch = new AMap.PlaceSearch({ 
                    type: '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施', // 兴趣点类别
                });

                var cpoint = data.position; //中心点坐标
                placeSearch.searchNearBy('', cpoint, 2000, function(status, result) {
                    if(status=='complete'){
                        let pois = result.poiList.pois
                        let names = pois.map( poi => poi.name )
                        positionIndicator.innerHTML += '<br>'+ names.join('<br>');
                        pois.forEach(place => {
                            const latitude = place.location.lat;
                            const longitude = place.location.lng;

                            // add place icon
                            const icon = document.createElement('a-image');
                            icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
                            icon.setAttribute('name', place.name);
                            icon.setAttribute('src', './map-marker.png');
                            
                            // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
                            icon.setAttribute('scale', '200, 200');

                            icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));

                            const clickListener = function(ev) {
                                ev.stopPropagation();
                                ev.preventDefault();

                                const name = ev.target.getAttribute('name');

                                const el = ev.detail.intersection && ev.detail.intersection.object.el;

                                if (el && el === ev.target) {
                                    const label = document.createElement('span');
                                    const container = document.createElement('div');
                                    container.setAttribute('id', 'place-label');
                                    label.innerText = name;
                                    container.appendChild(label);
                                    document.body.appendChild(container);

                                    setTimeout(() => {
                                        container.parentElement.removeChild(container);
                                    }, 1500);
                                }
                            };

                            icon.addEventListener('click', clickListener);

                            scene.appendChild(icon);
                            
                            // const qiu = document.createElement('a-sphere');
                            // qiu.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
                            // qiu.setAttribute('name', place.name);
                            // qiu.setAttribute('radius', '25');
                            // qiu.setAttribute('color', "#EF2D5E");
                            // scene.appendChild(qiu);
                        })
                    }else{

                    }
                });
            });
        }
        //解析定位错误信息
        function onError(data) {
            document.getElementById('status').innerHTML='定位失败'
            document.getElementById('result').innerHTML = '失败原因排查信息:'+data.message;
        }
        
    }
};
