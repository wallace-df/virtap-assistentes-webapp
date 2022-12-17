export default {

    async monitorAPICall(apiCall, apiResultChecker) {

        async function doCall(resolve) {
            let result;
            try {
                result  = await apiCall();
            } catch(err) {
                setTimeout(() => doCall(resolve), 1000);
                return;
            }

            if (apiResultChecker(result)) {
                resolve(result);
            } else {
                setTimeout(() => doCall(resolve), 1000);
            }
        }

        let result = await new Promise(resolve => doCall(resolve)); 
        return result;
    }
}