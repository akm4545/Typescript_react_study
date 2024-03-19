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

{
    //키가 유한한 집합이라면 유닛 타입(다른 타입으로 쪼개지지 않고 오직 하나의 정확한 값을 가지는 타입)을 사용

    type Category = "한식" | "일식";

    interface Food {
        name: string;
        //...
    }

    const foodByCategory: Record<Category, Food[]> = {
        한식: [{name: "제육덮밥"}, {name: "뚝배기 불고기"}],
        일식: [{name: "초밥"}, {name: "텐동"}],
    };

    // 카테고리로 한식 또는 일식만 올 수 있기 때문에 양식을 키로 사용하면 에럭 ㅏ발생한다
    // Property '양식' does not exist on type Record<Category, Food[]>;
    foodByCategory["양식"];
}

{
    // 키가 무한한 상황에서는 Partial을 사용하여 해당 값이 undefined일 수 있는 상태임을 표현할 수 있다
    // 객체 값이 undefined일 수 있는 경우에 Partial을 사용해서 PartialRecord 타입을 선언하고 객체를 선언할 때 이것을 활용할 수 있다
    // Partial<B>는 B 타입을 옵셔널로 만든다 따라서 {[key]? : undefined}와 같다
    type PartialRecord<K extends string, T> = Partial<Record<K, T>>;
    type Category = string;

    interface Food{
        name: string;
        //...
    }

    const foodByCategory: PartialRecord<Category, Food[]> = {
        한식: [{name: "제육덮밥"}, {name: "뚝배기 불고기"}],
        일식: [{name: "초밥"}, {name: "텐동"}],
    };

    // 타입스크립트는 foodByCategory[key]를 Food[] 또는 undefined로 추론하고 개발자에게 이 값은 undefined일 수 있으니 해당 값에 대한 처리가 필요하다고 표시한다
    // 개발자는 안내를 보고 옵셔널 체이닝을 사용하거나 조건문을 사용하는 등 사전에 조치할 수 있게 되어 예상치 못한 런타임 오류를 줄일 수 있다
    foodByCategory["양식"]; //Food[] 또는 undefined 타입으로 추론 
    foodByCategory["양식"].map((food) => console.log(food.name));  // Object is possibly 'indefined'
    foodByCategory["양식"]?.map((food) => console.log(food.name)); // OK
}
