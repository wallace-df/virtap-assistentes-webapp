import Config from "../../../resources/config.js"

const promisyFetch = (url, options) =>
  new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => response)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });

export default {

  async getAssistantData() {
    let url = `${Config.apiHost}/assistente`;
    let response = await fetch(url, { credentials: "include" });
    if (response.status === 200) {
      let responseObject = await response.json();
      console.log(responseObject);
      if (responseObject.errorCode) {
        throw responseObject;
      }
      return responseObject.responseData;
    } else {
      throw response;
    }

  }
}