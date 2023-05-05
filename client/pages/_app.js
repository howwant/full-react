import { QueryClient ,QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query'// 서버사이드에서 받아온 프로퍼티를 데이터없이 html만 남아있는 클라이언트 html에 그 데이터 정보를 구워줌
import './index.scss'
import { useRef } from 'react'

const App = ({ Component, pageProps }) => {
  const clientRef = useRef(null)
  const getClient = () => {
    if(!clientRef.current) clientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus:false
        }
      }
    })
    return clientRef.current
  }
  return (
    <QueryClientProvider client={getClient()}>
      <Hydrate state={pageProps.dehydrateState}>
      <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  )
}

App.getInitialProps = async ({ ctx, Component }) => {
  const pageProps = await Component.getInitialProps?.(ctx)
  return { pageProps }
}

export default App