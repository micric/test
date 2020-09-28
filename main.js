var ind = 0
var neck = 0
var head = 0
var headEnd = 0
var spine1 = 0
var spine2 = 0
var spine = 0
var rightForeArm = 0
var leftForeArm = 0
var rightHand = 0
var rightLeg = 0
var leftLeg = 0
var rightArm = 0
var leftArm = 0
var rightFoot = 0
var leftFoot = 0
var hips = 0
var leftUpLeg = 0
var rightUpLeg = 0
var leftHand = 0
var leftShoulder = 0
var rightShoulder = 0
var pose2exec = {}
var projector, mouse = { x: 0, y: 0 };
var moveModel = false
skeleton = 0;
camera = 0;
var targetList = [];
model = 0;
mixer = 0;
animationStopped = false
bonesInitialPositions = []
bonesInitialRotationsX = []
bonesInitialRotationsY = []
bonesInitialRotationsZ = []

class Game{
    constructor(){
        this.clock = new THREE.Clock();

        this.animations = [["soldier1", "soldier2", "soldier_elbow"]];

		this.init();
    }
    

    init() {

        const container = document.createElement( 'div' );
        document.body.appendChild( container );
		// set up camera
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 2000 );
        this.camera.position.set( 200, 200, 30 );
		camera = this.camera
		// create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xa0a0a0 );  //Background of the scene
        this.scene.fog = new THREE.Fog( 0xa0a0a0, 1000, 2000 );
		// set up lights
        let light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        light.position.set( 0, 200, 0 );
        this.scene.add( light );
        
        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 200, 100 );
        light.castShadow = true;
        light.shadow.camera.top = 180;
        light.shadow.camera.bottom = - 100;
        light.shadow.camera.left = - 120;
        light.shadow.camera.right = 120;
        this.scene.add( light );

        // ground
		const textureLoader = new THREE.TextureLoader();
		var textureFloor = textureLoader.load("grasslight-big.jpg")
		textureFloor.wrapS = THREE.RepeatWrapping;
		textureFloor.wrapT = THREE.RepeatWrapping;
		textureFloor.repeat.set( 4, 4 );
        const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3000, 3000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false, map: textureFloor } ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add( mesh );

        const grid = new THREE.GridHelper( 3000, 20, 0x000000, 0x000000 );
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.scene.add( grid );

        // model
        const self = this;
        const loader = new THREE.FBXLoader();
        loader.load( "model/soldier0.fbx", function ( object ) {
            self.mixer = new THREE.AnimationMixer( object );
            self.actions = object.animations;
            self.mixer.addEventListener( 'finished', function( ) {
                console.log("finisthed")
            } ); // properties of e: type, action and direction
            object.traverse( function ( child ) {
				if (child.isBone) {
					console.log(child.name);
					targetList.push(child);
					// store model initial position
					bonesInitialPositions.push(child.position);
					bonesInitialRotationsX.push(child.rotation.x);
					bonesInitialRotationsY.push(child.rotation.y);
					bonesInitialRotationsZ.push(child.rotation.z);
				}
				if (child.isBone && child.name == 'mixamorigNeck') {
					neck = child;
				}
				if (child.isBone && child.name == 'mixamorigHead') {
					head = child;
				}
				if (child.isBone && child.name == 'mixamorigHead_end') {
					headEnd = child;
				}
				if (child.isBone && child.name == 'mixamorigSpine') {
					spine = child;
				}
				if (child.isBone && child.name == 'mixamorigSpine1') {
					spine1 = child;
				}
				if (child.isBone && child.name == 'mixamorigSpine2') {
					spine2 = child;
				}
				if (child.isBone && child.name == 'mixamorigRightForeArm') {
					rightForeArm = child;
				}
				if (child.isBone && child.name == 'mixamorigRightArm') {
					rightArm = child;
				}
				if (child.isBone && child.name == 'mixamorigLeftArm') {
					leftArm = child;
				}
				if (child.isBone && child.name == 'mixamorigRightHand') {
					rightHand = child;					
				}
				if (child.isBone && child.name == 'mixamorigLeftForeArm') {
					leftForeArm = child;					
				}
				if (child.isBone && child.name == 'mixamorigLeftLeg') {
					leftLeg = child;					
				}
				if (child.isBone && child.name == 'mixamorigRightLeg') {
					rightLeg = child;					
				}
				if (child.isBone && child.name == 'mixamorigLeftFoot') {
					leftFoot = child;					
				}
				if (child.isBone && child.name == 'mixamorigRightFoot') {
					rightFoot = child;					
				}
				if (child.isBone && child.name == 'mixamorigHips') {
					hips = child;					
				}
				if (child.isBone && child.name == 'mixamorigLeftUpLeg') {
					leftUpLeg = child;
				}
				if (child.isBone && child.name == 'mixamorigRightUpLeg') {
					rightUpLeg = child;
				}
				if (child.isBone && child.name == 'mixamorigLeftHand') {
					leftHand = child;
				}
				if (child.isBone && child.name == 'mixamorigLeftShoulder') {
					leftShoulder = child;
				}
				if (child.isBone && child.name == 'mixamorigRightShoulder') {
					rightShoulder = child;
				}
                if ( child.isMesh ) {

                    child.castShadow = true;
                    child.receiveShadow = false;
				}
				
			} );

            self.scene.add( object );
			model = object;
			skeleton = new THREE.SkeletonHelper( object );
			//self.scene.add( skeleton );
			const tloader = new THREE.TextureLoader();
			tloader.load("Soldier_image1.jpg", function(texture){
                object.traverse( function ( child ) {
                    if ( child.isMesh ) {
						child.material = new THREE.MeshStandardMaterial( { color: 0x999999, skinning: true } );
						child.material.map = texture;}
                });
            });

			var axesHelper = new THREE.AxesHelper( 1000 );
			//self.scene.add( axesHelper );
    
            self.loadNextAnim(loader);
            //console.log("esco da loadNext")

            self.animate()
        } );

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;
        container.appendChild( this.renderer.domElement );

        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set( 0, 150, 0 );
        this.controls.update();
        
		window.addEventListener( 'resize', function(){ self.resize();}, false );
		
    }

	// animate using blender frames
    loadNextAnim(loader){
        const self = this;
        for (var index1= 0; index1< this.animations.length; index1++) {
            var arr = [];
            for (var index2= 0; index2< (this.animations[index1]).length; index2++) {
                var anim = this.animations[index1][index2];
                loader.load( `model/${anim}.fbx`, function ( object ) {

                    const action = self.mixer.clipAction( object.animations[0] );
                    arr.push(action);
                    object.traverse( function ( child ) {

                        if ( child.isMesh ) {                            
                            child.castShadow = true;
                            child.receiveShadow = false;
                        }
                    } );
                    self.scene.add( object );
                } );
            } 
            self.actions["k_"+ index1] = arr;   
        }
    }
	
    playAnimation(index){
        console.log("play animations");
        console.log(this.animations);
        this.mixer.stopAllAction();
		TWEEN.removeAll();
        console.log("play actions");
        console.log(this.actions);//modifica
        var action2Play = 0;
        //actionS2Play = this.actions.length;
        var actionS2Play = this.actions["k_" + index];
        this.execPlayAnim(action2Play, actionS2Play);
    }
	
    execPlayAnim(action2Play, actionS2Play){
        console.log("action2Play: "+action2Play);
        console.log("actionS2Play: "+actionS2Play);
        const self = this;
        //var action = this.actions[action2Play];
        var action = actionS2Play[action2Play];//modifica
        action.weight = 1;
        action.fadeIn(0.5);
        action.play();
        console.log("action.play");
        action2Play++;
        if(action2Play < actionS2Play.length){
            var delay = 1000;
            setTimeout(function(){self.execPlayAnim(action2Play, actionS2Play)}, delay);
            
        }
    }
	// animation to control model with mouse
	moveModelAnimation(){
		if (moveModel == false){
		moveModel = true}
		else {moveModel = false}
	}
	
    // stop animation and bring model back to starting point
    stopAnimation(){
		TWEEN.removeAll()
		initialPosition()
	}

	sideKickAnimation(){
		animationStopped = false
		sideKick();
		setTimeout(initialPosition, 1000)
	}
		
	lethalCombinationAnimation(){
		animationStopped = false
		lethalCombination();
		setTimeout(initialPosition, 4000);
	}

    
    resize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    
   animate() {
        const self = this;
    
        requestAnimationFrame( function(){ self.animate(); } );

		TWEEN.update();
		if (animationStopped) {
			TWEEN.removeAll()
		}
        const delta = this.clock.getDelta();

        if ( this.mixer ) this.mixer.update( delta );
        this.renderer.render( this.scene, this.camera );
    } 
}



document.addEventListener('mousemove', handleMouseMove, false);

// general method that uses tween to rotate a bone
function rotateBone(bone, angle, time, repetitions, chainTo) {
	var tween = new TWEEN.Tween({x:bone.position.x , y: bone.position.y, z: bone.position.z, rotX:bone.rotation.x, rotY:bone.rotation.y, rotZ:bone.rotation.z});
	finalPosition = {x:0 , y:0 , z:0, rotX:angle.x, rotY: angle.y, rotZ: angle.z}
	tween.to(finalPosition, time);
	tween.easing(TWEEN.Easing.Linear.None)
	tween.onUpdate(function() {
	bone.rotation.set(this.rotX, this.rotY, this.rotZ);
	//bone.position.set(this.x, this.y, this.z);
	});
	tween.repeat(repetitions);
	tween.yoyo(true);
	if (chainTo != 0) {		
		chainTo.chain(tween);
	} else {
	tween.start()
	}
	return tween
	
}

function jump() {
	// tween to animate the jump
	var tween = new TWEEN.Tween({x:0 , y:0 , z:0});
	tween.to({x:0 , y:20 , z:0}, 250);
	tween.easing(TWEEN.Easing.Quadratic.InOut)
	tween.onUpdate(function() {
	model.position.set(this.x, this.y, this.z);
	});
	tween.repeat(Infinity);
	tween.yoyo(true);
	tween.start();
	// rotate bones for body mechanics
	//rotateBone(rightArm.parent, {x: 0, y: 0, z: Math.PI / 6}, 500, Infinity, 0);
	//rotateBone(leftArm.parent, {x: 0, y: 0, z: -Math.PI / 6}, 500, Infinity, 0);
	rotateBone(leftLeg.parent, {x: Math.PI / 9, y: 0, z: 0}, 500, Infinity, 0);
	rotateBone(rightLeg.parent, {x: Math.PI / 9, y: 0, z: 0}, 500, Infinity, 0);
	rotateBone(leftFoot.parent, {x: Math.PI / 20, y: 0, z: 0}, 500, Infinity, 0);
	rotateBone(rightFoot.parent, {x: Math.PI / 20, y: 0, z: 0}, 500, Infinity, 0);
	rotateBone(neck.parent, {x: Math.PI / 9, y: 0, z: 0}, 500, Infinity, 0);
}

function initialPosition() {
	model.position.set(0, 0, 0);
	var i = 0;
	model.traverse( function ( child ) {
			if (child.isBone) {
				rotateBone(child, {x: bonesInitialRotationsX[i], y: bonesInitialRotationsY[i], z: bonesInitialRotationsZ[i]}, 200, 0, 0);
				//child.rotation.set(bonesInitialRotationsX[i], bonesInitialRotationsY[i], bonesInitialRotationsZ[i]);
				i = i + 1;
			}
	});
}

function sideKick() {
	// move to guard 
	let animTime = 500
	bone = hips.parent;
	time = 300
	angle = {x: hips.parent.rotation.x, y: hips.parent.rotation.y, z:hips.parent.rotation.z + Math.PI / 3};
	bonePosition = {x:bone.position.x , y: bone.position.y, z: bone.position.z, rotX:bone.rotation.x, rotY:bone.rotation.y, rotZ:bone.rotation.z}
	var tween = new TWEEN.Tween(bonePosition);
	finalPosition = {x:0 , y:0 , z:0, rotX:angle.x, rotY: angle.y, rotZ: angle.z}
	tween.to(finalPosition, time);
	tween.easing(TWEEN.Easing.Linear.None)
	tween.onUpdate(function() {
	bone.rotation.set(this.rotX, this.rotY, this.rotZ);
	});
	tween.start();
	
	bone2 = leftUpLeg.parent;
	angle2 = {x: bone2.rotation.x, y: bone2.rotation.y - Math.PI / 4, z:bone2.rotation.z};
	bone2Position = {x:bone2.position.x , y: bone2.position.y, z: bone2.position.z, rotX:bone2.rotation.x, rotY:bone2.rotation.y, rotZ:bone2.rotation.z}
	var tween2 = new TWEEN.Tween(bone2Position);
	finalPosition2 = {x:0 , y:0 , z:0, rotX:angle2.x, rotY: angle2.y, rotZ: angle2.z}
	tween2.to(finalPosition2, time);
	tween2.easing(TWEEN.Easing.Linear.None)
	tween2.onUpdate(function() {
	bone2.rotation.set(this.rotX, this.rotY, this.rotZ);
	});
	tween.chain(tween2);

	
	bone3 = rightUpLeg.parent;
	angle3 = {x: bone3.rotation.x - Math.PI / 1.6, y: bone3.rotation.y, z:bone3.rotation.z};
	bone3Position = {x:bone3.position.x , y: bone3.position.y, z: bone3.position.z, rotX:bone3.rotation.x, rotY:bone3.rotation.y, rotZ:bone3.rotation.z}
	var tween3 = new TWEEN.Tween(bone3Position);
	finalPosition3 = {x:0 , y:0 , z:0, rotX:angle3.x, rotY: angle3.y, rotZ: angle3.z}
	tween3.to(finalPosition3, time);
	tween3.easing(TWEEN.Easing.Linear.None)
	tween3.onUpdate(function() {
	bone3.rotation.set(this.rotX, this.rotY, this.rotZ);
	});

	tween.chain(tween3);	
	
	angle4 = {x: bone3.rotation.x - Math.PI / 1.8, y: bone3.rotation.y - Math.PI / 2, z:bone3.rotation.z};
	//bone3Position = {x:bone3.position.x , y: bone3.position.y, z: bone3.position.z, rotX:bone3.rotation.x, rotY:bone3.rotation.y, rotZ:bone3.rotation.z}
	var tween4 = new TWEEN.Tween(bone3Position);
	finalPosition4 = {x:0 , y:0 , z:0, rotX:angle4.x, rotY: angle4.y, rotZ: angle4.z}
	tween4.to(finalPosition4, time);
	tween4.easing(TWEEN.Easing.Linear.None)
	tween4.onUpdate(function() {
	bone3.rotation.set(this.rotX, this.rotY, this.rotZ);
	});

	tween.chain(tween4);
	
	bone5 = rightLeg.parent
	angle12 = {x: bone5.rotation.x + Math.PI / 1.7, y: bone5.rotation.y, z:bone5.rotation.z };
	bone5Position = {x:bone5.position.x , y: bone5.position.y, z: bone5.position.z, rotX:bone5.rotation.x, rotY:bone5.rotation.y, rotZ:bone5.rotation.z}
	var tween5 = new TWEEN.Tween(bone5Position);
	finalPosition5 = {x:0 , y:0 , z:0, rotX:angle12.x, rotY: angle12.y, rotZ: angle12.z}
	tween5.to(finalPosition5, time);
	tween5.easing(TWEEN.Easing.Linear.None)
	tween5.onUpdate(function() {
	bone5.rotation.set(this.rotX, this.rotY, this.rotZ);
	});
	tween5.delay(time)
	tween5.start()
	
	angle6 = {x: bone5.rotation.x - Math.PI / 3.3, y: bone5.rotation.y, z:bone5.rotation.z };
	var tween6 = new TWEEN.Tween(bone5Position);
	finalPosition6 = {x:0 , y:0 , z:0, rotX:angle6.x, rotY: angle6.y, rotZ: angle6.z}
	tween6.to(finalPosition6, time);
	tween6.easing(TWEEN.Easing.Linear.None)
	tween6.onUpdate(function() {
	bone5.rotation.set(this.rotX, this.rotY, this.rotZ);
	});
	tween6.delay(600)
	tween6.start()

	bone7 = spine.parent
	angle7 = {x: bone7.rotation.x - Math.PI / 8, y: bone7.rotation.y  - Math.PI / 8, z:bone7.rotation.z};
	bone7Position = {x:bone7.position.x , y: bone7.position.y, z: bone7.position.z, rotX:bone7.rotation.x, rotY:bone7.rotation.y, rotZ:bone7.rotation.z}
	var tween7 = new TWEEN.Tween(bone7Position);
	finalPosition7 = {x:0 , y:0 , z:0, rotX:angle7.x, rotY: angle7.y, rotZ: angle7.z}
	tween7.to(finalPosition7, time);
	tween7.easing(TWEEN.Easing.Linear.None)
	tween7.onUpdate(function() {
	bone7.rotation.set(this.rotX, this.rotY, this.rotZ);
	});
	tween7.delay(time)
	tween7.start()
}
	
function lethalCombination() {	
	time = 300
	
	bone = leftArm.parent;
	angle = {x: bone.rotation.x + Math.PI / 6, y: bone.rotation.y - Math.PI / 6, z:bone.rotation.z};
	bonePosition = {x:bone.position.x , y: bone.position.y, z: bone.position.z, rotX:bone.rotation.x, rotY:bone.rotation.y, rotZ:bone.rotation.z}
	var tween = new TWEEN.Tween(bonePosition);
	finalPosition = {x:0 , y:0 , z:0, rotX:angle.x, rotY: angle.y, rotZ: angle.z}
	tween.to(finalPosition, 150);
	tween.easing(TWEEN.Easing.Linear.None)
	tween.onUpdate(function() {
	bone.rotation.set(this.rotX, this.rotY, this.rotZ);
	});
	
	bone2 = leftForeArm.parent;
	angle2 = {x: bone2.rotation.x + Math.PI / 3, y: bone2.rotation.y, z:bone2.rotation.z};
	bone2Position = {x:bone2.position.x , y: bone2.position.y, z: bone2.position.z, rotX:bone2.rotation.x, rotY:bone2.rotation.y, rotZ:bone2.rotation.z}
	var tween2 = new TWEEN.Tween(bone2Position);
	finalPosition2 = {x:0 , y:0 , z:0, rotX:angle2.x, rotY: angle2.y, rotZ: angle2.z}
	tween2.to(finalPosition2, 150);
	tween2.easing(TWEEN.Easing.Linear.None)
	tween2.onUpdate(function() {
	bone2.rotation.set(this.rotX, this.rotY, this.rotZ);
	});	

	bone3 = leftHand.parent;
	angle3 = {x: bone3.rotation.x - Math.PI / 3, y: bone3.rotation.y, z:bone3.rotation.z};
	bone3Position = {x:bone3.position.x , y: bone3.position.y, z: bone3.position.z, rotX:bone3.rotation.x, rotY:bone3.rotation.y, rotZ:bone3.rotation.z}
	var tween3 = new TWEEN.Tween(bone3Position);
	finalPosition3 = {x:0 , y:0 , z:0, rotX:angle3.x, rotY: angle3.y, rotZ: angle3.z}
	tween3.to(finalPosition3, 150);
	tween3.easing(TWEEN.Easing.Linear.None)
	tween3.onUpdate(function() {
	bone3.rotation.set(this.rotX, this.rotY, this.rotZ);
	});	
	tween.repeat(1);
	tween2.repeat(1);
	tween3.repeat(1);
	tween.yoyo(true);
	tween2.yoyo(true);
	tween3.yoyo(true);
	tween.start();
	tween2.start();
	tween3.start();
	
	bone4 = rightArm.parent;
	angle4 = {x: bone4.rotation.x - Math.PI / 8, y: bone4.rotation.y - Math.PI / 6, z:bone4.rotation.z};
	bone4Position = {x:bone4.position.x , y: bone4.position.y, z: bone4.position.z, rotX:bone4.rotation.x, rotY:bone4.rotation.y, rotZ:bone4.rotation.z}
	var tween4 = new TWEEN.Tween(bone4Position);
	finalPosition4 = {x:0 , y:0 , z:0, rotX:angle4.x, rotY: angle4.y, rotZ: angle4.z}
	tween4.to(finalPosition4, 150);
	tween4.easing(TWEEN.Easing.Linear.None)
	tween4.onUpdate(function() {
	bone4.rotation.set(this.rotX, this.rotY, this.rotZ);
	});
	
	bone5 = rightForeArm.parent;
	angle5 = {x: bone5.rotation.x - Math.PI / 3, y: bone5.rotation.y, z:bone5.rotation.z};
	bone5Position = {x:bone5.position.x , y: bone5.position.y, z: bone5.position.z, rotX:bone5.rotation.x, rotY:bone5.rotation.y, rotZ:bone5.rotation.z}
	var tween5 = new TWEEN.Tween(bone5Position);
	finalPosition5 = {x:0 , y:0 , z:0, rotX:angle5.x, rotY: angle5.y, rotZ: angle5.z}
	tween5.to(finalPosition5, 150);
	tween5.easing(TWEEN.Easing.Linear.None)
	tween5.onUpdate(function() {
	bone5.rotation.set(this.rotX, this.rotY, this.rotZ);
	});	

	bone6 = rightHand.parent;
	angle6 = {x: bone6.rotation.x + Math.PI / 3, y: bone6.rotation.y, z:bone6.rotation.z};
	bone6Position = {x:bone6.position.x , y: bone6.position.y, z: bone6.position.z, rotX:bone6.rotation.x, rotY:bone6.rotation.y, rotZ:bone6.rotation.z}
	var tween6 = new TWEEN.Tween(bone6Position);
	finalPosition6 = {x:0 , y:0 , z:0, rotX:angle6.x, rotY: angle6.y, rotZ: angle6.z}
	tween6.to(finalPosition6, 150);
	tween6.easing(TWEEN.Easing.Linear.None)
	tween6.onUpdate(function() {
	bone6.rotation.set(this.rotX, this.rotY, this.rotZ);
	});	
	
	bone7 = leftShoulder.parent;
	angle7 = {x: bone7.rotation.x - Math.PI / 18, y: bone7.rotation.y, z:bone7.rotation.z};
	bone7Position = {x:bone7.position.x, y: bone7.position.y, z: bone7.position.z, rotX:bone7.rotation.x, rotY:bone7.rotation.y, rotZ:bone7.rotation.z}
	var tween7 = new TWEEN.Tween(bone7Position);
	finalPosition7 = {x:0 , y:0 , z:0, rotX:angle7.x, rotY: angle7.y, rotZ: angle7.z}
	tween7.to(finalPosition7, 150);
	tween7.easing(TWEEN.Easing.Linear.None)
	tween7.onUpdate(function() {
	bone7.rotation.set(this.rotX, this.rotY, this.rotZ);
	});	

	bone8 = spine.parent;
	angle8 = {x: bone8.rotation.x + Math.PI / 36, y: bone8.rotation.y + Math.PI / 36, z:bone8.rotation.z};
	bone8Position = {x:bone8.position.x, y: bone8.position.y, z: bone8.position.z, rotX:bone8.rotation.x, rotY:bone8.rotation.y, rotZ:bone8.rotation.z}
	var tween8 = new TWEEN.Tween(bone8Position);
	finalPosition8 = {x:0 , y:0 , z:0, rotX:angle8.x, rotY: angle8.y, rotZ: angle8.z}
	tween8.to(finalPosition8, 150);
	tween8.easing(TWEEN.Easing.Linear.None)
	tween8.onUpdate(function() {
	bone8.rotation.set(this.rotX, this.rotY, this.rotZ);
	});		

	angle9 = {x: bone8.rotation.x - Math.PI / 36, y: bone8.rotation.y - Math.PI / 36, z:bone8.rotation.z};
	var tween9 = new TWEEN.Tween(bone8Position);
	finalPosition9 = {x:0 , y:0 , z:0, rotX:angle9.x, rotY: angle9.y, rotZ: angle9.z}
	tween9.to(finalPosition9, 150);
	tween9.easing(TWEEN.Easing.Linear.None)
	tween9.onUpdate(function() {
	bone8.rotation.set(this.rotX, this.rotY, this.rotZ);
	});		
	
	tween4.delay(450);
	tween5.delay(450);
	tween6.delay(450);
	tween4.repeat(1);
	tween5.repeat(1);
	tween6.repeat(1);
	tween7.repeat(1);
	tween8.repeat(1);
	tween9.repeat(1);
	tween4.yoyo(true);
	tween5.yoyo(true);
	tween6.yoyo(true);
	tween7.yoyo(true);
	tween8.yoyo(true);
	tween9.yoyo(true);
	tween8.chain(tween9);
	tween4.start();
	tween5.start();
	tween6.start();
	tween7.start();
	tween8.start();
	
	time = 200

	//knee up
	bone10 = leftArm.parent;	
	angle10 = {x: bone10.rotation.x + Math.PI / 9, y: bone10.rotation.y , z:bone10.rotation.z};
	bonePosition10 = {x:bone10.position.x , y: bone10.position.y, z: bone10.position.z, rotX:bone10.rotation.x, rotY:bone10.rotation.y, rotZ:bone10.rotation.z}
	var tween10 = new TWEEN.Tween(bonePosition10);
	finalPosition10 = {x:0 , y:0 , z:0, rotX:angle10.x, rotY: angle10.y, rotZ: angle10.z}
	tween10.to(finalPosition10, 150);
	tween10.easing(TWEEN.Easing.Linear.None)
	tween10.onUpdate(function() {
	bone10.rotation.set(this.rotX, this.rotY, this.rotZ);
	});

	angle11 = {x: bone2.rotation.x , y: bone2.rotation.y + Math.PI / 4, z:bone2.rotation.z};
	bone2Position = {x:bone2.position.x , y: bone2.position.y, z: bone2.position.z, rotX:bone2.rotation.x, rotY:bone2.rotation.y, rotZ:bone2.rotation.z}
	var tween11 = new TWEEN.Tween(bone2Position);
	finalPosition2 = {x:0 , y:0 , z:0, rotX:angle11.x, rotY: angle11.y, rotZ: angle11.z}
	tween11.to(finalPosition2, 150);
	tween11.easing(TWEEN.Easing.Linear.None)
	tween11.onUpdate(function() {
	bone2.rotation.set(this.rotX, this.rotY, this.rotZ);
	});	

	angle12 = {x: bone5.rotation.x - Math.PI / 6, y: bone5.rotation.y, z:bone5.rotation.z};
	bone12Position = {x:bone5.position.x , y: bone5.position.y, z: bone5.position.z, rotX:bone5.rotation.x, rotY:bone5.rotation.y, rotZ:bone5.rotation.z}
	var tween12 = new TWEEN.Tween(bone12Position);
	finalPosition12 = {x:0 , y:0 , z:0, rotX:angle12.x, rotY: angle12.y, rotZ: angle12.z}
	tween12.to(finalPosition12, 300);
	tween12.easing(TWEEN.Easing.Linear.None)
	tween12.onUpdate(function() {
	bone5.rotation.set(this.rotX, this.rotY, this.rotZ);
	});	

	bone13 = rightUpLeg.parent;
	angle13 = {x: bone13.rotation.x - Math.PI / 1.6, y: bone13.rotation.y , z:bone13.rotation.z - Math.PI / 3.6};
	bone13Position = {x:bone13.position.x , y: bone13.position.y, z: bone13.position.z, rotX:bone13.rotation.x, rotY:bone13.rotation.y, rotZ:bone13.rotation.z}
	var tween13 = new TWEEN.Tween(bone13Position);
	finalPosition13 = {x:0 , y:0 , z:0, rotX:angle13.x, rotY: angle13.y, rotZ: angle13.z}
	tween13.to(finalPosition13, time);
	tween13.easing(TWEEN.Easing.Linear.None)
	tween13.onUpdate(function() {
	bone13.rotation.set(this.rotX, this.rotY, this.rotZ);
	});

	bone14 = rightLeg.parent;
    angle14 = {x: bone14.rotation.x + Math.PI / 1.6, y: bone14.rotation.y , z:bone14.rotation.z};
	bone14Position = {x:bone14.position.x , y: bone14.position.y, z: bone14.position.z, rotX:bone14.rotation.x, rotY:bone14.rotation.y, rotZ:bone14.rotation.z}
	var tween14 = new TWEEN.Tween(bone14Position);
	finalPosition14 = {x:0 , y:0 , z:0, rotX:angle14.x, rotY: angle14.y, rotZ: angle14.z}
	tween14.to(finalPosition14, time);
	tween14.easing(TWEEN.Easing.Linear.None)
	tween14.onUpdate(function() {
	bone14.rotation.set(this.rotX, this.rotY, this.rotZ);
	});

	bone15 = spine.parent;
    angle15 = {x: bone15.rotation.x - Math.PI / 12, y: bone15.rotation.y , z:bone15.rotation.z};
	bone15Position = {x:bone15.position.x , y: bone15.position.y, z: bone15.position.z, rotX:bone15.rotation.x, rotY:bone15.rotation.y, rotZ:bone15.rotation.z}
	var tween15 = new TWEEN.Tween(bone15Position);
	finalPosition15 = {x:0 , y:0 , z:0, rotX:angle15.x, rotY: angle15.y, rotZ: angle15.z}
	tween15.to(finalPosition15, time);
	tween15.easing(TWEEN.Easing.Linear.None)
	tween15.onUpdate(function() {
	bone15.rotation.set(this.rotX, this.rotY, this.rotZ);
	});

	bone16 = hips.parent;
    angle16 = {x: bone16.rotation.x  - Math.PI / 12, y: bone16.rotation.y  , z:bone16.rotation.z };
	bone16Position = {x:bone16.position.x , y: bone16.position.y, z: bone16.position.z, rotX:bone16.rotation.x, rotY:bone16.rotation.y, rotZ:bone16.rotation.z}
	var tween16 = new TWEEN.Tween(bone16Position);
	finalPosition16 = {x:0 , y:0 , z:0, rotX:angle16.x, rotY: angle16.y, rotZ: angle16.z}
	tween16.to(finalPosition16, time);
	tween16.easing(TWEEN.Easing.Linear.None)
	tween16.onUpdate(function() {
	bone16.rotation.set(this.rotX, this.rotY, this.rotZ);
	});

	bone17 = rightFoot.parent;
    angle17 = {x: bone17.rotation.x  + Math.PI / 6, y: bone17.rotation.y  , z:bone17.rotation.z };
	bone17Position = {x:bone17.position.x , y: bone17.position.y, z: bone17.position.z, rotX:bone17.rotation.x, rotY:bone17.rotation.y, rotZ:bone17.rotation.z}
	var tween17 = new TWEEN.Tween(bone17Position);
	finalPosition17 = {x:0 , y:0 , z:0, rotX:angle17.x, rotY: angle17.y, rotZ: angle17.z}
	tween17.to(finalPosition17, time);
	tween17.easing(TWEEN.Easing.Linear.None)
	tween17.onUpdate(function() {
	bone17.rotation.set(this.rotX, this.rotY, this.rotZ);
	});


    tween10.delay(900);
	tween10.start();
	tween11.delay(900);
	tween11.start();
	tween12.delay(900);
	tween12.start();
	tween13.delay(900);
	tween13.start();
	tween14.delay(900);
	tween14.start();
	tween15.delay(900);
	tween15.start();
	tween16.delay(900);
	tween16.start();
	tween17.delay(900);
	tween17.start();
	
	tween10.repeat(2);
	tween11.repeat(2);
	tween12.repeat(2);
	tween13.repeat(2);
	tween14.repeat(2);
	tween15.repeat(2);
	tween16.repeat(2);
	tween17.repeat(2);

	tween10.yoyo(true);
	tween11.yoyo(true);
	tween12.yoyo(true);
	tween13.yoyo(true);
	tween14.yoyo(true);
	tween15.yoyo(true);
	tween16.yoyo(true);
	tween17.yoyo(true);

	}

var mousePos={x:0, y:0};


function handleMouseMove(event) {
	// moves model using mouse	
	var scaledX = -1 + (event.clientX / window.innerWidth)*2;

	var scaledY = 1 - (event.clientY / window.innerHeight)*2;
	mousePos = {x:scaledX, y:scaledY};
	
	var normalizedX = normalize(mousePos.x, -1, 1, -300, 300);
	var normalizedY = normalize(mousePos.y, -1, 1, -0, 300);

	// update the model's position
	if (moveModel) {
		model.position.x = normalizedX;
		model.position.y = normalizedY;
	}
}

function normalize(position,mouseMin,mouseMax,lowerBoundary, upperBoundary){

	var mousePosition = Math.max(Math.min(position,mouseMax), mouseMin);
	var mouseRelativePosition = (mousePosition-mouseMin)/ (mouseMax-mouseMin);
	var spaceLength = upperBoundary-lowerBoundary;
	var normalizedMovement = lowerBoundary + (mouseRelativePosition*spaceLength);
	return normalizedMovement;

}