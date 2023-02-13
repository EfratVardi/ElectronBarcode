
var columnDefs = [
    { headerName: "קוד", field: "code" },
    { headerName: "שם", field: "name" },
    { headerName: "האם שומש", field: "used" },
    { headerName: "שייך לכיתה", field: "class" },
];

var rowData = JSON.parse(expose.uniqTasksExcel())

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
    enableRtl: true,
    rowData: rowData,
};

function ExportTasks() {
    var params = {
        fileName: new Date().toISOString().split('T')[0] + ' tasks',
    };
    gridOptions.api.exportDataAsCsv(params);
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#tasksGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});

