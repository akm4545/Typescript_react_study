{
    // Axios 라이브러리에서는 Axios에러에 대해 isAxiosError라는 타입 가드 제공

    // 공통 에러 객체에 대한 타입 정의
    interface ErrorResponse{
        status: string;
        serverDateTime: string;
        errorCode: string;
        errorMessage: string;
    }

    // ErrorResponse 인터페이스를 사용하여 처리해야 할 Axios 에러 형태는
    // AxiosError<ErrorResponse>로 표현할 수 있으며 다음과 같이 타입 가드를 명시적으로 작성할 수 있다
    function isServerError(error: unknown): error is AxiosError<ErrorResponse> {
        return axios.isAxiosError(error);
    }

    // 사용자 정의 타입 가드를 정의할 때는 타입 가드 함수의 반환 타입으로 parameterName is Type 형태의 타입 명제를 정의해주는게 좋다
    // 이때 parameterName은 타입 가드 함수의 시그니처에 포함된 매개변수여야 한다
    const  onClickDeleteHistoryButton = async (id: string) => {
        try{
            await axios.post("https://...", {id});

            alert("주문 내역이 삭제되었습니다");
        }catch(error: unknown){
            if(isServerError(error) && error.response.date.errorMessage){
                // 서버 에러일 때의 처리임을 명시적으로 알 수 있다
                setErrorMessage(e.response.data.errorMessage);
                return;
            }

            setErrorMessage("일시적인 에러가 발생했습니다. 잠시 후 다시 시도해주세요");
        }
    }
}

{
    // 서브클래싱
    // 기존 클래스를 확장하여 새로운 클래스를 만드는 과정

    // 다양한 에러에 대응하기 위한 에러 서브클래싱

    // 사용자 주문 내역 요청 코드
    const getOrderHistory = async (page: number): Promise<History> => {
        try{
            const {data} = await axios.get(`https://some.site?page=${page}`);
            const history = await JSON.parse(data);

            return history;
        }catch(error){
            alert(error.message);
        }
    };

    // 해당 코드는 에러 메세지를 얼럿을 사용하여 사용자에게 표시
    // 사용자는 어떤 에러인가 발생한 것인지 판단 가능
    // 개발자는 로그인 정보가 만료인지 타임아웃이 발생한 것인지 데이터를 잘못 전달한 것인지 구분 불가능
    // 이때 서브클래싱을 활용하면 에러가 발생했을 때 코드상에서 어떤 에러인지를 바로 확인할 수 있다
    // 에러 인스턴스가 무엇인지에 따라 에러 처리 방식을 다르게 구현할 수 있다

    // 에러 객체를 상속한 에러 클래스들
    class OrderHttpError extends Error{
        private readonly privateResponse: AxiosResponse<ErrorResponse> | undefined;

        constructor(message?: string, response?: AxiosResponse<ErrorResponse>){
            super(message);
            this.name = "OrderHttpError";
            this.privateResponse = response;
        }

        get response(): AxiosResponse<ErrorResponse> | undefined {
            return this.privateResponse;
        }
    }

    class NetworkError extends Error {
        constructor(message = ""){
            super(message);
            this.name = "NetworkError";
        }
    }

    class UnauthorizedError extends Error{
        constructor(message: string, response?: AxiosResponse<ErrorResponse>){
            super(message, response);
            this.name = "UnauthorizedError";
        }
    }

    // 조건에 따라 인터셉터에서 적합한 에러 객체 전달
    // 에러에 따라 적절한 에러 객체로 변환하여 반환
    const httpErrorHandler = (
        error: AxiosError<ErrorResponse> | Error
    ): Promise<Error> => {
        let promiseError: Promise<Error>;

        if(axios.isAxiosError(error)){
            if(Object.is(error.code, "ECONNABORTED")){
                promiseError = Promise.reject(new TimeoutError());
            }else if(Object.is(error.message, "Network Error")){
                promiseError = Pormise.reject(new NetworkError(""));
            }else{
                const {response} = error as AxiosError<ErrorResponse>;

                switch(response?.status){
                    case HttpStatusCode.UNAUTHORIZED:
                        promiseError = Promise.reject(
                            new UnauthorizedError(response?.data.message, response)
                        );
                        break;
                    default:
                        promiseError = Promise.reject(
                            new OrderHttpError(response?.data.message, response)
                        );
                }
            }
        }else{
            promiseError = Promise.reject(error);
        }

        return promiseError;
    };

    // 에러 처리 방식을 개선한 요청 코드 
    // 타입 가드문을 통해서 코드상에서 에러 핸들링에 대한 부분을 한눈에 볼 수 있다
    const onActionError = (
        error: unknown,
        params?: Omit<AlertPopup, "type" | "message">
    ) => {
        if(error instanceof UnauthorizedError){
            onUnauthorizedError(
                error.message,
                errorCallback?.onUnauthorizedErrorCallback
            );
        }else if(error instanceof NetworkError){
            alert("네트워크 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요". {
                onClose: errorCallback?.onNetworkErrorCallback,
            });
        }else if(error instanceof OrderHttpError){
            alert(error.message, params);
        }else if(error instanceof Error){
            alert(error.message, params);
        }else{
            alert(defaultHttpErrorMessage, params);
        }
    };

    const getOrderHistory = aync(page: number): Promise<History> => {
        try{
            const {data} = await fetchOrderHistory({page});
            const history = await JSON.parse(data);

            return history;
        }catch(error){
            onActionError(error);
        }
    };
}

{
    // 인터셉터를 활용한 에러 처리
    const httpErrorHandler = (
        error: AxiosError<ErrorResponse> | Error
    ): Promise<Error> => {
        (error) => {
            //401에러인 경우 로그인 페이지로 이동
            if(error.response && error.response.status === 401){
                window.location.href = `${backOfficeAuthHost}/login?targetUrl=${window.location.href}`;
            }

            return Promise.reject(error);
        };
    };

    orderApiRequester.interceptors.response.use(
        (response: AxiosResponse) => response, httpErrorHandler
    )
}

{
    // 에러 바운더리를 활용한 에러 처리
    // 에러 바운더리는 리액트 컴포넌트 트리에서 에러가 발생할 때 공통으로 에러를 처리하는 리액트 컴포넌트이다
    // 리액트 컴포넌트 트리 하위에 있는 컴포넌트에서 발생한 에러를 캐치하고 부모 에러 바운더리에서 처리할 수 있다
    // 에러 발생 컴포넌트에 대신에 에러 처리를 하거나 예상치 못한 에러를 공통 처리할 때 사용할 수 있다
    import React, {ErrorInfo} from 'react';
    import ErrorPage from "pages/ErrorPage";

    interface ErrorBoundaryProps{}

    interface ErrorBoundaryState {
        hasError: boolean;
    }

    class ErrorBoundary extends React.Component<
        ErrorBoundaryProps,
        ErrorBoundaryState
    >{
        constructor(props: ErrorBoundaryProps){
            super(props);
            this.state = {hasError: false};
        }

        static getDerivedStateFromError(): ErrorBoundaryState{
            return {hasError: true};
        }
    
        componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
            this.setState({hasError: true});
            console.error(error, errorInfo);
        }

        render(): React.ReactNode {
            const {children} = this.props;
            const {hasError} = this.state;

            return hasError ? <ErrorPage /> : children;
        }
    }

    const App = () => {
        return (
            <ErrorBoundary>
                <OrderHistoryPage />
            </ErrorBoundary>
        );        
    };

    // 이처럼 작성하면 OrderHistoryPage 컴포너트 내에서 처리되지 않은 에러가 있을 때 에러 바운더리에서 에러 페이지 노출
    // 이외에도 에러 바운더리에 로그를 보내는 코드를 추가하여 예상치 못한 에러의 발생 여부를 추적할 수 있게 된다
}

{
    // Redux의 에러 처리 방법

    // API 호출에 관한 api call reducer
    const apiCallSlice = createSlice({
        name: "apiCall",
        initialState,
        reducers: {
            setApiCall: (state, {pauload: {status, urlInfo}}) => {
                // API State를 채우는 logic
            },
            setApiCallError: (state, {payload}: PayloadAction<any>) => {
                state.error = payload;
            },
        },
    });

    const API = axios.create();

    const setAxiosInterceptor = (store: EnhancedStore) => {
        // 중복 코드 생략

        // onSuccess시 처리를 인터셉터로 처리
        // 에러 상태를 관리하지 않고 처리할 수 있으면 바로 처리하고 그렇지 않다면 reject로 넘김
        // setApiCallError를 사용 에러를 상태로 처리
        API.interceptors.response.use(
            (response: AxiosResponse) => {
                const {method, url} = response.config;

                store.dsipatch(
                    setApiCall({
                        status: ApiCallStatus.None,
                        urlInfo: {url, method},
                    })
                );

                return response?.data?.data || response?.data
            },
            (error: AxiosError) => {
                if(error.response?.status === 401){
                    window.location.href = error.response.headers.location;
                    return;
                }else if(error.response?.status === 403){
                    window.location.href = error.response.headers.location;
                    return;
                }else{
                    message.error(`[서버 요청 에러]: ${error?.response?.data?.message}`);
                }

                const {
                    config: {url, method},
                } = error;

                store.dispatch(
                    setApiCall({
                        status: ApiCallStatus.None,
                        urlInfo: {url, method},
                    })
                );

                return Promise.reject(error);
            }
        );
    };

    const fetchMenu = createAsyncThunk(
        FETCH_MENU_REQUEST,
        async({shopId, menuId}: FetchMenu) => {
            try{
                const data = await apiCallSlice.fetchMenu(shopId, menuId);
                return data;
            }catch(error){
                setApiCallError({error});
            }
        }
    );
}

{
    // MobX 사용시 에러 핸들링 
    // 외부에서는 별도로 성공, 실패 등에 대해 참조하지 않으며 비동기 동작의 수행 및 결괏값을 사용
    class JobStore {
        jobs: Job[] = [];
        state: LoadingState = "PENDING"; // "PENDING" | "DONE" | "ERROR";
        errorMsg = "";

        constructor() {
            makeAutObservable(this);
        }

        async fetchJobList(){
            this.jobs = [];
            this.state = "PENDING";
            this.errorMsg = "";

            try{
                const projects = await fetchJobList();

                runInAction(() => {
                    this.projects = projects;
                    this.state = "DONE";
                });
            }catch(e){
                runInAction(() => {
                    // 에러 핸들링 코드 작성
                    this.state = "ERROR";
                    this.errorMsg = e.message;
                    showAlert();
                });
            }
        }

        get isLoading(): boolean {
            return state === "PENDING";
        }
    }

    const JobList = (): JSX.Element => {
        const [jobStore] = useState(() => new JobStore());

        if(job.isLoading){
            return <Loader />;
        }

        return <>{jobStore.jobs.map((job) => <Item job={job} />)}</>;
    };
}