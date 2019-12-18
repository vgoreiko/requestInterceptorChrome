export interface Request {
    method: string,
    url: string,
    httpVersion: string,
    cookies: [],
    headers: [],
    queryString: [],
    postData: {},
    headersSize: number,
    bodySize: number,
    comment: string,
}
