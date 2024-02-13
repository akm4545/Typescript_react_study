{
    // object 타입은 가급적 사용하지 말자
    // 모든 값을 유동적으로 할당할 수 있어 정적 타이핑의 의미가 크게 퇴색된다
    // 원시 타입은 object 타입에 속하지 않는다
    function isObject(value: object){
        return (
            Object.prototype.toString.call(value).replace(/\[|\]|\s|object/g, "") === "Object"
        );
    }

    isObject({});
    isObject({name: "KG"});

    isObject(20); //false
    isObject("KG"); //false
}

{
    // ({}) = 객체 리터럴 방식으로 객체 생성
    const noticePopup: {title: string; description: string} = {
        title: "IE 지원 종료 안내",
        description: "2022.07.15일부로 배민상회 IE 부라우저 지원을 종료합니다."
    };

    const noticePopup: {title: string; description: string} = {
        title: "IE 지원 종료 안내",
        description: "2022.07.15일부로 배민상회 IE 부라우저 지원을 종료합니다.",
        // 지정한 타입에 존재하지 않으므로 오류
        startAt: "2022.07.15 10:00:00"
    };

    // 어떠한 값도 속성으로 할당 불가능
    const obj = {};
}

{
    // 배열 타입 제한
    const getCartList = async (cartId: number[]) => {
        const res = await CartApi.GET_CART_LIST(cartId);

        return res.getData();
    };

    getCartList([1000]);
    // 에러 string 타입이 들어감
    getCartList([1000, "1001"]);

    // 튜플 타입
    // 배열과 유사하지만 튜플의 대괄호 내부에는 선언 시점에 지정해준 타입 값만 할당 가능 
    // 원소 개수도 타입 선언 시점에 미리 정해진다
    const targetCodes: ["CATEGORY", "EXHIBITION"] = ["CATEGORY", "EXHIBITION"];
    //SALE은 저장 불가능
    const targetCodes: ["CATEGORY", "EXHIBITION"] = ["CATEGORY", "EXHIBITION", "SALE"];
}

{
    // 타입스크립트에서는 일반적으로 변수 타입을 명시적으로 선언하지 않아도 컴파일러가 자동으로 타입을 추론한다
    // 타입스크립트 컴파일러가 변수 사용 방식과 할당된 값의 타입을 분석해서 타입을 유추한다
    // 따라서 모든 변수에 타입을 일일이 명시적으로 선언할 필요가 없다
    // 어떤 방식을 따를것인지는 취향이나 팀의 컨벤션에 따르자
    type NoticePopupType = {
        title: string;
        description: string;
    };

    interface INoticePopup {
        title: string;
        description: string;
    }

    const noticePopup1: NoticePopupType = {...};
    const noticePopup2: INoticePopup = {...};
}