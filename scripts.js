// Object Definition //
function Face() {
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

function Slab() {
    this.Matrix = new Array();
}

function Slice() {
    this.Matrix = new Array();
}

function Wall() {
    this.Matrix = new Array();
}

// Object Instantiation //
function assignIds(faces) {
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

function createFaces(count) {
  var faceArray = [];
  for (var i = 0; i <= count - 1; i++) {
  var newFace = new Face();
  newFace.PopulateMatrix();
  faceArray.push(newFace);
  }
  return faceArray;
}

function createSlabs(count) {
  var slabArray = [];
  for (var i = 0; i <= count - 1; i++) {
  var newSlab = new Slab();
  slabArray.push(newSlab);
  }
  return slabArray;
}

function createSlices(count) {
  var sliceArray = [];
  for (var i = 0; i <= count - 1; i++) {
  var newSlice = new Slice();
  sliceArray.push(newSlice);
  }
  return sliceArray;
}
function createWalls(count) {
  var wallArray = [];
  for (var i = 0; i <= count - 1; i++) {
  var newWall = new Wall();
  wallArray.push(newWall);
  }
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
  4. get face, slab, slice, and wall with that id, remove number from all arrays > 1.
  */
  var choiceList = [];
  for (var i = 0; i <= 5; i++) {
    for (var j = 0; j <= 3; j++) {
      for (var k = 0; k <= 3; k++) {
        if (cube.faces[i].Matrix[j][k][1].length > 1) {
          choiceList.push(cube.faces[i].Matrix[j][k]);
        }
      }
    }
  }
  // console.log(choiceList);
  var randomValue = choiceList.sample();
  var randomNumber = randomValue[1].sample();
  var foundFace = searchArray(cube.faces.length, cube.faces, randomValue[0]);
  var foundSlab = searchArray(cube.slabs.length, cube.slabs, randomValue[0]);
  var foundSlice = searchArray(cube.slices.length, cube.slices, randomValue[0]);
  var foundWall = searchArray(cube.walls.length, cube.walls, randomValue[0]);

  removeOptions(cube.faces, foundFace, randomValue, randomNumber);
  // console.log(randomValue);
  // console.log("Face: " + JSON.stringify(foundFace));
  // console.log("Slab: " + JSON.stringify(foundSlab));
  // console.log("Slice: " + JSON.stringify(foundSlice));
  // console.log("Wall: " + JSON.stringify(foundWall));

}

function searchArray(length, arrayList, value) {
  var foundArray = null;
  for (var i = 0; i <= length - 1; i++) {
    var flatArray = Array.prototype.concat.apply([], arrayList[i].Matrix);
    console.log(flatArray);
    var possibleValue = flatArray.find(function(element) {return element[0] == value});
    if (possibleValue !== null) {foundArray = arrayList[i]};
  }
  return foundArray;


}

function removeOptions() {

}

function checkValidity(cube) {
  /*
  1. check if any face, slab, slice, or wall has either:
    - blank cell
    - multiple of same number

  */
}































function populateGrid(size, section) {
  for (var i = 1; i <= (size); i++) {
      btngroup = "<div class='float_center'><div class='child'><div class='btngroup' id='grid" + i + "'></div></div><div class='clear'></div></div><div class='clear'></div>"
    document.getElementById(section).insertAdjacentHTML('beforeend', btngroup);
    for (var r = 1; r <= (size); r++) {
      var pr = (size * i) - size + r
      row = "<label><input type='checkbox' class='grid' id='" + pr + "g' value='" + pr + "'/><span class='button'></span></label>"
      document.getElementById("grid"+i).insertAdjacentHTML('beforeend', row);
    }

  }
}

function populateDisplay(size, section) {
  for (var i = 1; i <= (size); i++) {
    btngroup = "<div class='float_center'><div class='child'><div class='btngroup' id='disp" + i + "'></div></div><div class='clear'></div></div><div class='clear'></div>"
    document.getElementById(section).insertAdjacentHTML('beforeend', btngroup);
    for (var r = 1; r <= (size); r++) {
      var pr = (size * i) - size + r
      row = "<label><input type='checkbox'  class='disp' id='" + pr + "d' value='" + pr + "' disabled/><span class='display'></span></label>"
      document.getElementById("disp"+i).insertAdjacentHTML('beforeend', row);
    }

  }
}

function getCheckedGrid() {
  var array = []
  var checkboxes = document.querySelectorAll('input.grid[type=checkbox]:checked');
  for (i = 0; i < checkboxes.length; i++) {
    array.push(Number(checkboxes[i].value));
  }
//  console.log("getCheckedGrid V");
//  console.log(array.sort())
  return array.sort()
}

function getCheckedDisplay() {
  var array = []
  var checkboxes = document.querySelectorAll('input.disp[type=checkbox]:checked');
  for (i = 0; i < checkboxes.length; i++) {
    array.push(Number(checkboxes[i].value));
  }
//  console.log("getCheckedDisplay V");
//  console.log(array.sort());
  return array.sort();
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomGrid(size) {
var array = [];
  for (var i = 1; i <= (size*size); i++) {
      document.getElementById(i+"d").checked = false;
      array.push(i);
      shuffle(array);
      slarray = array.slice(Math.floor(Math.random() * ((size * size) + 1)));
      soarray = slarray.sort();
  }
  soarray.forEach(element => document.getElementById(element+"d").checked = true);
//  console.log("randomGrid V");
//  console.log(soarray);
return soarray;
}

function arraysEqual(a,b) {
    if (a instanceof Array && b instanceof Array) {
        if (a.length!=b.length)  // assert same length
            return false;
        for(var i=0; i<a.length; i++)  // assert each element equal
            if (!arraysEqual(a[i],b[i]))
                return false;
        return true;
    } else {
        return a==b;  // if not both arrays, should be the same
    }
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// function randomLoop(size) {
//   let i = 0
//   while (arraysEqual(getCheckedDisplay(), getCheckedGrid()) != true) {
//     randomGrid(size);
//     getCheckedDisplay();
//     getCheckedGrid();
//     if (arraysEqual(getCheckedDisplay(), getCheckedGrid())) {
//       document.getElementById('title2').innerText = 'Found a match after ' + i + ' iterations!'
//       console.log(i)
//     } else {
//       sleep(100);
//       document.getElementById('title2').innerText = i
//       console.log(i)

//     }
//   i++;
//   if (i == 1000000) {break;}
//   }
//   if (i == 0) {document.getElementById('title2').innerText = 'Found a match after ' + i + ' iterations!'}
// }

function randomLoop(size, delay, max) {
  var i = 0
  var iID = setInterval(function() {
    //Found it!
    if (arraysEqual(getCheckedDisplay(), getCheckedGrid())) {
      document.getElementById('title2').innerText = 'Found a match after ' + i + ' iterations!'
      console.log(i);
      clearInterval(iID);
    } else {
      //Still looking...
      randomGrid(size);
      document.getElementById('title2').innerText = i;
      console.log(i);
    }
    if (++i >= max) {
      document.getElementById('title2').innerText = 'Hit the ' + max + ' iteration limit... Try again!'
      clearInterval(iID);
    }
  },
    delay);
  }