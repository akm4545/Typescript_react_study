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
    
}