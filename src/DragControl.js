import {Vector3, EventDispatcher} from "three";
import Intersectionplane from "./Intersectionplane.js";

const onDragstart = function( ev ){
    
    let object3d = ev.target;

    ev.origDomEvent.preventDefault();
    ev.origDomEvent.stopPropagation();

    this._domElement.style.cursor = 'move';
    this._draggingObjects[object3d.id] = object3d;

    this.iplane.setPlaneDirectionAndPositon( object3d, ev.intersect, this._dirs[object3d.id] );
    this.iplane.setOffset( object3d );

    this.dispatchEvent({ type:"dragstart", message:object3d });

};

const onDrag = function( ev ) {
    if ( !this._draggingObjects[ev.target.id] ) return;

    ev.origDomEvent.preventDefault();
    ev.origDomEvent.stopPropagation();
    
    this.iplane.setPosition( ev.target );
};

const onDragend = function( ev ){
    this._domElement.style.cursor = 'auto';
    delete this._draggingObjects[ev.target.id];

    this.dispatchEvent({ type:"dragend", message:ev.target });
};


class DragControl extends EventDispatcher { 

    constructor ( domevents, opts ) {

        super();

        const scope = this;

        if ( opts ) {
            if ( typeof opts.onDragstart === "function" ) { 
                this.addEventListener("dragstart", opts.onDragstart);
            }
            if ( typeof opts.onDragend === "function" ) {
                this.addEventListener("dragend", opts.onDragend);
            }
        }
        
        this.iplane = new Intersectionplane( domevents._camera, domevents._ray );
        this._domElement = domevents._domElement;
        this._dirs = {};
        this._draggingObjects = {};

        this._domElement.addEventListener("pointermove", function( ev ){
            if ( Object.keys( this._draggingObjects ).length > 0 ){
                ev.preventDefault();
                ev.stopPropagation();
            }
        }.bind( this ) );

        this._dragStart = function( ev ){
            onDragstart.call( scope, ev );
        };

        this._onDrag = function( ev ){
            onDrag.call( scope, ev );
        };

        this._onDragend = function( ev ){
            onDragend.call( scope, ev );
        };
    }

    enableDraggable ( object3d, dir ) { 


        if ( this.isDraggable( object3d ) ) {
            this.disableDraggable( object3d );
        }

        this._dirs[object3d.id] = dir || "cam";

        object3d.addEventListener("dragstart",  this._dragStart );
        object3d.addEventListener("drag",       this._onDrag );
        object3d.addEventListener("dragend",    this._onDragend );

    }

    disableDraggable ( object3d ) {

        object3d.removeEventListener("dragstart",   this._dragStart );
        object3d.removeEventListener("drag",        this._onDrag );
        object3d.removeEventListener("dragend",     this._onDragend );

    }

    isDraggable ( object3d ) {

        return object3d.hasEventListener("drag", this._onDrag );

    }

    pauseDragging () {
        //ToDo
    }
}

export default DragControl;