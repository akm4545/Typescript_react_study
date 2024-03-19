{
    // API 호출 코드 
    // 해당 코드를 복사 붙여넣기 하여 사용하게 되면 API 요청부의 요구사항이 바뀔때마다
    // 복사 붙여넣기 코드를 모두 수정해야 한다
    import React, {useEffect, useState} from 'react';

    const CartBadge: React.FC = () => {
        const [cartCount, serCartCount] = useState(0);

        useEffect(() => {
            fetch("https://api.beamin.com/cart")
            .then((response) => response.json())
            .then(({cartItem}) => {
                setCartCount(cartItem.length);
            });
        }, []);

        return <> {/*컴포넌트 렌더링*/} </>;
    }
}

{
    // 비동기 호출 코드를 컴포넌트 영역에서 분리 (서비스 레이어)
    // 분리를 하더라도 API 요청 정책이 추가되는것을 해결하기는 어려움
    // fetch에서 타임아웃을 설정하기 위한 코드
    async function fetchCart() {
        const controller = new AbortController();

        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch("https://api.baemin.com/cart", {
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        return response;
    }
}

{
    // fetch는 내장 라이브러리이기 때문에 따로 임포트나 설치가 필요없다
    // 다만 많은 기능을 사용하기 위해서 직접 구현해야 하기 때문에 Axios라이브러리를 사용한다
    const apiRequester: AxiosInstance = axios.creaste({
        baseURL: "https://api.baemin.com",
        timeout: 5000,
    });

    const fetchCart = (): AxiosPromise<FetchCartResponse> => 
        apiRequester.get <FetchCartResponse>("cart");

    const postCart = (postCartRequest: PostCartRequest): AxiosPromise<PostCartResponse> => 
        apiRequester.post <PostCartResponse>("cart", postCartRequest);


    // api entry가 2개 이상일 경우 각 서버의 기본 URL을 호출하도록 2개 이상의 api 요청을 처리하는 인스턴스를 따로 구성
    const apiRequester: AxiosInstance = axios.create(defaultConfig);

    const orderApiRequester: AxiosInstance = axios.create({
        baseURL: "https://api.baemin.or",
        ...defaultConfig,
    });

    const orderCartApiRequester: AxiosInstance = axios.create({
        baseURL: "https://cart.baemin.order",
        ...defaultConfig,
    });
}

{
    // 각각의 requester는 서로 다른 역할을 담당하는 다른 서버이기 때문에 requester별로 다른 헤더를 설정해줘야 할 수도 있다
    import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";

    const getUserToken = () => "";
    const getAgent = () => "";
    const getOrderClientToken = () => "";
    const orderApiBaseUrl = "";
    const orderCartApiBaseUrl = "";
    const defaultConfig = {};
    const httpErrorHandler = () => {};

    const apiRequester: AxiosInstance = axios.create({
        baseURL: "https://api.baemin.com",
        timeout: 5000,
    });

    // 기본 requester 설정
    const setRequestDefaultHeader = (requestConfig: AxiosRequestConfig) => {
        const config = requestConfig;

        config.headers = {
            ...config.headers,
            "Content-Type": "application/json;charset=utf-8",
            user: getUserToken(),
            agent: getAgent(),
        };

        return config;
    };

    // 주문 requester 설정
    const setOrderRequestDefaultHeader = (requestConfig: AxiosRequestConfig) => {
        const config = requestConfig;

        config.header = {
            ...config.headers,
            "Content-Type": "application/json;charset=utf-8",
            "order-client": getOrderClientToken(),
        };

        return config;
    };

    // interceptors 기능을 사용해 header를 설정하는 기능을 넣거나 에러를 처리할 수 있다
    apiRequester.interceptors.reuqest.use(setRequestDefaultHeader);

    const orderApiRequester: AxiosInstance = axios.create({
        baseURL: orderApiBaseUrl,
        ...defaultConfig,
    });

    //기본 apiRequester와는 다른 header를 설정하는 interceptors
    orderApiRequester.interceptors.request.use(setOrderRequestDefaultHeader);

    //interceptors를 사용해 httpError 같은 API 에러를 처리할 수도 있다
    orderApiRequester.interceptors.response.use(
        (response: AxiosResponse) => response, 
        httpErrorHandler
    );

    const orderCartApiRequester: AxiosInstance = axios.create({
        baseURL: orderCartApiBaseUrl,
        ...defaultConfig,
    });

    orderCartApiRequester.interceptors.request.use(setRequestDefaultHeader);

    // 요청 옵션에 따라 다른 인터셉터를 만들기 위해 빌더 패턴을 추가하여 APIBuilder 같은 클래스 형태로 구성하기도 한다
    // 기본 API 클래스로 실제 호출 부분을 구성 
    class API {
        readonly method: HTTPMethod;
        readonly url: string;
        baseURL?: string;
        headers?: HTTPHeaders;
        params?: HTTPParams;
        data?: unknown;
        timeout?: number;
        withCredentials?: boolean;

        constructor(method: HTTPMethod, url: string){
            this.method = method;
            this.url = url;
        }

        call<T>(): AxiosPromise<T> {
            const http = axios.create();

            //만약 withCredentail이 설정된 API라면 아래 같이 인터셉터를 추가하고 아니라면 인터셉터를 사용하지 않음
            if(this.withCredentials){
                http.interceptors.response.use(
                    response => response,
                    error => {
                        if(error.response && error.response.status == 401){
                            // 에러 처리 진행
                        }

                        return Promise.reject(error);
                    }
                );
            }

            return http.request({...this})
        }
    }

    //API를 호출하기 위한 래퍼를 빌더 패턴으로 만든다
    class APIBuilder {
        private _instance: API;

        constructor(method: HTTPMethod, url: string, data?: unknown){
            this._instance = new API(method, url);
            this._instance.baseURL = apiHost;
            this._instance.data = data;
            this._instance.headers = {
                'Content-Type': 'application/json;charset=urf-8',
            };
            this._instance.timeout = 5000;
            this._instance.withCredentials = false;
        }

        static get = (url: string) => new APIBuilder('GET', url);
        static put = (url: string, data: unknown) => new APIBuilder('PUT', url, data);
        static post = (url: string, data: unknown) => new APIBuilder('POST', url, data);
        static delete = (url: string) => new APIBuilder('DELETE', url);

        baseURL(value: string): APIBuilder{
            this._instance.baseURL = value;
            return this;
        }

        headers(value: HTTPHeaders): APIBuilder {
            this._instance.headers = value;
            return this;
        }

        timeout(value: number): APIBuilder {
            this._instance.timeout = value;
            return this;
        }

        params(value: HTTPParams): APIBuilder {
            this._instance.params = value;
            return this;
        }

        data(value: unknown): APIBuilder {
            this._instance.data = value;
            return this;
        }

        withCredentails(value: boolean): APIBuilder {
            this._instance.withCredentials = value;
            return this;
        }

        build(): API {
            return this._instance;
        }
    }

    // 해당 builder 패턴을 사용한 코드
    // 보일러플레이트 코드가 많다는 단점을 갖고 있다
    // 하지만 옵션이 다양한 경우에 인터셉터를 설정값에 따라 적용하고 필요없는 인터셉터를 선택적으로 사용할 수 있다는 장점도 있다
    // 보일러플레이트 코드 = 어떤 기능을 사용할 때 반복적으로 사용되는 기본적인 코드를 말한다 
    // 예를 들어 API를 호출하기 위한 기본적인 설정과 인터셉터 등을 설정하는 부분을 보일러플레이트 코드로 간주할 수 있다
    const fetchJobNameList = async (name?: string, size?: number) => {
        const api = APIBuilder.get("/apis/web/jobs")
            .withCredentails(true) // 이제 401 에러가 나는 경우 자동으로 에러를 탐지하는 인터셉터를 사용
            .params({name, size}) //body 가 없는 axios 객체도 빌더 패턴으로 쉽게 만든다
            .build();

        const {data} = await api.call<Response<JobNameListResponse>>();
        return data;
    };
}

{
    // 같은 서버에서 오는 응답의 형태는 대체로 통일되어 있어서 앞서 소개한 API의 응답 값은 하나의 Response 타입으로 묶일 수 있다
    interface Response<T> {
        data: T;
        status: string;
        serverDateTime: string;
        errorCode?: string //FAIL, ERROR
        errorMessage?: string; //FAIL, ERROR
    }

    const fetchCart = (): AxiosPromise<Response<FetchCartResponse>> => 
        apiRequester.get<Response<FetchCartResponse>> "cart";

    const postCart = (postCartRequest: PostCartRequest): AxiosPromise<Response<PostCartResponse>> => 
        apiRequester.post<Response<PostCartResponse>>("cart", postCartRequest);
}