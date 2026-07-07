import { GUIDELINES } from "../constants/url";
import { getApiCall } from "../utils/servicesBaseUtils";

export const fetchGuidelinesApi = ({ finalCallback, successCallback }) => {
  let url = GUIDELINES;
  return getApiCall({
    url: url,
  })
    .then((responseJson) => {
      if (responseJson?.status === 200) {
        successCallback(responseJson?.data);
      }
    })
    .catch((error) => {
      console.log("error caught here", error);
    })
    .finally(() => {
      finalCallback();
    });
};
