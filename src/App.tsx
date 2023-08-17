import './App.css'
// @ts-ignore
// import {authorize, Token} from "@frontify/frontify-authenticator"


import {useEffect} from "react";
import { AnExampleBlock } from './unsplash-component/src/Block.tsx';

function App() {
    // const [token, setToken] = useState<Token>('');
    // const [currentUser, setCurrentUser] = useState<string>('');
    // const [context, setContext] = useState< Record<string, string | string[]>>({});
    useEffect(() => {
        // (async () => {
        //     const token: Token = await authorize({
        //         domain: "dev.frontify.test",
        //         clientId: "client-31qwyn73vaegbt4e",
        //         scopes: ["basic:read", "basic:write"]
        //     });
        //     setToken(token);
        // })();

    }, [])

    // const getAllQueryParameters = (url: string): Record<string, string | string[]> => {
    //     const searchParams = new URLSearchParams(url.split('?')[1]);
    //     const queryParams: Record<string, string | string[]> = {};
    //
    //     searchParams.forEach((value, key) => {
    //         if (queryParams[key]) {
    //             queryParams[key] = Array.isArray(queryParams[key])
    //                 ? [...queryParams[key] as string[], value]
    //                 : [queryParams[key] as string, value];
    //         } else {
    //             queryParams[key] = value;
    //         }
    //     });
    //
    //     return queryParams;
    // };

    // const context = getAllQueryParameters(window.location.href);

    return (
        <>
            <AnExampleBlock />
        </>
    )
}

export default App
