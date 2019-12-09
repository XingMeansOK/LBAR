function test_1() {
    var loader = new THREE.GLTFLoader();
    
    loader.load( './Flamingo.glb', function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var s = 0.035;
        mesh.scale.set( s, s, s );
        mesh.position.x = 45;
        mesh.rotation.y = - 1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        store.scene.add( mesh );
        var mixer = new THREE.AnimationMixer( mesh );
        mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
        store.mixers.push( mixer );
        
    } );
}

