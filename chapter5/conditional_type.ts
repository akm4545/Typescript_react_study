{
    // 조건부 타입
    // T extends U ? X : Y
    // 삼항 연산자와 함께 사용
    // 타입 T를 U에 할당할 수 있으면 X 타입, 아니면 Y 타입

    interface Bank {
        financialCode: string;
        companyName: string;
        name: string;
        fullName: string;
    }

    interface Card {
        financialCode: string;
        companyName: string;
        name: string;
        appCardType?: string;
    }

    // 예시를 위해 제네릭 타입에 리터럴 값을 할당하지만 일반적으로 이렇게 사용하진 않음
    type PayMethod<T> = T extends "card" ? Card : Bank;
    // 제네릭에 card가 할당되었으므로 PayMethod = Card 타입을 반환 
    // 해당 타입을 type CardPayMethodType에 재할당 즉 CardPayMethodType = Card 타입 
    type CardPayMethodType = PayMethod<"card">;
    type BankPayMethodType = PayMethod<"bank">;
}

{
    // 조건부 타입을 사용하지 않았을 때의 문제점
    // react-query를 활용한 예시

    // 계좌 정보 엔드포인트
    // www.beamin.com/beaminpay/.../bank
    // 카드 정보 엔드포인트
    // www.beamin.com/beaminpay/.../card
    // 앱 카드 정보 엔드포인트
    // www.beamin.com/beaminpay/.../appcard

    // 각 API는 결제 수단 정보를 배열 형태로 반환
    // 엔드 포인트가 비슷하기 때문에 서버 응답 처리 공통 함수를 생성
    // 해당 함수에 타입을 전달하여 타입별로 처리 로직 구현

    // 서버에서 받아오는 결제 수단 기본 타입
    // 은행과 카드에 모두 들어가 있다
    interface PayMethodBaseFromRes{
        financialCode: string;
        name: string;
    }

    // 은행과 카드 각각에 맞는 결제 수단 타입
    // PayMethodBaseFromRes 상속
    interface Bank extends PayMethodBaseFromRes{
        fullName: string;
    }

    interface Card extends PayMethodBaseFromRes {
        appCardType?: string;
    }

    // 최종적인 은행, 카드 결제 수단 타입
    // 프론트에서 추가되는 UI 데이터 타입과 제네릭으로 받아오는 Bank 또는 Card를 합성
    // extends를 제네릭에서 한정자로 사용하여 Bank 또는 Card를 포함하지 않는 타입은 제네릭으로 넘겨주지 못하게 방어
    // BankPayMethodInfo = PayMethodInterface & Bank 처럼 카드와 은행의 타입을 만들어줄 수 있지만 제네릭을 
    // 활용하여 코드 중복 제거
    type PayMethodInfo<T extends Bank | Card> = T & PayMethodInterface;
    type PayMethodInterface = {
        companyName: string;
        // ...
    }

    type PayMethodType = PayMethodInfo<Card> | PayMethodInfo<Bank>;

    // 커스텀 훅
    // 반환값 UseQueryResult
    export const useGetRegisteredList = (
        type: "card" | "appcard" | "bank"
    ) : UseQueryResult<PayMethodType[]> => {
        const url = `beaminpay/codes/${type === "appcard" ? "card" : type}`;

        // fetcherFactory = axios 래핑 함수
        // 서버에서 데이터를 받아온 후 onSuccess 콜백 함수 실행
        // fetcher 호출 시 반환 타입은 PocketInfo 타입이다
        const fetcher = fetcherFactory<PayMethodType[]>({
            onSuccess: (res) => {
                const usablePocketList = 
                res?.filter(
                    (pocket: PocketInfo<Card> | PocketInfo<Bank>) => 
                        pocket?.useType === "USE"
                ) ?? [];

                return usablePocketList; 
            },
        });

        // useCommonQuery = useQuery 래핑 함수
        // useQuery의 반환 데이터를 T(PayMethodType) 타입으로 반환 
        // 최종적 반환 타입은 PayMethodType 이지만 사용하는 쪽에서는 PocketInfo일 가능성도 있다
        // PocketInfo로 받을 시 Card | Bank 값만 할당되고 PayMethodInterface는 증발
        // 인자로 넣는 타입에 알맞는 타입을 반환하려고 했지만
        // 타입 설정이 유니온으로만 되어있기 때문에 타입스크립트는 해당 타입에 맞는 Data 타입 추론 불가
        const result = useCommonQuery<PayMethodType[]>(url, undefined, fetcher);

        return result;
    }
}

{
    // extends 조건부 타입 활용하여 개선

    // type PayMethodType = PayMethodInfo<Card> | PayMethodInfo<Bank>; 개선
    // PayMethodType의 제네릭으로 받는 값이 "card", "appcard" 일때 PayMethodInfo<Card>반환? Card타입이 아닌가?
    type PayMethodType<T extends "card" | "appcard" | "bank"> = T extends
        | "card"
        | "appcard"
        ? Card
        : Bank;

    // 인자값 제한 T extends "card" | "appcard" | "bank"
    // 위와의 차이점은 제네릭 T로 타입을 제한했기 때문에 인자를 넣고 반환을 받을때 Card 타입인지 Bank타입인지
    // 명확하다는 뜻 같음
    // 추가 공부 필요
    // 제네릭과 extends를 함께 사용해 제네릭으로 받는 타입 제한 개발자는 잘못된 값을 넘길 수 없기 
    // 떄문에 휴먼 에러 방지
    // extends를 활용해 조건부 타입 설정 반환 값을 사용자가 우너하는 값으로 구체화 하여 불필요한
    // 타입 가드, 타입 단언 등을 방지
    export const useGetRegisteredList = <T extends "card" | "appcard" | "bank">(
        type: T
    ): UseQueryResult<PayMethodType<T>[]> => {
        const url = `beaminpay/codes/${type === "appcard" ? "card" : type}`;

        const fetcher = fetcherFactory<PayMethodType<T>[]> ({
            onSuccess: (res) => {
                const usablePocketList = 
                    res?.filter(
                        (pocket: PocketInfo<Card> | PcoketInfo<Bank>) =>
                            pocket?.useType === "USE"
                    ) ?? [];
            }
        });

        const result = useCommonQuery<PayMethodType<T>[]>(url, undefined, fetcher);

        return result;
    };
} 

{
    // infer = 추론하다 라는 의미를 지니고 있다
    // 타입을 추론하는 역할을 한다 
    // 삼항 연산자를 사용한 조건문의 형태를 가지는데 extends로 조건을 서술하고 infer로 타입을 추론하는 방식을 취한다

    // UnpackPromise 타입은 제네릭으로 T를 받아 (type UnpackPromise<T>)
    // T가 Promise로 래핑된 경우라면 (T extends Promise<infer K>[])
    // K를 반환하고 그렇지 않은 경우에는 any 반환 (? K : any)

    // Promise<infer K>는 Promise의 반환 값을 추론해 해당 값의 타입을 K로 한다는 의미이다
    type UnpackPromise<T> = T extends Promise<infer K>[] ? K : any;

    const promises = [Promise.resolve("Mark"), Promise.resolve(38)];
    type Expected = UnpackPromise<typeof promises>; //string | number
}

{
    // 배민 라이더를 관리하는 라이더 어드민 서비스에서 사용하는 타입으로 infer를 사용

    // RouteBase, RouteItem = 라이더 어드민에서 라우팅을 위해 사용하는 타입
    // routes같이 배열 형태로 사용

    // 권한 API로 반환된 사용자 권한과 name을 비교하여 인가되지 않은 사용자의 접근 방지
    // RouteItem의 name은 pages가 있을 때는 단순히 이름의 역할만 하며 그렇지 않을 때는 사용자 권한과 비교
    interface RouteBase {
        name: string;
        path: string;
        component: ComponentType;
    }

    export interface RouteItem{
        name: string;
        path: string;
        component?: ComponentType;
        pages?: RouteBase[];
    }

    export const routes: RouteItem[] = [
        {
            name: "기기 내역 관리",
            path: "/device-history",
            component: DeviceHistoryPage,
        },
        {
            name: "헬멧 인증 관리",
            path: "/helmet-certification",
            component: HelmetCertificationPage,
        },
        //...
    ];

    // MainMenu, SubMenu는 메뉴 리스트에서 사용하는 타입으로 권한 API를 통해 반환된 사용자 권한과 
    // name을 비교하여 사용자가 접근할 수 있는 메뉴만 렌더링
    export interface SubMenu{
        name: string;
        path: string;
    }

    // MainMenu의 name은 subMenus를 가지고 있을 때 단순히 이름의 역할만 하며 그렇지 않을 때는 권한으로 간주
    export interface MainMenu{
        name: string;
        path?: string;
        subMenus?: SubMenu[];
    }

    // item들의 권한 체크를 위해서는 동일한 문자열을 입력해야 하는 제약이 존재
    // name의 타입이 string 이므로 서로 다른 값이 입력되어도 컴파일 타입에서 에러가 발생하지 않는다
    // 또한 런타임에서도 인가되지 않음을 안내하는 페이지를 보여주거나 
    // 메뉴 리스트를 렌더링하지 않는 정도에 그치기 떄문에 존재하지 않는 권한에 대한 문제로 잘 못 인지할 수 있다
    export type MenuItem = MainMenu | SubMenu;
    export const menuList: MenuItem[] = [
        {
            name: "계정 관리",
            subMenus: [
                {
                    name: "기기 내역 관리",
                    path: "/device-history",
                },
                {
                    name: "헬멧 인증 관리",
                    path: "/helmet-certification"
                },
            ],
        },
        {
            name: "운행 관리",
            path: "/operation",
        },
        // ...
    ];

    // 이를 개선하기 위해 PermissionNames처럼 별도 타입을 선언하여 name을 관리하는 방법도 있지만
    // 권한 검사가 필요없는 subMenus나 pages가 존재하는 name은 따로 처리해야 한다 (즉 name이 권한의 역할이 아닌 이름의 역할이 부여되었을 떄) 
    type PermissionNames = "기기 정보 관리" | "안전모 인증 관리" | "운행 여부 조회";

    // subMenus의 타입을 ReadonlyArray로 변경 
    export interface MainMenu {
        //...
        subMenus?: ReadonlyArray<SubMenu>;
    }

    // as const 키워드를 추가하여 불변 객체로 정의
    export const menuList = [
        // ...
    ] as const;

    // Route관련 타입의 name은 menuList의 name에서 추출한 PermissionNames만 올 수 있도록 변경
    interface RouteBase {
        name: PermissionNames;
        path: string;
        component: ComponentType;
    }

    export type RouteItem = 
        | {
            name: string;
            path: string;
            component?: ComponentType;
            pages: RouteBase[];
        }
        | {
            name: PermissionNames;
            path: string;
            component?: ComponentType;
        }

    // 조건에 맞는 값을 추출할 UnpackMenuNames 타입
    // 불변객체인 MenuItem배열만 입력으로 받을 수 있도록 제한
    // infer U 를 사용하여 배열 내부 타입을 추론
    type UnpackMenuNames<T extends ReadonlyArray<MenuItem>> = T extends
    ReadonlyArray<infer U>
        // U가 MainMenu이라면
        ? U extends MainMenu
            // subMenus를 infer V로 추출
            ? U["subMenus"] extends infer V
                // subMenus = 옵셔널(subMenus?) 타입 ReadonlyArray<SubMenu>
                // V가 존재한다면 UnpackMenuNames에 다시 전달
                ? V extends ReadonlyArray<SubMenu>
                    ? UnpackMenuNames<V>
                    // 존재하지 않는다면 MainMenu의 name은 권한에 해당하므로 U["name"]
                    : U["name"]
                // 이외에는 never타입으로 리턴하여 잘못된 값을 막음 
                : never
            // U가 MainMenu가 아니라 SubMenu에 할당할 수 있다면 (U는 SubMenu 타입이기 때문에)
            : U extends SubMenu
            // U["name"] 은 권한에 해당
            ? U["name"]
            : never
        : never;

    // 위처럼 infer를 사용하여 풀기도 한다
    export type PermissionNames = UnpackMenuNames<typeof menuList>; //[기기 내역 관리, 헬멧 인증 관리, 운행 관리]
}