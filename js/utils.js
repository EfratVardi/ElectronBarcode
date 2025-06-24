// פונקציות עזר כלליות לשימוש גם ב-node וגם בדפדפן

function getYesterdayDate() {
    var x = new Date();
    x.setDate((new Date().getDate() - 1))
    return x.toISOString().split('T')[0];
}


module.exports = { getYesterdayDate };
