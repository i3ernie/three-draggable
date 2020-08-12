import {TextureLoader, BoxBufferGeometry, MeshBasicMaterial, Mesh} from "../../node_modules/three/build/three.module.js";

var texture = new TextureLoader().load( 'textures/crate.gif' );

const WoodBox = function( w,h,d ){
    let geo = new BoxBufferGeometry( w || 100, h || 100, d || 100 );
    let mat = new MeshBasicMaterial( { map: texture } );

    Mesh.call( this, geo,mat );
};

WoodBox.prototype = Object.assign( Object.create( Mesh.prototype ), {
    constructor : WoodBox
});

export default  WoodBox;