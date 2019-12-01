/**
 * 获取航空次序欧拉角
 *
 * @param {Event} event
 * @returns {Array}
 */
function getTaitBryanAngles (event) {

    if (event.alpha !== null) {
        if (event.absolute === true || event.absolute === undefined) {
            
            let yaw,pitch,roll;

            let alpha = event.alpha;
            let beta = event.beta;
            let gamma = event.gamma;
            // Convert degrees to radians
            var alphaRad = alpha * (Math.PI / 180);
            var betaRad = beta * (Math.PI / 180);
            var gammaRad = gamma * (Math.PI / 180);

            // Calculate equation components
            var cA = Math.cos(alphaRad);
            var sA = Math.sin(alphaRad);
            var cB = Math.cos(betaRad);
            var sB = Math.sin(betaRad);
            var cG = Math.cos(gammaRad);
            var sG = Math.sin(gammaRad);

            // 代表相机朝向的向量v坐标, 相比于论文符号都省略了‘
            var vX = - cA * sG - sA * sB * cG; // x
            var vY = - sA * sG + cA * sB * cG; // y
            var vZ = - cB * cG; // z

            var vXY = Math.sqrt(vX * vX + vY * vY); // 水平面（XY平面）投影

            // u
            var uX = - cB * sA;
            var uY = cA * cB;
            var uZ = sB;

            // u0
            var u0X = - vZ / vXY * vX;
            var u0Y = - vZ / vXY * vY;
            var u0Z = vXY;

            // Calculate compass heading (yaw)
            yaw = Math.atan(vX / vY);
            // pitch
            pitch = Math.atan(vZ / vXY);
            // roll
            var ab = uX*u0X + uY*u0Y + uZ*u0Z;
            var a = Math.sqrt(uX * uX + uY * uY + uZ * uZ);
            var b = Math.sqrt(u0X * u0X + u0Y * u0Y + u0Z * u0Z);
            roll = Math.acos(ab/(a*b));

            var xz = u0X * uY - uX * u0Y // 叉乘得到的向量z
            roll = xz * vZ > 0 ? roll : -roll; // 如果叉乘向量和v方向相同，那么就是顺时针转

            // Convert from half unit circle to whole unit circle
            if (vY < 0) {
                yaw += Math.PI;
            } else if (vX < 0) {
                yaw += 2 * Math.PI;
            }

            // Convert radians to degrees
            yaw *= 180 / Math.PI;
            pitch *= 180 / Math.PI;
            roll *= 180 / Math.PI;
            
            return [yaw, pitch, roll];
        } else {
            console.warn('event.absolute === false');
        }
    } else {
        console.warn('event.alpha === null');
    }
}




