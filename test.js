function test_0() {
    var loader = new THREE.GLTFLoader();
    
    // 75KB
    
    loader.load( 'https://xingmeansok.github.io/LBAR/models/Flamingo.glb', function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var s = 0.25;
        mesh.scale.set( s, s, s );
        mesh.rotation.y = - 1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        for(let i = 0; i < 2800; i++) {
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

function test_1() {
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

function test_2() {
    var loader = new THREE.GLTFLoader();
    
    // 3.57M shark
    
    loader.load( 'https://xingmeansok.github.io/LBAR/models/shark/scene.gltf', function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var s = 0.075;
        mesh.scale.set( s, s, s );
        mesh.position.x = 5;
        mesh.position.y = -3;
        mesh.position.z = 5;
        mesh.rotation.z = -1.25;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        store.scene.add( mesh ); 
        
    } );
}


function test_3() {
    var loader = new THREE.GLTFLoader();
    
    // 14.8M 宇航员
    
    loader.load( 'https://xingmeansok.github.io/LBAR/models/spaceman/scene.gltf', function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var s = 0.75;
        mesh.scale.set( s, s, s );
        mesh.position.x = 5;
        mesh.position.y = -1;
        mesh.position.z = 5;
        mesh.rotation.z = -1.25;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        store.scene.add( mesh ); 
        
    } );
}

function test_4() {
    var loader = new THREE.GLTFLoader();
    
    // 9.09M DNA
    
    loader.load( 'https://xingmeansok.github.io/LBAR/models/DNA/scene.gltf', function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var s = 0.75;
        mesh.scale.set( s, s, s );
        mesh.position.x = 25;
        mesh.position.y = -1;
        mesh.position.z = 15;
        mesh.rotation.z = -1.25;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        store.scene.add( mesh ); 
        
    } );
}

function test_5() {
    var loader = new THREE.GLTFLoader();
    
    // 15.9M race  
    loader.load( 'https://xingmeansok.github.io/LBAR/models/race/scene.gltf', function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var s = 0.25;
        mesh.scale.set( s, s, s );
        mesh.position.x = 25;
        mesh.position.y = -10;
        mesh.position.z = 10;
        mesh.rotation.z = -2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        store.scene.add( mesh ); 
        
    } );
}

function test_6() {
    var loader = new THREE.GLTFLoader();
    
    // 21M crab
    loader.load( 'https://xingmeansok.github.io/LBAR/models/crab/scene.gltf', function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var s = 0.05;
        mesh.scale.set( s, s, s );
        mesh.position.x = 2;
        mesh.position.y = -1;
        mesh.position.z = 1.5;
        mesh.rotation.z = 0;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        store.scene.add( mesh ); 
        
    } );
}

function test_7() {
    var loader = new THREE.GLTFLoader();
    
    // 4.02M island
    loader.load( 'https://xingmeansok.github.io/LBAR/models/island/scene.gltf', function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var s = 0.000075;
        mesh.scale.set( s, s, s );
        mesh.position.x = 2;
        mesh.position.y = -0.5;
        mesh.position.z = 0;
        mesh.rotation.z = 0;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        store.scene.add( mesh ); 
        
    } );
}
