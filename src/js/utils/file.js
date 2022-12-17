
export default {

    readFileAsBlob(file, callback) {
        let fileReader = new FileReader();

        fileReader.onload = function () {
            callback(null, fileReader.result);
        };

        fileReader.onerror = function (err) {
            callback(err, null);
        };

        fileReader.readAsArrayBuffer(file);
    },

    readFileAsText(file, callback) {
        let fileReader = new FileReader();

        fileReader.onload = function () {
            callback(null, fileReader.result);
        };

        fileReader.onerror = function (err) {
            callback(err, null);
        };

        fileReader.readAsText(file);
    },

    readFileAsJson(file, callback) {
        this.readFileAsText(file, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }

            try {
                callback(null, JSON.parse(result));
            } catch (error) {
                callback(error, null);
            }
        });
    }
}
