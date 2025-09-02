/**
 * MAWI MAN 3D Component
 * @package MAWI MAN
 * @author Mawi Man
 * @license Proprietary - All rights reserved to Ayoub Alarjani
 */

window.onload = function() {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.body.appendChild(renderer.domElement);

            camera.position.z = 130;
            camera.position.y = 10;

            scene.background = new THREE.Color(0x000c1c);
            scene.fog = new THREE.Fog(0x000c1c, 100, 800);
            const ambientLight = new THREE.AmbientLight(0x404040, 5);
            scene.add(ambientLight);
            const sunLight = new THREE.DirectionalLight(0xffffff, 1);
            sunLight.castShadow = true;
            sunLight.shadow.mapSize.width = 2048;
            sunLight.shadow.mapSize.height = 2048;
            sunLight.shadow.camera.near = 1;
            sunLight.shadow.camera.far = 100;
            scene.add(sunLight);
            const sun = new THREE.Mesh(
                new THREE.SphereGeometry(20, 32, 32),
                new THREE.MeshBasicMaterial({ color: 0xfff0c0, emissive: 0xfff0c0 })
            );
            scene.add(sun);
            const sunGlowLight = new THREE.PointLight(0xfff0c0, 5000, 200);
            scene.add(sunGlowLight);
            const moonLight = new THREE.PointLight(0xf0f0ff, 0.5, 300);
            scene.add(moonLight);
            const moonTextureLoader = new THREE.TextureLoader();
            const moonTexture = moonTextureLoader.load('https://www.mawiman.com/assets/img/3D/moon_1024.jpg');
            const moon = new THREE.Mesh(
                new THREE.SphereGeometry(10, 32, 32),
                new THREE.MeshStandardMaterial({
                    map: moonTexture,
                    color: 0xffffff,
                    emissive: 0xffffff,
                    emissiveIntensity: 0.5
                })
            );
            scene.add(moon);
            
            const waterGeometry = new THREE.PlaneGeometry(2000, 2000);
            const water = new THREE.Water(
                waterGeometry,
                {
                    textureWidth: 1024,
                    textureHeight: 1024,
                    waterNormals: new THREE.TextureLoader().load('https://www.mawiman.com/assets/img/3D/waternormals.jpg', function(texture) {
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(10, 10);
                    }),
                    alpha: 1.0,
                    sunDirection: sunLight.position.clone().normalize(),
                    sunColor: 0xffffff,
                    waterColor: 0x000510,
                    distortionScale: 3.7,
                    fog: scene.fog !== undefined,
                    side: THREE.DoubleSide
                }
            );
            water.rotation.x = -Math.PI / 2;
            water.position.y = -5;
            scene.add(water);
            
            const oceanFloorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
            const stoneTextureLoader = new THREE.TextureLoader();
            const stoneTexture = stoneTextureLoader.load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
            
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            
            for (let i = 0; i < 1000; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                const size = Math.random() * 20 + 5;
                const gray = Math.floor(Math.random() * 100 + 50);
                ctx.fillStyle = `rgb(${gray}, ${gray - 10}, ${gray - 20})`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            const stoneCanvasTexture = new THREE.CanvasTexture(canvas);
            stoneCanvasTexture.wrapS = stoneCanvasTexture.wrapT = THREE.RepeatWrapping;
            stoneCanvasTexture.repeat.set(20, 20);
            
            const oceanFloorMaterial = new THREE.MeshStandardMaterial({
                map: stoneCanvasTexture,
                color: 0x2a2a2a,
                metalness: 0.1,
                roughness: 0.9,
                normalScale: new THREE.Vector2(2, 2)
            });
            
            const positions = oceanFloorGeometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const z = positions.getZ(i);
                const height = Math.sin(x * 0.01) * Math.cos(z * 0.01) * 10 + Math.random() * 5;
                positions.setY(i, height);
            }
            positions.needsUpdate = true;
            oceanFloorGeometry.computeVertexNormals();
            
            const oceanFloor = new THREE.Mesh(oceanFloorGeometry, oceanFloorMaterial);
            oceanFloor.rotation.x = -Math.PI / 2;
            oceanFloor.position.y = -200;
            oceanFloor.receiveShadow = true;
            scene.add(oceanFloor);
            
            const glowingBugs = [];
            const bugCount = 30;
            
            const fishes = [];
            const fishCount = 15;
            
            for (let i = 0; i < fishCount; i++) {
                const fishGroup = new THREE.Group();
                
                const fishBodyGeometry = new THREE.CylinderGeometry(0.3, 0.8, 3, 8);
                const fishBodyMaterial = new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(Math.random() * 0.6 + 0.1, 0.8, 0.6),
                    metalness: 0.3,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.9
                });
                const fishBody = new THREE.Mesh(fishBodyGeometry, fishBodyMaterial);
                fishBody.rotation.z = Math.PI / 2;
                
                const fishTailGeometry = new THREE.ConeGeometry(0.8, 1.5, 6);
                const fishTailMaterial = new THREE.MeshStandardMaterial({
                    color: fishBodyMaterial.color.clone().multiplyScalar(0.8),
                    metalness: 0.2,
                    roughness: 0.5,
                    transparent: true,
                    opacity: 0.8
                });
                const fishTail = new THREE.Mesh(fishTailGeometry, fishTailMaterial);
                fishTail.position.set(-2, 0, 0);
                fishTail.rotation.z = Math.PI / 2;
                
                const finGeometry = new THREE.PlaneGeometry(0.8, 0.4);
                const finMaterial = new THREE.MeshStandardMaterial({
                    color: fishBodyMaterial.color.clone().multiplyScalar(0.7),
                    transparent: true,
                    opacity: 0.7,
                    side: THREE.DoubleSide
                });
                
                const topFin = new THREE.Mesh(finGeometry, finMaterial);
                topFin.position.set(0, 0.8, 0);
                topFin.rotation.x = Math.PI / 6;
                
                const bottomFin = new THREE.Mesh(finGeometry, finMaterial);
                bottomFin.position.set(0, -0.8, 0);
                bottomFin.rotation.x = -Math.PI / 6;
                
                const sideFin1 = new THREE.Mesh(finGeometry, finMaterial);
                sideFin1.position.set(0.5, 0, 0.6);
                sideFin1.rotation.y = Math.PI / 4;
                
                const sideFin2 = new THREE.Mesh(finGeometry, finMaterial);
                sideFin2.position.set(0.5, 0, -0.6);
                sideFin2.rotation.y = -Math.PI / 4;
                
                fishGroup.add(fishBody);
                fishGroup.add(fishTail);
                fishGroup.add(topFin);
                fishGroup.add(bottomFin);
                fishGroup.add(sideFin1);
                fishGroup.add(sideFin2);
                
                const fish = fishGroup;
                
                fish.position.set(
                    (Math.random() - 0.5) * 300,
                    -10 - Math.random() * 80,
                    (Math.random() - 0.5) * 300
                );
                
                fish.userData = {
                    velocity: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.3,
                        (Math.random() - 0.5) * 0.1,
                        (Math.random() - 0.5) * 0.3
                    ),
                    swimSpeed: Math.random() * 0.02 + 0.01,
                    swimTime: Math.random() * Math.PI * 2,
                    originalY: fish.position.y,
                    jumpCooldown: 0,
                    isJumping: false,
                    jumpVelocity: 0,
                    jumpHeight: 0,
                    jumpPhase: 'ascending',
                    isHeadUp: false,
                    headUpTime: 0,
                    headCooldown: 0,
                    targetY: fish.position.y,
                    tailSwim: Math.random() * Math.PI * 2,
                    finSwim: Math.random() * Math.PI * 2,
                    body: fishBody,
                    tail: fishTail,
                    topFin: topFin,
                    bottomFin: bottomFin,
                    sideFin1: sideFin1,
                    sideFin2: sideFin2
                };
                
                fishes.push(fish);
                scene.add(fish);
            }
            
            for (let i = 0; i < bugCount; i++) {
                const bugGeometry = new THREE.SphereGeometry(0.5, 8, 6);
                const bugMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.1, 1, 0.8),
                    emissive: new THREE.Color().setHSL(Math.random() * 0.3 + 0.1, 1, 0.5),
                    transparent: true,
                    opacity: 0.8
                });
                
                const bug = new THREE.Mesh(bugGeometry, bugMaterial);
                
                bug.position.set(
                    (Math.random() - 0.5) * 400,
                    -20 - Math.random() * 150,
                    (Math.random() - 0.5) * 400
                );
                
                const bugLight = new THREE.PointLight(
                    bugMaterial.color.getHex(),
                    2,
                    20
                );
                bugLight.position.copy(bug.position);
                scene.add(bugLight);
                
                bug.userData = {
                    light: bugLight,
                    velocity: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.1,
                        (Math.random() - 0.5) * 0.05,
                        (Math.random() - 0.5) * 0.1
                    ),
                    originalY: bug.position.y,
                    time: Math.random() * Math.PI * 2,
                    speed: Math.random() * 0.02 + 0.01
                };
                
                glowingBugs.push(bug);
                scene.add(bug);
            }

            const starGeometry = new THREE.BufferGeometry();
            const starCount = 20000;
            const starPositions = new Float32Array(starCount * 3);
            for (let i = 0; i < starCount * 3; i += 3) {
                starPositions[i] = (Math.random() - 0.5) * 800;
                starPositions[i + 1] = Math.random() * 800;
                starPositions[i + 2] = (Math.random() - 0.5) * 800;
            }
            starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
            const starMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.2,
                transparent: true,
                opacity: 0.8
            });
            const starField = new THREE.Points(starGeometry, starMaterial);
            scene.add(starField);
            
            const birds = [];
            const largeBirds = [];
            const birdCount = 25;
            const largeBirdCount = 8;
            
            const flocks = [
                { size: 8, leader: null, formation: 'V' },
                { size: 5, leader: null, formation: 'line' },
                { size: 3, leader: null, formation: 'triangle' }
            ];
            
            for (let i = 0; i < birdCount; i++) {
                const birdGroup = new THREE.Group();
                
                const bodyGeometry = new THREE.ConeGeometry(0.3, 1.5, 4);
                const bodyMaterial = new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    transparent: true,
                    opacity: 0.8
                });
                const birdBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
                
                const rightWingGeometry = new THREE.PlaneGeometry(1, 0.5);
                const rightWingMaterial = new THREE.MeshBasicMaterial({
                    color: 0x1a1a1a,
                    transparent: true,
                    opacity: 0.7,
                    side: THREE.DoubleSide
                });
                const rightWing = new THREE.Mesh(rightWingGeometry, rightWingMaterial);
                rightWing.position.set(0.6, 0, 0);
                rightWing.rotation.y = Math.PI / 6;

                const leftWingGeometry = new THREE.PlaneGeometry(1, 0.5);
                const leftWingMaterial = new THREE.MeshBasicMaterial({
                    color: 0x1a1a1a,
                    transparent: true,
                    opacity: 0.7,
                    side: THREE.DoubleSide
                });
                const leftWing = new THREE.Mesh(leftWingGeometry, leftWingMaterial);
                leftWing.position.set(-0.6, 0, 0);
                leftWing.rotation.y = -Math.PI / 6;
                
                birdGroup.add(birdBody);
                birdGroup.add(rightWing);
                birdGroup.add(leftWing);
                
                const bird = birdGroup;
                
                bird.position.set(
                    (Math.random() - 0.5) * 800,
                    50 + Math.random() * 100,
                    (Math.random() - 0.5) * 800
                );
                
                const isFlocking = i < 16;
                let flockIndex = -1;
                let positionInFlock = -1;
                
                if (isFlocking) {
                    if (i < 8) {
                        flockIndex = 0;
                        positionInFlock = i;
                    } else if (i < 13) {
                        flockIndex = 1;
                        positionInFlock = i - 8;
                    } else {
                        flockIndex = 2;
                        positionInFlock = i - 13;
                    }
                    
                    if (positionInFlock === 0) {
                        flocks[flockIndex].leader = bird;
                    }
                }
                
                bird.userData = {
                    velocity: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.2,
                        (Math.random() - 0.5) * 0.05,
                        (Math.random() - 0.5) * 0.2
                    ),
                    wingBeat: Math.random() * Math.PI * 2,
                    wingSpeed: Math.random() * 0.3 + 0.2,
                    isFlocking: isFlocking,
                    flockIndex: flockIndex,
                    positionInFlock: positionInFlock,
                    baseSpeed: Math.random() * 0.1 + 0.05,
                    turnSpeed: Math.random() * 0.02 + 0.01,
                    rightWing: rightWing,
                    leftWing: leftWing,
                    body: birdBody,
                    approachDistance: Math.random() * 100 + 50,
                    approachSpeed: Math.random() * 0.02 + 0.01,
                    isApproaching: Math.random() < 0.5,
                    originalScale: 1,
                    targetScale: Math.random() * 0.5 + 0.5
                };
                
                birds.push(bird);
                scene.add(bird);
            }
            
            for (let i = 0; i < largeBirdCount; i++) {
                const largeBirdGroup = new THREE.Group();
                
                const largeBodyGeometry = new THREE.ConeGeometry(1.2, 4, 6);
                const largeBodyMaterial = new THREE.MeshBasicMaterial({
                    color: 0x1a1a1a,
                    transparent: true,
                    opacity: 0.9
                });
                const largeBirdBody = new THREE.Mesh(largeBodyGeometry, largeBodyMaterial);
                
                const largeRightWingGeometry = new THREE.PlaneGeometry(3, 1.5);
                const largeRightWingMaterial = new THREE.MeshBasicMaterial({
                    color: 0x0d0d0d,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide
                });
                const largeRightWing = new THREE.Mesh(largeRightWingGeometry, largeRightWingMaterial);
                largeRightWing.position.set(2, 0, 0);
                largeRightWing.rotation.y = Math.PI / 4;
                
                const largeLeftWingGeometry = new THREE.PlaneGeometry(3, 1.5);
                const largeLeftWingMaterial = new THREE.MeshBasicMaterial({
                    color: 0x0d0d0d,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide
                });
                const largeLeftWing = new THREE.Mesh(largeLeftWingGeometry, largeLeftWingMaterial);
                largeLeftWing.position.set(-2, 0, 0);
                largeLeftWing.rotation.y = -Math.PI / 4;
                
                largeBirdGroup.add(largeBirdBody);
                largeBirdGroup.add(largeRightWing);
                largeBirdGroup.add(largeLeftWing);
                
                const largeBird = largeBirdGroup;
                
                largeBird.position.set(
                    (Math.random() - 0.5) * 1000,
                    80 + Math.random() * 150,
                    (Math.random() - 0.5) * 1000
                );
                
                largeBird.userData = {
                    velocity: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.15,
                        (Math.random() - 0.5) * 0.03,
                        (Math.random() - 0.5) * 0.15
                    ),
                    wingBeat: Math.random() * Math.PI * 2,
                    wingSpeed: Math.random() * 0.15 + 0.1,
                    glideTime: Math.random() * 200 + 100,
                    glideCounter: 0,
                    isGliding: Math.random() < 0.5,
                    circleRadius: Math.random() * 50 + 30,
                    circleAngle: Math.random() * Math.PI * 2,
                    circleSpeed: Math.random() * 0.01 + 0.005,
                    baseSpeed: Math.random() * 0.08 + 0.04,
                    rightWing: largeRightWing,
                    leftWing: largeLeftWing,
                    body: largeBirdBody,
                    approachDistance: Math.random() * 150 + 100,
                    approachSpeed: Math.random() * 0.015 + 0.008,
                    isApproaching: Math.random() < 0.5,
                    originalScale: 1,
                    targetScale: Math.random() * 0.7 + 0.4
                };
                
                largeBirds.push(largeBird);
                scene.add(largeBird);
            }

            let mainTextMesh;
            
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load('https://www.mawiman.com/assets/img/mawiman/Icon-1.png', function(texture) {
                const geometry = new THREE.PlaneGeometry(60, 60);
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    alphaTest: 0.1
                });
                mainTextMesh = new THREE.Mesh(geometry, material);
                mainTextMesh.position.y = 20;
                scene.add(mainTextMesh);
            });
            
            const contentWrapper = document.getElementById('content-wrapper');
        const contentInner = contentWrapper.querySelector('.content-inner');
            let isUnderwater = false;
            
            const animate = function(time) {
                requestAnimationFrame(animate);
                const globalTime = Date.now() * 0.001;
                
                const orbitRadius = 400;
                const orbitSpeed = 0.1;
                const angle = (globalTime * orbitSpeed) % (Math.PI * 2);
                
                sun.position.x = Math.sin(angle) * orbitRadius;
                sun.position.y = Math.cos(angle) * orbitRadius;
                sun.position.z = Math.sin(angle) * 100;
                
                moon.position.x = -Math.sin(angle) * orbitRadius;
                moon.position.y = -Math.cos(angle) * orbitRadius;
                moon.position.z = -Math.sin(angle) * 100;

                const sunY = sun.position.y;
                sunLight.position.copy(sun.position);
                sunGlowLight.position.copy(sun.position);
                moonLight.position.copy(moon.position);

                let dayFactor = Math.max(0, sunY / orbitRadius);
                if (sunY < 0) {
                    dayFactor = 0;
                }

                sunLight.intensity = dayFactor * 20;
                sunGlowLight.intensity = dayFactor * 5000;
                moonLight.intensity = (1 - dayFactor) * 0.5;

                const dayColor = new THREE.Color(0x4682b4);
                const nightColor = new THREE.Color(0x000c1c);
                const lerpedColor = new THREE.Color();
                lerpedColor.copy(nightColor).lerp(dayColor, dayFactor);
                
                if (!isUnderwater) {
                    scene.background = lerpedColor;
                    scene.fog.color = lerpedColor;
                }
                
                starField.rotation.y += 0.001;
                starField.material.opacity = 1 - dayFactor;
                
                fishes.forEach((fish, index) => {
                    const userData = fish.userData;
                    
                    userData.swimTime += userData.swimSpeed;
                    
                    userData.tailSwim += 0.15;
                    userData.tail.rotation.y = Math.sin(userData.tailSwim) * 0.3;
                    
                    userData.finSwim += 0.1;
                    userData.topFin.rotation.z = Math.sin(userData.finSwim) * 0.2;
                    userData.bottomFin.rotation.z = -Math.sin(userData.finSwim) * 0.2;
                    userData.sideFin1.rotation.x = Math.sin(userData.finSwim * 0.8) * 0.15;
                    userData.sideFin2.rotation.x = -Math.sin(userData.finSwim * 0.8) * 0.15;
                    
                    userData.body.position.y = Math.sin(userData.swimTime * 2) * 0.1;
                    
                    fish.position.add(userData.velocity);
                    fish.position.y = userData.originalY + Math.sin(userData.swimTime) * 2;
                    
                    if (Math.random() < 0.005) {
                        userData.velocity.x += (Math.random() - 0.5) * 0.02;
                        userData.velocity.z += (Math.random() - 0.5) * 0.02;
                        userData.velocity.normalize().multiplyScalar(0.1);
                    }
                    
                    if (!userData.isHeadUp && userData.headCooldown <= 0 && Math.random() < 0.001) {
                        userData.isHeadUp = true;
                        userData.headUpTime = 60 + Math.random() * 40;
                        userData.headCooldown = 400 + Math.random() * 300;
                        userData.targetY = -2;
                    }
                    
                    if (userData.isHeadUp) {
                        fish.position.y = THREE.MathUtils.lerp(fish.position.y, userData.targetY, 0.05);
                        userData.headUpTime--;
                        
                        if (userData.headUpTime <= 0) {
                            userData.isHeadUp = false;
                            userData.targetY = userData.originalY;
                        }
                    } else {
                        if (fish.position.y > userData.originalY) {
                            fish.position.y = THREE.MathUtils.lerp(fish.position.y, userData.originalY + Math.sin(userData.swimTime) * 2, 0.03);
                        }
                        userData.headCooldown--;
                    }
                    
                    if (!userData.isJumping && !userData.isHeadUp && userData.jumpCooldown <= 0 && Math.random() < 0.0002) {
                        userData.isJumping = true;
                        userData.jumpVelocity = 0.8 + Math.random() * 0.4;
                        userData.jumpHeight = fish.position.y;
                        userData.jumpCooldown = 500 + Math.random() * 400;
                        userData.jumpPhase = 'ascending';
                        
                        const createRealisticRipple = (x, z, intensity = 1) => {
                            for (let r = 0; r < 3; r++) {
                                const ripple = new THREE.Mesh(
                                    new THREE.RingGeometry(0.2 + r * 0.3, 0.5 + r * 0.4, 16),
                                    new THREE.MeshBasicMaterial({
                                        color: 0x4a90e2,
                                        transparent: true,
                                        opacity: 0.4 - r * 0.1,
                                        side: THREE.DoubleSide
                                    })
                                );
                                ripple.position.set(x, -4.9, z);
                                ripple.rotation.x = -Math.PI / 2;
                                scene.add(ripple);
                                
                                const delay = r * 100;
                                setTimeout(() => {
                                    const rippleAnimation = () => {
                                        ripple.scale.multiplyScalar(1.02);
                                        ripple.material.opacity *= 0.98;
                                        if (ripple.material.opacity > 0.01 && ripple.scale.x < 8) {
                                            requestAnimationFrame(rippleAnimation);
                                        } else {
                                            scene.remove(ripple);
                                        }
                                    };
                                    rippleAnimation();
                                }, delay);
                            }
                        };
                        
                        createRealisticRipple(fish.position.x, fish.position.z);
                    }
                    
                    if (userData.isJumping) {
                        if (userData.jumpPhase === 'ascending') {
                            fish.position.y += userData.jumpVelocity;
                            userData.jumpVelocity -= 0.02;
                            
                            fish.rotation.x = -Math.PI / 6;
                            
                            if (userData.jumpVelocity <= 0) {
                                userData.jumpPhase = 'descending';
                            }
                        } else if (userData.jumpPhase === 'descending') {
                            fish.position.y += userData.jumpVelocity;
                            userData.jumpVelocity -= 0.02;
                            
                            fish.rotation.x = Math.PI / 6;
                            
                            if (fish.position.y <= userData.originalY) {
                                userData.isJumping = false;
                                fish.position.y = userData.originalY;
                                fish.rotation.x = 0;
                                
                                const createSplashRipple = (x, z) => {
                                    for (let r = 0; r < 2; r++) {
                                        const splash = new THREE.Mesh(
                                            new THREE.RingGeometry(0.1 + r * 0.2, 0.4 + r * 0.3, 12),
                                            new THREE.MeshBasicMaterial({
                                                color: 0xffffff,
                                                transparent: true,
                                                opacity: 0.6 - r * 0.2,
                                                side: THREE.DoubleSide
                                            })
                                        );
                                        splash.position.set(x, -4.9, z);
                                        splash.rotation.x = -Math.PI / 2;
                                        scene.add(splash);
                                        
                                        const splashAnimation = () => {
                                            splash.scale.multiplyScalar(1.05);
                                            splash.material.opacity *= 0.94;
                                            if (splash.material.opacity > 0.01 && splash.scale.x < 6) {
                                                requestAnimationFrame(splashAnimation);
                                            } else {
                                                scene.remove(splash);
                                            }
                                        };
                                        splashAnimation();
                                    }
                                };
                                
                                createSplashRipple(fish.position.x, fish.position.z);
                            }
                        }
                    } else {
                        userData.jumpCooldown--;
                    }
                    
                    if (!userData.isJumping) {
                        const direction = userData.velocity.clone().normalize();
                        fish.lookAt(fish.position.clone().add(direction));
                    }
                    
                    if (Math.abs(fish.position.x) > 400 || Math.abs(fish.position.z) > 400) {
                        fish.position.set(
                            (Math.random() - 0.5) * 300,
                            userData.originalY,
                            (Math.random() - 0.5) * 300
                        );
                    }
                });
                
                glowingBugs.forEach(bug => {
                    bug.userData.time += bug.userData.speed;
                    
                    bug.position.add(bug.userData.velocity);
                    bug.position.y = bug.userData.originalY + Math.sin(bug.userData.time) * 5;
                    
                    if (Math.random() < 0.02) {
                        bug.userData.velocity.set(
                            (Math.random() - 0.5) * 0.1,
                            (Math.random() - 0.5) * 0.05,
                            (Math.random() - 0.5) * 0.1
                        );
                    }
                    
                    if (bug.position.x > 200) bug.position.x = -200;
                    if (bug.position.x < -200) bug.position.x = 200;
                    if (bug.position.z > 200) bug.position.z = -200;
                    if (bug.position.z < -200) bug.position.z = 200;
                    if (bug.position.y > -10) bug.position.y = -170;
                    if (bug.position.y < -180) bug.position.y = -20;
                    
                    bug.userData.light.position.copy(bug.position);
                    
                    const flicker = 0.8 + Math.sin(bug.userData.time * 3) * 0.2;
                    bug.userData.light.intensity = 2 * flicker;
                    bug.material.opacity = 0.6 + flicker * 0.2;
                });
                
                if (dayFactor > 0.3) {
                    birds.forEach((bird, index) => {
                        const userData = bird.userData;
                        
                         userData.wingBeat += userData.wingSpeed;
                         const wingMotion = Math.sin(userData.wingBeat);
                         
                         userData.rightWing.rotation.z = wingMotion * 0.8;
                         userData.rightWing.rotation.x = wingMotion * 0.3;
                         
                         userData.leftWing.rotation.z = -wingMotion * 0.8;
                         userData.leftWing.rotation.x = wingMotion * 0.3;
                         
                         userData.body.rotation.x = Math.sin(userData.wingBeat * 0.5) * 0.05;
                         
                         if (userData.isApproaching) {
                             userData.targetScale += userData.approachSpeed;
                             if (userData.targetScale > 1.5) {
                                 userData.isApproaching = false;
                             }
                         } else {
                             userData.targetScale -= userData.approachSpeed;
                             if (userData.targetScale < 0.3) {
                                 userData.isApproaching = true;
                             }
                         }
                         
                         bird.scale.setScalar(userData.targetScale);
                         
                         const distanceOpacity = Math.max(0.3, userData.targetScale);
                         userData.body.material.opacity = dayFactor * 0.8 * distanceOpacity;
                         userData.rightWing.material.opacity = dayFactor * 0.7 * distanceOpacity;
                         userData.leftWing.material.opacity = dayFactor * 0.7 * distanceOpacity;
                        
                        if (userData.isFlocking && userData.flockIndex !== -1) {
                            const flock = flocks[userData.flockIndex];
                            const leader = flock.leader;
                            
                            if (userData.positionInFlock === 0) {
                                bird.position.add(userData.velocity);
                                
                                if (Math.random() < 0.005) {
                                    userData.velocity.set(
                                        (Math.random() - 0.5) * 0.3,
                                        (Math.random() - 0.5) * 0.1,
                                        (Math.random() - 0.5) * 0.3
                                    );
                                }
                            } else {
                                if (leader) {
                                    const targetPos = leader.position.clone();
                                    
                                    if (flock.formation === 'V') {
                                        const side = userData.positionInFlock % 2 === 0 ? 1 : -1;
                                        const distance = Math.floor(userData.positionInFlock / 2) + 1;
                                        targetPos.x += side * distance * 8;
                                        targetPos.z -= distance * 5;
                                    } else if (flock.formation === 'line') {
                                        targetPos.x += (userData.positionInFlock - 2) * 6;
                                    } else if (flock.formation === 'triangle') {
                                        if (userData.positionInFlock === 1) {
                                            targetPos.x -= 4;
                                            targetPos.z -= 3;
                                        } else {
                                            targetPos.x += 4;
                                            targetPos.z -= 3;
                                        }
                                    }
                                    
                                    const direction = targetPos.sub(bird.position).normalize();
                                    bird.position.add(direction.multiplyScalar(userData.baseSpeed));
                                }
                            }
                        } else {
                            bird.position.add(userData.velocity);
                            
                            if (Math.random() < 0.01) {
                                userData.velocity.set(
                                    (Math.random() - 0.5) * 0.2,
                                    (Math.random() - 0.5) * 0.05,
                                    (Math.random() - 0.5) * 0.2
                                );
                            }
                        }
                        
                        if (userData.velocity.length() > 0) {
                            bird.lookAt(bird.position.clone().add(userData.velocity));
                        }
                        
                        if (Math.abs(bird.position.x) > 400 || Math.abs(bird.position.z) > 400 || bird.position.y < 30 || bird.position.y > 200) {
                            bird.position.set(
                                (Math.random() - 0.5) * 600,
                                50 + Math.random() * 100,
                                (Math.random() - 0.5) * 600
                            );
                        }
                        
                    });
                } else {
                      birds.forEach(bird => {
                          const userData = bird.userData;
                          userData.body.material.opacity = 0;
                          userData.rightWing.material.opacity = 0;
                          userData.leftWing.material.opacity = 0;
                      });
                  }
                 
                 if (dayFactor > 0.3) {
                     largeBirds.forEach((largeBird, index) => {
                          const userData = largeBird.userData;
                          
                          if (userData.isApproaching) {
                              userData.targetScale += userData.approachSpeed;
                              if (userData.targetScale > 1.8) {
                                  userData.isApproaching = false;
                              }
                          } else {
                              userData.targetScale -= userData.approachSpeed;
                              if (userData.targetScale < 0.2) {
                                  userData.isApproaching = true;
                              }
                          }
                          
                          largeBird.scale.setScalar(userData.targetScale);
                          
                          if (userData.isGliding) {
                              userData.glideCounter++;
                              
                              userData.circleAngle += userData.circleSpeed;
                              const circleX = Math.cos(userData.circleAngle) * userData.circleRadius;
                              const circleZ = Math.sin(userData.circleAngle) * userData.circleRadius;
                              
                              largeBird.position.x += circleX * 0.01;
                              largeBird.position.z += circleZ * 0.01;
                              largeBird.position.y += Math.sin(userData.circleAngle * 0.5) * 0.02;
                              
                              userData.wingBeat += userData.wingSpeed * 0.2;
                              const glideWingMotion = Math.sin(userData.wingBeat * 0.1);
                              
                              userData.rightWing.rotation.z = glideWingMotion * 0.1;
                              userData.rightWing.rotation.x = -0.2 + glideWingMotion * 0.05;
                              
                              userData.leftWing.rotation.z = -glideWingMotion * 0.1;
                              userData.leftWing.rotation.x = -0.2 + glideWingMotion * 0.05;
                              
                              if (userData.glideCounter > userData.glideTime) {
                                  userData.isGliding = false;
                                  userData.glideCounter = 0;
                                  userData.glideTime = Math.random() * 300 + 150;
                              }
                          } else {
                              userData.glideCounter++;
                              
                              userData.wingBeat += userData.wingSpeed;
                              const wingMotion = Math.sin(userData.wingBeat);
                              
                              userData.rightWing.rotation.z = wingMotion * 0.6;
                              userData.rightWing.rotation.x = wingMotion * 0.2;
                              
                              userData.leftWing.rotation.z = -wingMotion * 0.6;
                              userData.leftWing.rotation.x = wingMotion * 0.2;
                              
                              userData.body.rotation.x = Math.sin(userData.wingBeat * 0.3) * 0.03;
                              
                              largeBird.position.add(userData.velocity);
                              
                              if (Math.random() < 0.003) {
                                  userData.velocity.set(
                                      (Math.random() - 0.5) * 0.2,
                                      (Math.random() - 0.5) * 0.05,
                                      (Math.random() - 0.5) * 0.2
                                  );
                              }
                              
                              if (userData.glideCounter > userData.glideTime * 0.5) {
                                  userData.isGliding = true;
                                  userData.glideCounter = 0;
                              }
                          }
                         
                         if (userData.velocity.length() > 0) {
                             largeBird.lookAt(largeBird.position.clone().add(userData.velocity));
                         }
                         
                         if (Math.abs(largeBird.position.x) > 500 || Math.abs(largeBird.position.z) > 500 || largeBird.position.y < 60 || largeBird.position.y > 300) {
                             largeBird.position.set(
                                 (Math.random() - 0.5) * 800,
                                 80 + Math.random() * 150,
                                 (Math.random() - 0.5) * 800
                             );
                         }
                         
                          const largeDistanceOpacity = Math.max(0.2, userData.targetScale);
                          userData.body.material.opacity = dayFactor * 0.9 * largeDistanceOpacity;
                          userData.rightWing.material.opacity = dayFactor * 0.8 * largeDistanceOpacity;
                          userData.leftWing.material.opacity = dayFactor * 0.8 * largeDistanceOpacity;
                     });
                 } else {
                      largeBirds.forEach(largeBird => {
                          const userData = largeBird.userData;
                          userData.body.material.opacity = 0;
                          userData.rightWing.material.opacity = 0;
                          userData.leftWing.material.opacity = 0;
                      });
                 }
                
                water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
                water.material.uniforms.sunDirection.value.copy(sunLight.position).normalize();
                
                renderer.render(scene, camera);
            };

            function updateSurfaceButtonIcon() {
                const surfaceBtn = document.getElementById('surfaceBtn');
                const iconElement = surfaceBtn.querySelector('.material-symbols-rounded');
                
                if (camera.position.y >= 10) {
                    iconElement.textContent = 'keyboard_double_arrow_down';
                    surfaceBtn.title = 'Dive into the depths';
                    cameraLevel = 2;
                } else if (camera.position.y > -40) {
                    iconElement.textContent = 'keyboard_double_arrow_up';
                    surfaceBtn.title = 'Back to the surface';
                    cameraLevel = 1;
                } else {
                    iconElement.textContent = 'keyboard_double_arrow_up';
                    surfaceBtn.title = 'Back to the surface';
                    cameraLevel = 0;
                }
            }

            const scrollSpeed = 0.1;
            function handleScroll(deltaY) {
                camera.position.y -= deltaY * scrollSpeed;
                camera.position.y = Math.min(5, Math.max(-100, camera.position.y));

                const belowWater = camera.position.y < -5;
                const divingProgress = Math.max(0, Math.min(1, (-camera.position.y + 5) / 10));
                
                updateSurfaceButtonIcon();
                
                if (belowWater !== isUnderwater) {
                    isUnderwater = belowWater;
                    if (isUnderwater) {
                        scene.background.set(0x000005);
                        scene.fog.color.set(0x000005);
                        ambientLight.intensity = 0.5;
                        water.material.uniforms.distortionScale.value = 8;
                        sun.visible = false;
                        moon.visible = false;
                        sunLight.intensity = 0;
                        sunGlowLight.intensity = 0;
                        moonLight.intensity = 0;
                        if (mainTextMesh) mainTextMesh.visible = false;
                        contentWrapper.style.display = 'flex';
                        
                        const cards = contentWrapper.querySelectorAll('.underwater-card');
                        cards.forEach((card, index) => {
                            card.style.transform = `translateY(${100 - (divingProgress * 100)}px)`;
                            card.style.opacity = divingProgress;
                            card.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
                        });
                    } else {
                        const dayColor = new THREE.Color(0x4682b4);
                        const nightColor = new THREE.Color(0x000c1c);
                        const lerpedColor = new THREE.Color();
                        const dayFactor = Math.max(0, sun.position.y / 400);
                        lerpedColor.copy(nightColor).lerp(dayColor, dayFactor);
                        
                        scene.background.set(lerpedColor);
                        scene.fog.color.set(lerpedColor);
                        ambientLight.intensity = 5;
                        water.material.uniforms.distortionScale.value = 3.7;
                        sun.visible = true;
                        moon.visible = true;
                        sunLight.intensity = dayFactor * 20;
                        sunGlowLight.intensity = dayFactor * 5000;
                        moonLight.intensity = (1 - dayFactor) * 0.5;
                        if (mainTextMesh) mainTextMesh.visible = true;
                        contentWrapper.style.display = 'none';
                    }
                }
                
                if (isUnderwater) {
                    const cards = contentWrapper.querySelectorAll('.underwater-card');
                    cards.forEach((card, index) => {
                        const cardDepth = -15 - (index * 20);
                        const cardProgress = Math.max(0, Math.min(1, (-camera.position.y - cardDepth + 10) / 15));
                        
                        card.style.transform = `translateY(${50 - (cardProgress * 50)}px)`;
                        card.style.opacity = cardProgress;
                    });
                }
            }

            // Disable global scroll and touch events for diving/surfacing
            // Only the surface button can control diving/surfacing now
            // Scroll only works inside content area when underwater
            
            let touchStartY = 0;
            let lastTouchY = 0;
            let touchVelocity = 0;
            let isScrolling = false;
            let animationId = null;
            
            // Add scroll functionality only for content area when underwater
            contentWrapper.addEventListener('wheel', (event) => {
                if (isUnderwater) {
                    // Allow normal scrolling within content area when underwater
                    event.stopPropagation();
                }
            }, { passive: true });
            
            contentInner.addEventListener('touchstart', (event) => {
                if (isUnderwater) {
                    touchStartY = event.touches[0].clientY;
                    lastTouchY = touchStartY;
                    touchVelocity = 0;
                    isScrolling = true;
                    
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                }
            }, { passive: true });
            
            contentInner.addEventListener('touchmove', (event) => {
                if (isUnderwater && isScrolling) {
                    const touchCurrentY = event.touches[0].clientY;
                    const deltaY = lastTouchY - touchCurrentY;
                    
                    touchVelocity = deltaY * 2.5;
                    
                    contentInner.scrollTop += touchVelocity;
                    lastTouchY = touchCurrentY;
                }
            }, { passive: true });
            
            contentInner.addEventListener('touchend', () => {
                if (isUnderwater) {
                    isScrolling = false;
                    
                    if (Math.abs(touchVelocity) > 5) {
                        const momentum = () => {
                            touchVelocity *= 0.95;
                            contentInner.scrollTop += touchVelocity;
                            
                            if (Math.abs(touchVelocity) > 1) {
                                animationId = requestAnimationFrame(momentum);
                            } else {
                                animationId = null;
                            }
                        };
                        animationId = requestAnimationFrame(momentum);
                    }
                }
            }, { passive: true });
            
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            animate(performance.now());
            
            let cameraLevel = 1;
            
            updateSurfaceButtonIcon();
            
            document.getElementById('surfaceBtn').addEventListener('click', function() {
                const contentWrapper = document.getElementById('content-wrapper');
                let targetY;
                
                if (camera.position.y >= 10) {
                    // From surface: dive to underwater
                    targetY = -30;
                } else if (camera.position.y > -40) {
                    // From underwater: go back to surface
                    targetY = 10;
                    contentWrapper.style.display = 'none';
                } else {
                    // From deep underwater: go to shallow underwater
                    targetY = -30;
                }
                
                const animationDuration = 2000;
                const startY = camera.position.y;
                const startTime = Date.now();
                
                const cameraAnimation = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / animationDuration, 1);
                    
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    
                    camera.position.y = startY + (targetY - startY) * easeProgress;
                    
                    updateSurfaceButtonIcon();
                    
                    const belowWater = camera.position.y < -5;
                    if (belowWater !== isUnderwater) {
                        isUnderwater = belowWater;
                        if (isUnderwater) {
                            scene.background.set(0x000005);
                            scene.fog.color.set(0x000005);
                            ambientLight.intensity = 0.5;
                            water.material.uniforms.distortionScale.value = 8;
                            sun.visible = false;
                            moon.visible = false;
                            sunLight.intensity = 0;
                            sunGlowLight.intensity = 0;
                            moonLight.intensity = 0;
                            if (mainTextMesh) mainTextMesh.visible = false;
                        } else {
                            const dayColor = new THREE.Color(0x4682b4);
                            const nightColor = new THREE.Color(0x000c1c);
                            const lerpedColor = new THREE.Color();
                            const dayFactor = Math.max(0, sun.position.y / 400);
                            lerpedColor.copy(nightColor).lerp(dayColor, dayFactor);
                            
                            scene.background.set(lerpedColor);
                            scene.fog.color.set(lerpedColor);
                            ambientLight.intensity = 5;
                            water.material.uniforms.distortionScale.value = 3.7;
                            sun.visible = true;
                            moon.visible = true;
                            sunLight.intensity = dayFactor * 20;
                            sunGlowLight.intensity = dayFactor * 5000;
                            moonLight.intensity = (1 - dayFactor) * 0.5;
                            if (mainTextMesh) mainTextMesh.visible = true;
                        }
                    }
                    
                    if (progress < 1) {
                        requestAnimationFrame(cameraAnimation);
                    } else {
                        if (camera.position.y < 5) {
                            contentWrapper.style.display = 'flex';
                        }
                    }
                };
                
                cameraAnimation();
            });
        };