import {Plane, Vector3, Matrix4} from "../node_modules/three/build/three.module.js";

var _inverseMatrix = new Matrix4();
var _offset = new Vector3();

var _plane = new Plane();

var _worldPosition = new Vector3();
var _intersection = new Vector3();

const _dirs = {
    "xz" : new Vector3(0,1,0),
    "xy" : new Vector3(0,0,1),
    "yz" : new Vector3(1,0,0),
    "cam" : new Vector3(0,0,0)
};

const Intersectionplane = function( _camera, _raycaster ){
    
    this._camera = _camera;
    this._raycaster = _raycaster;

    let scope = this;

    this.setOffset = function( object3d ){
        if ( scope._raycaster.ray.intersectPlane( _plane, _intersection ) ) {

            _inverseMatrix.getInverse( object3d.parent.matrixWorld );
            _offset.copy( _intersection ).sub( _worldPosition.setFromMatrixPosition( object3d.matrixWorld ) );
        }
    };

    this.setPosition = function( object3d ){
        if ( scope._raycaster.ray.intersectPlane( _plane, _intersection ) ) {

            object3d.position.copy( _intersection.sub( _offset ).applyMatrix4( _inverseMatrix ) );

        }
    }

    this.setPlaneDirectionAndPositon = function( object3d, intersect, dir ){
        if ( dir instanceof Vector3 ) {
            _plane.set( dir, -(_worldPosition.setFromMatrixPosition( intersect.object.matrixWorld ).y + intersect.point.y) );
        } else if ( dir == "xz" ) {
            console.log(_worldPosition.setFromMatrixPosition( intersect.object.matrixWorld ).y + intersect.point.y);
            _plane.set( _dirs["xz"], -(_worldPosition.setFromMatrixPosition( intersect.object.matrixWorld ).y + intersect.point.y) );
        } else if ( dir == "xy" ) {
            console.log(_worldPosition.setFromMatrixPosition( intersect.object.matrixWorld ).y + intersect.point.y);
            _plane.set(  _dirs["xy"], -(_worldPosition.setFromMatrixPosition( intersect.object.matrixWorld ).y + intersect.point.y) );
        } else if ( dir == "yz" ) {
            console.log(_worldPosition.setFromMatrixPosition( intersect.object.matrixWorld ).y + intersect.point.y);
            _plane.set(  _dirs["xy"], -(_worldPosition.setFromMatrixPosition( intersect.object.matrixWorld ).y + intersect.point.y) );
        } else {
            _plane.setFromNormalAndCoplanarPoint( scope._camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( object3d.matrixWorld ) );
        }
        
    };
}

export default Intersectionplane;