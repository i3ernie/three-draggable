/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const gulp = require('gulp');

const rollup  = require('rollup');
const resolve =require('rollup-plugin-node-resolve');


//var pkg = require('./package.json');
//var dirs = pkg.directories;
//var requireconfig = require("./config.json");

/*
const rollupBuild = function ( inputOptions, outputOptions, done ) {
    // create a bundle
    rollup.rollup(inputOptions).then( function( bundle ){

        console.log( bundle.watchFiles ); // an array of file names this bundle depends on

        // generate code
        bundle.generate( outputOptions ).then( function( output ){

            // or write the bundle to disk
            bundle.write(outputOptions).then(function(){
                done();
            });
        });

    });
};
*/

const replace = function( obj ){
    
    return { 
        name : "replace",
        generateBundle : function( code, code2 ){ 
            let replacer;
            for ( var key in obj ){
                replacer = new RegExp(key,'g');
                for ( var file in code2 ) {
                    if (code2[file].code){
                        code2[file].code = code2[file].code.replace(replacer, obj[key] );
                    }
                    
                }
            }
        }
    };
};

module.exports = replace;

gulp.task('default', ( done ) => {
    build_packAMD( ()=>{
        build_packES(()=>{
            done();
        });
    });
});


gulp.task('init', ( done ) => {
    
    done();
    
});

gulp.task("build", ( done ) => {
    "use strict";
    build_packAMD( ()=>{
        build_packES(()=>{
            done();
        });
    });
    
});

gulp.task("build_packAMD", ( done )=>{
    build_packAMD( done );
});

const build_packAMD = function( done ){
   
    rollup.rollup({
        input : 'src/DragControl.js',
        external: ['../node_modules/three/build/three.module.js',  '../node_modules/three/examples/jsm/controls/OrbitControls.js'],
        
        plugins:[

            resolve()
            
           
        ]
    }).then(( bundle ) => { 
        bundle.write({
            file: './dist/draggable.amd.js',


            plugins:[
                replace({
                    "../node_modules/three/build/three.module" : "three",
                    "../node_modules/three/examples/jsm/controls/OrbitControls" : "OrbitControls"
                })
            ],
            
            format: 'amd',
            name: 'three',
            exports: 'named',
            sourcemap: true
          });
          done();
    }).catch(
        (err)=>{console.error(err);}
    );
};

gulp.task("build_packES", ( done ) => {
    build_packES( done );
});

const build_packES = function( done ){
   
    rollup.rollup({
        input : 'src/DragControl.js',
        external: ['three', '../node_modules/three/examples/jsm/controls/OrbitControls.js'],
        
        plugins:[
            
            resolve()
        ]
    }).then(( bundle ) => { 
        bundle.write({
            file: './dist/draggable.es.js',
            plugins:[
                replace({
                    "../node_modules/three/" : "three"
                })
            ],
            
            format: 'es',
            name: 'three',
            exports: 'named',
            sourcemap: true
          });
          done();
    }).catch(
        (err)=>{console.error(err);}
    );
};

gulp.task("copy", ( done ) => {
    gulp.src([
        "./node_modules/three/build/three.module.js",
        "./node_modules/three/examples/jsm/controls/OrbitControls.js",
        "./node_modules/three-viewport/dist/viewport.es.js",
        "./node_modules/three-domevents/dist/domevents.pack.es.js"
    ])
    .pipe( gulp.dest("examples/js/vendor/"));
    
    done();
});
