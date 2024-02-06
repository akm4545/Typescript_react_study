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




