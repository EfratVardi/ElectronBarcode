
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

function Export(name) {
    var params = {
        fileName: new Date().toISOString().split('T')[0] + ' '+name,
    };
    gridOptions.api.exportDataAsCsv(params);
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#studentsGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});

