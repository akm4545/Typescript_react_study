{
    // typeof 연산자를 이용한 타입 가드
    // typeof는 복잡한 타입 검증에는 한계가 있으므로 원시 타입을 좁히는
    // 용도로만 사용

    // 반환 타입이 여러개일 수 있을때는 이렇게 쓰는듯
    const replaceHyphen: (date: string | Date) => string | Date  = (date) => {
        if(typeof date === "string"){
            //해당 분기시 date는 string
            return date.replace(/-/g, "/");
        }

        return date;
    };
}

{
    // instanceof 연산자는 인스턴스화된 객체 타입을 판별하는 타입 가드로 사용

    interface Range{
        start: Date;
        end: Date;
    }

    interface DatePickerProps{
        selectedDates?: Date | Range;
    }

    const DatePicker = ({selectedDates} : DatePickerProps) => {
        const [selected, setSelected] = useState(convertToRange(selectedDates));
        //...
    };

    // 해당 타입이 Date 타입이면 Range 타입으로 변환 아니면 그대로 리턴
    export function convertToRange(selected?: Date | Range): Range | undefined {
        return selected instanceof Date
            ? {start: selected, end: selected}
            : selected;
    }

    const onKeyDown = (event: React.KeyboardEvent) => {
        if(event.target instanceof HTMLInputElement && event.key === "Enter"){
            //해당 분기에서는 event.target의 타입이 HTMLInputElement 이며 
            // event.key 가 'Enter'다

            event.target.blur();
            onCTAButtonClick(event);
        }
    }
}