
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
    return { "device": "0", "hasBuy": "0", "hasParents": "0", "date": getYesterdayDate(), "buy": false };
}

function login(page) {
    window.location.href = page + '.html';
}

function getBackground(type, num) {
    switch (type) {
        case "1":
            return "url('../../resources/barcode/pinkBackground" + num + ".gif')";
        case "2":
            return "url('../../resources/barcode/greenBackground" + num + ".gif')";
    }
}

function getPosition(type) {
    switch (type) {
        case "1":
            return "#75DDB4";
        case "2":
            return "yellow";
    }
}