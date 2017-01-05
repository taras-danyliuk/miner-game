let totalEmpty = 85,
    totalClicked = 0,
    clicked = [];

(function onLoad() {

  const DOMField = document.getElementById('field');
  const array = createArray(10, 10, 15);

  //Fill game field
  array.map((row, i) => {
    let DOMRow = document.createElement('div');
    DOMRow.className = 'row';

    row.map((block, j) => {
      let DOMBlock = document.createElement('div');
      DOMBlock.className = 'block new ';
      DOMBlock.setAttribute('number', i + ', ' + j);

      if (block) {
        DOMBlock.className += 'mine'
      }
      else {
        DOMBlock.className += 'empty';
        DOMBlock.innerHTML = countMinesAround(array, i, j);
      }

      DOMBlock.addEventListener('click', blockClick);
      DOMBlock.addEventListener('contextmenu', blockRightClick);

      DOMRow.appendChild(DOMBlock);
    });

    DOMField.appendChild(DOMRow);
  });

})();


//Fill array with random mines
function createArray(width, height, mines) {
  let positions = [];
  while(positions.length < mines) {
    let temp = [];
    temp[0] = Math.floor(Math.random()*height);
    temp[1] = Math.floor(Math.random()*width);

    if(!alreadyInserted(positions, temp)) positions.push(temp);
  }

  let array = [];
  for(let i = 0; i < height; i++) {
    array[i] = [];
    for(let j = 0; j < width; j++) {
      array[i][j] = 0;
    }
  }

  for(let i = 0; i < positions.length; i++) {
    array[positions[i][0]][positions[i][1]] = 1;
  }

  return array;
}

function alreadyInserted(base, arr) {
  if(!base.length) return false;
  for(let i = 0; i < base.length; i++) {
    if(base[i][0] === arr[0] && base[i][1] === arr[1]) return true;
  }
  return false;
}


//Events function
function blockClick(event) {
  showBlock(event.target);

  if(event.target.className.indexOf('mine') !== -1) {
    event.target.className += ' crossed';

    let DOMBlocks = document.getElementsByClassName('block');
    for (let i = 0 ; i < DOMBlocks.length; i++) {
      showBlock(DOMBlocks[i]);
    }

    document.getElementsByClassName('lose')[0].className = 'end-screen lose';
  }
  else {
    let number = event.target.getAttribute('number');
    if(clicked.indexOf(number) === -1) {
      clicked.push(number);
      totalClicked++;

      if(totalClicked == totalEmpty) {
        document.getElementsByClassName('win')[0].className = 'end-screen win';
      }

      if(event.target.innerHTML == '') {
        showAllEmptyZeros(event.target);
      }
    }
  }
}

function blockRightClick(event) {
  event.preventDefault();
  let className = event.target.className;
  if(className.indexOf('new') == -1 && className.indexOf('empty') != -1) return;

  if(className.indexOf('marked') == -1) className += ' marked';
  else className = className.substring(0, className.indexOf(' marked')) + className.substring(className.indexOf(' marked') + 7);

  event.target.className = className;
}

function showBlock(element) {
  let className = element.className;

  let index = className.indexOf(' new');
  if (index !== -1) {
    className = className.substring(0, index) + className.substring(index + 4);
  }

  index = className.indexOf(' marked');
  if (index !== -1) {
    className = className.substring(0, index) + className.substring(index + 7);
  }


  element.className = className;
}


//Helpers functions
function countMinesAround(array, i, j) {
  let number = 0,
      isFirstRow = false,
      isLastRow = false,
      isFirstColumn = false,
      isLastColumn = false;


  if (i === 0) isFirstRow = true;
  else if (i === 9) isLastRow = true;

  if (j === 0) isFirstColumn = true;
  else if (j === 9) isLastColumn = true;


  if (!isFirstRow) {
    array[i-1][j] ? number++ : '';
    if (!isFirstColumn) {
      array[i-1][j-1] ? number++ : '';
    }
    if (!isLastColumn) {
      array[i-1][j+1] ? number++ : '';
    }
  }
  if (!isLastRow) {
    array[i+1][j] ? number++ : '';
    if (!isFirstColumn) {
      array[i+1][j-1] ? number++ : '';
    }
    if (!isLastColumn) {
      array[i+1][j+1] ? number++ : '';
    }
  }
  if (!isFirstColumn) {
    array[i][j-1] ? number++ : '';
  }
  if (!isLastColumn) {
    array[i][j+1] ? number++ : '';
  }

  if(number == 0 ) return '';
  return number;
}

function showAllEmptyZeros(element){
  let i = +element.getAttribute('number').substring(0, 1),
      j = +element.getAttribute('number').substring(3),
      isFirstRow = false,
      isLastRow = false,
      isFirstColumn = false,
      isLastColumn = false;

  if (i === 0) isFirstRow = true;
  else if (i === 9) isLastRow = true;

  if (j === 0) isFirstColumn = true;
  else if (j === 9) isLastColumn = true;

  if (!isFirstRow) {
    document.querySelectorAll("[number='" + (i-1) + ", " + j + "']")[0].click();
    if (!isFirstColumn) document.querySelectorAll("[number='" + (i-1) + ", " + (j-1) + "']")[0].click();
    if (!isLastColumn) document.querySelectorAll("[number='" + (i-1) + ", " + (j+1) + "']")[0].click();
  }
  if (!isLastRow) {
    document.querySelectorAll("[number='" + (i+1) + ", " + j + "']")[0].click();
    if (!isFirstColumn) document.querySelectorAll("[number='" + (i+1) + ", " + (j-1) + "']")[0].click();
    if (!isLastColumn) document.querySelectorAll("[number='" + (i+1) + ", " + (j+1) + "']")[0].click();
  }
  if (!isFirstColumn) document.querySelectorAll("[number='" + i + ", " + (j-1) + "']")[0].click();
  if (!isLastColumn) document.querySelectorAll("[number='" + i + ", " + (j+1) + "']")[0].click();
}