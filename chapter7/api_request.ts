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
    
    // Response 타입을 apiRequester내에서 처리하고 싶은 생각이 들 수 있는데 
    // 이렇게 되면 update나 create 같이 응답이 없는 API를 처리하기 까다로워진다
    // 따라서 Response 타입은 apiRequester가 모르게 관리되어야 한다
    const updateCart = (updateCartRequest): AxiosPromise<Response<FetchCartResponse>> => 
        apiRequester.get("cart");

    // 어떤 응답이 들어있는지 알 수 없거나 값의 형식이 달라지더라도 로직에 영향을 주지 않는 경우에는 unknown 타입을 사용하여 알 수 없는
    // 값임을 표현한다
    interface response {
        data: {
            cartItems: CartItem[];
            // 만약 forPass 안에 프론트 로직에서 사용해야 하는 값이 있다면 어떤 값이 들어올지 모르는 상태이기 때문에 unkonw을 유지한다
            // 로그를 위해 단순히 받아서 넘겨주는 값의 타입은 언제든지 변경될 수 있으므로 forPass 내의 값은 사용하지 않아야 한다
            forPass: unknown;
        }
    }

    // 다만 이미 설계된 프로덕트에서 쓰고 있는 값이라면 프론트 로직에서 써야 하는 값에 대해서만 타입을 선언한 다음에 사용하는게 좋다
    type ForPass = {
        type: "A" | "B" | "C";
    };

    const isTargetValue = () => (data.forPass as ForPass).type === "A";
}

{
    // API 응답은 변할 가능성이 크다 특히 새로운 프로젝트는 서버 스펙이 자주 바뀌기 때문에 뷰모델을 사용하여 API 변경에 따른 범위를 한정해줘야 한다

    // 특정 객체 리스트를 조회하여 리스트 각각의 내용과 리스트 전체 길이 등을 보여줘야 하는 화면 코드
    interface ListResponse{
        items: ListItem[];
    }

    const fetchList = async (filter?: ListFetchFilter): Promise<ListResponse> => {
        const {data} = await api
            .params({...filter})
            .get("/apis/get-list-summaries")
            .call<Response<ListResponse>>();

        return {data};
    };

    // 해당 api를 사용하는 코드 컴포넌트 내부에서 비동기 함수를 호출하고 then으로 처리하지만 실제 비도기 함수는 컴포넌트 내부에서 직접 호출되지 않음
    const ListPage: React.FC = () => {
        const [totalItemCount, setTotalItemCount] = useState(0);
        const [items, setItems] = useState<ListItem[]>([]);

        useEffect(() => {
            fetchList(filter).then(({items}) => {
                setCartCount(items.length);
                setItems(items);
            });
        }, [])

        return (
            <div>
                <Chip label={totalItemCount}/>
                <Table items={items}>
            </div>
        );
    };

    // 좋은 컴포넌트는 변경될 이유가 하나뿐인 컴포넌트
    // api응답의 items 인자를 좀 더 정확한 개념으로 나타내기 위해 jobItems나 cartItems 같은 이름으로 수정되면 해당 컴포넌트도 수정되어야 함

    // 기존 ListResponse에 더 자세한 의미를 담기 위한 변화
    interface JobListItemResponse{
        name: string;
    }

    interface JobListResponse{
        jobItems: JobListItemResponse[];
    }

    // 뷰모델로 응답값 통일
    class JobList {
        readonly totalItemCount: number;
        readonly items: JobListItemResponse[];

        constructor({jobItems}: JobListResponse){
            this.totalItemCount = jobItems.length;
            this.items = jobItems;
        }
    }

    const fetchJobList = async(filter?: ListFetchFilter): Promise<JobListResponse> => {
        const {data} = await api
            .params({...filter})
            .get("/apis/get-list-summaries")
            .call<Response<JobListResponse>>();

        return new JobList(data);
    };

    // 뷰모델을 만들면 API 응답이 바뀌어도 UI가 꺠지지 않게 개발할 수 있다
    // API에 없는 totalItemCount 같은 도메인 개념을 넣을 때 로직을 추가할 필요 없이 간편하게 새로운 필드를 뷰 모데렝 추가할 수 있다
    // 하지만 추상화 레이어 추가는 결국 코드를 복잡하게 만들고 관리 개발 비용도 늘어난다

    // JobListItemResponse 타입은 서버에서 지정한 응답 형식이기 때문에 이를 UI에서 사용하려면 더 많은 타입이 필요하다
    interface JobListResponse{
        jobItems: JobListItemResponse[];
    }

    // 목록을 뷰모델로 만들어 추상화 뿐만 아니라 각각의 데이터도 뷰모델로 만들어 UI에서 사용하기 위해 추가
    class JobListItme {
        constructor(item: JobListItemResponse) {
            // JobListItemResponse 에서 JobListItem 객체로 변환하는 코드
        }
    }

    class JobList {
        readonly totalItemCount: number;
        readonly items: JobListItemResponse[];

        constructor({jobItems}: JobListResponse){
            this.totalItemCount = jobItems.length;
            this.items = jobItems.map((item) => new JobListItem(item));
        }
    }

    const fetchJobList = async(filter?: ListFetchFilter): Promise<JobListResponse> => {
        const {data} = await api
            .params({...filter})
            .get("/apis/get-list-summaries")
            .call<Response<JobListResponse>>();

        return new JobList(data);
    };

    // 단순 API20개가 추가되면 20개의 응답이 추가 (뷰모델)
    // 앞 코드의 totalItemCount같이 API 응답에는 없는 새로운 필드를 만들어 사용할때 서버와 클라이언트의 도메인이 다르면 의사소통 문제가 생길 수 있음
    // 뷰 모델은 꼭 필요한 곳만 사용하고 백엔드와 프론트 개발자가 충분히 소통하여 API 응답 변화를 최대한 줄여야 한다
    // getter등의 함수를 추가하여 실제 어떤 값이 뷰 모델에 추가한 값인지 알기 쉽게 하기 등의 방법을 사용
}

{
    // Superstruct 
    // Superstruct를 사용하여 인터페이스 정의와 자바스크립트 데이터의 유효성 검사를 쉽게 할 수 있다
    // Superstruct는 런타임에서의 데이터 유효성 검사를 통해 개발자와 사용자에게 자세한 런타임 에러를 보여주기 위해 고안되었다

    // Superstruct 사용 예시
    import {assert, is, validate, object, number, string, array} from "superstruct";

    // Article = superstruct의 object()모듈의 반환 결과
    // 아래와 같은 데이터 명세를 가진 스키마
    const Article = object({
        id: number(),
        title: string(),
        tages: array(string()),
        author: object({
            id: number()
        }),
    });

    // 데이터를 담은 object
    const data = {
        id: 34,
        title: "Hello World",
        tags: ["news", "features"],
        author: {
            id: 1,
        },
    };

    // 유효하지 않을 경우 에러
    assert(data, Article);
    // 검사 결과에 따라 boolean 값 리턴
    is(data, Article);
    // [error, data] 형식의 튜플 반환
    // 유효하지 않을 시 에러 값 반환
    // 유효하면 첫번째 요소로 undefined 두번째 요초소 data value 반환
    validate(data, Article);

    // Infer를 사용하여 기존 타입 선언 방식과 동일하게 타입을 선언할 수 있다
    import {Infer, number, object, string} from "superstruct";

    const User = object({
        id: number(),
        email: string(),
        name: string(),
    });

    type User = Infer<typeof User>;

    // user가 User타입과 매칭되는지 확인하는 isUser 함수
    type User = {
        id: number;
        email: string;
        name: string;
    };

    import {assert} from 'superstruct';

    function isUser(user: User){
        assert(user, User);
        console.log("적절한 유저입니다.")
    }

    const user_A = {
        id: 4,
        email: "test@woowahan.email",
        name: "woowa",
    };
    
    // 타입이 호환되므로 적절한 유저라는 메세지가 나옴
    isUser(user_A);

    const user_B = {
        id: 5,
        email: "wrong@woowahan.email",
        name: 4
    };

    // 런타임 에러 발생
    // 컴파일 단계가 아닌 런타임에서도 적절한 데이터인지 체크할때 사용
    isUser(user_B);
}

{
    interface ListItem{
        id: string;
        content: string;
    }

    interface ListResponse{
        items: ListItem[];
    }

    // 호출 시 명시한 타입대로 응답이 올 거라고 생각하지만 실제 서버 응답 형식은 다를 수 있다
    // 타입스크립트는 컴파일타임에 타입을 검증하므로 실제 서버 응답의 형식을 검증할 수 없다
    const fetchList = async(filter?: ListFetchFilter): Promise<ListResponse> => {
        const {data} = await api
            .params({...filter})
            .get("/apis/get-list-summaries")
            .call(Response<ListResponse)>>();

        return {data};
    }

    // 타입 검증 코드
    import {assert} from "superstruct";

    function isListItem(listItems: ListItem[]){
        listItems.forEach((listItem) => assert(listItem, ListItem));
    }
}
