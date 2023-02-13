
var columnDefs = [
    { headerName: "כיתה", field: "grade", editable: true },
    { headerName: "תעודת זהות", field: "tz" },
    { headerName: "שם", field: "name", editable: true },
    { headerName: "מספרי משימות", field: "tasksNumber", hide: true },
    { headerName: "סך נקודות", field: "points" },
    { headerName: "שמות המשימות", field: "tasks" },
    { headerName: "תאריכי עדכון", field: "dates" }
];

var rowData = JSON.parse(expose.studentsExcel())

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        filter: 'agTextColumnFilter',
        filterParams: {
            suppressAndOrCondition: true
        },
        sortable: true,
        resizable: true,
    },
    // enableRtl:true,
    rowData: rowData,
    onFirstDataRendered: onFirstDataRendered,
    onCellEditingStopped: onCellEditingStopped
};

function onFirstDataRendered(params) {
    gridOptions.api.sizeColumnsToFit({
        defaultMinWidth: 150,
        columnLimits: [{ key: 'tasks', minWidth: 800 }],
    });
}

function onCellEditingStopped(params) {
    expose.writeToFile("studentsExcel", JSON.stringify(gridOptions.rowData))
}

function New() {
    var students = JSON.parse(expose.studentsExcel())
    var tz = Math.floor(Math.random() * (399999999 - 200000000 + 1) + 200000000)
    for (var i = 0; i < students.length; i++) {
        while (students[i]["tz"] == tz) {
            tz = Math.floor(Math.random() * (399999999 - 200000000 + 1) + 200000000)
            i = 0
        }
    }
    students.unshift({
        grade: '------', name: '------', tz: tz, barcode: '',
        points: 0, tasks: ",", tasksNumber: ",", dates: '[]'
    })
    expose.writeToFile("studentsExcel", JSON.stringify(students))
    location.reload()
}

function Export() {
    var params = {
        fileName: new Date().toISOString().split('T')[0] + ' students',
    };
    gridOptions.api.exportDataAsCsv(params);
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#studentsGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});

