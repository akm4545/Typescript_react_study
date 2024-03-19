{
    // Record타입 = Record<키, 값> -> 해당 키와 값을 가진 타입 생성

    // Categor 타입은 string
    type Category = string;
    
    interface Food{
        name: string;
        //...
    }

    // foodByCatogory객체는 Category를 Record의 키로 사용하므로 무한한 키 집합을 가지게 된다
    const foodByCategory: Record<Category, Food[]> = {
        한식: [{name: "제육덮밥"}, {name: "뚝배기 불고기"}],
        일식: [{name: "초밥"}, {name: "텐동"}],
    };

    foodByCategory["양식"]; //Food[]로 추론 실제로 없는 값이지만 키값이 string이므로 에러가 발생하지 않는다

    //에러가 발생하지 않는다
    //하지만 런타임에서는 undefined가 되어 오류를 반환한다
    foodByCategory["양식"].map((food) => console.log(food.name)); 

    // 옵셔널 체이닝 (optional chaining)
    // 객체의 속성을 찾을 때 중간에 null 또는 undefined가 있어도 오류 없이 안전하게 접근하는 방법
    // ?. 문법으로 표현되며 옵셔널 체이닝 사용시 중간에 null 또는 undefined인 속성이 있는지 검사
    // 속성이 존재하면 해당 값을 반환하고 존재하지 않으면 undefined 반환
    // 어떤 값이 undefined인지 매번 판단해야 한다는 번거로움이 생김
    // 실수로 undefined일 수 있는 값을 인지하지 못하고 코드를 작성하면 예상치 못한 런타임 에러가 발생

    foodByCategory["양식"]?.map((food) => console.log(food.name));
}


