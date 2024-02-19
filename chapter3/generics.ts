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

    // 제네릭을 상단과 같이 선언하면 하나의 여러 타입을 받을 수 있지만 2개 이상의 제네릭은 받을 수 없다
    // 하단과 같이선언하면 제네릭을 여러개 사용할 수 있다
    export class APIResponse<Ok, Err = string> {
        private readonly data: Ok | Err | null;
        private readonly status: ResponseStatus;
        private readonly statusCode: number | null;

        constructor(
            data: Ok | Err | null,
            statusCode: number | null,
            status: ResponseStatus
        ) {
            this.data = data;
            this.status = status;
            this.statusCode = statusCode;
        }

        public static Success<T, E = string>(data: T): APIResponse<T, E> {
            return new this<T, E>(data, 200m ResponseStatus.SUCCESS);
        }

        public static Error<T, E = unknown>(init: AxiosError): APIResponse<T, E> {
            if(!init.response){
                return new this<T, E>(null, null, ResponseStatus.CLIENT_ERROR);
            }

            if(!init.response.data?.result){
                return new this<T, E>(
                    null,
                    init.response.status,
                    ResponseStatus.SERVER_ERROR
                );
            }

            return new this<T, E>(
                init.response.data.result,
                init.response.status,
                ResponseStatus.FAILURE
            );
        }

        //...
    }

    // 사용하는쪽 코드
    const fetchShopStatus = async(): Promise<APIResponse<IShopResponse | null>> => {
        //...
        return (await API.get<IShopResponse | null>("/v1/main/shop", config)).map((it) => it.result);
    };
}

{
    //  제네릭의 장점은 다양한 타입을 받게 함으로써 코드를 효율적으로 재사용할 수 있는 것이다
    // 실무에서느 API 응답 값의 타입을 지정할때 많이 쓴다

    // 응답값에 따라 달라지는 data를 제네릭 타입으로 사용하는 예시
    export interface MobileApiResponse<Data> {
        data: Data;
        statusCode: string;
        statusMessage?: string;
    }

    export const fetchPriceInfo = (): Promise<MobileApiResponse<PriceInfo>> => {
        const priceUrl = "https: ~~"; //url 주소

        return request({
            method: "GET",
            url: priceUrl,
        });
    };

    export const fetchOrderInfo = (): Promise<MobileApiResponse<Order>> => {
        const orderUrl = "https: ~~"; //url 주소

        return request({
            method: "GET",
            url: orderUrl,
        });
    }

    // 제네릭 타입을 굳이 필요하지 않은데 사용한 예시
    type GType<T> = T;
    type RequirementType = "USE" | "UN_USE" | "NON_SELECT";

    interface Order {
        getRequirement(): GType<RequirementType>;
    }

    // 해당 코드는 아래처럼 사용 가능
    type RequirementType = "USE" | "UN_USE" | "NON_SELECT";

    interface Order {
        getRequirement(): GType<RequirementType>;
    }
}

{
    // any를 사용하면 모든 타입을 허용하기 때문에 사실상 자바스크립트와 동일한 방식으로 코드를 작성한는것과 같다
    type ReturnType<T = any> = {
        //...
    };
}

{
    // 가독성을 고쳐하지 않은 사용
    // 제네릭이 과하게 사용되면 가독성을 해치기 때문에 부득이한 상황을 제외하고 복잡한 제네릭은 의미 단위로 분할해서 사용
    ReturnType<Record<OrderType, Partial<Record<CommonOrderStatus | CommonReturnStatus, Partial<Record<OrderRoleType, String[]>>>>>>;

    // 분할 사용 예시
    type CommonStatus = CommonOrderStatus | CommonReturnStatus;

    type PartialOrderRole = Partial<Record<OrderRoleType, string[]>>;

    type RecordCommonOrder = Record<CommonStatus, PartialOrderRole>;

    type RecordOrder = Record<OrderType, Partial<RecordCommonOrder>>;

    ReturnType<RecordOrder>;
}