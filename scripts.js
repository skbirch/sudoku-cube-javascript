// Object Definition //
// Create Face template
function newCube() {
  this.faces = null;
  this.slabs = null;
  this.slices = null;
  this.walls = null;
  this.valid = true;
  this.complete = false;
  this.invalidList = null;
  this.newestNumber = null;

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

  function setupNewCube() {
    var cube = {
      faces: createFaces(6),
      slabs: createSlabs(4),
      slices: createSlices(4),
      walls: createWalls(4),
      valid: true,
      complete: false,
      invalid: [""],
      newestNumber: ['', '']
    };
    assignPositionalIds(cube.faces);
    setFaceColors(cube);
    syncAll(cube.faces, cube.slabs, cube.slices, cube.walls);
    displayAll(cube);
    return cube;
  }

// Visual Functions
// -------------------------------------------------------------------------------------
function initializeUnwrappedCanvasCube() {
  for (var i = 0; i <= 5; i++) {
    document.getElementById(i).innerHTML = initializeUnwrappedCanvasFace(i);
  }
}

function initializeUnwrappedCanvasFace(faceId) {
  var html = "";
  for (var i = 0; i <= 15; i++) {
    var id = faceId + "-" + i;
    html += "<div id=\"" + id + "\"class=\"cell\">" + initializeUnwrappedCanvasCell(id) + "</div>"
  }
  return html;
}

function initializeUnwrappedCanvasCell(cellId) {
  var html = "";
  for (var i = 0; i <= 15; i++) {
    var id = cellId + "-" + i;
    html += "<div id=\"" + id + "\"class=\"cell-row\">15</div>"
  }
  return html;
}

function setCellState(id, status, value) {
  var element = document.getElementById(id);
  element.innerHTML = value;
  element.classList.add(status);
}

function completedCube() {
  var elements = document.getElementsByClassName("face");
  for (let element of elements) {
    element.classList.add("completed");
  }
}
// -------------------------------------------------------------------------------------