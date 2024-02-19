{
    // 어떤 함수의 매개변수나 반환값에 다양한 타입을 넣고 싶을 때 제네릭을 사용할 수 있다
    function ReadOnlyRepository<T>(target: ObjectType<T> | EntitySchema<T> | string): Repository<T> {
        return getConnection("ro").getRepository(target);
    }
}

{
    // 호출 시그니처 = 타입스크립트의 함수 타입 문법으로 함수의 매개변수와 반환타입을 미리 선언
    // 호출 시그니처를 사용할때 제네릭 타입을 어디에 위치시키는지에 따라 타입의 범위와 제네릭 타입을 언제 구체 타입으로 한정할지를 결정할 수 있다
    // 해당 함수를 사용할때 제네릭 타입을 구체 타입으로 한정한다 useSelectPaginationProps<T>
    interface useSelectPaginationProps<T> {
        categoryAtom: RecoilState<number>;
        filterAtom: RecoilState<stirng[]>;
        sortAtom: RecoilState<SortType>;
        fetcherFunc: (props: CommonListRequest) => Promise<DefaultResponse<ContentListResponse<T>>>;
    }

    // 호출 시그니처의 일부 (괄호 앞)에 선언했기 떄문에 UseRequesterHookType 타입의 함수를 실제 호출할 때 제네릭 타입을 구체 타입으로 한정
    export type UseRequesterHookType = <RequestData = void, ResponseData = void>(
        baseURL?:
            string | Headers,
            defaultHeader?: Headers
    ) => [RequestStatus, Requester<RequestData, ResponseData>];
}

{
    // 제네릭 클래스 
    // 외부에서 입력된 타입을 클래스 내부에 적용 가능 
    // 해당 코드에서 T 타입은 
    // {
    // key: string; 
    // value: Promise<Record<string, unknown>>;
    // cacheTTL: number
    // }
    // 가 된다
    class LocalDB<T>{
        //...
        async put(table: string, row: T): Promise<T>{
            return new Promise<T>((resolved, rejected) => {
                //T 타입의 데이터를 DB 저장
            });
        }

        async get(table: string, key: any): Promise<T> {
            return new Promise<T>((resolved, rejected) => {
                // T 타입의 데이터를 DB에서 가져옴
            });
        }

        async getTable(table: string): Promise<T[]> {
            return new Promise<T[]> ((resolved, rejected) => {
                // T[] 타입의 데이터를 DB에서 가져옴
            });
        }
    }

    export default class IndexedDB implements ICacheStore {
        private _DB?: LocalDB<{
            key: string; 
            value: Promise<Record<string, unknown>>;
            cacheTTL: number}>;
        
        private DB() {
            if(!this._DB){
                this._DB = new LocalDB("localCache", {
                    ver: 6, 
                    tables: [{
                        name: TABLE_NAME, 
                        keyPath: "key"}]
                });

                return this._DB;
            }

            //...
        }
    }
}

{
    // 제한된 제네릭 
    // key를 string 타입으로 제한하려면
    // Key extends string 로 사용하면 된다
    // 이처럼 타입 매개변수가 특정 타입으로 묶였을 때 키를 바운드 타입 매개변수라고 부른다
    // 그리고 string을 키의 상한 한계라고 한다
    type ErrorRecord<Key extends string> = Exclude<Key, ErrorCodeType> extends never
        ? Partial<Record<Key, boolean>>
        : never;

    // 상속받을 수 있는 타입으로는 기본 타입뿐만 아니라 상황에 따라 인터페이스나 클래스도 사용할 수 있다
    // 또한 유니온 타입을 상속해서 선언할 수도 있다
    function useSelectPagination<T extends CardListContent | CommonProductResponse> ({
        filterAtom,
        sortAtom,
        fetcherFunc,
    }: useSelectPaginationProps<T>) : {
        intersectionRef: RefObject<HTMLDivElement>;
        data: T[];
        categoryId: number;
        isLoading: boolean;
        isEmpty: boolean;
    } {
        //...
    }

    // 사용하는 쪽 코드
    const {intersectionRef, data, isLoading, isEmpty} = useSelectPagination<CardListContent>({
        categoryAtom: replyCardCategoryIdAtom,
        filterAtom: replyCardFilterAtom,
        sortAtom: replyCardSortAtom,
        fetcherFunc: fetchReplyCardListByThemeGroup,
    });
}

{
    // 타입을 이런 식으로 제약해버리면 제네릭의 유연성을 잃어버린다
    <Key extends string>

    // 제네릭의 유연성을 잃지 않으면서 타입을 제약해야 할 때는 타입 매개변수에 유니온 타입을 상속해서 선언하면 된다
    <Key extends string | number>
}