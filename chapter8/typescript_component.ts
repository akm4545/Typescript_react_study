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
}