import {Result} from "../interface";
import {Button, ButtonStyle, Card, Text} from '@frontify/fondue';
import {AssetCreator} from "../utils/UploadAsset.tsx";
import {Token} from "@frontify/frontify-authenticator";
import {useState} from "react";
import {Loading} from "./Loading.tsx";


interface ICard {
    res: Result,
    token: Token
}

export const MyCard = ({ res, token }: ICard) => {
    const [uploadingImage, setUploadingImage] = useState<boolean>(false);
    const [imageAdded, setImageAdded] = useState<boolean>(false);
    const createAssetFromUrl = async (fileUrl: string, filename: string, format:string, projectId: number) => {
        setUploadingImage(true);
        setImageAdded(true);
        const assetCreator = new AssetCreator(
            token.bearerToken.domain,
            token.bearerToken.accessToken
        );

        await assetCreator.createAssetFromUrl(
            fileUrl,
            filename,
            format,
            projectId
        ).then(() => setUploadingImage(false));
    };

    const getAllQueryParameters = (
        url: string
    ): Record<string, string | string[]> => {
        const searchParams = new URLSearchParams(url.split("?")[1]);
        const queryParams: Record<string, string | string[]> = {};

        searchParams.forEach((value, key) => {
            if (queryParams[key]) {
                queryParams[key] = Array.isArray(queryParams[key])
                    ? [...(queryParams[key] as string[]), value]
                    : [queryParams[key] as string, value];
            } else {
                queryParams[key] = value;
            }
        });

        return queryParams;
    };

    const queryParams = getAllQueryParameters(window.location.href);



    // read format from url parameter "fmt"
    const url = new URL(res.urls.full);
    const urlParams = url.searchParams;
    const format = urlParams.get('fm') ?? 'jpg';
    const imageName = res.user ? res.user.username+'-'+res.id : res.id;
    const projectId = Number(queryParams.projectId);

    return (
        <Card className={'tw-my-3 tw-relative tw-w-full tw-flex before:tw-content-[&quot;&quot;] before:tw-block before:tw-w-1 before:tw-pb-[100%]'}>
            <div className={'tw-absolute tw-flex tw-left-0 tw-right-0 tw-top-0 tw-bottom-0 tw-overflow-hidden tw-rounded tw-flex tw-flex-col after:tw-absolute after:tw-rounded after:tw-content-[&quot;&quot;] after:tw-block after:tw-w-full after:tw-h-full after:tw-bottom-0 after:tw-left-0 after:tw-right-0 after:tw-top-0 after:tw-border-solid after:tw-z-20 after:tw-pointer-events-none after:tw-border after:tw-border-line-strong'}>
                <div className={'tw-z-0 tw-w-full tw-flex tw-flex-1 tw-overflow-hidden tw-cursor-pointer'}>
                    <img src={res.urls.small} alt={res.alt_description || 'photo'} loading="lazy" />
                    <div className={'tw-absolute tw-left-0 tw-right-0 tw-bottom-0 tw-transition-all tw-duration-200 tw-ease-in-out tw-flex tw-flex-col tw-overflow-hidden tw-border-t tw-border-line-strong tw-p-4 tw-pt-3 tw-gap-[4px] tw-h-[72px] tw-translate-y-0'}>
                        <h4>{res.description?res.description:res.alt_description}</h4>
                        {
                            uploadingImage
                                ? <Loading/>
                                : imageAdded
                                    ? <Text style={ButtonStyle.Default}>Added!</Text>
                                    : <Button style={ButtonStyle.Positive} onClick={() => createAssetFromUrl(res.urls.full, imageName, format, projectId)}>Add Image to Library</Button>
                        }
                    </div>
                </div>
            </div>
        </Card>
    )
}