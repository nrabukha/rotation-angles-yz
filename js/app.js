class Geometry3D {

   constructor(){
      this.points = [];
   }

   rotateGeometry(angles){
      const rotationMatrixX = [
          [1, 0, 0],
          [0, this.cosRad(angles[0]), -1 * this.sinRad(angles[0])],
          [0, this.sinRad(angles[0]), this.cosRad(angles[0])]];

      const rotationMatrixY = [
          [this.cosRad(angles[1]), 0, this.sinRad(angles[1])],
          [0, 1, 0],
          [-1 * this.sinRad(angles[1]), 0, this.cosRad(angles[1])]];

      const rotationMatrixZ = [
          [this.cosRad(angles[2]), -1 * this.sinRad(angles[2]), 0],
          [this.sinRad(angles[2]), this.cosRad(angles[2]), 0],
          [0, 0, 1]];

      this.points = this.multiplyMatrix(this.transponseMatrix(rotationMatrixX));
      this.points = this.multiplyMatrix(this.transponseMatrix(rotationMatrixY));
      this.points = this.multiplyMatrix(this.transponseMatrix(rotationMatrixZ));
   }
  
   moveGeometry(distance) {
      this.points = this.points.map((key)=>{
         return key.map((prop, i)=>{
             return prop + distance[i];
         })
      })
   }

   addPoint(point){
      this.points.push(point);
   }
   
}


class MathFormulasForCoordinates extends Geometry3D {


  getAnglesOfRightTriangle(aSide, bSide) {
      const anglesTriangle = [];
      anglesTriangle[0] = 90;
      anglesTriangle[1] = this.toDeg(Math.atan(bSide / aSide));
      anglesTriangle[2] = anglesTriangle[0] - anglesTriangle[1];

      return anglesTriangle;
  }

  getDistance(firstPoint, lastPoint){
    const x1 = firstPoint[0];
    const x2 = lastPoint[0];
    const y1 = firstPoint[1];
    const y2 = lastPoint[1];
    if(firstPoint.length === 3){
      const z1 = firstPoint[2];
      const z2 = lastPoint[2];
      return Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2)+Math.pow(z2-z1,2));
    }
    return Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2));
  }


  multiplyMatrix(bMatrix){
      const aMatrix = this.points;
      const resultMatrix = [];

      aMatrix.forEach((key, i) => resultMatrix[i] = []);
      
      bMatrix[0].forEach((arr, firstIndex)=>{
         aMatrix.forEach((k, secondIndex)=>{
            let t = 0;
            bMatrix.forEach((key, thirdIndex) => {
                t += aMatrix[firstIndex][thirdIndex] * 
                     bMatrix[thirdIndex][secondIndex];
            });
            resultMatrix[firstIndex][secondIndex] = t;
         });
      });

     return resultMatrix;
  }

   transponseMatrix = (matrix) => {
      const transponsedMatrix = [];

       matrix.forEach((arr, i) => {
          transponsedMatrix[i] = [];
          arr.forEach((key, index) => {
             transponsedMatrix[i][index] = matrix[index][i];
          })
       });
          return transponsedMatrix;
    };

  toRad(deg) {
      return deg * Math.PI / 180;
  };

  toDeg(rad) {
      return rad / Math.PI * 180;
  };

  cosRad(angle) {
      return Math.cos(this.toRad(angle)).toFixed(4);
  };

  sinRad(angle) {
      return Math.sin(this.toRad(angle)).toFixed(4);
  };

}

const findPriorRotationAngles = (newPoint) => {
   const rotationAngles = {};

   if(newPoint[0] == false && newPoint[1] == false){
          rotationAngles.y = -1*Math.sign(newPoint[2])*90;
          return rotationAngles;
     }

   newPoint = [
      Math.abs(newPoint[0]), 
      Math.abs(newPoint[1]), 
      -1*Math.abs(newPoint[2])
   ];

    const isoscelesTriangle = new MathFormulasForCoordinates();

    isoscelesTriangle.addPoint([0, 0, 0]);
    isoscelesTriangle.addPoint(newPoint);
    newPoint = isoscelesTriangle.points[1];

    const leftSideTriangle = isoscelesTriangle.getDistance([0,0,0], newPoint);

    isoscelesTriangle.addPoint([-1*(leftSideTriangle - newPoint[0]), 
                                newPoint[1], newPoint[2]]);

    const aSideXY = isoscelesTriangle.points[1][0];
    const bSideXY = isoscelesTriangle.points[1][1];

    rotationAngles.z = isoscelesTriangle.getAnglesOfRightTriangle(aSideXY, bSideXY)[1];
    isoscelesTriangle.rotateGeometry([0, 0, -1*rotationAngles.z]);

    const aSideXZ = isoscelesTriangle.points[1][0];
    const bSideXZ = -1*isoscelesTriangle.points[1][2];

    rotationAngles.y = isoscelesTriangle.getAnglesOfRightTriangle(aSideXZ, bSideXZ)[1];

    return rotationAngles;
};


const setRotateAngleBySystemXYZ = (point) => {
   let currentSystemXYZ = point.map((num)=>{
       if(!num || !parseInt(num)) num = 1;
       return Math.sign(num);
   });
   let selectedNumXYZ;

   const systemXYZ = [
      [1, 1, -1], [-1, 1, -1], [-1, -1, -1], [1, -1, -1],
      [1, 1, 1],  [-1, 1, 1],  [-1, -1, 1],  [1, -1, 1]
   ];

   systemXYZ.forEach((arr, i)=>{
      if(arr[0] === currentSystemXYZ[0] &&
         arr[1] === currentSystemXYZ[1] &&
         arr[2] === currentSystemXYZ[2]) 
      return selectedNumXYZ = i;
   });

   return (rotationAngles) => {
      switch(selectedNumXYZ){
         case 0:
         break;
         case 1: 
            rotationAngles.z += 180 - rotationAngles.z*2;
         break;
         case 2: 
            rotationAngles.z += -180;
         break;
         case 3: 
            rotationAngles.z = -1*rotationAngles.z;
         break;
         case 4: 
            rotationAngles.y = -1* rotationAngles.y;
         break;
         case 5: 
            rotationAngles.y = -1* rotationAngles.y;
            rotationAngles.z += 180 - rotationAngles.z*2;
         break;
         case 6: 
            rotationAngles.y = -1* rotationAngles.y;
            rotationAngles.z += -180;
         break;
         case 7: 
            rotationAngles.y = -1* rotationAngles.y;
            rotationAngles.z = -1*rotationAngles.z;
         break;
      }
      return rotationAngles;
   } 
};