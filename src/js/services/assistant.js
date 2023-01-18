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
      if (responseObject.errorCode) {
        throw responseObject;
      }
      return responseObject.responseData;
    } else {
      throw response;
    }
  },

  async registerAssistant(assistantDetails) {
    let url = `${Config.apiHost}/assistente/signup`;
    let formData = new FormData();
    let pictureFile = assistantDetails.picture;

    delete assistantDetails['picture'];
    formData.append('assistantDetails', JSON.stringify(assistantDetails));
    formData.append('pictureFile', pictureFile);

    let response = await fetch(url, {
        method: "POST",
        body: formData,
        credentials: "include"
    });

    if (response.status === 200) {
      let responseObject = await response.json();
      if (responseObject.errorCode) {
        throw responseObject;
      }
      return responseObject.responseData;
    } else {
      throw response;
    }
  }
}