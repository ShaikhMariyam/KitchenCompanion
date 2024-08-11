import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from '../context/AuthContext';

const baseUrl = 'http://127.0.0.1:8000/';

const useAxios = () => {
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext)
    const AxiosInstance = axios.create({
        baseURL: baseUrl,
        // timeout: 5000,
        headers: {
            Authorization: `Bearer ${authTokens?.access}`
        }
    })

    AxiosInstance.interceptors.request.use(
        async req => {
            const user = jwtDecode(authTokens.access)
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

            if (!isExpired) return req;

            const response = await axios.post(`${baseUrl}token/refresh/`, {
                refresh: authTokens.refresh
            });
            localStorage.setItem("authTokens", JSON.stringify(response.data))

            setAuthTokens(response.data);
            setUser(jwtDecode(response.data.access))

            req.headers.Authorization = `Bearer ${jwtDecode(response.data.access)}`

            return req;
        }
    )

    return AxiosInstance
}

export default useAxios