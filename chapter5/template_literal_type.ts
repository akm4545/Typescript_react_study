{
    // 타입스크립트에서는 유니온 타입을 사용하여 변수 타입을 특정 문자열로 지정 가능
    // 컴파일 타임의 변수에 할당되는 타입을 특정 문자열로 정확하게 검사여 휴면 에러를 방지
    // 자동 완성 기능을 통해 개발 생산성을 높일 수 있다
    type HeaderTag = "h1" | "h2" | "h3" | "h4" | "h5";
}

{
    // 타입스크립트 4.1부터 이를 확장하는 방법인 템플릿 리터럴 타입을 지원
    // 자바스크립트의 템플릿 리터럴 문법을 사용해 특정 문자열에 대한 타입 선언
    type HeadingNumber = 1 | 2 | 3 | 4 | 5;
    type HeaderTag = `h${HeadingNumber}`;

    // 수평 또는 수직 방향을 표현하는 타입
    type Direction = 
        | "top"
        | "topLeft"
        | "topRight"
        | "bottom"
        | "bottomLeft"
        | "bottomRight";
    
    //템플릿 리터럴 ㅌ입을 적용하여 명확하게 표현 한다면
    type Vertical = "top" | "bottom";
    type Horizon = "left" | "right";

    type Direction = Vertical | `${Vertical}${Capitalize<Horizon>}`;

    // 타입스크립트 컴파일러가 유니온을 추론하는 데 시간이 오래 걸리면 비효율적이기 떄문에
    // 타입스크립트가 타입을 추론하지 않고 에러를 내뱉을 때가 있다
    // 따라서 템플릿 리터럴 타입에 삽입된 유니온 조합의 경우의 수가 너무 많지 않게 적절하게 나누어 타입을 정의하는 것이 좋다
    type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    type Chunk = `${Digit}${Digit}${Digit}`;
    type PhoneNumberType = `010-${Chunk}-${Chunk}`;
}