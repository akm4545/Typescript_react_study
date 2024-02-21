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