import * as THREE from "../node_modules/three/build/three.module.js";
import WoodBox from "./WoodBox.js";
import Viewport from "../node_modules/three-viewport/dist/viewport.es.js";
import Domevents from "../node_modules/three-domevents/dist/domevents.es.js";
import DragControl from "../src/DragControl.js";


    let VP = new Viewport();
   

    VP.init();
    VP.start();

    
    //VP.disableControl();

   let DEH = new Domevents( VP.camera, VP.renderer.domElement );
   let DC = new DragControl( DEH );

   DEH.activate( VP.scene );

    VP.camera.position.z = 400;

    let mesh = new WoodBox();
    DC.make( mesh );

    let floor = new THREE.Mesh( new THREE.BoxGeometry( 400 ,1, 400), new THREE.MeshStandardMaterial() );
    floor.position.set(0,-50,0);

    VP.scene.add( floor );
    VP.scene.add( mesh );
