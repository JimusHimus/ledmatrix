let matrixSize = 16;
const bitMaps = [];
let bitmap = [];

function doTurnX(y) {
    var angle = parseInt(document.pixCalc.inputAngle.value);
    if (y == 1) {
        doTurn(angle * -1);
    } else {
        doTurn(angle)
    }
}

function doTurn(angle) {
    var x = document.pixCalc.inputRotCent;
    var r = x.value.split(",");
    var bitMapsTemp = [0, 0, 0, 0, 0, 0, 0, 0];
    var i = document.pixCalc.dataList1;
    var arr_i = i.value.split(",");
    for (rown = 0; rown < 8; ++rown) {
        for (col = 0; col < 8; ++col) {
            var mask = 1 << col;
            if ((arr_i[rown] & mask) !== 0) { //wenn pixel gesetzt
                var Pixel = rotate(parseFloat(r[0]), parseFloat(r[1]), rown, col, angle);
                var nx = Math.round(Pixel[0]);
                var ny = Math.round(Pixel[1]);
                bitMapsTemp[nx] = bitMapsTemp[nx] + Math.pow(2, ny);
            }
        }
    }
    clearit();
    document.pixCalc.dataList1.value = bitMapsTemp;
    updateMap();
}

function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
        ny = (sin * (x - cx)) + (cos * (y - cy)) + cy;
    return [nx, ny];
} //cx,cy = center of rotation, x.y =coords , 

/*
var newPoint = rotate(0, 0, 6, 1, 40),
newX = newPoint[0],
newY = newPoint[1];*/

//newX and newY are both floating point decimals, and you can convert them to integers using Math.round(), Math.ceil(), or Math.floor() as needed.

function doshiftRight() {
    i = document.pixCalc.dataList1;
    var arr_i = i.value.split(",");
    for (a = 0; a < 8; a++) {
        arr_i[a] = (arr_i[a] >> 1) | (arr_i[a] << (8 - 1));
    }
    clearit();
    document.pixCalc.dataList1.value = arr_i;
    updateMap();
}

function doshiftLeft() {
    i = document.pixCalc.dataList1;
    var arr_i = i.value.split(",");
    for (a = 0; a < 8; a++) {
        arr_i[a] = (arr_i[a] << 1) | (arr_i[a] >> (8 - 1));
    }
    clearit();
    document.pixCalc.dataList1.value = arr_i;
    updateMap();
}

function doshiftUp() {
    i = document.pixCalc.dataList1;
    var arr_i = i.value.split(",");
    var t_ArrV = arr_i.shift();
    arr_i[7] = t_ArrV;
    clearit();
    document.pixCalc.dataList1.value = arr_i;
    updateMap();
}

function doshiftDown() {
    i = document.pixCalc.dataList1;
    var arr_i = i.value.split(",");
    var t_ArrV = arr_i.pop();
    for (var x = 6; x >= 0; x--) {
        arr_i[x + 1] = arr_i[x];
    }
    arr_i[0] = t_ArrV;
    clearit();
    document.pixCalc.dataList1.value = arr_i;
    updateMap();
}

function insertHexStr() {
    clearit();
    i = document.pixCalc.inputHexStr;
    document.pixCalc.dataList1.value = i.value;
    updateMap();
}

function updateMap() {
    i = document.pixCalc.dataList1;
    var arr_i = i.value.split(",");
    for (rown = 0; rown < 8; ++rown) {
        for (col = 0; col < 8; ++col) {
            var mask = 1 << col;
            if ((arr_i[rown] & mask) !== 0) {
                imgName = 'p' + rown + col
                togImage(imgName);
            }
        }
    }
}

function upDateList() {
    with (document.pixCalc) {
        dataList.value = row0.value + ', ' + row1.value + ', ' + row2.value + ', ' + row3.value + ', ' + row4.value + ', ' + row5.value + ', ' + row6.value + ', ' + row7.value
        dataList1.value = row01.value + ', ' + row11.value + ', ' + row21.value + ', ' + row31.value + ', ' + row41.value + ', ' + row51.value + ', ' + row61.value + ', ' + row71.value
    }
}

function togImage(imgName) {
    var bitMask = 1 << parseInt(imgName.charAt(2))
    var n = imgName.charAt(1)
    var pixelChange = 'document.pixCalc.row' + n + '.value = bitMaps[n]'
    var pixelChange1 = 'document.pixCalc.row' + n + '1.value = "0x"+bitMaps[n].toString(16)'
    var pixState = document[imgName].src.charAt((document[imgName].src.length) - 5)
    if (pixState === '0') {
        document[imgName].src = 'pixel1.gif'
        bitMaps[n] = bitMaps[n] | bitMask
        eval(pixelChange)
        eval(pixelChange1)
        upDateList()
    } else {
        document[imgName].src = 'pixel0.gif'
        bitMask = bitMask ^ 0xFF
        bitMaps[n] = bitMaps[n] & bitMask
        eval(pixelChange)
        eval(pixelChange1)
        upDateList()
    }
}

function invert() {
    for (rown = 0; rown < 8; ++rown) {
        for (col = 0; col < 8; ++col) {
            imgName = 'p' + rown + col
            togImage(imgName)
        }
    }
}

function clearit() {
    for (rown = 0; rown < 8; ++rown)
        for (col = 0; col < 8; ++col) {
            imgName = 'p' + rown + col
            var bitMask = 1 << parseInt(imgName.charAt(2))
            var n = imgName.charAt(1)
            var pixelChange = "document.pixCalc.row" + n + ".value = bitMaps[n]"
            var pixelChange1 = 'document.pixCalc.row' + n + '1.value = "0x"+bitMaps[n].toString(16)'
            document[imgName].src = 'pixel0.gif'
            bitMask = bitMask ^ 0xFF
            bitMaps[n] = bitMaps[n] & bitMask
            eval(pixelChange)
            eval(pixelChange1)
            upDateList()
        }
}

function resizeArray(arr, newSize, defaultValue) {
    while (newSize > arr.length)
        arr.push(defaultValue);
    arr.length = newSize;
}

function resizeMatrix(matrix, newSize, defaultValue) {
    matrix.forEach((item) => resizeArray(item, newSize, defaultValue))
    while (newSize > matrix.length)
        matrix.push(Array(newSize).fill(defaultValue));
    matrix.length = newSize;
    // console.log(matrix);
}

function drawMatrix(existing) {
    let table = document.querySelector('#bitmap');

    if (!existing) {
        table.innerHTML = null;
        for (let i = 0; i < matrixSize; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < matrixSize; j++) {
                const td = document.createElement('td');
                td.id = `i_${i}_${j}`;
                td.classList.add('item');
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }

    let rows = table.querySelectorAll('tr');

    for (let i = 0; i < matrixSize; i++) {
        let cells = rows[i].querySelectorAll('td');
        for (let j = 0; j < matrixSize; j++) {
            if (bitmap[i][j])
                cells[j].classList.add('selected');
            else
                cells[j].classList.remove('selected');
        }
    }
}

function bitmapToByteString(bitmap) {
    // Разделение массива на группы по 8 бит
    const chunks = [];
    for (let i = 0; i < bitmap.length; i += 8) {
        chunks.push(bitmap.slice(i, i + 8));
    }

    // Преобразование каждой группы в байт и сборка их в строку
     // Разделитель между байтами
    return chunks.map(chunk => {
        const byte = chunk.reduce((acc, bit, index) => {
            // Сдвигаем биты и присоединяем к предыдущим битам
            return acc | (bit ? 1 << (7 - index) : 0);
        }, 0);
        // Преобразование числа в шестнадцатеричную строку вида 0x??
        return '0x' + byte.toString(16).padStart(2, '0');
    }).join(', ');
}

function printValues() {
    const hexArray = document.querySelector('#hexArray');
    // let res = 1;
    bitmap.flat()
    // console.log(bitmap.flat().slice(0, 16));
    // console.log(bitmap.flat().slice(0, 16).reduce((res, x) => res << 1 | x));
    hexArray.value = bitmapToByteString(bitmap.flat());
}

function processMatrix(existing = true) {
    resizeMatrix(bitmap, matrixSize, false);
    drawMatrix(existing);
    printValues();
}

function togglePos(x, y) {
    bitmap[x][y] = !bitmap[x][y];
    // console.log(bitMaps);
    processMatrix();
    // initListeners();
}

function handleHexArrayChange(target) {
    const regex = /^(0x[0-9a-fA-F]{2}, )*0x[0-9a-fA-F]{2}$/;

    const text = target.value.trim().replace('\n', '');
    target.value = text;
    if (!regex.test(text)) {
        return;
    }

    const values = text.split(', ').map(val => parseInt(val.trim().substring(2), 16));
    const getBits = num => Array.from({length: 8}, (_, i) => ((num >> (7 - i)) & 1) === 1);
    const chunkArray = (array, chunkSize) => Array.from({length: Math.ceil(array.length / chunkSize)}, (_, i) => array.slice(i * chunkSize, i * chunkSize + chunkSize));

    bitmap = chunkArray(values.flatMap(getBits), matrixSize);
    processMatrix();
}

function initListeners() {
    let table = document.querySelector('#bitmap');
    let matrixSizeInput = document.querySelector('#matrixSize');
    let hexArrayInput = document.querySelector('#hexArray');

    let clicked = false;

    document.addEventListener("mouseup", () => {
        clicked = false;
    });

    function handleMouseEvent(e) {
        if (!e.target.classList.contains('item')) return;

        const splitted = e.target.id.split('_');
        const posX = parseInt(splitted[1]);
        const posY = parseInt(splitted[2]);
        // console.log(posX, posY);
        togglePos(posX, posY);
    }

    table.addEventListener("mousedown", (e) => {
        handleMouseEvent(e);
        clicked = true;
    });

    table.addEventListener("mouseover", (e) => {
        if (!clicked) return;
        handleMouseEvent(e);
    });

    matrixSizeInput.onchange = () => {
        matrixSize = parseInt(matrixSizeInput.value);
        processMatrix(false);
    };

    hexArrayInput.oninput = (e) => {
        handleHexArrayChange(e.target);
    }
}

window.addEventListener('load', function () {
    document.querySelector('#matrixSize').value = matrixSize;
    processMatrix(false);
    initListeners();
});
