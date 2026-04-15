import { useNavigate } from "react-router-dom";
import { useAdminLogout } from "../api/auth/logout";

export const useLogout = () => {
  const navigate = useNavigate();
  const { mutate: logoutApi, isPending } = useAdminLogout();

  const logout = () => {
    const refreshToken = sessionStorage.getItem("refreshToken");

    logoutApi(
      { refreshToken },
      {
        onSettled: () => {
          sessionStorage.clear();
          navigate("/login", { replace: true });
        },
      },
    );
  };

  return { logout, isLoggingOut: isPending };
};
