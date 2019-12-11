function test_0() {
    var loader = new THREE.GLTFLoader();
    
    // 75KB
    
    loader.load( 'https://xingmeansok.github.io/LBAR/models/Flamingo.glb', function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var s = 0.25;
        mesh.scale.set( s, s, s );
        mesh.position.x = 45;
        mesh.position.z = 25;
        mesh.rotation.y = - 1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        store.scene.add( mesh );
        var mixer = new THREE.AnimationMixer( mesh );
        mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
        store.mixers.push( mixer );
        
    } );
}

function test_1() {
    var loader = new THREE.GLTFLoader();
    
    // 75KB
    
    loader.load( 'https://xingmeansok.github.io/LBAR/models/Flamingo.glb', function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var s = 0.25;
        mesh.scale.set( s, s, s );
        mesh.rotation.y = - 1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        for(let i = 0; i < 500; i++) {
            let meshClone = mesh.clone();
            meshClone.position.x =Math.random()*1000 -500;
            meshClone.position.y =Math.random()*1000 - 500;
            meshClone.position.z =Math.random()*1000 - 500;
            
            store.scene.add( meshClone );
            let mixer = new THREE.AnimationMixer( meshClone );
            mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
            store.mixers.push( mixer );
        }
        
    } );
}

function test_2() {
    var loader = new THREE.GLTFLoader();
    
    // 1.6M
    
    loader.load( 'https://xingmeansok.github.io/LBAR/models/ferrari.glb', function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var s = 0.25;
        mesh.scale.set( s, s, s );
        mesh.position.x = 45;
        mesh.position.z = 25;
        mesh.rotation.y = - 1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        store.scene.add( mesh );
        var mixer = new THREE.AnimationMixer( mesh );
        mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
        store.mixers.push( mixer );
        
    } );
}

function test_3() {
    var loader = new THREE.GLTFLoader();
    
    // 3.94M
    
    loader.load( 'https://xingmeansok.github.io/LBAR/models/LittlestTokyo.glb', function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var s = 0.25;
        mesh.scale.set( s, s, s );
        mesh.position.x = 45;
        mesh.position.z = 25;
        mesh.rotation.y = - 1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        store.scene.add( mesh );
        var mixer = new THREE.AnimationMixer( mesh );
        mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
        store.mixers.push( mixer );
        
    } );
}
