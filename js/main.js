
const newPositionX = document.getElementById('new-position-x');
const newPositionY = document.getElementById('new-position-y');
const newPositionZ = document.getElementById('new-position-z');

const window3DView = document.getElementById('window-3d-view').childNodes[0];

const rotationAnglesButton = document.getElementById('rotation-angles-button');
const clearPositionXYZ = document.getElementById('clear-position-x-y-z');



const pivotPoint = new THREE.Object3D();

// create axes
const axes = new THREE.AxesHelper(40);

// create grid 
const grid = new THREE.GridHelper(50, 10, 0xff3300, 0x000000);

const whiteSphereGeometry = new THREE.SphereBufferGeometry(3, 30, 30);
const whiteSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, 
                                                   transparent: true, 
                                                   opacity: 0.5 });

const whiteSphere = new THREE.Mesh(whiteSphereGeometry, whiteSphereMaterial);

whiteSphere.position.set(0, 0, 0);

const defaultPositionGeometry = new THREE.BoxGeometry(1, 1, 1);
const defaultPositionMaterial = new THREE.MeshBasicMaterial({color: 0xff5400});
const defaultPositionCube = new THREE.Mesh(defaultPositionGeometry, defaultPositionMaterial);

defaultPositionCube.position.set(21, 0, 0);


const redRingGeometry = new THREE.TorusGeometry(3.5, 0.3, 4, 40);
const redRingMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const redRing = new THREE.Mesh(redRingGeometry, redRingMaterial);

const blueRingGeometry = new THREE.TorusGeometry(4.2, 0.3, 4, 40);
const blueRingMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const blueRing = new THREE.Mesh(blueRingGeometry, blueRingMaterial);

const shaftGeometry = new THREE.CylinderBufferGeometry(0.1, 0.3, 6, 32);
const shaftMaterial = new THREE.MeshBasicMaterial({ color: 0x0da000 });
const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);

shaft.position.set(7.5, 0, 0);

const arrowheadGeometry = new THREE.ConeGeometry(0.5, 1.5, 32);
const arrowheadMaterial = new THREE.MeshMatcapMaterial({ color: 0x0da000 });
const arrowhead = new THREE.Mesh(arrowheadGeometry, arrowheadMaterial);

arrowhead.position.set(10.5, 0, 0);

const helperPointGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const helperPointMaterial = new THREE.MeshBasicMaterial({ color: 0x0da000 });
const helperPoint = new THREE.Mesh(helperPointGeometry, helperPointMaterial);

helperPoint.position.set(20, 0, 0);

const helperLineGeometry = new THREE.Geometry();
const helperLineMaterial = new THREE.LineBasicMaterial({ color: 0x0da000 });

helperLineGeometry.vertices.push(
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(20, 0, 0)
);

const helperLine = new THREE.Line(helperLineGeometry, helperLineMaterial);

grid.rotateX(Math.PI / 180 * 90);
redRing.rotateY(Math.PI / 180 * 90);
shaft.rotateX(Math.PI / 180 * 90);
shaft.rotateZ(Math.PI / 180 * -90);
arrowhead.rotateX(Math.PI / 180 * 90);
arrowhead.rotateZ(Math.PI / 180 * -90);

const camera = new THREE.PerspectiveCamera(45, window3DView.offsetWidth/window3DView.offsetHeight, 1, 500);

camera.up = new THREE.Vector3(0, 0, 1);

camera.position.x = 20;
camera.position.y = 20;
camera.position.z = 20;

const scene = new THREE.Scene();
camera.lookAt(scene.position);
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xc9c9c9);
renderer.setSize(window3DView.offsetWidth, window3DView.offsetHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;

window3DView.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableKeys = false;

scene.add(axes);
scene.add(grid);
scene.add(whiteSphere);
scene.add(pivotPoint);
scene.add(defaultPositionCube);

pivotPoint.add(redRing);
pivotPoint.add(blueRing);
pivotPoint.add(shaft);
pivotPoint.add(arrowhead);
pivotPoint.add(helperPoint);
pivotPoint.add(helperLine);

const setNewPoint = (newCoordinates) => {
  const oldPoint = scene.getObjectByName('new-point');
  const oldLine = scene.getObjectByName('new-line')

  if(oldPoint && oldLine){
     scene.remove(oldPoint);
     scene.remove(oldLine);
  }  
  
  const newPointGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const newPointMaterial = new THREE.MeshBasicMaterial({ color: 0xff9000 });
  const newPoint = new THREE.Mesh(newPointGeometry, newPointMaterial);

  newPoint.position.x = newCoordinates[0]; 
  newPoint.position.y = newCoordinates[1]; 
  newPoint.position.z = newCoordinates[2];
  
  newPoint.name = 'new-point';
  scene.add(newPoint);

  const newLineMaterial = new THREE.LineBasicMaterial({color: 0xff9000});
  const newLineGeometry = new THREE.Geometry();

  newLineGeometry.vertices.push(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(newCoordinates[0], newCoordinates[1], newCoordinates[2])
  );

  const newLine = new THREE.Line(newLineGeometry, newLineMaterial);
  newLine.name = 'new-line';
  scene.add(newLine);
};

class AnimationFrameUpdate{
   
   constructor(object){
      this.object = object;
      this.priority = 3;
      this.arrayRotation = {};
   }
   
   rotateGeometryX(angle){
     this.arrayRotation.x = angle;
     this.xPriority = this.priority - 1;
     this.priority--;
   };

   rotateGeometryY(angle){
     this.arrayRotation.y = angle;
     this.yPriority = this.priority - 1;
     this.priority--;
   };

   rotateGeometryZ(angle){
     this.arrayRotation.z = angle;
     this.zPriority = this.priority - 1;
     this.priority--;
   };

   getFractionOfNumber(num){
     num = Math.abs(num);
     return num - Math.trunc(num);
   }

   playAnimationX(){
      if (this.arrayRotation.x && this.priority === this.xPriority) {
        const angle = this.arrayRotation.x;
        const angleFraction = this.getFractionOfNumber(angle);
        const angleSign = Math.sign(angle);
        if(angleFraction){
          this.object.rotateX(Math.PI / 180 * angleSign * angleFraction);
          this.arrayRotation.x -= angleSign * angleFraction;
          return;
        }
        this.object.rotateX(Math.PI / 180 * angleSign);
        this.arrayRotation.x -= angleSign;
        if (this.arrayRotation.x === 0) this.priority++;
        return;
     };
   }

   playAnimationY(){
      if (this.arrayRotation.y && this.priority === this.yPriority) {
        const angle = this.arrayRotation.y;
        const angleFraction = this.getFractionOfNumber(angle);
        const angleSign = Math.sign(angle);
        if(angleFraction){
          this.object.rotateY(Math.PI / 180 * angleSign * angleFraction);
          this.arrayRotation.y -= angleSign * angleFraction;
          return;
        }
        this.object.rotateY(Math.PI / 180 * angleSign);
        this.arrayRotation.y -= angleSign;
        if (this.arrayRotation.y === 0) this.priority++;
        return;
     };
   }

   playAnimationZ(){
      if (this.arrayRotation.z && this.priority === this.zPriority) {
        const angle = this.arrayRotation.z;
        const angleFraction = this.getFractionOfNumber(angle);
        const angleSign = Math.sign(angle);
        if(angleFraction){
          this.object.rotateZ(Math.PI / 180 * angleSign * angleFraction);
          this.arrayRotation.z -= angleSign * angleFraction;
          return;
        }
        this.object.rotateZ(Math.PI / 180 * angleSign);
        this.arrayRotation.z -= angleSign;
        if (this.arrayRotation.z === 0) this.priority++;
        return;
     };
   }

   update(){

     if (this.arrayRotation.x && this.priority === this.xPriority) {
        this.playAnimationX();
     };

     if (this.arrayRotation.y && this.priority === this.yPriority) {
        this.playAnimationY();
     };

     if (this.arrayRotation.z && this.priority === this.zPriority) {
        this.playAnimationZ()
     };
  }
}

const animationHelperObject = new AnimationFrameUpdate(pivotPoint);

const resetData = () => {
   const resultDiv = document.getElementById('result');
   const resultRotationX = document.getElementById('result-rotation-x');
   const resultRotationY = document.getElementById('result-rotation-y');
   const resultRotationZ = document.getElementById('result-rotation-z'); 

   if(resultRotationZ.textContent != '' &&
      resultRotationZ.textContent != 0){
   animationHelperObject.rotateGeometryZ(-1*resultRotationZ.textContent);
   }

   if(resultRotationY.textContent != '' &&
      resultRotationY.textContent != 0){
   animationHelperObject.rotateGeometryY(-1*resultRotationY.textContent);
   }

   if(resultRotationX.textContent != '' &&
      resultRotationX.textContent != 0){
   animationHelperObject.rotateGeometryX(-1*resultRotationY.textContent);
   }

   result.innerHTML = '';
};

const getRotationData = () => {
    
resultPanel();

   const resultRotationX = document.getElementById('result-rotation-x');
   const resultRotationY = document.getElementById('result-rotation-y');
   const resultRotationZ = document.getElementById('result-rotation-z'); 

   const coordinates = [newPositionX.value, 
                        newPositionY.value, 
                        newPositionZ.value];

   let rotation = findPriorRotationAngles(coordinates);

   if(!coordinates[0] && !coordinates[1]){
      resultRotationY.textContent = rotation.y;
      animationHelperObject.rotateGeometryY(rotation.y);
      return;
   }
   
   rotation = setRotateAngleBySystemXYZ(coordinates)(rotation);
   
   resultRotationX.textContent = 0;
   resultRotationY.textContent = parseFloat(rotation.y.toFixed(4));
   resultRotationZ.textContent = parseFloat(rotation.z.toFixed(4));
   animationHelperObject.rotateGeometryY(rotation.y);
   if(coordinates[0] && !coordinates[1] && coordinates[2]) return;
   animationHelperObject.rotateGeometryZ(rotation.z)
};

// draw Scene
const render = () => {
  renderer.render(scene, camera);
};


const ViewLoop = () => {
  requestAnimationFrame(ViewLoop);
  animationHelperObject.update();
  render();
};

ViewLoop();

clearPositionXYZ.addEventListener('click', () => {
   scene.remove(scene.getObjectByName('new-point'));
   scene.remove(scene.getObjectByName('new-line'));
   newPositionX.value = '';
   newPositionY.value = '';
   newPositionZ.value = '';
});

[newPositionX, newPositionY, newPositionZ].forEach((element)=>{
   element.addEventListener('input', () => {
      setNewPoint([newPositionX.value,
                   newPositionY.value, 
                   newPositionZ.value]);
   })
});

rotationAnglesButton.addEventListener('click', ()=>{
   getRotationData();
   controlRotationPanel(resetData);
});


window.addEventListener('resize', ()=>{
   camera.aspect = window3DView.offsetWidth / window3DView.offsetHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window3DView.offsetWidth, window3DView.offsetHeight);
});