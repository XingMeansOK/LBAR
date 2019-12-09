function test_1() {
    var loader = new THREE.GLTFLoader();
    
    loader.load( './flamingo.glb', function ( gltf ) {
        var mesh = gltf.scene.children[ 0 ];
        var s = 0.35;
        mesh.scale.set( s, s, s );
        mesh.position.y = 15;
        mesh.rotation.y = - 1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        store.scene.add( mesh );
        var mixer = new THREE.AnimationMixer( mesh );
        mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
        mixers.push( mixer );
    } );
}

