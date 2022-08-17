// Object Definition //
// Create Face template
function Face() {
  this.id = null;
  this.color = null;
    this.Matrix = new Array(4).fill().map(()=>Array(4).fill());
    this.PopulateMatrix = function() {
      this.Matrix.forEach(line => line.fill(Array.from(new Array(16), (x, i) => i)));
    };
    this.RotateFaceClockwise = function(save = false) {
      this.Matrix = this.Matrix[0].map((val, index) => this.Matrix.map(row => row[index]).reverse());
      return this;
    };
    this.RotateFaceCounterClockwise = function(save = false) {
      this.Matrix = this.Matrix[0].map((val, index) => this.Matrix.map(row => row[row.length-1-index]));
      return this;
    };
    this.RotateFaceUpsideDown = function(save= false) {
      var semi = this.Matrix[0].map((val, index) => this.Matrix.map(row => row[index]).reverse());
      this.Matrix = semi[0].map((val, index) => semi.map(row => row[index]).reverse());
      return this;
    }
  }

// Create slab template
function Slab() {
  this.id = null;
  this.color = null;
  this.Matrix = new Array();
}

// Create slice template
function Slice() {
  this.id = null;
  this.color = null;
  this.Matrix = new Array();
}

// Create wall template
function Wall() {
  this.id = null;
  this.color = null;
  this.Matrix = new Array();
}

// Object Instantiation //
function assignPositionalIds(faces) {
  var id = 0;
  for (var i = 0; i <= 5; i++) {
    for (var j = 0; j <= 3; j++) {
      for (var k = 0; k <= 3; k++) {
        faces[i].Matrix[j][k] = ["id" + id, faces[i].Matrix[j][k]];
        id++;
      }
    }
  }
}

function assignIds(array) {
  var id = 0;
  for (var i = 0; i <= array.length - 1; i++) {
    array[i].id = id;
    id++;
  }
}

function createFaces(count) {
  var faceArray = [];
  for (var i = 0; i <= count - 1; i++) {
  var newFace = new Face();
  newFace.PopulateMatrix();
  faceArray.push(newFace);
  }
  assignIds(faceArray);
  return faceArray;
}

function createSlabs(count) {
  var slabArray = [];
  for (var i = 0; i <= count - 1; i++) {
  var newSlab = new Slab();
  slabArray.push(newSlab);
  }
  assignIds(slabArray);
  return slabArray;
}

function createSlices(count) {
  var sliceArray = [];
  for (var i = 0; i <= count - 1; i++) {
  var newSlice = new Slice();
  sliceArray.push(newSlice);
  }
  assignIds(sliceArray);
  return sliceArray;
}
function createWalls(count) {
  var wallArray = [];
  for (var i = 0; i <= count - 1; i++) {
  var newWall = new Wall();
  wallArray.push(newWall);
  }
  assignIds(wallArray);
  return wallArray;
}

// Sync Functions //
function syncAll(faces, slabs, slices, walls) {
  syncSlabs(faces, slabs);
  syncSlices(faces, slices);
  syncWalls(faces, walls);
}

function syncSlabs(faces, slabs) {
  var faceList = [faces[0], faces[1], faces[2], faces[3]];
  for (var i = 0; i <= faceList.length - 1; i++) {
    faceList.forEach(face => slabs[i].Matrix.push(face.Matrix[i]));
  }
}

function syncSlices(faces, slices) {
  var face6 = Object.assign({}, faces[5]);
  var face1 = Object.assign({}, faces[0]);
  var face5 = Object.assign({}, faces[4]);
  var face3 = Object.assign({}, faces[2]);
  var faceList = [face6.RotateFaceClockwise(), face1.RotateFaceClockwise(), face5.RotateFaceClockwise(), face3.RotateFaceCounterClockwise()];
  for (var i = 0; i <= faceList.length - 1; i++) {
    faceList.forEach(face => slices[i].Matrix.push(face.Matrix[i]));
  }
}

function syncWalls(faces, walls) {
  var face5 = Object.assign({}, faces[4]);
  var face2 = Object.assign({}, faces[1]);
  var face6 = Object.assign({}, faces[5]);
  var face4 = Object.assign({}, faces[3]);
  var faceList = [face5, face2.RotateFaceCounterClockwise(), face6.RotateFaceUpsideDown(), face4.RotateFaceClockwise()];
  for (var i = 0; i <= faceList.length - 1; i++) {
    faceList.forEach(face => walls[i].Matrix.push(face.Matrix[i]));
  }
}

// Action Functions //
Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

function populateValidCube(cube) {
    cube.faces[0].Matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];
    cube.faces[1].Matrix = [[8, 5, 6, 7], [12, 9, 10, 11], [16, 13, 14, 15], [4, 1, 2, 3]];
    cube.faces[2].Matrix = [[11, 12, 9, 10], [15, 16, 13, 14], [3, 4, 1, 2], [7, 8, 5, 6]];
    cube.faces[3].Matrix = [[14, 15, 16, 13], [2, 3, 4, 1], [6, 7, 8, 5], [10, 11, 12, 9]];
    cube.faces[4].Matrix = [[4, 8, 1, 5], [16, 12, 9, 13], [11, 15, 2, 6], [3, 7, 10, 14]];
    cube.faces[5].Matrix = [[15, 11, 6, 2], [7, 3, 14, 10], [8, 4, 5, 1], [12, 16, 13, [1, 9]]];
}

function waveformCollapse(cube) {
  /*
  -- 1. get a face
  -- 2. choose a random array point that has length > 1
  -- 3. fill with random number chosen from cell options
  -- 4. get face, slab, slice, and wall with that id, remove number from all arrays > 1.
  -- 5. repeat for any new singletons
  */

  var lists = getChoiceAndSingleList(cube);

  // var randomValue = lists[0].sample();
  // console.log(lists[0])
  var randomValue = getLowestEntropy(lists[0]);
  var randomNumber = randomValue[1].sample();

  removeAll(cube, randomValue, randomNumber, "Removed");
  var newLists = getChoiceAndSingleList(cube)
  if (newLists[1].length > lists[1].length + 1) {
    var differences = newLists[1].filter(x => !lists[1].includes(x));
    differences.forEach(num => removeAll(cube, num[0], num[1], "Auto-Removal"));
  }
  checkValidity(cube);
  if (cube.valid == false) {
    cube.invalid = randomValue;
  }

}

function getLowestEntropy(array) {
  var sortedArray = array.sort(function(a,b){
    if(a[1].length > b[1].length) return 1;
    if(a[1].length < b[1].length) return -1;
    return 0;
  });
  var minLength = sortedArray[0][1].length;
  var filteredArray = sortedArray.filter(function(a){return a[1].length = minLength;})
  return filteredArray.sample();
    /*
  shortestLength = 17;
  shortestArrays = [];
  for (var i = 0; i <= array.length - 1; i++) {
    console.log(array[i][1].length);
    if (array[i][1].length < shortestLength) {
      shortestArrays = [array[i]];
    }
    else if (array[i][1] == shortestLength) {
      shortestArrays.push(array[i]);
    }
    console.log(shortestArrays);
  }
  return shortestArrays.sample();
*/
}

function getChoiceAndSingleList(cube) {
  var choiceList = [];
  var singleList = [];
  for (var i = 0; i <= 5; i++) {
    for (var j = 0; j <= 3; j++) {
      for (var k = 0; k <= 3; k++) {
        if (cube.faces[i].Matrix[j][k][1].length > 1) {
          choiceList.push(cube.faces[i].Matrix[j][k]);
        }
        else {
          singleList.push(cube.faces[i].Matrix[j][k]);
        }
      }
    }
  }

  return [choiceList, singleList];
}

function removeAll(cube, value, number, message) {
  searchAndRemoveFromArray(cube.faces, value, number);
  searchAndRemoveFromArray(cube.slabs, value, number);
  searchAndRemoveFromArray(cube.slices, value, number);
  searchAndRemoveFromArray(cube.walls, value, number);
  // console.log(message);

}

// this is not good
function searchAndRemoveFromArray(arrayList, value, foundNumber) {
  for (var i = 0; i <= arrayList.length - 1; i++) {
    for (var j = 0; j <= arrayList[i].Matrix.length - 1; j++) {
      for (var k = 0; k <= arrayList[i].Matrix[j].length - 1; k++) {
        if (arrayList[i].Matrix[j][k][0] == value[0]) {
          // console.log(arrayList[i].Matrix[j][k][0]);
          reduceSuperPosition(arrayList[i], foundNumber);
          // console.log(arrayList[i]);
          arrayList[i].Matrix[j][k][1] = [foundNumber];// arrayList[i].Matrix[j][k][1].filter(item => item !== foundNumber);

          // console.log(arrayList[i].Matrix[j][k][1].filter(item => item !== foundNumber));
          // return arrayList[i].id;
        }
      }
    }
  }
}

function reduceSuperPosition(array, num) {
  for (var i = 0; i <= 3; i++) {
    for (var j = 0; j <= 3; j++) {
      if (array.Matrix[i][j][1].length >1) {
        array.Matrix[i][j][1] = array.Matrix[i][j][1].filter(item => item !== num);
      }
    }
  }
}

function checkValidity(cube) {
  /*
  1. check if any face, slab, slice, or wall has either:
    - blank cell
    - multiple of same number
  */
  if (foundDuplicatesOrBlanks(cube.faces, 6) ||
      foundDuplicatesOrBlanks(cube.slabs, 4) ||
      foundDuplicatesOrBlanks(cube.slices, 4) ||
      foundDuplicatesOrBlanks(cube.walls, 4)) {
    cube.valid = false;
  }
}

function foundDuplicatesOrBlanks(array, count) {
  for (var i = 0; i <= count - 1; i++) {
    var singleList = [];
    for (var j = 0; j <= 3; j++) {
      for (var k = 0; k <= 3; k++) {
        if (array[i].Matrix[j][k][1].length == 0) {
          console.log("NO LENGTH");
          return true;
        }
        if (array[i].Matrix[j][k][1].length == 1) {
          singleList.push(array[i].Matrix[j][k][1][0]);

        }
      }
    }
    var noDups = new Set(singleList);
    // console.log(singleList.length + " | " + noDups);
    return singleList.length !== noDups.size;
  }
}

function displayFaces(cube, face, id) {
  var html = "<table style='table-layout: fixed; width: 350px; background-color:" + face.color + ";' border='1|1'>";
  for (var i = 0; i <= 3; i++) {
    html+="<tr height='85px'>";
    for (var j = 0; j <= 3; j++) {
      var font = face.Matrix[i][j][1].length == 1 ? "font-size:50px; text-align: center;" : "";
      var textColor = face.Matrix[i][j][0] == cube.invalid[0] ? "color:red;" : "";
    html+="<td style='word-wrap: break-word; " + font + textColor + "'>"+ face.Matrix[i][j][1] +"</td>";
    }
    html+="</tr>";
  }
  html+="</table>";
document.getElementById(id).innerHTML = html;
}

function displayArray(face, id) {
  var html = "<table style='table-layout: fixed; width: 1400px;' border='1|1'>";
  html+="<tr>";
  for (var i = 0; i <= 3; i++) {
    for (var j = 0; j <= 3; j++) {
    html+="<td style='word-wrap: break-word'>"+ face.Matrix[i][j][1] +"</td>";
    }
  }
  html+="</tr>";
  html+="</table>";
  document.getElementById(id).innerHTML = html;
}

function setFaceColors(cube) {
  cube.faces[0].color = "white";
  cube.faces[1].color = "pink";
  cube.faces[2].color = "lightyellow";
  cube.faces[3].color = "Moccasin";
  cube.faces[4].color = "lightblue";
  cube.faces[5].color = "lightgreen";
}

function displayAllFaces(cube) {
  displayFaces(cube, cube.faces[0], "0");
  displayFaces(cube, cube.faces[1], "1");
  displayFaces(cube, cube.faces[2], "2");
  displayFaces(cube, cube.faces[3], "3");
  displayFaces(cube, cube.faces[4], "4");
  displayFaces(cube, cube.faces[5], "5");
}
/*
function displayRest(cube) {
  displayArray(cube.slabs[0], "6");
  displayArray(cube.slabs[1], "7");
  displayArray(cube.slabs[2], "8");
  displayArray(cube.slabs[3], "9");

  displayArray(cube.slices[0], "10");
  displayArray(cube.slices[1], "11");
  displayArray(cube.slices[2], "12");
  displayArray(cube.slices[3], "13");

  displayArray(cube.walls[0], "14");
  displayArray(cube.walls[1], "15");
  displayArray(cube.walls[2], "16");
  displayArray(cube.walls[3], "17");
}
*/
function displayAll(cube) {
  displayAllFaces(cube);
  //displayRest(cube);
}

function collapseAndCheck(cube) {
  if (cube.valid == true && cube.complete == false) {
    waveformCollapse(cube);
    displayAll(cube);
  }
}

function loopWhileValid(cube, bestCube, bestCount) {
  count = 0;
  while (cube.valid == true && cube.complete == false) {
    if (count >= bestCount) {  bestCube = Object.assign({}, cube); bestCount = count;}
  collapseAndCheck(cube);
  count += 1;
  // console.log(count);
  }
}

function setupNewCube(cube) {
  var cube = {
    faces: createFaces(6),
    slabs: createSlabs(4),
    slices: createSlices(4),
    walls: createWalls(4),
    valid: true,
    complete: false,
    invalid: [""]
  };
  assignPositionalIds(cube.faces);
  setFaceColors(cube);
  syncAll(cube.faces, cube.slabs, cube.slices, cube.walls);
  displayAll(cube);
  return cube;
}

