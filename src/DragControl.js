import {Vector3} from "../node_modules/three/build/three.module.js";
import Intersectionplane from "./Intersectionplane.js";


const DragControl = function( domevents ) {
    this.iplane = new Intersectionplane( domevents._camera, domevents._ray );
    this._domElement = domevents._domElement;
    this._dirs = {};
    this._draggingObject = {};

    this._onMouseCancle = this.onMouseCancle.bind(this);
    this._mousemove = this.mousemove.bind(this);
    this._mousedown = this.mousedown.bind(this);
};

Object.assign( DragControl.prototype, {

    make : function( object3d, dir ){ 

        let scope = this;

        this._dirs[object3d.id] = dir || "cam";

        object3d.addEventListener("click", function( ev ){
            console.log( ev );
        });

        object3d.addEventListener("mousedown", function( ev ){ 
            scope._mousedown( ev, object3d );
        });

        object3d.addEventListener("mousemove", function( ev ){           
            scope._mousemove( ev, object3d );
        });

        object3d.addEventListener("mouseup", function( ev ){ 
            scope._onMouseCancle( ev, object3d ); 
        });
        object3d.addEventListener("mouseout", function( ev ){ 
            scope._onMouseCancle( ev, object3d ); 
        });
    },

    mousedown : function( ev, object3d ){ 
        ev.origDomEvent.preventDefault();
        ev.origDomEvent.stopPropagation();

        this.iplane.setOffset( object3d );

        this._draggingObject[ object3d.id ] = object3d;
        
        this._domElement.style.cursor = 'move';

        object3d.dispatchEvent( { type: 'dragstart', object: ev } );
        console.log("dragstart", object3d);
    },

    mousemove : function( ev, object3d ){
            
        ev.origDomEvent.preventDefault();
        ev.origDomEvent.stopPropagation();

        if ( this._draggingObject[ object3d.id ] ) {
            
            this.iplane.setPosition( object3d );

            object3d.dispatchEvent( { type: 'drag', object: ev } );
        
            return;
        }

        this.iplane.setPlaneDirectionAndPositon( object3d, ev.intersect, "xz" );
    },

    onMouseCancle : function( ev, object3d ){
        this._draggingObject[ object3d.id ] = null;
        this._domElement.style.cursor = 'auto';
        object3d.dispatchEvent( { type: 'dragstop', object: ev } );
        console.log("dragend");
    }
});

export default DragControl;