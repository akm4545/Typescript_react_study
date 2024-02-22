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
        errorMessag: string;
        onConfirm: () => void;
    };
}