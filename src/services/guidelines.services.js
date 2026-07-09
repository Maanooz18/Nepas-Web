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

const API_BASE_URL = "http://localhost:3001";

export async function getGuidelines() {
  const response = await fetch(`${API_BASE_URL}/api/guidelines`);

  if (!response.ok) {
    throw new Error("Failed to fetch guidelines");
  }

  return response.json();
}
