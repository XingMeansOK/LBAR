        //解析定位结果
        function locationComplete(scene,data) {
            
            const radar = document.getElementById('radar');
         
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
                        pois.forEach(place => {
                            const latitude = place.location.lat;
                            const longitude = place.location.lng;

                            // add place icon
                            const icon = document.createElement('a-image');
                            icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
                            icon.setAttribute('name', place.name);
                            icon.setAttribute('src', 'https://raw.githubusercontent.com/XingMeansOK/GeoAR.js/master/examples/assets/map-marker.png');
                            
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
