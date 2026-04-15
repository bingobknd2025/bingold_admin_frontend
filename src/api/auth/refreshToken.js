// I have Implimented refresh token in the axios interceptor
// in utils folder axios.js file

// import axios from "axios";

// export const refreshToken = async () => {
//   const refreshToken = sessionStorage.getItem("refreshToken");
//   const accessToken = localStorage.getItem("accessToken");
//   const response = await axios.post(
//     import.meta.env.VITE_BASE_URL + "auth/refresh-token",
//     {
//       refreshToken,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "x-api-key": import.meta.env.VITE_API_KEY,
//       },
//     },
//   );
//   console.log("response from api", response.data.data.accessToken);
//   return response.data.data;
// };
