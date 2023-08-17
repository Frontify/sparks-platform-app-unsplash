import {useQuery} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {useEffect, useState} from 'react';
import {MyCard} from './Card';
import {ResponseAPI} from '../interface';
import {getImages} from "../utils";
import {Loading} from './Loading';
import {authorize, Token} from "@frontify/frontify-authenticator";


interface IGridResults {
    handleLoading: (e: boolean) => void
    query: string
}

export const GridResults = ({query, handleLoading}: IGridResults) => {
    const {data, isLoading, error, isError} = useQuery<ResponseAPI>([query], () => getImages(query))
    const [token, setToken] = useState<Token>("");
    const tokenKeyName = 'unsplash-frontify-app'
    useEffect(() => handleLoading(isLoading), [isLoading]);

    useEffect(() => {
        const tmpToken = localStorage.getItem(tokenKeyName)
        if(tmpToken) {
            setToken(JSON.parse(tmpToken))
        } else {
            (async () => {
                const token: Token = await authorize({
                    domain: "dev.frontify.test",
                    clientId: "client-31qwyn73vaegbt4e",
                    scopes: ["basic:read", "basic:write"],
                });
                setToken(token);
                localStorage.setItem(tokenKeyName, JSON.stringify(token));
            })();
        }
    }, []);


    if (isLoading) return <Loading/>
    if (isError) return <p>{(error as AxiosError).message}</p>


    return (
        <div className={'tw-flex tw-flex-col tw-gap-7'}>
            <div className={'tw-px-5 tw-pb-5 tw-relative tw-z-10'}>
                <p className='no-results'>
                    {data && data.results.length === 0 ? 'No results with: ' : 'Results with: '}
                    <b>{query}</b>
                </p>

                <div className={'tw-grid tw-auto-rows-auto'}>
                    {data.results.map(image => (<MyCard key={image.id} res={image} token={token}/>))}
                </div>
            </div>
        </div>
    )
}