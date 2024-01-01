const terrain_types = ['desert', 'forest', 'mountains', 'river', 'plains', 'beach']
const resource_types = ['iron', 'wood', 'marble', 'oil', 'tin', 'coal', 'lead', 'honey', 'gems', 'wheat', 'rubber'];
const tile_counts = {
    small: 25,
    medium: 100,
    large: 400
}
const max_random_value = 100;
const random4 = 25;
const random5 = 20;
const none = 'None';
function generateMapData(mapSize) {
    const tiles = mapSize;
    const encryptedMap = [];
    for (let i = 1; i <= tiles; i++) {
        const tileStats = {
            tile: i,
            terrain: randomArray(terrain_types),
            controller: 'No one',
            resource: randomArray(resource_types),
            resourceQuantity: Math.floor(1 + (randomNumber() / random4)),
            additionalResource: additionalResource(),
            additionalResourceQuantity: 1
        };
        /* Sprawdzenie, czy surowiec dodatkowy jest taki sam jak głowny, i jeśli jest, to jest on usuwany */
        if (tileStats.resource === tileStats.additionalResource) {
            tileStats.additionalResource = none;
        };
        if (tileStats.additionalResource === none) {
            tileStats.additionalResourceQuantity = 0;
        };
        /**/
        encryptedMap.push(tileStats);
    }
    localStorage.setItem('map', JSON.stringify(encryptedMap));
    localStorage.setItem('flagGenerated', true);
}
function additionalResource() {
    if (randomNumber() <= random5) {
        return randomArray(resource_types);
    } else {
        return none;
    }
}
function generateGraphics(tiles) {
    const rowsandcolumns = Math.sqrt(tiles);
    const mapData = JSON.parse(localStorage.getItem('map'));
    if ((150 + rowsandcolumns * 100 + 50 * (rowsandcolumns - 1)) > 1920) {
        document.body.style.width = `${150 + rowsandcolumns * 100 + 50 * (rowsandcolumns - 1)}px`
    };
    if (48 * rowsandcolumns > 1080) {
        document.body.style.height = `${400 + 48 * rowsandcolumns}px`
    };
    document.querySelector('.map').style.width = `${50 + rowsandcolumns * 100 + 50 * (rowsandcolumns - 1)}px`;
    document.querySelector('.map').style.gridTemplateColumns = `repeat(${rowsandcolumns}, 10fr)`;
    for (let i = 1; i <= rowsandcolumns; i++) {
        const newSection = document.createElement('section');
        newSection.id = `mapsection${i}`;
        if (i % 2 === 0) {
            newSection.classList.add('map', 'map2');
        }
        else {
            newSection.classList.add('map');
        };
        for (let n = 1; n <= rowsandcolumns; n++) {
            const tileData = mapData[(rowsandcolumns * i + n) - rowsandcolumns - 1];
            const newDiv = document.createElement('div');
            const newDivPicture = document.createElement('img');
            const newDivMap = document.createElement('map');
            const newDivMapArea = document.createElement('area');
            newDiv.id = `tile${(rowsandcolumns * i + n) - rowsandcolumns}`;
            newDiv.classList.add('tile');
            newDivPicture.classList.add('imgres');
            newDivPicture.src = `images/${tileData.terrain}.png`;
            newDivMap.name = `tile${(rowsandcolumns * i + n) - rowsandcolumns}map`
            newDivMapArea.target = '_top'
            newDivMapArea.alt = 'Just a tile'
            function ifAdditionalResource(checkResource) {
                if (checkResource != none) {
                    return `, ${tileData.additionalResource}: ${tileData.additionalResourceQuantity}.`;
                } else {
                    return `.`
                };
            }
            newDivMapArea.title = `${tileData.resource}: ${tileData.resourceQuantity}${ifAdditionalResource(tileData.additionalResource)}`
            newDivMapArea.setAttribute("onclick", `checkID(${(rowsandcolumns * i + n) - rowsandcolumns})`);
            newDivMapArea.shape = 'poly';
            newDivMapArea.coords = "25,1,1,45,25,99,75,99,99,45,75,1";
            newDivMapArea.classList.add('areaclick');
            newDivPicture.useMap = `#${newDivMap.name}`
            newDiv.appendChild(newDivPicture);
            newDiv.appendChild(newDivMap);
            newDivMap.appendChild(newDivMapArea);
            newSection.appendChild(newDiv);
        }
        const wrapSection = document.body.getElementsByClassName('map_wrap');
        wrapSection[0].appendChild(newSection);
    }
}
function generateMap(mapSize) {
    if (JSON.parse(localStorage.getItem('flagGenerated'))) {
        alert('Map is already generated!')
    } else {
        generateMapData(mapSize);
        generateGraphics(mapSize);
    }
}
function randomNumber() {
    return Math.round(Math.random() * max_random_value);
}
function randomArray(vartab) {
    return vartab[Math.floor(randomNumber() / (max_random_value / vartab.length))];
}
function checkID(tileID) {
    mapData = JSON.parse(localStorage.getItem('map'));
    let tileData;
    tileData = mapData[tileID - 1];
    console.log(tileData);
}
function removeMap() {
    if (JSON.parse(localStorage.getItem('flagGenerated'))) {
        localStorage.removeItem('map');
        document.body.querySelector('.map_wrap').innerHTML = "";
        localStorage.setItem('flagGenerated', false);
    } else {
        alert('Map is not generated!');
    }
}