import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

function main(){
	const canvas = document.querySelector('#c');
	const renderer = new THREE.WebGLRenderer({canvas});
	
	const fov = 75;
	const aspect = 2;
	const near = 0.1;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 0, 25);

	//const controls = new OrbitControls(camera, canvas);
  	//controls.target.set(0, 0, 0);
	//controls.update();

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x0b0c10);

	const color2 = 0xffffff;
	const intensity2 = 0.5;
	const light2 = new THREE.AmbientLight(color2, intensity2);
	scene.add(light2);

	const r = 4;
	const tube = 2;
	const rSeg = 25;
	const tSeg = 25;
	const geometry = new THREE.TorusGeometry( r, tube, rSeg, tSeg );
	const material = new THREE.MeshPhongMaterial( { color: 0x45a29e } );
	const torus = new THREE.Mesh( geometry, material );
	scene.add( torus );
	material.wireframe = true;
	torus.position.x = 10;

	const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
	const boxMaterial = new THREE.MeshPhongMaterial({color: 0xc5c6c7});
	
	const cubes = [];
	const cubeNum = 1000;
	for (let i = 0; i < cubeNum; i++){
		const cube = new THREE.Mesh(boxGeometry, boxMaterial);
		scene.add(cube);
		cubes.push(cube);
		cube.position.x = (Math.random() - 0.5) * 50;
		cube.position.y = (Math.random() - 0.5) * 25;
		cube.position.z = (Math.random() - 0.5) * far;
	}


	function render(time){
		time *= 0.001;
		if (resizeRenderer(renderer)){
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		cubes.forEach((cube, ndx) => {
			const speed = 1 + (ndx * 0.01);
			const rot = time * speed;
			cube.rotation.set(rot, rot, rot);
			cube.position.z += 0.1;
			if (cube.position.z > 25){
				cube.position.x = (Math.random() - 0.5) * 100;
				cube.position.y = (Math.random() - 0.5) * 100;
				cube.position.z = (Math.random() - 0.5) * far/10;
			}
		})

		torus.rotation.x = time;
		torus.rotation.y = time;
		
		//controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	function resizeRenderer(renderer){
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize){
			renderer.setSize(width, height, false);
		}

		return needResize;
	}

	requestAnimationFrame(render);
}

window.onload = main;