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

{
    interface BasicNoticeDialogProps{
        noticeTitle: string;
        noticeBody: string;
    }

    interface NoticeDialogWithCookieProps extends BasicNoticeDialogProps {
        cookieKey: string;
        noForADay?: boolean;
        neverAgain?: boolean;
    }

    export type NoticeDialogProps = 
        | BasicNoticeDialogProps
        | NoticeDialogWithCookieProps;

    // NoticeDialogProps 타입이 BasicNoticeDialogProps인지 NoticeDialogWithCookieProps인지에
    // 따라 렌더링 하는 컴포넌트가 달라지도록 하고 싶다면

    // in 연산자는 A in B의 형태로 사용 A라는 속성이 B 객체에 존재하는지 검사
    const NoticeDialog: React.FC<NoticeDialogProps> = (props) => {
        // NoticeDialogWithCookieProps 타입 반횐
        if("cookieKey" in props) return <NoticeDialogWithCookie {...props} />;
        
        // 얼리 리턴 (Early return) = 특정 조건에 부합하지 않으면 바로 반환
        // 떄문에 BasicNoticeDialogProps x타입
        return <NoticeDialogBase {...props} />;
    }
}

{
    // is 연산자 = 타입 명제 함수를 정의할 때 사용 A is B 형식으로 작성
    // 타입 명제 = 함수의 반환 타입에 대한 타입 가드를 수행하기 위해 사용되는 특별한 형태의 함수
    // A = 매개변수 / B = 타입
    // 반환 타입을 타입 명제로 지정하면 반환 값이 참일 때 A 매개변수의 타입을 B 타입으로 취급한다

    // 해당 함수의 반환 타입은 x is DestinationCode
    // 함수가 사용되는 곳의 타입을 추론할 때 해당 조건을 타입 가드로 사용하도록 알려준다
    // 불리언 값을 반환해야 한다
    // 조건을 만족하면 true를 반환하고 반환값은 is 뒤의 타입을 가지게 된다
    const isDestinationCode = (x: string): x is DestinationCode => destinationCodeList.includes(x);

    const getAvailableDestinationNameList = async (): Promise<DestinationName[]> => {
        // 데이터를 받아옴
        const data = await AxiosRequest<string[]>("get", ".../destinations");
        // destinationNames을 빈 배열로 초기화
        const destinationNames: DestinationName[] = [];
        data?.forEach((str) => {
            // is 키워드로 만든 함수를 호출 후 true/false에 따라 해당 스코프 
            // 안에서 str이 DestinationCode로 취급되는듯 하다
            if(isDestinationCode(str)){
                destinationNames.push(DestinationNameSet[str]);
                // isDestinationCode의 반환 값에 is를 사용하지 않고 boolean이라고 한다면 다음 에러가 발생
                // Element implicitly has an 'any' type because expression of type 'string' cant't....

            }
        });

        return destinationNames;
    }
}