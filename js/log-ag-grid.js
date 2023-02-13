
var lcolumnDefs = [
    { headerName: "תאריך", field: "date" },
    { headerName: "פונקציה", field: "function" },
    { headerName: "שגיאה", field: "error" },
    { headerName: "פרטי תלמידה", field: "studentResult" },
    { headerName: "פרטי משימה", field: "taskResult" }

];

var lrowData = JSON.parse(localStorage.getItem("log"))

var lgridOptions = {
    columnDefs: lcolumnDefs,
    defaultColDef: {
        filter: 'agTextColumnFilter',
        filterParams: {
            suppressAndOrCondition: true
        },
        sortable: true,
        resizable: true,
    },
    enableRtl: true,
    rowData: lrowData,
};

function ExportLog() {
    var params = {
        fileName: new Date().toISOString().split('T')[0] + ' log',
    };
    lgridOptions.api.exportDataAsCsv(params);
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#logGrid');
    new agGrid.Grid(gridDiv, lgridOptions);
});

