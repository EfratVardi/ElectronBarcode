var gridOptions
var columnDefs = [
    { headerName: "כיתה", field: "grade", editable: true },
    { headerName: "שם", field: "name", editable: true },
    { headerName: "תעודת זהות", field: "tz" },
    { headerName: "מספרי משימות", field: "tasksNumber", hide: true },
    { headerName: "סך נקודות", field: "points" },
    { headerName: "שמות המשימות", field: "tasks" },
    { headerName: "תאריכי עדכון", field: "dates" }
];


document.addEventListener('DOMContentLoaded', function () {
    fileName = 'students'
    window.expose.SendExcel("sendReadExcel", fileName);
    window.expose.ReceiveExcel("receiveReadExcel" + fileName, (data) => {
        students = JSON.parse(data)
        console.log("rr")
        gridOptions = {
            columnDefs: columnDefs,
            rowData: students,
            defaultColDef: {
                filter: 'agTextColumnFilter',
                filterParams: {
                    suppressAndOrCondition: true
                },
                sortable: true,
                resizable: true,
            },
        };
        var gridDiv = document.querySelector('#studentsGrid');
        new agGrid.Grid(gridDiv, gridOptions);
    });
});

function Export(name) {
    var params = {
        fileName: new Date().toISOString().split('T')[0] + ' ' + name,
    };
    gridOptions.api.exportDataAsCsv(params);
}



