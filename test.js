function test_1() {
    var geometry = new THREE.BoxGeometry( 10, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(5,0,0);
    cube.rotateY(Math.PI/2);
    store.scene.add( cube );
}
