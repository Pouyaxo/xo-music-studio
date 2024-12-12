export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const isNetworkError = (error: any) => {
  return error instanceof TypeError && error.message === 'Failed to fetch';
};