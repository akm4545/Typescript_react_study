{
    // 타입 확장은 코드 중복을 줄일 수 있다

    // 메뉴 요소 타입 = 메뉴 이름, 이미지, 할인율, 재고 정보를 담고 있다
    interface BaseMenuItem{
        itemName: string | null;
        itemImageUrl: string | null;
        itemDiscountAmount: Number;
        stock: number | null;
    }

    // 장바구니 요소 타입 = 메뉴 타입에 수량 정보가 추가되었다
    interface BaseCartItem extends BaseMenuItem {
        quantity: Number;
    }

    // type을 사용시 아래와 같이 확장하면 된다
    type BaseMenuItem2 = {
        itemName: string | null;
        itemImageUrl: string | null;
        itemDiscountAmount: Number;
        stock: number | null;
    }

    type BaseCartItem2 = {
        quantity: Number;
    } & BaseMenuItem2;

    // 타입 확장은 이 외에도 확장성이란 장점을 가지고 있다
    // BaseCartItem을 활용하면 요구 사항이 늘어날 때마다 새로운 CartItem 타입을 확장하여 정의할 수 있다

    // 장바구니 관련 요구 사항이 변경되어도 BaseCartItem 타입만 수정하고 EditableCartItem 외 등등은 수정할 필요가 없어 효율적이다

    // 수정할 수 있는 장바구니 요소 타입
    // 품절 여부, 수정할 수 있는 옵션 배열 정보가 추가되었다
    interface EditableCartItem extends BaseCartItem {
        isSoldOut: boolean;
        optionGroups: SelectableOptionGroup[];
    }

    // 이벤트 장바구니 요소 타입
    // 주문 가능 여부에 대한 정보가 추가되었다
    interface EventCartItem extends BaseCartItme{
        orderable: boolean;
    }
}

{
    // 유니온 타입으로 선언된 값은 유니온 타입에 포함된 모든 타입이 공통으로 갖고 있는 속성에만 접근 가능하다
    interface CookingStep {
        orderId: string;
        price: number;
    }

    interface DeliveryStep {
        orderId: string;
        time: number;
        distance: string;
    }

    // step 의 타입은 CookingStep 또는 DeliveryStep 타입이지 CookingStep 이면서 DeliveryStep인 것은 아니다
    function getDeliveryDistance(step: CookingStep | DeliveryStep){
        return step.distance;
    }
}

{
    // 교차타입 = 기존 타입을 합쳐 필요한 모든 기능을 가진 하나의 타입으로 만듦
    interface CookingStep{
        orderId: string;
        time: number;
        price: number;
    }

    interface DeliveryStep {
        orderId: string;
        time: number;
        distance: string;
    }

    // BeadalProgress = CookingStep, DeliveryStep 의 모든 속성을 가진 단일 타입이 된다
    type BeadalProgress = CookingStep & DeliveryStep;

    function logBeadalInfo(progress: BeadalProgress){
        console.log(`주문 금액: ${progress.price}`);
        console.log(`배달 거리: ${progress.distance}`);
    }


    // 공통된 속성이 없어도 교차 타입이 가능하다
    // 배달 팁
    interface DeliveryTip {
        tip: string;
    }

    // 별점
    interface StarRating{
        rate: number;
    }

    // 주문 필터
    type Filter = DeliveryTip & StarRating;

    const filter: Filter = {
        tip: "1000원 이하",
        rate: 4,
    };

    type IdType = string | number;
    type Numeric = number | boolean;

    type Universal = IdType & Numeric;

    // Universal 타입을 다음 4가지로 생각해 볼 수 있다
    // 1.string 이면서 number
    // 2.string 이면서 boolean
    // 3.number 이면서 number
    // 4.number 이면서 boolean

    // Universal은 IdType과 Numeric의 교차 타입이므로 두 타입을 모두 만족하는 경우에만 유지된다 
    // 따라서 1, 2, 4번은 성립되지 않고 3번만 유효하기 때문에 Universal의 타입은 number가 된다
}

{
    // 유니온이나 교차 타입을 사용한 새로운 타입은 오직 type 키워드로만 선언할 수 있다
    // 주의할 점은 extends 키워드를 사용한 타입이 교차 타입과 100% 상응하지 않는다

    // DeliveryTip의 tip 은 number 타입이라 Filter에서 확장한 tip은 호환되지 않아 에러가 발생한다
    interface DeliveryTip {
        tip: number;
    }

    interface Filter extends DeliveryTip {
        tip: string;
    }


    // 아래와 같이 작성하면 에러는 발생하지 않지만 타입은 never가 된다
    type DeliveryTip2 = {
        tip: number;
    };

    type Filter2 = DeliveryTip2 & {
        tip: string;
    };
}

{
    // 메뉴에 대한 타입 
    // 메뉴 이름과 메뉴 이미지에 대한 정보를 담고 있다
    interface Menu{
        name: string;
        image: string;
    }

    // 메뉴 타입으로 화면 렌더링
    function MainMenu() {
        // Munu 타입을 원소로 갖는 배열
        const menuList: Menu[] = [{name: "1인분", image: "1인분.png"}]

        return (
            <ul>
                {menuList.map((menu) => (
                    <li>
                        <img src={menu.image} />
                        <span>{menu.name}</span>
                    </li>
                ))}
            <ul>
        )
    }

    // 이때 특정 메뉴의 중요도를 다르게 주기 위한 요구사항이 추가된다면
    // 1. 특정 메뉴를 길게 누르면 git 파일이 재생
    // 2. 특정 메뉴는 이미지 대신 별도의 텍스트만 노출

    // 요구사항을 만족하는 타입을 정의한다면
    
    // 방법1 타입 내에서 속성 추가
    // 기존 Menu 인터페이스에 추가된 정보를 전부 추가
    interface Menu1{
        name: string;
        image: string;
        gif?: string; //요구사항 1. 특정 메뉴의 git 재생
        text?: string; //요구사항 2. 특정 메뉴는 이미지 대신 텍스트
    }

    // 방법2 타입 확장 활용
    // 기존 Menu 인터페이스는 유지한 채, 각 요구사항에 따른 별도 타입을 만들어 확장

    // git메뉴
    interface SpecialMenu extends Menu {
        gif: string;
    }

    // 텍스트메뉴
    interface PackageMenu extends Menu {
        text: string;
    }

    // 서버에서 받아온 데이터로 가정
    const menuList = [
        {name: "찜", image: "찜.png"},
        {name: "찌개", image: "찌개.png"},
        {name: "회", image: "회.png"},
    ];

    const specialMenuList = [
        {name: "돈까스", image: "돈까스.png", gif: "돈까스.gif"},
        {name: "피자", image: "피자.png", gif: "피자.gif"},
    ];

    const packageMenuList = [
        {name: "1인분", image: "1인분.png", text: "1인 가구 맞춤형"},
        {name: "족발", image: "족발.png", text: "오늘은 족발로 결정"},
    ];

    // 1번 방식으로 타입을 설정했을 시
    // 각 메뉴 목록은 Menu[]로 표현할 수 있다
    menuList: Menu1[] //ok
    specialMenuList: Menu1[] //ok
    packageMenuList: Menu1[] //ok

    // specialMenuList 배열에 원소가 각 속성에 접근한다면 에러가 살생한다 
    // 해당 타입은 text가 없어 에러
    specialMenuList.map((menu) => menu.text);

    // 2번 방식으로 타입을 설정했을 시
    menuList: Menu[] //ok

    specialMenuList: Menu[] //not ok
    specialMenuList: SpecialMenu[] //ok

    packageMenuList: Menu[] //not ok
    packageMenuList: PackageMenu[] //ok

    // 이를 바탕으로 specialMenuList 배열의 원소 내 속성에 동일하게 접근한다고 가정해도
    // 프로그램을 실행하지 않고도 타입을 체크할 수 있다
    specialMenuList.map((menu) => menu.text);

    // 주어진 타입에 무분별하게 속성을 추가하는것보다 타입을 확장해서 사용하는 것이 좋다
    // 적절한 네이밍으로 타입의 의도를 명확히 표현할 수 있고 코드 작성 단계에서 버그도 예방할 수 있다
}