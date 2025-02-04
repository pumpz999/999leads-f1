import { ethers } from 'ethers';
import { store } from '../../../store/store';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../../store/api';

interface AggregatorQuote {
  protocol: string;
  chainId: number;
  route: string[];
  amountOut: string;
  gasEstimate: string;
}

const aggregatorApi = createApi({
  reducerPath: 'aggregatorApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getBestRoute: builder.query<AggregatorQuote[], {
      fromToken: string;
      toToken: string;
      amount: string;
      chains: number[];
    }>({
      query: (params) => ({
        url: '/aggregator/quote',
        params
      })
    })
  })
});

class AggregatorService {
  private static instance: AggregatorService;
  private provider: ethers.Provider | null = null;

  static getInstance(): AggregatorService {
    if (!AggregatorService.instance) {
      AggregatorService.instance = new AggregatorService();
    }
    return AggregatorService.instance;
  }

  async getBestRoute(params: {
    fromToken: string;
    toToken: string;
    amount: string;
    chains: number[];
  }): Promise<AggregatorQuote[]> {
    const { data } = await store.dispatch(
      aggregatorApi.endpoints.getBestRoute.initiate(params)
    );
    return data!;
  }
}

export const aggregatorService = AggregatorService.getInstance();
export const { useGetBestRouteQuery } = aggregatorApi;
