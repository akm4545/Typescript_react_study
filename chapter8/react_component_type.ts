// 리액트 내장 타입 
{
    // 클래스 컴포넌트 타입
    interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {}

    // props와 상태 타입을 제네릭으로 받는다
    class Component<P, S> {
        //...
    }

    class PureComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {}
    // 클래스 컴포넌트가 상속받는 React.Component와 React.PureComponent의 타입 정의는 위와 같으며 P와 S는 각각 
    // props와 상태(state)를 의미한다

    interface WelcomeProps {
        name: string;
    }
 
    // Welcom 컴포넌트의 props 타입 = WelcomProps
    // 상태가 존재하는 컴포넌트일 때는 제네릭의 두 번째 인자로 타입을 넘겨주면 상태에 대한 타입을 지정할 수 있다
    class Welcome extends React.Component<WelcomProps> {
        // ...
    }
}

{
    // 함수 선언을 사용한 방식
    function Welcome(props: WelcomeProps): JSX.Element {}

    // 함수 표현식을 사용한 방식 - React.FC 사용
    const Welcome: React.FC<WelcomeProps> = ({neme}) => {};

    // 함수 표현식을 사용한 방식 - React.VFC 사용
    const Welcome: React.VFC<WelcomeProps> = ({name}) => {};

    // 함수 표현식을 사용한 방식 - JSX.Element를 반환 타입으로 지정
    const Welcome = ({name}: WelcomeProps): JSX.Element => {};

    // 함수 표현식에서 가장 많이 보는 형태 (FC, VFC)
    // FC = FunctionComponent
    // 리액트에서 함수 컴포넌트의 타입 지정을 위해 제공되는 타입
    type FC<P = {}> = FunctionComponent<P>;

    interface FunctionComponent<P = {}> {
        // props에 children을 추가
        (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
        propTypes?: WeakValidationMap<P> | undefined;
        contextTypes?: ValidationMap<any> | undefined;
        defaultProps?: Partial<P> | undefined;
        displayName?: string | undefined;
    }

    type VFC<P = {}> = VoidFunctionComponent<P>;

    interface VoidFunctionComponent<P = {}> {
        // children 없음
        (props: P, context?: any): ReactElement<any, any> | null;
        propTypes?: WeakValidationMap<P> | undefined;
        contextTypes?: ValidationMap<any> | undefined;
        defaultProps?: Partial<P> | undefined;
        displayName?: string | undefined;
    }

    // React.FC = 암묵적으로 children을 포함 
    // children을 사용하지 않더라도 children props를 허용 
    // 따라서 children props가 필요하지 않은 컴포넌트에서는 더 정확한 타입 지정을 하기 위해서 VFC를 더 많이 사용
    // 하지만 리액트 v18로 넘어오면서 VFC가 삭제되고 FC에서 children이 사라짐 (FC에서 사용시 따로 지정하는 형태로 타이핑)
}

{
    // Children props 타입 지정
    // 가장 보편적인 children 타입 (ReactNode | undefined)
    // ReactNode = ReactElement 외에도 boolean, number 등 여러 타입을 포함하고 있으므로 구체적 타이핑하는 용도에는 적합하지 않음
    type PropsWithChildren<P> = P & {children?: ReactNode | undefined};

    // 특정 문자열만 허용하고 싶을 때는 children에 대해 추가로 타이핑해줘야 한다
    
    //example 1
    type WelcomeProps = {
        children: "천생연분" | "더 귀한 분" | "귀한 분" | "고마운 분";
    };

    //example 2
    type WelcomeProps = {
        children: string;
    };

    //example 3
    type WelcomeProps = {
        children: ReactElement;
    };
}

{
    // render 메서드와 함수 컴포넌트의 반환 타입 - React.ReactElement, JSX.Element, React.ReactNode

    // 함수 컴포넌트 반환 타입 ReactElement 정의
    interface ReactElement<P = any,
        T extends string | JSXElementConstructor<any> = 
        | string
        | JSXElementConstructor<any>
    > {
        type: T;
        props: P;
        key: Key | null;
    }

    // React.createElement를 호출하는 형태의 구문으로 변환하면 React.createElement의 반환 타입은 ReactElement
    // 가상 DOM의 엘리먼트는 ReactElement 형태로 저장
    // 즉 ReactElement 타입은 리액트 컴포넌트를 객체 형태로 저장하기 위한 포맷

    // 글로벌 네임스페이스 = 전역 스코프에서 선언된 변수나 함수 등은 글로벌 네임스페이스에 속하며 
    // 어떤 파일이든지 해당 스코프에서 선언된 식별자는 모든 곳에서 접근 할 수 있다
    declare global {
        namespace JSX{
            interface Element extends React.ReactElement<any, any> {}
        }
    }

    // 함수 컴포넌트에서 JSX.Element 타입은 ReactElement를 확장하고 있는 타입이며 
    // 글로벌 네임스페이스에 정의되어 있어 외부 라이브러리에서 컴포넌트 타입을 재정의 할 수 있는 유연성을 제공한다
    // 이러한 특성으로 인해 컴포넌트 타입을 재정의하거나 변경하는 것이 용이해진다 

    // React.Node 타입 정의
    type ReactText = string | number;
    type ReactChild = ReactElement | ReactText;
    type ReactFragment = {} | Iterable<ReactNode>;

    type ReactNode = 
        | ReactChild
        | ReactFragment
        | ReactPortal
        | boolean
        | null
        | undefined;

    // 단순히 ReactElement 외에도 boolean, stirng, number 등의 여러 타입을 포함하고 있다
    // 포함 관계
    // JSX.Element < ReactElement < ReactNode
}

{
    // ReactElement, ReactNode, JSX.Element = 리액트의 요소를 나타내는 타입

    // @types/react 패키지에 정의된 타입을 살펴보면 아래와 같다
    declare namespace React{
        // ReactElement
        interface ReactElement<
            P = any,
            T extends string | JSXElementConstructor<any> =
                | string
                | JSXElementConstructor<any>
        >{
            type: T;
            props: P;
            key: Key | null;
        }
    }

    //ReactNode
    type ReactText = string | number;
    type ReactChild = ReactElement | ReactText;
    type ReactFragment = {} | Iterable<ReactNode>;

    type ReactNode = 
        | ReactChild
        | ReactFragment
        | ReactPortal
        | boolean
        | null
        | undefined;

    type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

    //JSX.Element
    declare global {
        namespace JSX {
            interface Element extends React.ReactElement<any, any> {
                //...
            }
            ..///
        }        
    }
}

{
    // JSX = createElement 메서드를 호출하기 위한 문법
    // 트랜스파일러가 JSX 문법을 createElement 메서드 호출문으로 변환하여 아래와 같이 리액트 엘리먼트를 생성
    const element = React.createElement(
        "h1",
        {className: "greeting"},
        "Hello, world!"
    );

    // 주의: 다음 구조는 단순화되었다
    const element = {
        type: "h1",
        props: {
            className: "greeting",
            children: "Hello, world!",
        },
    };

    declare global {
        namespace JSX {
            interface Element extends React.ReactElement<any, any> {
                //...
            }
            //...
        }
    }

    // 리액트는 이런식으로 리액트 엘리먼트 객체를 읽어서 DOM을 구성
    // ReactElement 타입은 JSX의 createElement 메서드 호출로 생성된 리액트 엘리먼트를 나타내는 타입이라고 볼 수 있다
}

{
    // ReactChild 타입
    // ReactChild 타입은 ReactElement | string | number 로 정의되어 ReactElement 보다는 좀 더 넓은 범위를 갖고 있다
    type ReactText = string | number;
    type ReactChild = ReactElement | ReactText;

    type ReactFragment = {} | Iterable<ReactNode>; //ReactNode의 배열 형태

    // ReactNode는 render 함수가 반환할 수 있는 모든 형태를 담고 있다
    type ReactNode = 
        | ReactChild 
        | ReactFragment
        | ReactPortal
        | boolean
        | null
        | undefined;
}

{
    // JSX.Element는 ReactElement의 특정 타입으로 props와 타입 필드를 any로 가지는 타입
    declare global {
        namespace JSX {
            interface Element extends React.ReactElement<any, any> {
                //...
            }
            //...
        }
    }
}

{
    // children을 포함하는 props 타입 
    interface MyComponentProps {
        children?: React.ReactNode;
        //...
    }

    // JSX 형태의 문법을 때로는 string, number, null, undefined 같이 어떤 타입이든 children prop으로 지정할 수 있게 하고 싶다면
    // ReactNode 타입으로 children을 선언하면 된다
    // 이런 식으로 ReactNode는 prop으로 리액트 컴포넌트가 다양한 형택를 가질 수 있게 하고 싶을 때 유용하다

    // 리액트 내장 타입인 PropsWithChildren 타입도 ReactNode 타입으로 children을 선언하고 있다
    type PropsWithChildren<P = unknown> = P & {
        children?: ReactNode | undefined;
    };

    interface MyProps {
        //...
    }

    type MyComponentProps = PropsWithChildren<MyProps>;
}

{
    // JSX.Element는 props와 타입 필드가 any타입인 리액트 엘리먼트
    // 리액트 엘리먼트를 prop으로 전달받아 render props 패턴으로 컴포넌트를 구현할 때 유용하게 활용할 수 있다

    interface Props{
        icon: JSX.Element;
    }

    const Item = ({icon}: Props) => {
        //prop으로 받은 컴포넌트의 props에 접근할 수 있다
        const iconSize = icon.props.size;

        return (<li>{icon}</li>);
    };

    // icon prop에는 JSX.Element 타입을 가진 요소만 할당할 수 있다
    const App = () => {
        return <Item icon={<Icon size={14 />}}/>
    };
}

{
    // JSX.Element 예시를 확장하여 추론 관점에서 더 유용하게 사용 = ReactElement 사용
    // 원하는 컴포넌트의 props를 ReactElement의 제네릭으로 지정할 수 있다
    // 만약 JSX.Element가 ReactElement의 props 타입으로 any가 지정되었다면 ReactElement 타입을 활용하여 제네릭에 직접 해당 컴포넌트의 props 타입을 명시

    interface IconProps {
        size: number;
    }

    interface props {
        // ReactElement의 props 타입으로 IconProps 타입 지정
        icon: React.ReactElement<IconProps>;
    }

    // 이처럼 코드를 작성하면 icon.props에 접근할 때 어떤 props가 있는지가 추론되어 IDE에 표시된다
    const item = ({icon}: Props) => {
        // icon prop으로 받은 컴포넌트의 props에 접근하면 props의 목록이 추론된다
        const iconSize = icon.props.size;

        return <li>{icon}</li>;
    };
}

{
    // HTML button 태그를 확장한 Button 컴포넌트
    // 새롭게 만든 컴포넌트도 기존 button 처럼 onClick 이벤트 핸들러를 지원해야만 일관성과 편의성을 모두 챙길 수 있다
    const SquareButton = () => <button>정사각형 버튼</button>;
}

{
    // HTML 태그의 속성 타입을 활용하는 대표적인 2가지 방법 
    // DetailedHTMLProps, ComponentWithoutRef

    // React.DetailedHTMLProps를 활용하는 경우 아래와 같이 쉽게 HTML 태그 속성과 호환되는 타입 선언 가능
    type NativeButtonProps = React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >;

    // ButtonProps의 onClick 타입은 실제 HTML button 태그의 onClick이벤트 핸들러 타입과 동일하게 할당된다
    type ButtonProps = {
        onClick?: NativeButtonProps["onClick"];
    };

    // React.ComponentPropsWithoutRef 타입
    type NativeButtonType = React.ComponentPropsWithoutRef<"button">;
    // 마찬가지로 onClick 이벤트 핸들러에 대한 타입 할당
    type ButtonProps = {
        onClick?: NativeButtonType["onClick"];
    };
}

{
    // 컴포넌트의 props로서 HTML 태그 속성을 확장하고 싶을 때의 상황
    // HTML button 태그와 동일한 역할을 하지만 커스텀한 UI를 적용하여 재사용성을 높이기 위한 Button 컴포넌트
    const Button = () => {
        return <button>버튼</button>;
    };

    // 먼저 HTML button 태그를 대체하는 역할이므로 아래와 같이 기존 button 태그의 HTML 속성을 props로 받을 수 있도록 지원
    type NativeButtonProps = React.DetailedHTMLProps<
        React.ButtonHTMLAttribures<HTMLButtonElement>,
        HTMLButtonElement
    >;

    // HTMLButtonElement의 속성을 모두 props로 받아 button 태그에 전달했으므로 문제없어 보인다
    const Button = (props: NativeButtonProps) => {
        return <button {...props}>버튼</button>;
    };

    // ref를 props로 받을 경우 고려해야 할 사항이 있다
    // ref = 생성된 DOM 노드나 리액트 엘리먼트에 접근하는 방법 
    // 아래와 같이 사용
    
    // 클래스 컴포넌트
    class Button extends React.Component {
        constructor(props){
            super(props);
            this.buttonRef = React.createRef();
        }

        render(){
            return <button ref={this.buttonRef}>버튼</button>;
        }
    }

    // 함수 컴포넌트
    function Button(props){
        const buttonRef = useRef(null);

        return <button ref={buttonRef}>버튼</button>;
    }

    type NativeButtonProps = React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >;

    // 클래스 컴포넌트
    class Button extends React.Component {
        constructor(ref: NativeButtonProps["ref"]){
            this.buttonRef = ref;
        }

        render(){
            return <button ref={this.buttonRef}>버튼</button>;
        }
    }

    //함수 컴포넌트
    function Button(ref: NativeButtonProps["ref"]){
        const buttonRef = useRef(null);

        return <button ref={buttonRef}>버튼</button>;
    }

    // 클래스형 컴포넌트와 함수 컴포넌트에서 ref를 props로 받아 전달하는 방식에 차이가 있다

    // 클래스 컴포넌트로 만들어진 Button 컴포넌트를 사용할 때
    // 컴포넌트 props로 전달된 ref가 Button 컴포넌트의 button 태그를 그대로 바라보게 된다
    class WrappedButton extends React.Component{
        constructor(){
            this.buttonRef = React.createRef();
        }

        render(){
            return(
                <div>
                    <Button ref={this.buttonRef} />
                </div>
            );
        }
    }

    // 함수 컴포넌트로 만들어진 Button 컴포넌트를 사용할 때
    // 함수 컴포넌트의 경우 전달받은 ref가 Button 컴포넌트의 button 태그를 바라보지 않는다
    const WrappedButton = () => {
        const buttonRef = useRef();

        return (
            <div>
                <Button ref={buttonRef} />
            </div>
        );
    };

    // 클래스 컴포넌트에서 ref 객체는 마운트된 컴포넌트의 인스턴스를 current 속성값으로 가지지만 
    // 함수 컴포넌트에서는 생성된 인스턴스가 없기 때문에 ref에 값이 할당되지 않는다

    // 함수 컴포넌트에서도 ref를 전달받을 수 있도록 도롸주는 React.forwardRef 메서드
    // forwardRef를 사용해 ref를 전달받을 수 있도록 구현
    const Button = forwardRef((props, ref) => {
        return <button ref={ref} {...props}>버튼</button>
    });

    // buttonRef가 Button 컴포넌트의 button 태그를 바라볼 수 있다
    const WrappedButton = () => {
        const buttonRef = useRef();

        return (
            <div>
                <Button ref={buttonRef} />
            </div>
        );
    };

    // forwardRef는 2개의 제네릭 인자를 받을 수 있다
    // 첫번째는 ref에 대한 타입 정보
    // 두번째는 props에 대한 타입 정보

    // Button 컴포넌트에 대한 forwardRef의 타입 선언
    type NativeButtonType = React.ComponentPropsWithoutRef<"button">;
    
    // forwardRef의 제네릭 인자를 통해 ref에 대한 타입으로 HTMLButtonElement를 props에 대한 타입으로 NativeButtonType을 정의했다
    const Button = forwardRef<HTMLButtonElement, NativeButtonType>((props, ref) => {
        return (
            <button ref={ref} {...props}>
                버튼
            </button>
        );
    });

    // Button 컴포넌트의 props에 대한 타입인 NativeButtonType을 정의할 때 ComponentPropsWithoutRef 타입을 사용
    // 이렇게 타입을 React.ComponentPropsWithoutRef<"button">로 작성하면 button 태그에 대한 HTML 속성을 모두 포함 ref 속성은 제외
    // 이러한 특징 때문에 DetailedHTMLProps, HTMLProps, ComponentPropsWithRef와 같이 ref 속성을 포함하는 타입과는 다르다
    // 함수 컴포넌트의 props로 DetailedHTMLProps와 같이 ref를 포함하는 타입을 사용하게 되면 실제로는 동작하지 않는 ref를 받도록 타입이 지정되 
    // 에러가 발생할 수 있다
    // 따라서 HTML 속성을 확장하는 props를 설계할 때는 ComponentPropsWithoutRef 타입을 사용하여 ref가 실제로 forwardRef와 함께 사용될 때만 props로 전달되도록 타입을 저의하는것이 안전
}



