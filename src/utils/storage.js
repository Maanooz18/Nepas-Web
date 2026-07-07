// import localforage from "localforage";

// const db= localforage.createInstance({
//     name: "nepas-web"
// });
// export const setData = async(key,data)=>{
//     await db.setItem(key,data);

// }

// export const getData = async(key,data)=>{
//   return  await db.getItem(key);

// }

import localforage from "localforage";

const db = localforage.createInstance({
  name: "nepas-web",
});

export const setData = async (key, data) => {
  await db.setItem(key, data);
};

export const getData = async (key) => {
  return await db.getItem(key);
};

// Added a quick helper to get all keys so we know what is downloaded
export const getAllKeys = async () => {
  return await db.keys();
};
