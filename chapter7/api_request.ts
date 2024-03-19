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
}