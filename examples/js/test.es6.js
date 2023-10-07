import * as THREE from "three";
import WoodBox from "./WoodBox.js";
import Viewport from "viewport";
import { DomeventDrag, DomeventPointer, Domevents} from "domevents";

import DragControl from "../../dist/draggable.es.js";

Domevents.extend( DomeventPointer.config({emulateClick:true}) );
Domevents.extend( DomeventDrag );

   const VP = new Viewport().init().start();
    
   let DEH = new Domevents( VP.camera, VP.renderer.domElement );

   let DC = new DragControl( DEH, {
    "onDragstart" : VP.disableControl.bind( VP ),
    "onDragend" : VP.enableControl.bind( VP )
   });

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

    mesh.addEventListener("pointerdown", function( ev ){
        console.log( "mousedown", ev );
    });
    mesh.addEventListener("pointerup", function( ev ){
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

    VP.scene.add( floor, mesh, mesh2 );
    VP.scene.add( DC.iplane.helper );
