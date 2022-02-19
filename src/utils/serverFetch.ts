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
    body: Body
  };

  async function handledResponse<Body, Response> (
    path: string,
    body?: Body,
    method?: 'POST' | 'GET'
  ): Promise<HandledResponse<Response>> {
    const initialResponse = await fetch(fullPath(path), {
      method,
      body: JSON.stringify(body),
      headers
    });

    if (initialResponse.ok || initialResponse.status === 422) {
      const body = await initialResponse.json()

      return {
        status: initialResponse.status,
        body
      };
    }

    // eslint-disable-next-line no-throw-literal
    throw 'server error';
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
