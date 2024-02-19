{
    // 두 개의 타입의 멤버를 모두 합쳐 새로운 타입을 만들 수 있다
    type ProductItem = {
        id: number;
        name: string;
        type: string;
        price: number;
        imageUrl: string;
        quantity: number;
    };

    // & 연산자를 사용하여 교차타입을 만든다
    type ProductItemWithDiscount = ProductItem & {discountAmount: number};
}

{
    // 두 개의 타입 모두 받아들 수 있는 타입을 만들 수 있다
    type ProductItem = {
        id: number;
        name: string;
        type: string;
        price: number;
        imageUrl: string;
        quantity: number;
    };

    type CardItem = {
        id: number;
        name: string;
        type: string;
        imageUrl: string;
    };

    // | 연산자를 사용하여 유니온 타입을 만든다 (ProductItem OR CardItem)
    type PromotionEventItem = ProductItem | CardItem

    const printPromotionItem = (item: PromotionEventItem) => {
        console.log(item.name);

        // cardItem 타입에는 quantity 가 없으므로 컴파일 에러 발생
        console.log(item.quantity);
    }

    // 교차타입이나 유니온 타입은 여러 줄에 걸쳐 표기할 수도 있는데 이럴경우 각 줄의 맨 앞에 & 혹은 | 를 붙인다
    type PromotionEventItem2 = 
    | ProductItem
    | CardItem;
}

{
    // 인덱스 시그니처는 특정 타입의 속성 이름은 알 수 없지만 속성값의 타입을 알고 있을때 사용
    // [key: 타입(키의 타입)]: 타입(값의 타입) 으로 쓴다
    interface IndexSignatureEx {
        [key: string]: number;
    }

    // 인덱스 시그니처를 선언할 때 다른 속성을 추가로 명시할 수 있다
    // 추가로 명시된 속성은 인덱스 시그니처에 포함되는 타입이어야 한다
    interface IndexSignatureEx2 {
        // 추후 추가 속성은 number | boolean 값만 허용
        [key: string]: number | boolean;
        length: number;
        isValid: boolean;
        // string 값이기 때문에 에러
        name: string;
    }
}

{
    // 인덱스드 액세스 타입은 다른 타입의 특정 속성이 가지는 타입을 조회하기 위해 사용
    type Example = {
        a: number;
        b: string;
        c: boolean;
    };

    // 인덱스에 사용되는 타입 또한 그 자체로 타입이기 떄문에 유니온 타입, keyof, 타입 별칭 등의 표현을 사용 가능
    type IndexedAccess = Example["a"];
    // a | b 는 각각 number, string 타입이므로 유니온 타입이 된다
    type IndexedAccess2 = Example["a" | "b"]; // number | string
    type IndexedAccess3 = Example[keyof Example]; //number | string | boolean

    // ExAlias "b" 혹은 "c" 만 올 수 있다
    type ExAlias = "b" | "c";
    // Example의 b | c 타입은 string, boolean 이므로 stirng | boolean 타입이 된다
    type IndexedAccess4 = Example[ExAlias]; // string | boolean

    // 배열의 요소 타입을 조회하기 위해 인덱스드 액세스 타입을 사용하는 경우가 있다
    // 배열 타입의 모든 요소는 전부 동일한 타입을 가지며 배열의 인덱스는 숫자 타입이다
    const PromotionList = [
        {type: "product", name: "chicken"},
        {type: "product", name: "pizza"},
        {type: "card", name: "cheer-up"}
    ];

    // 따라서 number로 인덱싱하여 배열 요소를 얻은 다음에 typeof 연산자를 붙여주면 해당 배열 요소의 타입을 가져올 수 있다
    type ElementOf<T> = typeof T[number];
    //type PromotionItemType = {type: string; name: stirng;}
    type PromotionItemType = ElementOf<PromotionList>;
}

{
    // 맵드 타입
    // 다른 타입을 기반으로 한 타입을 선언할 때 사용하는 문법 
    // 인덱스 시그니처 문법을 사용해서 반복적인 타입 선언을 효과적으로 줄일 수 있다
    type Example = {
        a: number;
        b: string;
        c: boolean;
    };

    // SubSet<타입>
    type Subset<T> = {
        // [in = for in]
        // [Example의 키값을 뽑음]? : Example[키값] = (인덱스 시그니처 문법 = 타입 추출)
        [K in keyof T]?: T[K];
    };

    // 즉 Subset으로 뽑힌 타입은 기존 Example의 데이터 셋을 따라가되 옵셔널을 사용해서 꼭 속성이 다 들어가지 않아도 된다
    const aExample: Subset<Example> = {a: 3};
    const bExample: Subset<Example> = {b: "hello"};
    const acExample: Subset<Example> = {a: 4, c: true};
    

    // 맵드 타입은 ?, readonly를 붙이는것 외에도 제거하는것도 가능하다
    type ReadOnlyEx = {
        readonly a: number;
        readonly b: string;
    };

    // 앞에 - 를 붙이면 제거 가능
    type CreateMutable<Type> = {
        -readonly [Property in keyof Type]: Type[Property];
    };

    type ResultType = CreateMutable<ReadOnlyEx>; // {a: number; b: string}

    type OptionalEx = {
        a?: number;
        b?: string;
        c: boolean;
    };

    type Concrete<Type> = {
        [Property in keyof Type]-?: Type[Property];
    };

    type ResultType = Concrete<OptionalEx>; // {a: number; b: string, c: boolean}
}

{
    // 배민 예시 맵드타입
    const BottomSheetMap = {
        RECENT_CONTACTS: RecentContactsBottomSheet,
        CARD_SELECT: CardSelectBottomSheet,
        SORT_FILTER: SortFilterBottomSheet,
        PRODUCT_SELECT: ProductSelectBottomSheet,
        REPLY_CARD_SELECT: ReplyCardSelectBottomSheet,
        RESEND: ResendBottomSheet,
        STICKER: StickerBottomSheet,
        BASE: null,
    };

    export type BOTTOM_SHEET_ID = keyof typeof BottomSheetMap;

    // 불필요한 반복
    type BottomSheetStore = {
        RECENT_CONTACTS: {
            resolver?: (payload: any) => void;
            args?: any;
            isOpened: boolean;
        };
        CARD_SELECT: {
            resolver?: (payload: any) => void;
            args?: any;
            isOpened: boolean;
        };
        SORT_FILTER: {
            resolver?: (payload: any) => void;
            args?: any;
            isOpened: boolean;
        };
        //...
    }

    //Mapped Types를 통해 효율적으로 타입을 선언
    type BottomSheetStore = {
        [index in BOTTOM_SHEET_ID]: {
            resolver?: (payload: any) => void;
            args?: any;
            isOpened: boolean;
        };
    };

    // as를 붙여 새로운 키를 지정하는것도 가능
    type BottomSheetStore = {
        [index in BOTTOM_SHEET_ID as `${index}_BOTTOM_SHEET`]: {
            resolver?: (payload: any) => void;
            args?: any;
            isOpened: boolean;
        };
    };
}

{
    //템플릿 리터럴 타입
    // 템플릿 리터럴 문자열을 사용하여 문자열 리터럴 타입을 선언할 수 있다
    type Stage = 
        | "init"
        | "select-image"
        | "edit-image"
        | "decorate-card"
        | "capture-image";

    type StageName = `${Stage}-stage`;
    // 'init-stage' | 'select-image-stage' | 'edit-image-stage' ...
}

{
    // 제네릭 타입 
    // 보통 변수명으로 T(Type), E(Element), K(Key), V(Value)등 사용
    type ExampleArrayType<T> = T[];

    const array1: ExampleArrayType<string> = ["치킨", "피자", "우동"];

    // any 타입과의 차이점
    type ExampleArrayType2 = any[];

    const array2: ExampleArrayType2 = [
        "치킨",
        {
            id:0,
            name: "치킨",
            price: 20000,
            quantity: 1
        },
        99,
        true
    ];

    // 제네릭 함수 호출시 <>안에 무조건 타입을 명시해야 하는것은 아니다
    // 타입을 명시하는 부분을 생략하면 컴파일러가 인수를 보고 타입을 추론해준다
    function exampleFunc<T>(arg: T): T[]{
        return new Array(3).fill(arg);
    }

    exampleFunc("hello"); //T는 string으로 추론된다

    // 특정 요소 타입을 알 수 없을 때는 제네릭 타입에 기본값을 추가할 수 있다
    interface SubmitEvent<T = HTMLElement> extends SyntheticEvent<T> {
        submitter: T;
    }

    // 제네릭은 어떤 타입이든 될 수 있으므로 특정 타입에만 존재하는 멤버를 참조하려 하면 안된다
    function exampleFunc2<T>(arg: T): number{
        return arg.length; //에러
    }

    // 제네릭 꺾쇠괄호 내부의 length 속성을 가진 타입만 받는다 라는 제약을 걸어주면 length 속성을 사용할 수 있다
    interface TypeWithLength{
        length: number;
    }

    function exampleFunc3<T extends TypeWithLength>(arg: T): number{
        return arg.length;
    }

    // 제네릭 사용시 파일 확장자가 tsx일때 화살표 함수에 제네릭을 사용하면 에러가 발생한다
    // tsx = 타입스크립트 + JSX 이므로 제네릭의 꺾쇠괄호와 태그의 꺾쇠괄호를 혼동하여 문제가 생긴다

    // 에러
    const arrowExampleFunc = <T>(arg: T): T[] => {
        return new Array(3).fill(arg);
    };

    // 이럴경우 제네릭 부분에 extends 키워드를 사용하여 컴파일러에게 특정 타입의 하위 타입만 올 수 있음을 확실히 알려주면 된다
    // 보통 제네릭을 사용할 때는 function 키워드로 선언하는 경우가 많다
    const arrowExampleFunc2 = <T extends {}> (arg: T): T[] => {
        return new Array(3).fill(arg);
    }
}