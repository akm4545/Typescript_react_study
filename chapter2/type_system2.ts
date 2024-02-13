// 트리쉐이킹 
// 자바스크립트, 타입스크립트에서 사용하지 않는 코드를 삭제하는 방식
// ES6 이후의 최신 애플리케이션 개발 환경에서는 웹팩, 롤업 같은 모듈 번들러를 사용한다
// 해당 도구로 작업을 수행할 때 사용되지 않는 코드는 자동으로 삭제된다

{
    interface Person{
        first: string;
        last: string;
    }

    const person: Person = {first: "zig", last: "song"};

    function email(options: {person: Person; subject: string, body: string}){}

// 값에서 사용된 typeof는 자바스크립트 런타임의 typeof 연산자가 된다
    const v1 = typeof person; //object
    const v2 = typeof email; // functioin

    // 타입에서 사용된 typeof는 값을 읽고 타입스크립트 타입을 반환한다
    // person 변수는 Person 타입이기 떄문에 Person을 반환
    type T1 = typeof person; // Person
    // 함수의 매개변수 타입과 리턴 타입을 포함한 함수 시그니처 타입을 반환
    type T2 = typeof email; // (options: {person: Person; subject: string, body: string}) => void
}

{
    class Developer {
        name: string;
        sleepingTime: number;

        constructor(name: string, sleepingTime: number){
            this.name = name;
            this.sleepingTime = sleepingTime;
        }
    }

    // 자바스크립트의 클래스는 결국 함수이기 때문에 값 공간에서 function이 된다
    const d = typeof Developer; //function
    // 타입 공간에서 typeof Develper의 반환값은 조금 특이한데 type T에 할당된 Develper는 인스턴스의 타입이 아니라 
    // new 키워드를 사용할 때 볼 수 있는 생성자 함수이기 떄문
    type T = typeof Developer; // typeof Developer

    // Developer 클래스로 생성한 zig 인스턴스는 Developer가 인스턴스 타입으로 생성되었기 때문에 
    // 타입 공간에서 typeof zig 즉 type ZigType은 Developer를 반환한다
    // 그러나 Developer는 Developer 타입의 인스턴스를 만드는 생성자 함수이다 
    // 따라서 typeof Developer 타입도 그 자체인 typeof Developer가 된다
    const zig: Developer = new Developer("zig", 7);
    type ZigType = typeof zig; //타입이 Developer
}

{
    // 자바스크립트에서 instaceof 연산자를 사용하면 프로토타입 체이닝 어딘가에 생성자의 프로토타입 속성이 존재하는 
    // 판단할 수 있다
    // typeof 연산자처럼 instanceof 연산자의 필터링으로 타입이 보장된 상태에서 안전하게 값의 타입을 정재하여 사용할 수 있다
    let error = unknown;

    if (error instanceof Error){
        showAlertModal(error.message);
    } else{
        throw Error(error);
    }
}

{
    // as = 타입 단언 
    // 타입을 강제한다
    // 개발자가 해당 값의 타입을 더 잘 파악할 수 있을때 사용되며 강제 형 변환과 유사한 기능을 제공한다
    const loaded_text: unknown; // 어딘가에서 unknown 타입 값을 전달받았다고 가정

    const validateInputText = (text: string) => {
        if(text.length < 10) {
            return "최소 10글자 이상 입력해야 합니다.";
        }

        return "정상 입력된 값입니다.";
    };

    // as 키워드를 사용해서 stirng으로 강제하지 않으면 타입스크립트 컴파일러 단계에서 에러 발생
    validateInputText(loaded_text as string);
}