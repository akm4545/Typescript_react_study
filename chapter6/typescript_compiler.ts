{
    const developer = {
        work(){
            console.log("working...");
        },
    };
 
    // 해당 코드는 자바스크립트로 작성하는 시점에선 에러가 발생하지 않는다
    // 하지만 실제 실행을 하면 에러가 발생한다
    // 타입스크립트는 코드를 실행하기 전에 에러를 사전에 발견하여 알려준다
    // 문법 에러뿐만 아니라 타입 에러도 같이 알려준다
    // 타입스크립트 컴파일러는 tsc binder를 사용하여 타입 검사를 하며 컴파일타임에 타입 오류를 발견한다
    // 타입 검사를 거쳐 코드를 안전하게 만든 이후에는 타입스크립트 AST를 자바스크립트로 변환한다
    developer.work();
    developer.sleep();
}

{
    // 타입스크립트 소스코드는 브라우저와 같은 런타임에서 실행될 수 없다
    // 타입스크립트 소스코드를 파싱하고 자바스크립트 코드로 변환해야 비로소 실행할 수 있다
    type Fruit = "banana" | "watermelon" | "orange" | "apple" | "kiwi" | "mango";
    const fruitBox: Fruit[] = ["banana", "apple", "mango"];

    const welcome = (name: string) => {
        console.log(`hi! ${name} :)`);
    };

    // 자바스크립트로 변환한 결과 
    // 타입스크립트의 target 옵션을 사용하여 특정 버전의 자바스크립트 소스코드로 컴파일할 수 있다
    // 해당 예시는 ES5
    "use strict";
    var fruitBox = ["banana", "apple", "mango"];
    var welcome = function (name) {
        console.log("hi! ".concat(name, " :)"))
    };

    // 타입스크립트 컴파일러는 타입 검사를 수행한 후 코드 변환을 시작한다
    // 이때 타입 오류가 있더라도 일단 컴파일을 진행한다
    // 타입스크립트 코드가 자바스크립트 코드로 변환되는 과정은 타입 검사와 독립적으로 동작하기 때문이다
    // 타입스크립트 코드의 타이핑이 잘못되어 발생하는 에러는 자바스크립트 실행 과정에서 런타임 에러로 처리
    // 타입스크립트 소스코드에 타입 에러가 있더라도 자바스크립트로 컴파일되어 타입 정보가 모두 제거된 후에는 타입이 아무런 효력을 발휘하지 못한다

    const name: string = "zig";
    // 타입 에러 발생
    // 자바스크립트로 컴파일은 가능하다
    const age: number = "zig";

    // 컴파일 후
    const name = "zig";
    const age = "zig";

    interface Square {
        width: number;
    }

    interface Rectangle extends Square {
        height: number;
    }

    type Shape = Square | Rectangle;

    // 자바스크립트 런타임은 해당 코드를 이해하지 못한다
    function calculateArea(shape: Shape) {
        if (shape instanceof Rectangle){
            return shape.width * shape.height;
        }else{
            return shape.width * shape.width;
        }
    }
}