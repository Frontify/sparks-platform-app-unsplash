import type {FC} from 'react';
import {Title, Form, GridResults} from './components';
import {useFormQuery} from "./hooks";

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient()


export const AnExampleBlock: FC = () => {

    const {handleLoading, handleSubmit, isLoading, query} = useFormQuery()

    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <Title/>
                <Form handleSubmit={handleSubmit} isLoading={isLoading}/>
                {query.length > 0 && <GridResults query={query} handleLoading={handleLoading}/>}
            </QueryClientProvider>
        </div>
    )
};
