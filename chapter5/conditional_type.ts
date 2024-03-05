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
    type PayMethodType<T extends "card" | "appcard" | "bank"> = T extends
        | "card"
        | "appcard"
        ? Card
        : Bank;
} 