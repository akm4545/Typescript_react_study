{
    // 에러 정의하기
    // 배민 에러는 텍스트, 토스트, 얼럿 방식으로 ㄹ에러를 보여줌
    // 에러 노출 방식에 따라 추가로 필요 정보가 있을 수 있음

    // 에러 타입 정의
    type TextError = {
        errorCode: string;
        errorMessage: string;
    };

    type ToastError = {
        errorCode: string;
        errorMessage: string;
        toastShowDuration: number; //토스트를 띄워줄 시간
    };

    type AlertError = {
        errorCode: string;
        errorMessage: string;
        onConfirm: () => void; //얼럿 창의 확인 버튼을 누른 뒤 액션
    };

    // 에러 타입의 유니온 타입 배열
    type ErrorFeedbackType = TextError | ToastError | AlertError;
    const errorArr: ErrorFeedbackType[] = [
        {errorCode: "100", errorMessage: "텍스트 에러"},
        {errorCode: "200", errorMessage: "토스트 에러", toastShowDuration: 3000},
        {errorCode: "300", errorMessage: "얼럿 에러", onConfirm: () => {}},
    ];

    // 추가로 에러에 관련된 모든 필드를 가지는 객체가 추가될 시
    // 타입스크립트는 값의 집합이 타입을 결정한다
    // 때문에 유니온으로 묶은 3가지 탑의 값들에 대해서 모두 허용한다?
    // 그래서 4번째 객체처럼 의도하지 않은 값이 들어가 에러 객체가 생겨날 위험성이 있다
    const errorArr2: ErrorFeedbackType[] = [
        {errorCode: "100", errorMessage: "텍스트 에러"},
        {errorCode: "200", errorMessage: "토스트 에러", toastShowDuration: 3000},
        {errorCode: "300", errorMessage: "얼럿 에러", onConfirm: () => {}},
        {errorCode: "999", errorMessage: "잘못된 에러", toastShowDuration: 3000, onConfirm: () => {}},
    ];

    // 타입이 호환되지 않도록 구분할 방법이 필요
    // 이때 식별할 수 있는 유니온을 활용
    // 타입 간의 구조 호환을 막기 위해 타입마다 구분할 수 있는 판별자(태그)를 달아 포함관계 제거 
    // 판별자 타입
    type TextError1 = {
        errorType: "TEXT";
        errorCode: string;
        errorMessage: string;
    };

    type ToastError1 = {
        errorType: "TOAST";
        errorCode: string;
        errorMessage: string;
        toastShowDuration: number;
    };

    type AlertError1 = {
        errorType: "ALERT";
        errorCode: string;
        errorMessage: string;
        onConfirm: () => void;
    };

    type ErrorFeedbackType1 = TextError1 | ToastError1 | AlertError1;
    // errorType의 타입을 직접 텍스트로 지정해줬기 떄문에 타입별 호환 불가
    // 따라서 text 타입에 없는 필드는 에러 발생
    const errorArr1: ErrorFeedbackType1[] = [
        {errorType: "TEXT", errorCode: "100", errorMessage: "텍스트 에러"},
        {errorType: "TOAST", errorCode: "200", errorMessage: "토스트 에러", toastShowDuration: 3000},
        {errorType: "ALERT", errorCode: "300", errorMessage: "얼럿 에러", onConfirm: () => {}},
        {errorType: "TEXT", errorCode: "999", errorMessage: "잘못된 에러", toastShowDuration: 3000, onConfirm: () => {}},
    ]
}

{
    // 식별할 수 있는 유니온 사용시 유닛 타입으로 선언되어야 정상동작
    // 유닛 타입 = 다른 타입으로 쪼개지지 않고 오직 하나의 정확한 값을 가지는 타입
    // 리터럴 타입을 비롯 true, 1 과 같은 타입
    // 다양한 타입을 할당 할 수 있는 void, string, number는 불가

    interface A {
        value: "a"; //unit type
        answer: 1;
    };

    interface B {
        value: string; //not unit type
        answer: 2;
    }

    interface C {
        value: Error; //instantiable type
        answer: 3;
    }

    type Unions = A | B | C;
    function handle(param: Unions){
        // 판별자가 value 일때
        param.answer; //1 | 2 | 3

        // a가 리터럴 타입이므로 타입이 좁혀진다
        // 단 이는 string 타입에 포함되므로 param은 A 또는 B 타입으로 좁혀진다
        if(param.value === "a"){
            param.answer; // 1 | 2 return;
        }

        // 유닛 타입이 아니거나 인스턴스화할 수 있는 타입일 경우 타입이 좁혀지지 않는다
        if(typeof param.value === "string"){
            param.answer; // 1 | 2 | 3 return;
        }
        if(param.value instanceof Error){
            param.answer; // 1 | 2 | 3 return; 
        }

        // 판별자가 answer 일떄
        param.value; //string | Error

        // 판별자가 유닛 타입이므로 타입이 좁혀진다
        if(param.answer === 1){
            param.value; // a
        }
    }
}

{
    // 배민 상품권 서비
    // 상품권 가격에 따라 상품권 이름은 반환하는 함수
    type ProductPrice = "10000" | "20000";

    const getProductName = (productPrice: ProductPrice): string => {
        if(productPrice === "10000") return "배민상품권 1만 원";
        if(productPrice === "20000") return "배민상품권 2만 원";
        else{
            return "배민상품권";
        }
    };

    // 새로운 상품권이 생겼다고 가정하면
    type ProductPrice1 = "10000" | "20000" | "5000";

    const getProductName1 = (productPrice: ProductPrice1): string => {
        if(productPrice === "10000") return "배민상품권 1만 원";
        if(productPrice === "20000") return "배민상품권 2만 원";
        // 타입 업데이트 시 해당 코드도 같이 추가되어야 한다
        // 하지만 getProductName1 함수를 수정하지 않아도 별도 에러가 발생하지는 않아 실수할 여지가 있다
        // if(productPrice === "5000") return "배민상품권 5천 원";
        else{
            // 때문에 정의하지 않은 타입은 else 로 분기하게 되고 에러가 발생한다
            // 모든 케이스에 대해 분기 처리를 해주지 않았을때 컴파일타임 에러가 발생하게 하는것을 Exhaustiveness Cehcking이라 한다
            exhaustiveCheck(productPrice); //Error: Argument of type 'string' is not assingable to parameter of type 'never'
            return "배민상품권";
        }
    };

    // 해당 함수의 타입은 never로 어떠한 값도 받을 수 없다
    // 만일 값이 들어온다면 에러를 내뱉는다
    // else문에 사용하여 앞의 조건문에서 모든 타입에 대한 분기 처리를 강제한다
    const exhaustiveCheck = (param: never) => {
        throw new Error("type error!");
    };
}