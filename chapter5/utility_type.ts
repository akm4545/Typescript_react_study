{
    // 유틸리티 타입 미사용시 문제점
    // Props 타입과 styled-components 타입의 중복 선언 및 문제점

    // 수평선을 그어주는 Hr 컴포넌트
    //HrComponent.tsx
    export type Props = {
        height?: string;
        color?: keyof typeof VideoColorSpace;
        isFull?: boolean;
        className?: string;
        ...
    };

    // 값이 들어오면 해당 값을 전달하여 컴포넌트를 생성하는 함수
    export const Hr: VFC<Props> = ({height, color, isFull, className}) => {
        ...
        return <HrComponent 
            hegiht={height}
            color={color}
            isFull={isFull}
            className={className}
        />;
    };

    //style.ts
    import {Props} from '...';
    
    //Props에 속성들의 타입이 변경된다면 StyledProps도 수정되어야 한다 추가되면 해당 부분이 바뀌어야 한다
    // 코드 중복 발생
    type StyledProps = {
        height?: string;
        color?: keyof typeof VideoColorSpace;
        isFull?: boolean;
    };

    //Pick을 사용하여 원하는 속성만 뽑아 타입을 만들 수 있다
    type StyledProps = Pick<Props, "height" | "color" | "isFull">;

    // 컴포넌트 생성
    const HrComponent = styled.hr<StyledProps>`
        height: ${({height}) => height || "10px"};
        margin: 0;
        background-color: ${({color}) => colors[color || "gray7"]};
        border: none;
        ${({isFull}) => 
            isFull &&
            css`
                margin:0 -15px;
            `
        }
    `;
}

{
    // 타입스클비트에는 서로 다른 2개 이상의 객체를 유니온 타입으로 받을 때 타입 검사가 제대로 진행되지 않는 이슈가 있다
    // 이 문제를 해결하기 위해 PcikOne이라는 이름의 유틸리티 함수를 구현해서 사용한다

    type Card = {
        card: string
    };

    type Account = {
        account: string
    };

    // 매개변수로 Card나 Account 중 하나만 받기 위해 작성
    function withdraw(type: Card | Account) {
        //...
    }

    // 하지만 두 값을 받아도 에러가 발생하지 않는다
    // 집합 관점으로 볼 때 유니온은 합집합이기 때문
    withdraw({card: "hyundai", account: 'hana'});
}

{
    // 식별할 수 있는 유니온은 각 타입에 type이라는 공통된 속성을 추가하여 구분하는 방법
    type Card = {
        type: "card";
        card: string;
    };

    type Account = {
        type: "account";
        account: string;
    };

    function withdraw(type: Card | Account){
        //...
    }

    // 식별할 수 있는 유니온으로 문제를 해결할 수 있지만 일일이 type을 다 넣어줘야 한다
    withdraw({type: "card", card: "hyundai"});
    withdraw({type: "account", account: "hana"});
}

{
    // account 일 때는 card를 받지 못하고 card일 때는 account를 받지 못하게 하려면 하나의 속성이 들어왔을 때
    // 다른 타입을 옵셔널한 undefined 값을 지정하는 방법도 있다
    // 옵셔널 + undefined로 타입을 지정하면 사용자가 의도적으로 undefined 값을 넣지 않는 이상 원치 않는 속성에 값을 넣었을 때 타입 에러가 발생할 것이다
    // {account: stirng; card?: undefined } | { account?: undefined; card: string}

    // 해당 타입을 정확하게 이해하기 위해 속성을 하나 더 추가한다면
    // 선택하고자 하는 하나의 속성을 제외한 나머지 값을 옵셔널 타입 + undefined로 설정하면 원하고자 하는 속성만 받도록 구현할 수 있다
    type PayMethod = 
        | {account: string; card?: undefined; payMoney?: undefined}
        | {account?: undefined; card: string; payMoney?: undefined}
        | {account?: undefined; card?: undefined; payMoney: string};

    type PickOne<T> = {
        [P in keyof T]: Record<P, T[P]> & Partial<Record<Exclude<keyof T, P> undefined>>;
    }[keyof T];

    // 앞의 유틸리티 타입을 하나씩 본다면
    // PickOne 타입을 2가지 타입을 ㅗ분리해서 생각할 수 있다
    // One<T> = T 는 객체가 들어 온다고 가정

    // 1. [P in keyof T]에서 T는 객체로 가정하기 때문에 P는 T 객체의 키값을 말한다.
    // 2. Record<P, T[P]>는 P 타입을 키로 가지고 value는 P를 키로 둔 T 객체의 값의 레코드 타입을 말한다
    // 3. 따라서 {[P in keyof T]: Record<P, T[P]>} 에서 키는 T 객체의 키 모음([P in keyof T]) 이고 value는(Record<P, T[P]>) 해당 키의 원본 객체 T를 말한다
    // 4. 다시 [keyof T]의 기값으로 접근하기 때문에 최종 결과는 전달받은 T와 같다
    type One<T> = {[P in keyof T]: Record<P, T[P]>}[keyof T];

    type Card = {card: string};
    const one: One<Card> = {card: "hyundai"};

    // ExcludeOne<T>

    // 1. [P in keyof T]에서 T는 객체로 가정하기 떄문에 P는 T객체의 키값을 말한다
    // 2. Exclude<keyof T, P>는 T객체가 가진 키값에서 P타입과 일치하는 키값을 제외한다 (이를 A타입이라 지정)
    // 3. Record<A, undefined>로 키는 A 타입을, 값으로 undefined 타입을 갖는 레코드 타입이다 즉 전달받은 객체 타입을 모두 {[key]: undefined} 형태로 만든다 (이를 B타입이라 지정)
    // 4. Partial<B>는 B 타입을 옵셔널로 만든다 따라서 {[key]? : undefined}와 같다
    // 5. 최종적으로 [P in keyof T]로 매핑된 타입에서 동일한 객체의 키값인 [keyof T]로 접근하기 떄문에 4번 타입이 반환된다
    type ExcludeOne<T> = {[P in keyof T]: Partial<Record<Exclude<keyof T, P>, undefined>>}[keyof T];

    //결론적으로 얻고자 하는 타입은 속성 하나와 나머지는 옵셔널 + undefined인 타입이기 때문에 앞의 속성을 활용해서 PickOne 타입을 표현할 수 있다
    type PickOne<T> = One<T> & ExcludeOne<T>;

    // One<T> $ ExcludeOne<T>는 [P in keyof T]를 공통으로 갖기 떄문에 아래 같이 교차된다
    // 이 타입을 해석하면 전달된 T 타입의 1개의 키는 값을 가지고 있으며 나머지 키는 옵셔널한 undefined값을 가진 객체를 의미한다
    //[P in keyof T]: Record<P, T[P]> & Partial<Record<Exclude<keyof T, P> undefined>>;

    type Card = {card: string};
    type Account = {account: string};

    // card + account 타입을 제네릭으로 전달
    // undefined가 없어서 에러가 뜨는듯?
    // type ExcludeOne<T> = {[P in keyof T]: Partial<Record<Exclude<keyof T, P>, undefined>>}[keyof T];로 undefined도 포함되도록 했으니까?
    // Partial로 옵셔널로 만듦으로 undefined가 아니라 값 자체가 없는 경우에는 에러가 뜨지 않음
    const pickOne1: PickOne<Card & Account> = {card: "hyundai"};
    const pickOne2: PickOne<Card & Account> = {account: "hana"};
    const pickOne3: PickOne<Card & Account> = {card: "hyundai", account: undefined};
    const pickOne4: PickOne<Card & Account> = {card: undefined, account: "hana"};
    const pickOne5: PickOne<Card & Account> = {card: "hyundai", account: "hana"}; // X    
}

{
    // PickOne을 활용하여 코드 수정
    type Card = {
        card: string
    };

    type Account = {
        account: string
    };

    type CardOrAccount = PickOne<Card & Account>;
}