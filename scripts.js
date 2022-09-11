// Object Definition //
// Create Face template
function newCube() {
  var cube = new Object();
  cube.faces = newFaces(6);
  cube.slabs = newSections(4);
  cube.slices = newSections(4);
  cube.walls = newSections(4);
  cube.valid = true;
  cube.complete = false;
  cube.invalidList = [];
  cube.newestNumber = {id: "", value: null};
  return cube;
  }

  function newFaces(count) {
    var faceList = [];
    for (var i = 0; i <= count - 1; i++) {
      var face = new Object();
      face.id = String(i);
      face.cells = newCells(16, face.id);
    // face.matrix = new Array(4).fill();
      face.PopulateMatrix = function() {
        face.Matrix.forEach(line => line.fill(Array.from(new Array(16), (x, i) => i)));
      };
      faceList.push(face);
    }
    return faceList;
  }

  function newCells(count, faceId) {
    var cellList = [];
    for (var i = 0; i <= count - 1; i++) {
      var cell = new Object();
      cell.id = `${faceId}-${i}`;
      cell.value = null;
      cell.invalid = false;
      cell.superPositions = newSuperPositions(16, cell.id);
      cellList.push(cell);
    }
    return cellList;
  }

  function newSuperPositions(count, cellId) {
    var superPositionList = [];
    for (var i = 0; i <= count - 1; i++) {
      var superPosition = {id: `${cellId}-${i}`, value: i+1};
    superPositionList.push(superPosition);
    }
    return superPositionList;
  }

  function newSections(count) {
    var sectionList = [];
    for (var i = 0; i <= count; i++) {
      var section = {id: null, matrix: {}};
      sectionList.push(section);
    }
    return section;
  }

  function populateCube(cube) {
      //populateFaces(cube.faces);
      //populateSlabs(cube.slabs);
      //populateSlices(cube.slices);
      //populateWalls(cube.walls);
    }

  function populateFaces(faces) {
    for (var i = 0; i <= 5; i++) {
      //faces[i].id = i;
      //populateCells(faces[i]);
      //populateSlabs(cube.slabs);
      //populateSlices(cube.slices);
      //populateWalls(cube.walls);
    }
  }

  function populateCells(face) {
    //console.log(face);
//    for (var i = 0; i <= 15; i++) {

  }
// Visual Functions
// -------------------------------------------------------------------------------------
function ShowHideSections() {

}
function initializeUnwrappedCanvasCube() {
  for (var i = 0; i <= 5; i++) {
    document.getElementById(i).innerHTML = initializeUnwrappedCanvasFace(i, 16);
      //document.getElementById("slices").innerHTML += initializeUnwrappedCanvasSection(i, "slice");
      //document.getElementById("walls").innerHTML += initializeUnwrappedCanvasSection(i, "wall");
  }
  document.getElementById("slabs").innerHTML = initializeUnwrappedCanvasSection("slab");
  document.getElementById("slices").innerHTML = initializeUnwrappedCanvasSection("slices");
  document.getElementById("walls").innerHTML = initializeUnwrappedCanvasSection("walls");
}

function initializeUnwrappedCanvasFace(faceId, count) {
  var html = "";
  for (var i = 0; i <= count - 1; i++) {
    var id = faceId + "-" + i;
    html += "<div id=\"" + id + "\"class=\"cell\">" + initializeUnwrappedCanvasCell(id, 16) + "</div>"
  }
  return html;
}

function initializeUnwrappedCanvasCell(cellId, count) {
  var html = "";
  for (var i = 0; i <= count - 1; i++) {
    var id = cellId + "-" + i;
    html += "<div id=\"" + id + "\"class=\"cell-row\"></div>"
  }
  return html;
}

function initializeUnwrappedCanvasSection(sectionsId) {
  var html = "";
  for (var i = 0; i <= 3; i++) {
    var id = sectionsId + "-" + i;
    html += "<div id=\"" + id + "\"class=\"section\">" + initializeUnwrappedCanvasSubSection(id) + "</div>"
  }
  return html;
}

function initializeUnwrappedCanvasSubSection(sectionId) {
  var html = "";
  for (var i = 0; i <= 3; i++) {
    var id = sectionId + "-" + i;
    html += "<div id=\"" + id + "\"class=\"sub-section\">" + initializeUnwrappedCanvasFace(id, 4) + "</div>"
  }
  return html;
}

// Update Functions
// -------------------------------------------------------------------------------------
function updateCube(cube) {
  cube.faces.forEach(face => {updateFace(face)});
}

function updateFace(face) {
  //console.log(face);
  face.cells.forEach(cell => {updateCell(cell)});
}

function updateCell(cell) {
  cell.superPositions.forEach(sp => {updateSuperPosition(sp)});
}

function updateSuperPosition(superPosition) {
  document.getElementById(superPosition.id).innerHTML = superPosition.value - 1;
}

// -------------------------------------------------------------------------------------

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

function showSections() {
  var sections = document.getElementsByClassName("sections");
  for (let section of sections) {
    if (section.style.display === "grid") {
      section.style.display = "none";
    } else {
      section.style.display = "grid";
    }
  }
}