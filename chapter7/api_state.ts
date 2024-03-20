{
    // 상태관리 라이브러리 Redux 예시
    import {useEffect} from "react";
    import {useDispatch, useSelector} from "react-redux";

    export function useMonitoringHistory() {
        const dispatch = useDispatch();

        // 전역 Store 상태(RootState)에서 필요한 데이터만 가져온다
        const searchState = useSelector(
            (state: RootState) => state.monitoringHistory.searchState
        );

        // history 내역을 검색하는 함수
        // 검ㅅㄱ 조건이 바뀌면 상태를 갱신하고 API를 호출
        const getHistoryList = async (
            newState: Partial<MonitoringHistorySearchState>
        ) => {
            const newSearchState = {...searchState, ...newState};
            dispatch(monitoringHiotorySlice.actions.changeSearchState(newSearchState));

            const response = await getHistories(newSearchState); //비동기 API 호출
            dispatch(monitoringHistorySlice.actions.fetchData(response));
        };

        return {
            searchState,
            getHistoryList
        };
    }

    // 스토어에서 getHistories API만 호출하고 그 결과를 받아와서 상태를 업데이트 하는 일반적인 방식으로 사용할 수 있다
    //예시에서는 dispatch 코드를 제외하더라도 다음과 같이 API 호출과 상태 관리 코드를 작성해야 한다
    enum ApiCallStatus{
        Request,
        None
    }

    const API = axios.create();

    // API를 호출할 때, 호출한 뒤, 에러가 발생했을 때 각각 setApiCall을 호출해서 상태를 업데이트
    // Redux는 비동기 상태가 아닌 전역 상태를 위해 만들어진 라이브러리이기 때문에 미들웨어라고 불리는 여러 도구를 도입하여 비동기 상태 관리
    // 따라서 보일러플레이트 코드가 많아지는 등 간편하게 비동기 상태를 관리하기 어려운 상황도 발생
    const setAxiosInterceptor = (store: EnhancedStore) => {
        API.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                const {params, url, method} = config;

                store.dispatch(
                    //API 상태 저장을 위해 redux reducer setApiCall 함수 사용
                    //상태가 요청됨인 경우 API가 loading 중인 상태
                    setApiCall({
                        status: ApiCallStatus.Request, //API 호출 상태를 요청됨으로 변경
                        urlInfo:{url, method}
                    })
                );

                return config;
            },
            (error) => Promise.reject(error)
        );

        // onSuccess시 인터셉터로 처리한다
        API.interceptors.response.use(
            (response: AxiosResponse) => {
                const {method, url} = response.config;

                store.dispatch(
                    setApiCall({
                        status: ApiCallStatus.None, //API 호출 상태를 요청되지 않음으로 변경
                        urlInfo: {url, method}
                    })
                );

                return response?.data?.data || response?.data;
            },
            (error: AxiosError) => {
                const {
                    config: {url, method},
                } = error;

                store.dispatch(
                    setApiCall({
                        status: ApiCallStatus.None,
                        urlInfo: {url, method}
                    })
                );

                return Promise.reject(error);
            }
        )
    }

    // MobX 라이브리러 
    // Redux의 불편한 점을 개선하기 위해 비동기 콜백함수를 분리하여 액션으로 만들거나 runInAction같은 메서드를 사용하여 상태 변경 처리
    // 또한 async / await나 flow 같은 비동기 상태 관리를 위한 기능도 존재
    // 예시
    import {runInAction, makeAutoObservable} from 'mobx';
    import type Job from "models/Job";

    class JobStore {
        job: Job[] = [];

        constructor() {
            makeAutoObservable(this);
        }
    }

    type LoadingState = "PENDING" | "DONE" | "ERROR";

    class Store {
        job: Job[] = [];
        state: LoadingState = "PENDING";
        errorMsg = "";

        constructor() {
            makeAutoObservable(this);
        }

        async fetchJobList(){
            this.job = [];
            this.state = "PENDING";
            this.errorMsg = "";

            try{
                const projects = await this.fetchJobList();

                runInAction(() => {
                    this.projects = projects;
                    this.state = "DONE";
                });
            }catch(e){
                runInAction(() => {
                    this.state = "ERROR";
                    this.errorMsg = e.message;
                });
            }
        }
    }

    // 모든 상태 관리 라이브러리에서 비동기 처리 함수를 호출하기 위해 액션이 추가될 때마다 관련된 스토어나 상태가 계속 늘어난다
    // 이로 인한 가장 큰 문제점은 전역 상태 관리자가 모든 비동기 상태에 접근하고 변경할 수 있다는 것이다
    // 만약 2개 이상의 컴포넌트가 구독하고 있는 비동기 상태가 있다면 쓸데없는 비동기 통신이 발생하거나 의도치 않은 상태 변경이 발생할 수 있다
}

{
    // react-query나 useSwr같은 훅을 사용하는 방법은 상태 변경 라이브러리를 사용한 방식보다 훨씬 간단하다
    // 캐시를 사용하여 비동기 함수를 호출하며 상태 관리 라이브러리에서 발생했던 의도치 않은 상태 변경을 방지하는데 도움이 된다

    // Job 목록을 불러오는 훅과 Job 1개를 업데이트 하는 예시
    // Job이 업데이트되면 해당 Job 목록의 정보가 유효하지 않게 되므로 다시 API를 호출해야 함을 알려줘야 한다
    // react-query에서는 onSuccess 옵션의 invalidateQueries를 사용하여 특정 키의 API를 유효하지 않은 상태로 설정할 수 있다

    // Job 목록을 불러오는 훅
    const useFetchJobList = () => {
        return useQuery(["fetchJobList"], async () => {
            const response = await JobService.fetchJobList();

            // 뷰 모델 사용
            return new JobList(response);
        });
    };

    // Job 1개를 업데이트 하는 훅
    const useUpdateJob = {
        id: number,
        // Job 1개 update 이후 Query Option
        {onSuccess, ...options}: UseMutationOptions<void, Error, JobUpdateFormValue>
    }: UseMutationResult<void, Error, JobUpdateFormValue> => {
        const queryClient = useQueryClient();

        return useMutation(
            ["updateJob", id],
            async (jobUpdateForm: JobUpdateFormValue) => {
                await JobService.updateJob(id, jobUpdateForm);
            },
            {
                onSuccess: (
                    data: void, //updateJob의 return 값은 없다 (status 200으로만 성공 판별)
                    values: JobUpdateFormValue,
                    context: unknown
                ) => {
                    // 성공 시 fetchJobList를 유효하지 않음으로 설정
                    queryClient.invalidateQueries(["fetchJobList"]);

                    onSuccess && onSucess(data, values, context);
                },
                ...PushSubscriptionOptions,
            }
        );
    };    

    // JobList 컴포넌트가 최신 상태를 표현하려면 폴링이나 웹소켓 등의 방법을 사용
    // 간단한 폴링

    const JobList: React.FC = () => {
        const {
            isLoading,
            isError,
            error,
            refetch,
            data: jobList,
        } = useFetchJobList();

        //간단한 polling 로직, 실시간 화면 갱신 요구가 없으므로 30초 간격
        useInterval(() => refetch(), 30000);

        //loading인 경우에도 화면 표시
        if (isLoading) return <LoadingSpinner />;

        //Error
        if(isError) return <ErrorAlert error={error} />;

        return (
            <>
                {jobList.map((job) => (
                    <Job job={job} />
                ))}
            </>
        )
    }
}