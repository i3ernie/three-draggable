import { PlaneHelper } from "three";

const defaults = {
    size : 150,
    color : 0xffff00
};

class Intersectionhelper extends PlaneHelper {

    constructor ( _plane, opts ) {

        const o = Object.assign( {}, defaults, opts );

        super( _plane, o.size, o.color );
    
    }

}

export default Intersectionhelper;