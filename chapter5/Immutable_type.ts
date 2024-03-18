{
    const colors = {
        red: "#F45452",
        green: "#0C952A",
        blue: "#1A7CFF",
    };

    // 함수를 인자로 키를 받아서 value를 반환하는 함수 
    // 키 타입을 해당 객체에 존재하는 키값으로 설정하는 것이 아니라 string으로 설정하면 getColorHex 함수의 반환 값은 any가 된다
    // colors에 어떤 값이 추가될지 모르기 때문이다
    const getColorHex = (key: string) => colors[key];

    // 여기서 as const 키워드로 객체를 불변 객체로 선언하고 keyof 연산자를 사용하여 getColorHex 함수 인자로 실제 colors 객체에 존재하는 키값만 받도록 설정할 수 있다
    // keyos, as const로 객체 타입을 구체적으로 설정하면 타입에 맞지 않는 값을 전달할 경우 타입 에러가 반환되기 떄문에 컴파일 단계에서 발생할 수 있는 실수를 방지할 수 있다
    // 또한 자동 완성 기능을 통해 객체에 어떤 값이 있는지 쉽게 파악할 수 있다
}

{
    // 예시1 Atom 컴포넌트에서 theme style 객체 활용하기 
    // Atom 단위의 작은 컴포넌트(Button, Header 등)는 폰트 크기, 폰트 색상, 배경 색상 등 다양한 환경에서 유연하게 사용될 수 있도록 구현해야 한다
    // 보통 이러한 설정값은 props로 넘겨주도록 설계한다
    // 이런 설계시 사용자가 모든 색상 값을 인지해야 하고 변경사항이 생길 때 직접 값을 넣은 모든 곳을 찾아 수정해야 하는 번거로움이 생기기 때문에 변경에 취약한 상태가 된다
    // 이런 문제 때문에 해당 프로젝트의 스타일 값을 관리해주는 theme 객체를 두고 관리한다

    interface Props {
        fontSize?: string;
        backgroundColor?: string;
        color?: string;
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
    }

    const Button: FC<Props> = ({fontSize, backgroundColor, color, children}) => {
        return (
            <ButtonWrap
                fontSize={fontSize}
                backgroundColor={backgroundColor}
                color={color}
            >
                {children}
            </ButtonWrap>
        );
    };

    const ButtonWrap = styled.button<Omit<Props, "onClick">>`
        color: ${({color}) => theme.color[color ?? "default"]};
        background-color: ${({backgroundColor}) => 
            theme.bgColor[backgroundColor ?? "default"]
        };
        font-size: ${({fontSize}) => theme.fontSize[fontSize ?? "default"]};
    `;
}