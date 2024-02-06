// 타입스크립트의 타입 선언 방식
// 변수 이름 뒤에: type 구문을 붙여 데이터 타입 명시
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let x: [string, number]; //tuple


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


// 타입스크립트에서는 특정 값이 string 또는 number타입을 동시에 가질 수 있다
type stringOrNumber = string | number;


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


interface Pet {
    name: string;
}

cat = {name: "Zag", age: 2};

function greet(pet: Pet){
    console.log("Hello, " + pet.name);
}

greet(cat); //ok

