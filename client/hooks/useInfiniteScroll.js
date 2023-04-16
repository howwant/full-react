import { useState, useEffect, useCallback, useRef } from "react"

const useInfinteScroll = targetEl => {
    const observerRef = useRef(null) // 값을 저장함
    const [intersecting, setIntersecting] = useState(false)

    const getObserver = useCallback(()=> {
        if(!observerRef.current) {
            observerRef.current = new IntersectionObserver(entries => setIntersecting( //entries는 IntersectionObserverEntry 인스턴스의 배열입니다.
                entries.some(entry => entry.isIntersecting) //isIntersecting : 관찰 대상의 교차 상태(Boolean) 화면에 있는기
            ))//some:하나라도 true가 발생하면 true를 반환
        }
        return observerRef.current
    }, [observerRef.current])

    useEffect(()=> {
        if(targetEl.current) getObserver().observe(targetEl.current) // entries의 배열중 하나인 targetEl.current를 넣음
    
        return () => {
            getObserver().disconnect()
        }
    }, [targetEl.current])
    return intersecting
}

export default useInfinteScroll
// 참고: https://heropy.blog/2019/10/27/intersection-observer/
// 1. 최하단의 엘리먼트를 가져옴
// 2. 엘리먼트가 있으면 옵저버 세팅
// 2-1. 변수값이 없으면 변수값에 옵저버 넣고 화면에 있는가에 따라 intersecting 참거짓 변수입력
// 2-2. 변수값 내보내고 intersecting의 참거짓을 내보냄
// 3. 엘리먼트가 없으면 옵저버 끝