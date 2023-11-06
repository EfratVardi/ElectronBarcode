
function getYesterdayDate() {
    var x = new Date();
    x.setDate((new Date().getDate() - 1))
    return x.toISOString().split('T')[0];
}

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}
function getTodayDateTime() {
    return new Date().toLocaleString();
}

function getDefaultConfig() {
    return {"date": getYesterdayDate(), "position": "", "color": "1" };
}
// function mainLoad() {
//     fileName = 'systemConfig'
//     window.expose.SendExcel("sendReadExcel", fileName);
//     window.expose.ReceiveExcel("receiveReadExcel" + fileName, (data) => {
//         if (data == 0) {
//             systemConfig = { "date": getYesterdayDate(), "position": "", "color": "1" }
//         }
//         else {
//             systemConfig = JSON.parse(data)
//         }
//         systemConfig.color == "2" ?
//             document.getElementById("background").style.backgroundImage = "url('resources/greenBackground4.gif')" :
//             document.getElementById("background").style.backgroundImage = "url('resources/pinkBackground4.gif')";

//     })
// }