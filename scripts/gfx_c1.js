// Init
var cv = document.getElementById("cv"); // The canvas
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x0070CC);
var asp = cv.width / cv.height;
var cam = new THREE.PerspectiveCamera(36, asp, 0.1, 1000);
var clock = new THREE.Clock();
clock.start();

function resizer() {
	cv = document.getElementById("cv"); // The canvas		
	var cv_w = 1200;
	var cv_h = 300;
	if (window.innerWidth < cv_w) {
		cv_w = window.innerWidth;
		cv_h = cv_w * (3.0/12.0);
	}
	//
	cam.aspect = cv_w / cv_h;
    cam.updateProjectionMatrix();
    renderer.setSize(cv_w, cv_h);
	// Icon
	ic = document.getElementById("icon");
	px = cv.offsetLeft + 5.0;
	py = cv.offsetTop + 3.0;
	ic.style.left = px;	
	ic.style.top = py;
}

// Init:Renderer
var renderer = new THREE.WebGLRenderer({canvas:cv, antialias:true});
resizer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//renderer.shadowMap.soft = true;
//document.body.appendChild(renderer.domElement);

// Window resize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){	
	resizer();
}

// Floor
meshFloor = new THREE.Mesh(
	new THREE.PlaneGeometry(100, 100, 8, 8),
	new THREE.MeshPhongMaterial({
		color:0x003099,
		shininess:4,
		wireframe:false
		})
);
//meshFloor.rotation.x = -Math.PI / 2.0; // Lay flat (was standing)
meshFloor.receiveShadow = true;
scene.add(meshFloor);


// Wirecube
var mesh_wcube = new THREE.Mesh(
	new THREE.BoxGeometry(1,1,1),
	new THREE.MeshBasicMaterial({color:0xFFFFFF, wireframe:true})
);
mesh_wcube.receiveShadow = true;
mesh_wcube.castShadow = true;
//scene.add(mesh_wcube);


// stand
mesh_stand = new THREE.Mesh(
	new THREE.CylinderGeometry(1,1.0,3,36,3),
	new THREE.MeshPhongMaterial({
		color:0x333333,		
		flatShading:false
	})
);
//scene.add(mesh_stand);
mesh_stand.position.set(0,0,0);
mesh_stand.receiveShadow = true;
mesh_stand.castShadow = true;

//// Texture box (mesh_tcube);
var textureLoader = new THREE.TextureLoader();
// Diff
brickDiff = textureLoader.load("img/brick_diff.png");
brickDiff.anisotropy = renderer.capabilities.getMaxAnisotropy();
// Bump
brickBump = textureLoader.load("img/brick_bump.png");
brickBump.anisotropy = renderer.capabilities.getMaxAnisotropy();
// Mesh
mesh_tcube = new THREE.Mesh(
	new THREE.BoxGeometry(3,3,3),
	new THREE.MeshPhongMaterial({
		color:0x999999,
		//map:brickDiff,		
		flatShading:true
	})
);
scene.add(mesh_tcube);
mesh_tcube.position.set(0,0,0);
mesh_tcube.receiveShadow = true;
mesh_tcube.castShadow = true;

// OBJ (imported)
var mesh_hab = null;
var textureLoader = new THREE.TextureLoader();
// Diff
hab_diff = textureLoader.load("img/hab_diff.png");
hab_diff.anisotropy = renderer.capabilities.getMaxAnisotropy();
var mat1 = new THREE.MeshPhongMaterial({
	color:0x888888, 
	map:hab_diff,
	shininess:4,
	flatShading:true,
	wireframe:false}
	);
var objLoader = new THREE.OBJLoader();
var url = "models/hab2.obj";
objLoader.load(url, function(mesh) {	
	mesh.traverse(function(node) {
		if (node instanceof THREE.Mesh) {
			mesh_hab = mesh;	
			node.castShadow = true;
			node.receiveShadow = true;
			node.material = mat1;
		}
	});
	scene.add(mesh);
	mesh.position.set(0,1,0);	
});


var mesh_ribbon = null;
var textureLoader = new THREE.TextureLoader();
// Diff
ribbon_diff = textureLoader.load("img/ribbon.png");
ribbon_diff.anisotropy = renderer.capabilities.getMaxAnisotropy();
var mat2 = new THREE.MeshPhongMaterial({
	color:0x888888, 
	map:ribbon_diff,
	shininess:1,
	flatShading:true,
	wireframe:false}
	);
var objLoader = new THREE.OBJLoader();
var url = "models/ribbon.obj";
objLoader.load(url, function(mesh) {	
	mesh.traverse(function(node) {
		if (node instanceof THREE.Mesh) {
			mesh_ribbon = mesh;	
			node.castShadow = true;
			node.receiveShadow = true;
			node.material = mat2;
		}
	});
	scene.add(mesh);
	mesh.position.set(0,1,0);	
	mesh.rotation.x = Math.PI / 2.0; // Lay flat (was standing)
	mesh_ribbon.scale.set(2.5, 2.5, 2.5);
});


//// Lights
var ambientLight = new THREE.AmbientLight(0xFFFF00, 0.10); 
//scene.add(ambientLight); // off for now
//
sz = 1024;
var L1 = new THREE.PointLight(0xFFFFFF, 1.9, 70);
L1.castShadow = false;
L1.shadow.mapSize.width = sz;
L1.shadow.mapSize.height = sz;
L1.shadow.camera.near = 2;
L1.shadow.camera.far = 80;
L1.shadow.bias = 0.0;
scene.add(L1);

var L2 = new THREE.PointLight(0xFFFFFF, 1.6, 50);
L2.castShadow = true;
L2.shadow.mapSize.width = sz;
L2.shadow.mapSize.height = sz;
L2.shadow.camera.near = 2;
L2.shadow.camera.far = 80;
L2.shadow.bias = 0.0;
scene.add(L2);

// Cam pos
cam.position.set(0, 1.2, 7);
cam.lookAt(new THREE.Vector3(0,1.2,0));

//cam.position.set(2, 2, 4);
//cam.lookAt(new THREE.Vector3(7,-2,-3));


var update = function() {	
	meshFloor.position.set(0,0,-7);
	
	// Wire cube at origin
	mesh_wcube.position.set(0,0.52,0);
	mesh_wcube.rotation.y += 0.02;
	
	// Textured cube(base) 3wide ('radius' = 1.5)
	mesh_tcube.rotation.y = 0.0;
	mesh_tcube.position.set(7, -1.4, -3);
	
	// Ribbon
	mesh_ribbon.position.set(7, -1.1, -2.3);

	// Balloon
	tf = clock.getElapsedTime();
	py = 2.1 + (0.5 * Math.sin(tf * 0.3));
	mesh_hab.position.set(7, py, -3);
	mesh_hab.rotation.y += 0.0030;

	L1.position.set(2, 5, 12); // L1 no shadow
	L2.position.set(-9,10,12); // L2 shadow on
	//L2.position.x += 0.02;
};
var render = function() {
	renderer.render(scene, cam);
}
var GameLoop = function() {
	requestAnimationFrame(GameLoop);
	
	update();
	render();
}

GameLoop();