import * as THREE from "../../node_modules/three/build/three.module.js";
import WoodBox from "./WoodBox.js";
import Viewport from "../../node_modules/three-viewport/dist/viewport.es.js";
import ExtendedDomEvents from "../../node_modules/three-domevents/dist/extdomevents.es.js";
import DragControl from "../../src/DragControl.js";


    let VP = new Viewport();
   

    VP.init();
    VP.start();

    
    //VP.disableControl();

   let DEH = new ExtendedDomEvents( VP.camera, VP.renderer.domElement );
   let DC = new DragControl( DEH );

   DEH.activate( VP.scene );

    VP.camera.position.z = 400;

    let mesh = new WoodBox();
    DC.enableDraggable( mesh, "xz" );
    
    mesh.addEventListener("click", function( ev ){
        console.log( "click", ev );
        if ( DC.isDraggable(mesh) ){
            DC.disableDraggable( mesh, "xz" );
        } else {
            DC.enableDraggable( mesh, "xz" );
        }
        
    });

    mesh.addEventListener("mousedown", function( ev ){
        console.log( "mousedown", ev );
    });
    mesh.addEventListener("mouseup", function( ev ){
        console.log( "mouseup", ev );
    });

    let mesh2 = new WoodBox();
    DC.enableDraggable( mesh2, "cam" );
    mesh2.position.set(110, 0, 110);

    mesh.addEventListener("click", function( ev ){
        console.log( "click", ev );
    });

    let floor = new THREE.Mesh( new THREE.BoxGeometry( 400 ,1, 400), new THREE.MeshStandardMaterial() );
    floor.position.set(0,-50,0);

    VP.scene.add( floor );
    VP.scene.add( mesh );
    VP.scene.add( mesh2 );
