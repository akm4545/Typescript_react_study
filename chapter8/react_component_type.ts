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
    
}

