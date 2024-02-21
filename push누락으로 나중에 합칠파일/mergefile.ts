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
}