{
    // any 타입은 어떤 타입의 데이터라도 들어올 수 있으므로 지양해야할 패턴이다
    // 개발 단계에서 임시로 값을 지정해야 할 때     
    let state: any;

    state = {value: 0};
    state = 100;
    state = "hello world!";
    state.foo.bar = () => console.log("this is any type");

    // 어떤 값을 받아올지 또는 넘겨줄지 정할 수 없을 때
    type FeedbackModalParams = {
        show: boolean;
        content: string;
        cancelButtonText?: string;
        confirmButtonText?: string;
        beforeOnClose?: () => void;
        action?: any;
    }

    // 값을 예측할 수 없을 때 암묵적으로 사용 (Fetch API의 일부 메서드)
    async function load() {
        const response = await fatch("https://api.com");
        const data = await response.json(); // response.json()의 리턴 타입은 Promise<any>로 정의되어 있다

        return data;
    }
}

{
    // unknown 타입도 any와 마찬가지로 모든 타입의 값이 할당될 수 있다
    let unknownValue: unknown;
    
    unknownValue = 100;
    unknownValue = "hello world";
    unknownValue = () => console.log("this is any type");

    // any 타엡에는 unknown 타입이 할당될 수 있다
    let somValue1: any = unknownValue;
    // 다른 경우는 불가능
    let somValue2: number = unknownValue;
    let somValue3: string = unknownValue;

    // unknown 타입은 객체 내부에 접근하는 모든 시도에서 에러가 발생한다
    // 어떤 값이든 올 수 있음을 의미하는 동시에 개발자에게 엄격한 타입 검사를 강제한다
    // 따라서 데이터 구조를 파악하기 힘들 때 any 타입 대신 unknown 타입으로 대체해서 사용하는 방법이 권장된다

    // 할당 시점에는 에러가 발생하지 않음
    const unknownFunction: unknown = () => console.log("this is unknown type");

    // 실행 시점에 에러 발생
    unknownFunction();
}

{
    // 자바스크립트에서는 함수에서 명시적인 반환문을 작성하지 않으면 기본적으로 undefined가 반환된다
    // 타입스크립트에서는 void 타입이 사용되는데 undefined != void 이다 

    function showModal(type: ModalType): void {
        feedbackSlice.actions.createModal(type);
    }

    // 화살표 함수로 작성 시
    const showModal = (type: ModalType): void => {
        feedbackSlice.actions.createModal(type);
    }

    // void는 변수에도 타입을 지정할 수 있으며 undefined 또는 null값만 할당할 수 있다
    let voidValue: void = undefined;

    voidValue = null;

    // 일반적으로 함수 자체를 다른 함수의 인자로 전달하는 경우가 아니라면 void 타입은 잘 명시하지 않는 경향이 있다
    // 컴파일러가 알아서 함수 타입을 void로 추론해주기 때문이다
}

{
    // never 타입은 함수와 관련하여 많이 사용한다
    // never 타입은 값을 반환할 수 없는 타입이다

    // 예외를 발생시키면 값을 반환하는것으로 간주하지 않는다
    // 따라서 특정 함수가 실행 중 마지막에 에러를 던지는 작업을 수행한다면 해당 함수의 반환 타입은 never다
    function generateError(res: Response): never {
        throw new Error(res.getMessage());
    }

    // 무한 루프를 싱행하는 경우는 함수가 종료되지 않으므로 값을 반환하지 못한다
    function checkStatus(): never{
        while(true){
            // ...
        }
    }

    // never 타입은 자신을 제외한 어느 타입도 never타입에 할당될 수 없다 (any 포함)
    // 타입스크립트에서는 조건부 타입을 결정할 때 특정 조건을 만족하지 않는 경우에 엄격한 타입 검사 목적으로 never 타입을 명시적으로 
    // 사용하기도 한다
}

{
    // array 타입 선언
    const array: number[] = [1, 2, 3];
    const array2: Array<number> = [1, 2, 3];

    // 유니온 타입을 사용 여러 타입을 허용
    const array3: Array<number | string> = [1, "string"];
    const array4: number[] | string[] = [1, "string"];

    // array4는 다음과 같이 사용할 수도 있다
    const array5: (number | string)[] = [1, "string"];
}

{
    // 튜플은 타입스크립트의 타입 시스템과 대괄호를 사용해서 선언할 수 있다
    // 이때 대괄호 안에 선언하는 타입의 개수가 튜플이 가질 수 있는 원소의 개수를 나타낸다
    let tuple: [number] = [1];

    // 불가능
    tuple = [1, 2];
    tuple = [1, "string"];

    // 여러 타입과 혼합도 가능하다
    let tuple: [number, string, boolean] = [1, "string", true];

    // 스프레드 연산자 (...) 을 이용하여 특정 인덱스에서 요소를 명확한 타입으로 선언하고 
    // 나머지 인덱스에서는 배열처럼 동일한 자료형의 원소를 개수 제한 없이 받도록 할 수 있다
    const httpStatusFromPaths: [number, string, ...string[]] = [
        400,
        "Bad Request",
        "/users/:id",
        "/users/:userId",
        "/users/:uuid"
    ];

    // 옵셔널(?) = 특정 속성 또는 매개변수가 값이 있을 수도 있고 없을 수도 있는 것을 의미
    const optionalTuple1: [number, number, number?] = [1, 2];
    // 3번째 인덱스에 해당되는 수자형 원소는 있어도 없어도 된다
    const optionalTuple2: [number, number, number?] = [1, 2, 3];
}

{
    enum ProgrammingLanguage {
        Typescript, // 0
        Javascript, // 1
        Java, // 2
        Python, // 3
        Kotlin, // 4
        Rust, // 5
        Go, // 6
    }

    ProgrammingLanguage.Typescript; //0
    ProgrammingLanguage.Rust; //5
    ProgrammingLanguage["Go"]; //6

    ProgrammingLanguage[2]; //Java
}