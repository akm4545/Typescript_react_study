{
    // 프론트엔드와 백엔드가 같이 개발을 들어가게 되면 API가 완성되기 전에 작업해야 하는 경우가 생길 수 있다
    // 이럴 때 모킹이라는 방법을 활용할 수 있다 
    // 모킹은 가짜 모듈을 활용하는 것을 말한다
}

{
    // 간단한 조회만 필요한 경우에는 *.json 파일을 만들거나 자바스크립트 파일 안에 JSON 형식의 정보를 저장하고 
    // 익스포트 해주는 방식을 사용하면 된다
    // 이후 GET 요청에 파일 경로를 삽입해주면 조회 응답으로 원하는 값을 받을 수 있다
    const SERVICES: Service[] = [
        {
            id: 0,
            name: "배달의민족",
        },
        {
            id: 1,
            name: "만화경",
        },
    ];

    export default SERVICES;

    const getServices = ApiRequester.get("/mock/service.ts");

    // 해당 방법은 별도의 환경 설정이 필요하지 않아 쉽게 구현할 수 있다.
    // 프로젝트 초기 단계에서 사용자의 인터랙션 없이 빠르게 목업을 구축할 때 유용하게 사용할 수 있다.
    // 그러나 실제 API URL로 요청하는 것이 아니기 떄문에 추후에 요청 경로를 바꿔야 한다
}

{
    // NextApiHandler 활용
    // 프로젝트에서 Next.js를 사용하고 있다면 NextApiHandler를 활용할 수 있다
    // 하나의 파일 안에 하나의 핸들러를 디폴트 익스포트로 구현해야 하며 파일의 경로가 요청 경로가 된다
    // 응답하고자 하는 값을 정의하고 핸들러 안에서 요청에 대한 응답을 정의한다
    // 단순 파일을 불러오는 것과 다르게 중간 과정에 응답 처리 로직을 추가할 수 있다
    
    import {NextApiHandler} from "next";

    const BRANDS: Brand[] = [
        {
            id: 1,
            label: "배민스토어",
        },
        {
            id: 2,
            label: "비마트",
        },
    ];

    const handler: NextApiHandler = (req, res) => {
        //request 유효성 검증

        res.json(BRANDS);
    };

    export default handler;
}

{
    // 요청 경로를 수정하지 않고 평소에 개발 시 필요한 경우에만 실체 요청을 보내고 그 외에는 목업을 사용하고 싶다면 
    // 다음과 같이 처리할 수도 있다 
    // API 요청을 훅 또는 별로 함수로 선언해준 다음 조건에 따라 목업 함수를 내보내거나 실제 요청 함수를 내보낼 수 있다.
    const mockFetchBrands = (): Promise<FetchBrandsResponse> => new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: "SUCCESS",
                message: null,
                data: [
                    {
                        id: 1,
                        label: "배민스토어",
                    },
                    {
                        id: 2,
                        label: "비마트",
                    },
                ],
            });
        }, 500);
    });

    const fetchBrands = () => {
        if(useMock){
            return mockFetchBrands();
        }

        return requester.get("/brands");
    };

    // 해당 방법을 사용하면 개발이 완료된 후에도 유지보수할 때 목업 함수를 사용할 수 있다
    // 필요한 경우에만 실제 API에 요청을 보내고 평소에는 서버에 의존하지 않고 개발할 수 있게 된다
    // 그러나 모든 API 요청 함수에 if 분기문을 추가해야 하므로 번거롭게 느껴질 수도 있다
}

{
    // 서비스 함수에 분기문이 추가디는 것을 바라지 않는다면 라이브러리를 사용하면 된다
    // axios-mock-adapter는 Axios 요청을 가로채서 요청에 대한 응답 값을 대신 반환한다
    // 먼저 MockAdapter 객체를 생성하고 해당 객체를 사용하여 모킹할 수 있다
    // 앞선 두가지 방법과 다르게 mock API의 주소가 필요하지 않다

    // mock/index.js
    import axios from "axios";
    import MockAdapter from "axios-mock-adapter";
    import fetchOrderListSuccessResponse from "fetchOrderListSuccessResponse.json";

    interface MockResult {
        status?: number;
        delay?: number;
        use?: boolean;
    }

    const mock = new MockAdapter(axios, {onNoMatch: "passthrough"});

    export const fetchOrderListMock = () => 
        mock
            .onGet(/\/order\/list/)
            .reply(200, fetchOrderListSuccessResponse);

    // fetchOrderListSuccessResponse.json
    {
        "data": [
            {
                "orderNo": "ORDER1234",
                "orderDate": "2022-02-02",
                "shop": {
                    "shopNo": "SHOP1234",
                    "name": "가게이름1234"
                },
                "deliveryStatus": "DELIVERY"
            }
        ]
    }

    // 단순히 응답 바디만 모킹할 수도 있지만 상태 코드, 응답 지연 시간 등을 추가로 설정할 수도 있다. 
    // 이에 따라 다양한 HTTP 상태 코드에 대한 목업을 정의할 수 있고 API별로 지연 시간을 다르게 설정할 수 있다
    // 이렇게 응답 처리를 하는 부분을 별도 함수로 구현하면 여러 mock 함수에서 사용할 수 있다

    export const lazyData = {
        status: number = Math.floor(Math.random() * 10) > 0 ? 200 : 200,
        successData: unknown = defaultSuccessData,
        failData: unknown = defaultFailData,
        time = Math.floor(Math.random() * 1000)
    }: Promise((resolve) => {
        setTimeout(() => {
            resolve([status, status === 200? successData: failData]);
        }, time);
    });

    export const fetchOrderListMock = ({
        status = 200,
        time = 100,
        use = true,
    }: MockResult) =>
        use &&
        mock
            .onGet(/\/order\/list/)
            .reply(() =>
                lazyData(status, fetchOrderListSuccessResponse, undefined, time)
            );

    // axios-mock-adapter를 사용하면 여러 HTTP 메서드에 대한 목업을 작성할 수 있게 된다 
    // 또한 networkError, timeoutError 등을 메서드로 제공하기 떄문에 다음처럼 임의로 에러를 발생시킬 수도 있다

    export const getchOrderListMock = () => mock.onPost(/\/order\/list/).networkError();
}

{
    // 로컬에서 목업을 사용하고 dev나 운영 환경에서는 사용하지 않으려면 간단한 설정을 해주면 되는데 플래그를 사용하여 구분할 수 있다
    // 이렇게 하면 프로덕션에서 사용되는 코드와 목업을 위한 코드를 분리할 필요가 없다
    // 프론트엔드 코드를 작성하고 요청을 보낼 때 실제 엔드포인트를 쓸 수 있으므로 새로운 기능을 개발할 때 말고도 유지보수할 때도 작성해둔 목업을 사용할 수 있다
    // 로컬에서 개발할 때는 주로 목업을 사용하고 dev서버 환경이 필요할 때는 dev 서버를 바라보도록 설정할 수 있다
    // 이런 식으로 프론트엔드와 서버를 독립시킬 수 있고 혹여나 dev 서버에 문제가 생기더라도 로컬에서 진행되는 프론트엔드 개발에는 영향을 주지 않는다

    const useMock = Object.is(REACT_APP_MOCK, "true");

    const mockFn = ({status = 200, time = 100, use = true}: MockResult) => use &&
        mock.onGet(/\order\/list/).reply(() =>
            new Promise((resolve) => 
                setTimeout(() => {
                    resolve([
                        status,
                        status === 200 ? fetchOrderListSuccessResponse : undefined,
                    ]);
                }, time)
            )
        );

    //  플래그에 따라 mockFn 제어
    if(useMock){
        mockFn({status: 200, time: 100, use: true});
    }

    // 스크립트 실행 시 구분 짓고자 한다면 package.json에 관련 스크립트 추가
    //package.json
    {
        ...,
        "scripts": {
            ...
            "start:mock": "REACT_APP_MOCK=true npm run start",
            "start": "REACT_APP_MOCK=false npm run start",
            ...
        },
        ...
    }

    // axios-mock-adapter는 api요청을 중간에 가로채기 째문에 브라우저 개발자 도구의 네트워크 탭에서는 확인이 어렵다
    // api 요청의 흐름을 파악하고 싶다면 react-query-devtools 혹은 redux test tool과 같은 별도 도구를 사용해야 한다
    // 목업 사용시 네트워크 요청을 확인하고 싶으면 네트워크에 보낸 요청을 변경해주는 Cypress 같은 도구의 웹훅을 사용하면 된다
    
}