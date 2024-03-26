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



