// 全局变量
const store = {
    yaw: 0, // 移动设备的航空次序欧拉角
    pitch: 0,
    roll: 0,
    originCoords: null,//虚拟坐标原点经纬度
    poi: [],
    scene: null, // three场景
    camera: null, // three相机
    renderer: new THREE.WebGLRenderer({alpha: true,antialias: true}), // trree渲染器
    videoTack: null, // 后置摄像头视频流
    eventName: getDeviceOrientationEventName(), // 设备姿态变换事件名称
    VAOV: 2*Math.atan(18/27)*180/Math.PI, // 相机竖直视角
    constraints: { // 视频流限制条件
        audio: false, 
        video: { 
            facingMode: { exact: "environment" },
            // aspectRatio:1440/3120,
            aspectRatio: { exact: window.innerHeight/window.innerWidth }, // 高！！宽！！比

            width: { ideal: 800 },
            height: { ideal: 400 },
        } 
    },
    mixers: [], // 动画集合
    textlabels: [],
    selectedObject: null, // 选中的虚拟物体
    record: [],// 实验记录
}

// isSafari();


/**
 * Get device orientation event name, depends on browser implementation.
 * @returns {string} event name
 */
function getDeviceOrientationEventName () {
    if ('ondeviceorientationabsolute' in window) {
        var eventName = 'deviceorientationabsolute'
    } 
    else if ('ondeviceorientation' in window) {
        var eventName = 'deviceorientation'
    } else {
        var eventName = ''
        console.error('Compass not supported')
    }

    return eventName
}

function isSafari(){
        // if Safari
    if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
        // iOS 13+
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            var handler = function() {
                console.log('Requesting device orientation permissions...')
                DeviceOrientationEvent.requestPermission();
                document.removeEventListener('touchend', handler);
            };

            document.addEventListener('touchend', function() { handler() }, false);

            alert('After camera permission prompt, please tap the screen to active geolocation.');
        } else {
            var timeout = setTimeout(function () {
                alert('Please enable device orientation in Settings > Safari > Motion & Orientation Access.')
            }, 750);
            window.addEventListener(eventName, function () {
                clearTimeout(timeout);
            });
        }
    }
}
