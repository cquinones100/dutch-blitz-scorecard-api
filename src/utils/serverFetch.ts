const ROOT_PATH = process.env.REACT_APP_API_URL;

const serverFetch = (sessionToken?: string) => {
  const headers: HeadersInit = {
    'content-type': 'application/json',
  };

  if (sessionToken) {
    headers['Authorization'] = sessionToken;
  }

  const fullPath = (path: string) => `${ROOT_PATH}${path}`;

  type HandledResponse<Body> = {
    status: number;
    body: Body;
    cancel: AbortController['abort'];
  };

  interface PromiseWithCancel<T> extends Promise<T> {
    cancel: () => void;
  };

  function handledResponse<Body, Response> (
    path: string,
    body?: Body,
    method?: 'POST' | 'GET'
  ) {
    const controller = new AbortController();
    const signal = controller.signal;

    const request = new Promise(async resolve => {
      const initialResponse = await fetch(fullPath(path), {
        method,
        body: JSON.stringify(body),
        headers,
        signal
      });

      if (initialResponse.ok || initialResponse.status === 422) {
        const body = await initialResponse.json()

        resolve({
          status: initialResponse.status,
          body
        });
      }

      // eslint-disable-next-line no-throw-literal
      throw 'server error';
    });

    (request as PromiseWithCancel<HandledResponse<Response>>).cancel = () => controller.abort();
    return request as PromiseWithCancel<HandledResponse<Response>>;
  }

  return ({
    post<Body, Response>(path: string, body?: Body) {
      return handledResponse<Body, Response>(path, body, 'POST');
    },

    get<Response>(path: string) {
      return handledResponse<null, Response>(path);
    },
  });
};

export default serverFetch;
