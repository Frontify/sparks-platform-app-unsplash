import axios from "axios";

export function sendUrl(url: string, format: string|null, description: string|null) {
    axios.post("https://19b11ef8-46cd-46c0-bc26-3a9b264b290f.trayapp.io/",
        {
            "url": url,
            "format": format,
            "description": description
        },
        {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            console.log(res)
        })
}
