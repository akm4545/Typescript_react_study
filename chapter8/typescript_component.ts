{
    // JSX로 구현된 Select 컴포넌트
    // 각 option의 키,값 쌍을 객체로 받음
    // 선택된 값이 변경될 때 호출되는 onChange 이벤트 핸들러를 받음
    // 추가적인 설명이 없다면 컴포넌트를 사용하는 입잡에서 각 속성에 어떤 타입의 값을 전달해야 할지 알기 어려움

    const Select = ({onChange, options, selectedOption}) => {
        const handleChange = (e) => {
            const selected = Object.entries(options)
                .find(([_, value]) => value === e.target.value)?.[0];
            
            onChange?.(selected);
        };

        return (
            <select
                onChange={handleChange}
                value={selectedOption && options[selectedOption]}
            >
                {Object.entries(options).map(([key, value]) => (
                    <option key={key} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        );
    };   
}

{
    // 컴포넌트의 속성 타입을 명시하기 위해 JSDocs를 사용할 수 잇다
    /**
     * Select 컴포넌트
     * @param {Object} props - Select 컴포넌트로 넘겨주는 속성
     * @param {Object} props.options - {[key: string]: string} 형식으로 이루어진 option 객체
     * @param {string | undefined} props.selectedOption - 현재 선택된 option의 key값 (optional)
     * @param {function} props.onChange - select 값이 변경되었을 때 불리는 callBack 함수 (optional)
     * @returns {JSX.Element}
     * 
     */
    const Select = //...
}

{
    // JSDocs 사용시 파악이 쉽지만 options가 어떤 형식의 객체인지 onChange의 매개변수 및 반환값에 대한 구체적인 정보를 알기 쉽지 않음
    // 때문에 타입스크립트를 사용 구체적인 타입 지정

    // props에 대한 인터페이스
    // Option 타입 정의
    // string 이외의 value는 전달 불가
    type Option = Record<string, string>; //{[key: string]: string}

    // Option 타입 재사용
    interface SelectProps {
        options: Option;
        selectedOption?: string;
        // string 또는 undefined를 매개변수로 받고 어떤 값도 반환하지 않음
        // 옵셔널이라 부모 컴포넌트에서 넘겨주지 않아도 해당 컴포넌트 사용 가능
        onChange?: (selected?: string) => void;
    }

    const Select = ({options, selectedOption, onChange}: SelectProps): JSX.Element => 
    //...

    interface Fruit {
        count: number;
    }

    interface Param {
        [key: string]: Fruit; // type Param = Record<string, Fruit>과 동일
    }

    const func: (fruits: Param) => void = ({apple}: Param) => console.log(apple.count);

    // ok
    func({apple: {count: 0}});

    // 얘가 왜 에러가 남?
    func({mango: {count: 0}});
}

{
    // 리액트 이벤트는 카멜 케이스로 표기
    // 브라우저 고유 이벤트와 완전히 동일하게 작동하지는 않음
    // 리액트 이벤트 핸들러는 이벤트 버블링 단계에서 호출
    // 이벤트 캡처 단계에서 이벤트 핸들러를 등록하기 위해서는 onClickCapture, onChangeCapture와 같이 리스너 이름 뒤에 Capture를 붙여야 한다
    // 브라우저 이벤트를 합성한 합성 이벤트(SyntheticEvent)를 제공
    type EventHandler<Event extends React.SyntheticEvent> = (e: Event) => void | null;
    type ChangeEventHandler = EventHandler<ChangeEvent<HTMLSelectElement>>;

    const eventHandler1: GlobalEventHandlers["onchange"] = (e) => {
        e.target; //일반 Event는 target이 없음
    };

    const eventHandler2: ChangeEventHandler = (e) => {
        e.target; //리액트 이벤트(합성 이벤트)는 target이 있음
    };

    // 리액트 제공 기본 컴포는트도 SelectProps 처럼 각각 props에 대한 타입 명시
    // 이벤트 핸들러도 해당 타입을 일치시켜야함
    // React.ChangeEventHandler<HTMLSelectElement> 타입은 React.EventHandler<ChangeEvent<HTMLSelectElement>>와 동일 타입

    // ChangeEvent<HTMLSelectElement> 타입의 이벤트를 매개변수로 받아 해당 이벤트를 처리하는 핸들러
    const Select = ({onChnage, options, selectedOption}: SelectProps) => {
        const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
            const selected = Object.entries(options).find(
                ([_, value]) => value === e.target.value
            )?.[0];
        };

        return (
            <select onChange={handleChange}>
                {/** ... */}
            </select>
        );
    };
}

{
    // Select 컴포넌트를 사용하여 과일 선택 컴포넌트 
    // useState 같은 함수 역시 타입 매개변수를 지정해서 반환되는 state 타입을 지정해 줄 수 있다
    // 제네릭 타입을 명시하지 않으면 타입스크립트 컴파일러는 초깃값(default value)의 타입을 기반으로 state 타입을 추론한다
    const fruits = {
        apple: "사과",
        banana: "바나나",
        blueberry: "블루베리",
    };

    const FruitSelect: VFC = () => {
        const [fruit, changeFruit] = useState<string | undefined>();

        return (
            <Select onChange={changeFruit} options={fruits} selectedOptions=
        )
    }
}