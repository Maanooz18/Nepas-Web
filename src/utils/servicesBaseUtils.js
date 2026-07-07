import { BASE_URL } from '../constants/url';
var authToken;
// import AppAlert from '../components/alerts/toast';
// import { resetTokenStatus } from '../store/slices/profileSlice';


export const setTokenValue = (token) => {
  if (token) {
    authToken = `Bearer ${token}`;
  } else {
    authToken = undefined;
  }
  console.log('final Auth token', authToken);
};

export const getApiCall = ({ url, dispatch }) => {
  let finalUrl = `${BASE_URL}${url}`
  console.log('getApiCall', finalUrl);
  return fetch(finalUrl, {
    method: 'GET',
    headers: {
      Authorization: authToken,
      Accept: 'application/json',
    },
  }).then((response) => {
    // console.log('first response', response)
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 401) {
      if (navigation) {
        handleTokenExpired(dispatch, navigation)
      }
      return response.json();
    } else if (response.status === 403) {
      // AppAlert({ message: 'Your email address is not verified.', type: "error" });
      return response.json();
    } else {
      // catchApiError(response.status);
      console.log('error', response);
      response.json().then((res) => {
        if (res?.message?.toLowerCase() === "unauthenticated") {

        } else {
          // AppAlert({ message: 'Something went wrong. Error code:' + response.status, type: "error", type: "error" });
        }
      });
      // crashlytics().log(response.status);
    }
  }).catch((e) => {
    console.log(e, "Unkwn Error----------------");
  });
};

export const genericApiCall = ({ url, method, data, dispatch, purpose, encodedContent, header, isFormData, navigation }) => {
  let finalUrl = `${BASE_URL}${url}`
  return fetch(finalUrl, {
    method: method,
    headers: {
      Authorization: authToken,
      Accept: 'application/json',
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      ...header
    },
    body: data,
  }).then((response) => {
    if (response.status === 500) {
      response.json().then((res) => {
        // AppAlert({ message: 'Something went wrong. Error code:' + response.status, type: "error" });
      });
      return response.json();
    }
    else if (response.status === 401) {
      // console.log('here', authToken)
      // if (authToken) {
      handleTokenExpired(dispatch)
      // }
    }
    else {
      return response.json();
    }
  });
};

const handleTokenExpired = (dispatch) => {
  // AppAlert({ message: 'Looks like session has expired. Please login again.' })
  // dispatch(resetTokenStatus())
  // dispatch(logout())
}

