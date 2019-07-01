
const controlRotationPanel = (cb) => {
  const currentElement = document.getElementById('control-rotation');
  const rotationAnglesXYZ = document.getElementById('rotation-angles-button');
  const resetXYZ = document.getElementById('reset-x-y-z');
  
  if(rotationAnglesXYZ){
     const resetButton = document.createElement('button');
     resetButton.id = 'reset-x-y-z';
     resetButton.textContent = 'Reset';
     resetButton.disabled = true;
     setTimeout(()=>{
        resetButton.disabled = false;
     }, 3000);
     currentElement.innerHTML = '';
     currentElement.appendChild(resetButton);
     resetButton.addEventListener('click', ()=>{
         cb();
         controlRotationPanel(getRotationData);
     });
     return;
   }
  if(resetXYZ){
     const rotationAnglesButton = document.createElement('button');
     rotationAnglesButton.id = 'rotation-angles-button';
     rotationAnglesButton.textContent = 'Find Angles';
     rotationAnglesButton.disabled = true;
     setTimeout(()=>{
        rotationAnglesButton.disabled = false;
     }, 3000);
     currentElement.innerHTML = '';
     currentElement.appendChild(rotationAnglesButton);
     rotationAnglesButton.addEventListener('click', ()=>{
         cb();
         controlRotationPanel(resetData);
     });
     return;
   }
};

const resultPanel = () => {
   const resultDiv = document.getElementById('result');
   const divElement = document.createElement('div');
   const innerDiv = document.createElement('div');
   resultDiv.appendChild(divElement);
   

   const resultTitle = document.createElement('span');
   resultTitle.textContent = 'Rotation angles (deg):';
   resultTitle.style = 'font-weight: bold; font-size: 18px;'

   const xTitle = document.createElement('span');
   xTitle.textContent = 'X: ';
   xTitle.className = 'result-title';
   const resultRotationX = document.createElement('span');
   resultRotationX.id = 'result-rotation-x';

   const yTitle = document.createElement('span');
   yTitle.textContent = 'Y: ';
   yTitle.className = 'result-title';
   const resultRotationY = document.createElement('span');
   resultRotationY.id = 'result-rotation-y';

   const zTitle = document.createElement('span');
   zTitle.textContent = 'Z: ';
   zTitle.className = 'result-title';
   const resultRotationZ = document.createElement('span');
   resultRotationZ.id = 'result-rotation-z';
    
   divElement.appendChild(resultTitle);
   divElement.appendChild(innerDiv);  

   [xTitle, resultRotationX, yTitle, 
    resultRotationY, zTitle, resultRotationZ].forEach((element)=>{
      innerDiv.appendChild(element);
   });
}