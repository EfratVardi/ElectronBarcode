
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
    return { "date": getYesterdayDate(), "position": "", "hasPrint": "1", "hasBuy": "0", "device": "0", "color": "0", "type": "0", "hasParents": "0", "buy": false };
}

function login(page) {
    window.location.href = page + '.html';
}

function getBackground(device, color, step="") {
    switch (device) {
        case "0": {
            return "url('../../resources/barcode/pinkBackground" + step + ".gif')";
        };
        case "1": {
            switch (color) {
                case "1":
                    return "url('../../resources/barcode/pinkBackground" + step + ".gif')";
                case "2":
                    return "url('../../resources/barcode/greenBackground" + step + ".gif')";
                case "3":
                    return "url('../../resources/barcode/ravKavBackground.png')";
                case "4":
                    return "url('../../resources/barcode/personalBackground.png')";
            }
        };
        case "2":
        case "4":
            {
                switch (color) {
                    case "1":
                        return "url('../../resources/magnetCard/background.png')";
                    case "3":
                        return "url('../../resources/magnetCard/ravKavBackground.png')";
                    case "4":
                        return "url('../../resources/magnetCard/personalBackground.png')";
                };
            };
        case "3": {
            return "url('../../resources/digitalCard/background" + step + ".gif')";
        };
    }
}

function getPosition(color) {
    switch (color) {
        case "1":
            return "#75DDB4";
        case "2":
            return "yellow";
        case "3":
        case "4":
            return "white";
    }
}


function getExcelFiles() {
    return ["students", "uniqTasks", "products", "parents"];
}

function getWonTexts() {
    return ["!איזה כיף", "---כן, כן, זה קרה", "...וואו, איזה חלום", "---קולולולולו"];
}

function getLossTexts() {
    return ["...לא זכית, אולי בפעם הבאה", "!!מצטערים--- לא זכית הפעם", "!אופס... הכרטיס לא שווה ", "...לא זכית! לא נורא"];
}