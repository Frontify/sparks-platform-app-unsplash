import { Result } from "../interface";
import { sendUrl } from "../utils/sendUrl";
import { Button, Card } from '@frontify/fondue';


interface ICard {
    res: Result
}

export const MyCard = ({ res }: ICard) => {
    // read format from url parameter "fmt"
    const url = new URL(res.urls.full);
    const urlParams = url.searchParams;
    const format = urlParams.get('fm');
    return (
        <Card className={'tw-my-3'}>
            <img src={res.urls.small} alt={res.alt_description || 'photo'} loading="lazy" />
            <div className="hidden">
                <h4>{res.description?res.description:res.alt_description}</h4>
                <Button onClick={() => sendUrl(res.urls.full, format, res.description?res.description:res.alt_description)}>Add Image to Library</Button>
            </div>
        </Card>
    )
}