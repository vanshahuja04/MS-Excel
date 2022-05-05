/* defaultProperty is an object which contains all the properties of a cell with their default value */
let defaultProperties = {
    text: "",
    "font-weight": "",
    "font-style": "",
    "text-decoration": "",
    "text-align": "left",
    "background-color": "white",
    "color": "black",
    "font-family": "Noto Sans",
    "font-size": "14"
}
/* cellData is an object which contains all property of cell only if any property is changed from defaultProperties of particular cell */
let cellData = {
    "Sheet1": {}
}

let selectedSheet = "Sheet1";
let totalSheets = 1;

$(document).ready(function () { //code inside .ready method runs only when the DOM is loaded and ready to execute the JS code

    /* below for loop puts alphabets on column-name from A to Z then AA to AZ and so on till 100 and puts 1 to 100 in row-name. 
       Also it contains 1 based indexing */
    for (let i = 1; i <= 100; i++) {
        let ans = "";
        let n = i;

        while (n > 0) {
            let rem = n % 26;
            if (rem == 0) {
                ans = "Z" + ans;
                n = Math.floor(n / 26) - 1;
            } else {
                ans = String.fromCharCode(rem - 1 + 65) + ans;
                n = Math.floor(n / 26);
            }
        }
        let column = $(`<div class="column-name  colId-${i}" id="colcod-${ans}">${ans}</div>`);
        $(".column-name-container").append(column);
        let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
        $(".row-name-container").append(row);
    }

    /* It puts 100 cells in each row for 100 rows i.e total 10,000 cells. */
    for (let i = 1; i <= 100; i++) {
        let row = $(`<div class="cell-row"></div>`);
        for (let j = 1; j <= 100; j++) {
            let colcod = $(`.colId-${j}`).attr("id").split("-")[1];//it takes colId class for particular column and stores its alphabet in colcod
            let column = $(`<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data="col-${colcod}"></div>`);
            row.append(column);
        }
        $(".input-cell-container").append(row);
    }

    /* On clicking align icon it selects the currently clicked align icon and deselects the previously selected align icon */
    $(".align-icon").click(function () {
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
    })

    /* Toggles the selection on clicking the style icon in menu icon bar */
    $(".style-icon").click(function () {
        $(this).toggleClass("selected");
    })

    /* Defines the functions to be done when input cell is clicked */
    $(".input-cell").click(function (e) {
        if (e.ctrlKey)//for selecting multiple cells and gives the appropriate class to the selected cell
        {
            let [rowId, colId] = getRowCol(this);
            if (rowId > 1) {
                let topCellSelected = $(`#row-${rowId - 1}-col-${colId}`).hasClass("selected");
                if (topCellSelected) {
                    $(this).addClass("top-cell-selected");
                    $(`#row-${rowId - 1}-col-${colId}`).addClass("bottom-cell-selected");
                }
            }
            if (rowId < 100) {
                let bottomCellSelected = $(`#row-${rowId + 1}-col-${colId}`).hasClass("selected");
                if (bottomCellSelected) {
                    $(this).addClass("bottom-cell-selected");
                    $(`#row-${rowId + 1}-col-${colId}`).addClass("top-cell-selected");
                }
            }
            if (colId > 1) {
                let leftCellSelected = $(`#row-${rowId}-col-${colId - 1}`).hasClass("selected");
                if (leftCellSelected) {
                    $(this).addClass("left-cell-selected");
                    $(`#row-${rowId}-col-${colId - 1}`).addClass("right-cell-selected");
                }
            }
            if (colId < 100) {
                let rightCellSelected = $(`#row-${rowId}-col-${colId + 1}`).hasClass("selected");
                if (rightCellSelected) {
                    $(this).addClass("right-cell-selected");
                    $(`#row-${rowId}-col-${colId + 1}`).addClass("left-cell-selected");
                }
            }
        }
        else {
            $(".input-cell.selected").removeClass("selected"); //removes selected class from all the cells which were selected

            /* below 4 statements remove the classes which were given to the cell for multiple selection */
            if ($(this).hasClass("left-cell-selected"))
                $(this).removeClass("left-cell-selected");

            if ($(this).hasClass("right-cell-selected"))
                $(this).removeClass("right-cell-selected");

            if ($(this).hasClass("top-cell-selected"))
                $(this).removeClass("top-cell-selected");

            if ($(this).hasClass("bottom-cell-selected"))
                $(this).removeClass("bottom-cell-selected");

        }
        $(this).addClass("selected"); //gives selected class to the particular selected cell 
        changeHeader(this);
    });

    /* changeHeader retains the properties of selected cell and gives the properties back to the cell when it is selected again. */
    function changeHeader(ele) {
        let [rowId, colId] = getRowCol(ele);
        let cellInfo = defaultProperties;
        if (cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId])// if cell exists then store it in cellInfo
        {
            cellInfo = cellData[selectedSheet][rowId][colId];
        }
        cellInfo["font-weight"] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected");
        cellInfo["font-style"] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected");
        cellInfo["text-decoration"] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected");

        let alignment = cellInfo["text-align"];
        $(".align-icon.selected").removeClass("selected");
        $(".icon-align-" + alignment).addClass("selected");
    }

    /* Things to be done on the double click of cell */
    $(".input-cell").dblclick(function () {
        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable", "true");
        $(this).focus();
    })

    /* When we select any other cell then the cell which was selected will have blur property using which 
    we can make its contenteditable false */
    $(".input-cell").blur(function () {
        $(".input-cell.selected").attr("contenteditable", "false");
    })

    /* Whenever the input container is scolled we will scroll column-name-container as well as row-name-container */
    $(".input-cell-container").scroll(function () {
        $(".column-name-container").scrollLeft(this.scrollLeft);
        $(".row-name-container").scrollTop(this.scrollTop);
    })

});

/* getRowCol() for getting the cell info */
function getRowCol(ele) {
    let idArray = $(ele).attr("id").split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId, colId];
}

/* updateCell() updates the property of the cell accordingly which is selected in the menu-icon-bar as well as it updates
   the particular cell's property in the cell data */
function updateCell(property, value, defaultPossible) {
    $(".input-cell.selected").each(function () {
        $(this).css(property, value);
        let [rowId, colId] = getRowCol(this);
        if (cellData[selectedSheet][rowId]) {
            if (cellData[selectedSheet][rowId][colId]) {
                cellData[selectedSheet][rowId][colId][property] = value;
            }
            else {
                cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
                cellData[selectedSheet][rowId][colId][property] = value;
            }
        }
        else {
            cellData[selectedSheet][rowId] = {};
            cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
            cellData[selectedSheet][rowId][colId][property] = value;
        }
        if (defaultPossible && (JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify(defaultProperties))) {
            delete cellData[selectedSheet][rowId][colId];
            if (Object.keys(cellData[selectedSheet][rowId]).length === 0)
                delete cellData[selectedSheet][rowId];
        }
    })
}

/* On clicking below three classes of buttons in menu icon bar we can update the property of selected cells and if we are passing
   the value of property equal to default one then 3rd parameter will be true else false. Also changed property will be updated in
   cell data which is the storage of particular cell.*/
$(".icon-bold").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("font-weight", "", true);
    }
    else {
        updateCell("font-weight", "bold", false);
    }
})

$(".icon-italic").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("font-style", "", true);
    }
    else {
        updateCell("font-style", "italic", false);
    }
})

$(".icon-underline").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("text-decoration", "", true);
    }
    else {
        updateCell("text-decoration", "underline", false);
    }
})

/* On clicking below 3 classes of buttons in menu icon bar we can give allignment to selected cells. Note, that the selected cells
can have only 1 property from below 3 so 3rd parameter will be passed as true */
$(".icon-align-left").click(function () {
    if (!$(this).hasClass("selected")) {
        updateCell("text-align", "left", true);
    }
})

$(".icon-align-center").click(function () {
    if (!$(this).hasClass("selected")) {
        updateCell("text-align", "center", true);
    }
})

$(".icon-align-right").click(function () {
    if (!$(this).hasClass("selected")) {
        updateCell("text-align", "right", true);
    }
})