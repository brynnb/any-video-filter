//loads default data into browser storage from saved JSON file
function loadDefaultData() {
    var request = new XMLHttpRequest();
    request.open('GET', chrome.extension.getURL('defaultData.json'), true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            chrome.storage.sync.set(data, function() {
                console.log("Default data loaded");
            });
        }
    };
    request.send();
}