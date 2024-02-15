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