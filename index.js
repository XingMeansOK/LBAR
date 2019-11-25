window.onload = () => {
    const scene = document.querySelector('a-scene');

    handleOrientation();
    
 
    if (!navigator.geolocation) {
        // 如果不支持定位
    } else {

        var map = new AMap.Map('mapcontainer', {
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
            geolocation.getCurrentPosition(function(status,result){
                if(status=='complete'){
                    // 初始化POI
                    locationComplete(scene,result)
                    
                }else{
                    onError(result)
                }
            });
        });

        
    }
};
