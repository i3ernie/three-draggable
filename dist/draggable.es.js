import { PlaneHelper, Matrix4, Vector3, Plane, EventDispatcher } from 'three';

const defaults$1 = {
    size : 150,
    color : 0xffff00
};

class Intersectionhelper extends PlaneHelper {

    constructor ( _plane, opts ) {

        const o = Object.assign( {}, defaults$1, opts );

        super( _plane, o.size, o.color );
    
    }

}

const _inverseMatrix = new Matrix4();
var _offset = new Vector3();

const _plane = new Plane();


const _worldPosition = new Vector3();
const _intersection = new Vector3();

const _dirs = {
    "xz" : new Vector3(0,1,0),
    "xy" : new Vector3(0,0,1),
    "yz" : new Vector3(1,0,0),
    "cam" : new Vector3(0,0,0)
};

const defaults = {
    "helper" : true
};

const Intersectionplane = function( _camera, _raycaster, opts ) {
    
    this._camera = _camera;
    this._raycaster = _raycaster;

    this.options = Object.assign( {}, defaults, opts );

    if ( this.options.helper ) {
        this.helper = new Intersectionhelper( _plane );
    }
    
    let scope = this;

    this.setOffset = function( object3d ){
        if ( scope._raycaster.ray.intersectPlane( _plane, _intersection ) ) {

            _inverseMatrix.invert( object3d.parent.matrixWorld );
            _offset.copy( _intersection ).sub( _worldPosition.setFromMatrixPosition( object3d.matrixWorld ) );
        }
    };

    this.setPosition = function( object3d ) {

        if ( scope._raycaster.ray.intersectPlane( _plane, _intersection ) ) {

            object3d.position.copy( _intersection.sub( _offset ).applyMatrix4( _inverseMatrix ) );

        }
    };

    this.setPlaneDirectionAndPositon = function( object3d, intersect, dir ){
        if ( dir instanceof Vector3 ) {
            _plane.set( dir, -(_worldPosition.setFromMatrixPosition( intersect.object.matrixWorld ).y + intersect.point.y) );
        } else if ( dir == "xz" ) {
            _plane.set( _dirs["xz"], -(_worldPosition.setFromMatrixPosition( intersect.object.matrixWorld ).y + intersect.point.y) );
        } else if ( dir == "xy" ) {
            _plane.set(  _dirs["xy"], -(_worldPosition.setFromMatrixPosition( intersect.object.matrixWorld ).y + intersect.point.y) );
        } else if ( dir == "yz" ) {
            console.log(_worldPosition.setFromMatrixPosition( intersect.object.matrixWorld ).y + intersect.point.y);
            _plane.set(  _dirs["xy"], -(_worldPosition.setFromMatrixPosition( intersect.object.matrixWorld ).y + intersect.point.y) );
        } else {
            _plane.setFromNormalAndCoplanarPoint( scope._camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( object3d.matrixWorld ) );
        }
        
    };
};

const _vec = new Vector3();

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

    if ( this._draggingObjects[ev.target.id] ) {

        ev.origDomEvent.preventDefault();
        ev.origDomEvent.stopPropagation();
        
        _vec.copy( ev.target.position );
        this.iplane.setPosition( ev.target );

        ev.target.dispatchEvent(Object.assign({}, ev, {
            type:"moved", 
            direction:new Vector3().subVectors (ev.target.position, _vec)
        }));

        return;
    }

    ev.intersects.every( ( obj ) => {

        if ( this._draggingObjects[obj.object.id] ) {

            ev.origDomEvent.preventDefault();
            ev.origDomEvent.stopPropagation();
            this.iplane.setPosition( this._draggingObjects[obj.object.id] );

            return false;
        }

        return true;

    }); 
    
};

const onDragend = function( ev ) {
    
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

export { DragControl as default };
//# sourceMappingURL=draggable.es.js.map
