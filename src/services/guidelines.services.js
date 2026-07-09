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

const API_URL = import.meta.env.VITE_API_URL;

export async function getGuidelines() {
  const response = await fetch(`${API_URL}/guidelines`);

  if (!response.ok) {
    throw new Error("Failed to fetch guidelines");
  }

  return response.json();
}
