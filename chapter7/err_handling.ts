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
}