{
    const isEmpty: boolean = true;
    const isLoading: boolean = false;

    // 비교식의 결과고 boolean 타입을 갖는다 
    // 다만 Truthy / Falsy 값은 boolean 원시 값이 아니므로 타입스크립트에서도 boolean 타입에 해당하지 않는다
    function isTextError(errorCode: ErrorCodeType): boolean {
        const errorAction = getErrorAction(errorCode);

        if(errorAction){
            return errorAction.type === ERROR_TEXT;
        }

        return false;
    }
}

{
    let value: string;
    // 값이 할당되지 않았으므로 undefined 
    console.log(value);

    type Person = {
        name: string; 
        // 해당 속성은 옵셔널로 지정되어 있는데 이런 경우에도 undefined를 할당할 수 있다
        job?: string;
    };
}

{
    // 자바스크립트에서 == 연산자로 둘을 비교하면 서로 같다고 나온다
    // 하지만 엄연히 따로 존재하는 원시 값이기 때문에 서로의 타입에 할당할 수 없다
    let value: null | undefined;
    console.log(value); //undefined

    value = null;
    console.log(value); //null

    // job 속성이 있을 수도 또는 없을 수도 있음
    // 해당 값의 유무로 데이터 판단
    type Person1 = {
        name: string;
        job?: string;
    };

    // 해당 값이 비어있을 수도 있음
    // 해당 값이 null인지에 따라 데이터 판단
    type Person2 = {
        name: string;
        job: string | null;
    }
}

{
    // Symbol = 어떤 값과도 중복되지 않는 유일한 값을 생성
    const MOVIE_TITLE = Symbol("title");
    const MUSIC_TITLE = Symbol("title");
    console.log(MOVIE_TITLE === MUSIC_TITLE); //false

    // 타입스크립트에서는 symbol 타입과 const 선언에서만 사용할 수 있는 unique symbol 타입이라는 symbol 하위 타입도 있다
    let SYMBOL: unique symbol = Symbol();
}

// 타입스크립트의 모든 타입은 기본적으로 null과 undefined를 포함하고 있다 
// 하지만 ts-config의 strictNullChecks 옵션을 활성화했을 때는 사용자가 명시적으로 해당 타입에 null이나 undefined를 포함해야만
// 사용할 수 있다
// 보통 타입 가드를 사용하여 걸러낸다
// !연산자를 사용해서 타입을 단언하는 방법도 있다