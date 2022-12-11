import { API } from 'aws-amplify';

export async function putUserDataAPI(form) { 
    const apiName = 'api994a52bc';
    const path = '/users';
    const myInit = { // OPTIONAL
        body: {
          ...form,
          password: "",
        }, // replace this with attributes you need
        headers: {}, // OPTIONAL
    };

    return await API.put(apiName, path, myInit);
  }