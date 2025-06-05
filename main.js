import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const Texureloader = new THREE.TextureLoader();
Texureloader.load('imgs/2K_mercury.jpg', function (texture) {
    scene.background = texture;
});
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();

camera.position.set(0, 10, 50);


function newPlanet(planetSize, planetPositionX, planetTextureImg, sceneHierarchy) {
    const planetTexture = new THREE.TextureLoader().load(planetTextureImg)
    const planetGeometry = new THREE.SphereGeometry(planetSize, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({
        map: planetTexture,
        /* emissive: 0xffaa00,
        emissiveIntensity: 0.3, */
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    sceneHierarchy.add(planet);

    planet.position.x = planetPositionX;




    return planet;
}

function addPlanetRing(sceneHierarchy, ringPositionX, ringWidth) {
    /* const ringTexture = new THREE.TextureLoader().load('imgs/2k_saturn_ring_alpha.png'); */
    const ringGeometry = new THREE.RingGeometry(ringPositionX - ringWidth, ringPositionX + ringWidth, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        /* map: ringTexture, */
        color: 0x857b73,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
    }); 
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    sceneHierarchy.add(ring);
} 

function newOrbit(planetPositionX, sceneHierarchy) {
    const orbitGeometry = new THREE.RingGeometry(planetPositionX - 0.1, planetPositionX + 0.1, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
    }); 
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    sceneHierarchy.add(orbit);
}

function animateOrbit(planet, planetPositionX, planetRotationSpeed) {
    let planetAngle = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        

        planetAngle += planetRotationSpeed;

        const planetRadius = planetPositionX;
        planet.position.x = planetRadius * Math.cos(planetAngle);
        planet.position.z = planetRadius * Math.sin(planetAngle);

        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

function createSolarSystemePlanet(planetSize, planetTextureImg, planetPositionX, planetRotationSpeed, sceneHierarchy) {
    
    // create plane
    const planet = newPlanet(planetSize, planetPositionX, planetTextureImg, sceneHierarchy);

    // create orbit
    newOrbit(planetPositionX, sceneHierarchy);

    // animate planet orbit
    animateOrbit(planet, planetPositionX, planetRotationSpeed);

    return planet;
}



// sun
const planetTexture = new THREE.TextureLoader().load('imgs/2k_sun.jpg');
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const SunMaterial = new THREE.MeshBasicMaterial({
    map: planetTexture,
    /* emissive: 0xffaa00,
    emissiveIntensity: 0.3, */
});
const sun = new THREE.Mesh(sunGeometry, SunMaterial);
scene.add(sun);

/* glow */
const glowGeometry = new THREE.SphereGeometry(7, 32, 32);
const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.1,
});
const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
sun.add(sunGlow);


// Mercure — petite, proche du Soleil
createSolarSystemePlanet(0.5, 'imgs/2k_mercury.jpg', 10, 0.047, scene);

// Vénus — presque taille Terre
createSolarSystemePlanet(0.9, 'imgs/2k_venus_surface.jpg', 15, 0.035, scene);

// Terre
const earth = createSolarSystemePlanet(1, 'imgs/2k_earth_daymap.jpg', 20, 0.03, scene);

// lune
createSolarSystemePlanet(0.2, 'imgs/2k_moon.jpg', 2, 0.1, earth);

// Mars — plus petite que Terre
createSolarSystemePlanet(0.7, 'imgs/2k_mars.jpg', 27, 0.024, scene);

// Jupiter — très grosse mais réduite pour lisibilité
createSolarSystemePlanet(2.5, 'imgs/2k_jupiter.jpg', 40, 0.013, scene);

// Saturne — un peu plus petite que Jupiter
const saturn = createSolarSystemePlanet(2.1, 'imgs/2k_saturn.jpg', 55, 0.009, scene);
addPlanetRing(saturn, 3, 0.4);

// Uranus — bien plus petite
createSolarSystemePlanet(1.2, 'imgs/2k_uranus.jpg', 70, 0.006, scene);

// Neptune — similaire à Uranus
createSolarSystemePlanet(1.2, 'imgs/2k_neptune.jpg', 85, 0.005, scene);






renderer.render(scene, camera);


