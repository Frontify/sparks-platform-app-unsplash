import axios from 'axios';
import { ResponseAPI } from "../interface"
import { AxiosError } from 'axios';

const ACCESS_KEY = 'H2kEHoJvnwOz1_bF1Ac0l9KBkBXFDvSieiMatQdRXng'
// const ACCESS_KEY = import.meta.env.VITE_API_KEY as string\

export const getImages = async (query: string): Promise<ResponseAPI> => {
    const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${ACCESS_KEY}`
    console.log(url)
    try {
        const { data } = await axios.get(url)
        return data
    } catch (error) {
        throw new Error((error as AxiosError).message)
    }
}

