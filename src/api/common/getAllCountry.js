import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetCountry = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await axios.post(
        "https://admin.aiiongoldgtc.com/api/v1/get-country",
        {},
        {
          headers: {
            "x-api-key": import.meta.env.VITE_COUNTRY_API_KEY,
          },
        },
      );

      return response.data;
    },
  });
};
