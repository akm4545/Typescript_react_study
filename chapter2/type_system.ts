{
    // 타입스크립트의 타입 선언 방식
    // 변수 이름 뒤에: type 구문을 붙여 데이터 타입 명시
    let isDone: boolean = false;
    let decimal: number = 6;
    let color: string = "blue";
    let list: number[] = [1, 2, 3];
    let x: [string, number]; //tuple
}

{
    // 타입스크립트는 구조로 타입을 구분한다 (구조적 타이핑)
    interface Developer{
        faceValue: number;
    }

    interface BankNote{
        faceValue: number;
    }

    let developer: Developer = {faceValue: 52};
    let bankNote: BankNote = {faceValue: 10000};

    // 공통으로 faceValue 인터페이스를 가지고 있으므로 호환 가능
    developer = bankNote //ok
    bankNote = developer //ok
}


{
    // 타입스크립트에서는 특정 값이 string 또는 number타입을 동시에 가질 수 있다
    type stringOrNumber = string | number;
}


{
    // 구조적 서브타이핑 
    // 객체가 가지고 있는 속성을 바탕으로 타입을 구분
    // 이름이 다른 객체라도 가진 속성이 동일하다면 타입스크립트는 서로 호환이 가능한 동일 타입으로 간주
    interface Pet {
        name: string;
    }

    interface Cat {
        name: string;
        age: number;
    }

    let pet: Pet;
    let cat: Cat = {name: "Zag", age: 2};

    // 타입이 서로 다르지만 같은 name 속성을 가지고 있어서 할당 가능
    pet = cat;
}


{
    // greet 함수의 매개변수에 들어갈 수 있는 값은 Pet타입으로 제한되어 있다
    // 그러나 타입을 명시하지 않은 cat객체를 전달 가능하다
    // cat 객체는 Pet 인터페이스가 가지고 있는 name속성이 있으므로 pet.name 방식으로 name값에 접근할 수 있기 때문
    interface Pet {
        name: string;
    }

    let cat = {name: "Zag", age: 2};

    function greet(pet: Pet){
        console.log("Hello, " + pet.name);
    }

    greet(cat); //ok
}


{
    // Developer 클래스가 Person 클래스를 상속받지 않았는데도 greet(developer)는 정상작동한다
    // Developer는 Person이 갖고 있는 속성을 가지고 있기 때문이다
    // 서로 다른 두 타입 간의 호환성은 오로지 타입 내부의 구조에 의해 결정된다
    // 타입이 계층 구조로부터 자유롭다
    class Person {
        name: string;
        age: number;
    
        constructor(name: string, age: number){
            this.name = name;
            this.age = age;
        }
    }
    
    class Developer {
        name: string;
        age: number;
        sleepTime: number;
    
        constructor(name: string, age:number, sleepTime: number){
            this.name = name;
            this.age = age;
            this.sleepTime = sleepTime;
        }
    }
    
    function greet2(p: Person) {
        console.log(`Hello, I'm ${p.name}`);
    }

    const developer = new Developer("zig", 20, 7);

    greet2(developer); // Hello, I'm zig
}

{
    interface Cube {
        width: number;
        height: number;
        depth: number;
    }

    function addLines(c: Cube){
        let total = 0;

        for(const axis of Object.keys(c)){
            const length = c[axis];

            total += length;
        }
    }

    // 구조적 타이핑의 특징 때문에 예기치 못한 결과가 발생한다
    // Cube의 값을 모두 가지고 있기 때문에 Cube 타입으로 인정받지만 추가된 필드를 제한하지 못해 
    // 아래 함수를 실행하면 에러가 발생한다
    const namedCube = {
        width: 5,
        height: 5,
        depth: 4,
        name: "SweetCube"
    };

    addLines(namedCube);
}

{
    function add(x, y){
        return x + y;
    }

    // 위 코드는 아래와 같이 암시적 타입 변환이 일어난다
    // 이처럼 타입스클비트에서는 필요에 따라 타입을 생략할 수도 있고 타입을 점진적으로 추가할 수도 있다
    // 타입스크립트는 컴파일타임에 프로그램의 모든 타입을 알고 있을 때 최상의 결과를 보여준다
    // 타입스크립트는 자바스크립트의 슈퍼셋 언어이기 때문에 모든 자바스크립트 코드는 타입스크립트 코드라고 봐도 무방하다
    //function add(x: any, y: any): any;

    // any 타입은 타입스크립트 내 모든 타입의 종류를 포함하는 가장 상위 타입
    // 컴파일 옵션이 noImplicaitAny 값이 true일때는 에러가 발생
}

{
    // 정적 타입의 정확성을 100% 보장하지 않아 타입이 올바르게 정해지지 않으면 런타임에서 에러가 발생하기도 한다
    const names = ["zig", "colin"];
    console.log(names[2].toUpperCase());
    //TypeError: Cannot read property 'toUpperCase' of undefined
}

{
    // 모든 자바스크립트 코드는 타입스크립트라고 볼 수 있지만 역은 성립하지 않는다
    // 따라서 해당 코드를 자바스크립트에서 실행하면 에러가 발생한다
    function greet3(name: string){
        console.log("Hello", name);
    }

    // 타입스크립트 컴파일러는 타입스크립트뿐만 아니라 자바스크립트 프로그램에서도 유용하게 사용할 수 있다
    // 해당 코드를 타입스크립트 컴파일러로 실행하면 초깃값으로 타입을 추론하여 toUppercase 대신 toUpperCase 메서도르 대체할 것을 제안한다
    // let developer = "Colin";
    // console.log(developer.toUppercase());
}

{
    // type 또는 interface 키워드로 커스텀 타입을 정의할 수 있다
    type Person = {
        name: string;
        age: number;
    };

    interface Person {
        name: string;
        age: number;
    }
}

{
    // 값 공간과 타입 공간의 이름은 서로 충돌하지 않기 때문에 타입과 변수를 같은 이름으로 정의할 수 있다
    // 타입스크립트 문법 type으로 선언한 내용은 자바스크립트 런타임에서 제거되기 떄문이다
    type Developer = {isWorking: true};
    const Developer = {isTyping: true};

    type Cat = {name: string, age: number};
    const Cat = {slideStuffOffTheTable: true};
}

{
    function email(options: {person: Person; subject: string; body: string}){

    }

    // 자바스크립트의 구조 분해 할당을 사용시 
    function email({person, subject, body}{

    })

    // 타입스크립트로 구조 분해 할당을 사용시
    function email({
        person,
        subject,
        body,
    } : {
        person: Person;
        subject: string,
        body: string,
    }) {

    }
}

{
    // 자바스크립트에서 클래스는 객체 인스턴스를 더욱 쉽게 생성하기 위한 문법 기능으로 실제 동작은 함수와 같다
    // 동시에 클래스는 타입으로도 사용된다
    class Rectangle {
        constructor(height, width){
            this.height = height;
            this.width = width;
        }
    }

    const rect1 = new Rectangle(5, 4);

    // 타입스크립트 코드에서 클래스는 값과 타입 공간 모두에 포함될 수 있다
    // 타입스크립트에서 클래스는 타입 애너테이션으로 사용할 수 있지만 런타임에서 객체로 변환되어 자바스크립트의 값으로 사용된다
    class Developer {
        name: string;
        domain: string;

        constructor(name: string, domain: string){
            this.name = name;
            this.domain = domain;
        }
    }

    const me: Developer = new Developer("zig", "frontend");
}

{
    // 클래스와 마찬가지로 타입스크립트 문법인 enum 역시 런타임에 객체로 변환되는 값이다
    // enume도 클래스처럼 타입 공간에서 타입을 제한하는 역할을 하지만 자바스크립트 런타임에서 실제 값으로도 사용될 수 있다
    enum WeekDays {
        MON = "Mon",
        TUES = "Tues",
        WEDNES = "Wednes",
        THURS = "Thurs",
        FRI = "Fri",
    }

    // 해당 구문으로 나온 타입은 유니온 타입이 된다
    // type 'MON' | 'TUES' ...
    // enum을 keyof typeof를 사용하여 유니온 타입으로 만들어 값을 제한하는 코드
    type weekDaysKey = keyof typeof WeekDays;

    function printDay(key: weekDaysKey, message: string){
        const day = WeekDays[key];

        if(day <= WeekDays.WEDNES){
            console.log(`It's still ${day}day, ${message}`);
        }
    }

    printDay("TUES", "wanna go home");
}

{
    enum MyClolors{
        BLUE = "#0000FF",
        YELLOW = "#FFFF00",
        MINT = "#2AC1BC",        
    }

    // palette = MINT 속성을 갖는 객체 
    function whatMintColor(palette: {MINT: string}){
        return palette.MINT;
    }

    // MyClolors = MINT 속성을 가지고 있기 때문에 코드가 정상적으로 실행된다
    whatMintColor(MyClolors);

    // 타입스크립트에서 어떠한 심볼이 값으로 사용된다는 것은 컴파일러를 사용해서 타입스크립트 파일을 자바스크립트 파일로 변환해도 
    // 여전히 자바스크립트 파일에 해당 정보가 남아있음을 의미한다 
    // 반면 타입으로만 사용되는 요소는 컴파일 이후에 자바스크립트 파일에서 해당 정보가 사라진다
}
