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