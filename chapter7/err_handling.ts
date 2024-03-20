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