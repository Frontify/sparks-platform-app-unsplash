const uploadChunkSize = 104857600;

const readFileContentFromUrl = async (url: string) => {
    return await (await fetch(url)).blob();
};

function* readFileContentInChunks(fileContent: Blob) {
    for (let i = 0; i < fileContent.size; i += uploadChunkSize) {
        yield fileContent.slice(i, i + uploadChunkSize);
    }
}

export class AssetCreator {
    private domain: string;
    private bearerToken: string;

    constructor(domain: string, bearerToken: string) {
        this.domain = domain;
        this.bearerToken = bearerToken;
    }

    public createAssetFromUrl = async (
        fileUrl: string,
        filename: string,
        extension: string,
        projectId: number
    ) => {
        const {
            uploadUrls,
            fileId,
            fileContent: fileBlob,
        } = await this.initFileUpload(fileUrl, `${filename}.${extension}`);

        await this.uploadFileToUrls(uploadUrls, fileBlob);
        return await this.createAssetFromFileId(fileId, filename, projectId);
    };

    private initFileUpload = async (
        url: string,
        filenameWithExtension: string
    ) => {
        const fileBlob = await readFileContentFromUrl(url);

        const response = await fetch(`https://${this.domain}/graphql`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.bearerToken}`,
            },
            body: JSON.stringify({
                query: `mutation UploadFile($input: UploadFileInput!) {
                      uploadFile(input: $input) {
                          id
                          urls
                      }
                  }`,
                variables: {
                    input: {
                        filename: filenameWithExtension,
                        size: fileBlob.size,
                        chunkSize: uploadChunkSize,
                    },
                },
            }),
        });

        const data = await response.json();
        return {
            uploadUrls: data.data.uploadFile.urls,
            fileId: data.data.uploadFile.id,
            fileContent: fileBlob,
        };
    };

    private uploadFileToUrls = async (uploadUrls: string[], fileBlob: Blob) => {
        for (const chunk of [...readFileContentInChunks(fileBlob)]) {
            const uploadUrl = uploadUrls.shift();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await fetch(uploadUrl,
                {
                    method: "PUT",
                    headers: {
                        "content-type": "binary",
                    },
                    body: chunk,
                });
        }
    };

    private createAssetFromFileId = async (
        fileId: string,
        title: string,
        projectId: number
    ) => {
        const response = await fetch(`https://${this.domain}/graphql`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.bearerToken}`,
            },
            body: JSON.stringify({
                query: `mutation CreateAsset($input: CreateAssetInput!) {
                      createAsset(input: $input) {
                          job {
                              assetId
                          }
                      }
                  }`,
                variables: {
                    input: {
                        fileId,
                        projectId,
                        title,
                    },
                },
            }),
        });

        const data = await response.json();
        const assetId = JSON.parse(
            atob(data.data.createAsset.job.assetId)
        ).identifier;
        return assetId;
    };
}