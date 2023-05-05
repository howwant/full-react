import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import MsgItem from "./MsgItem"
import MsgInput from "./MsgInput"
import { QueryKeys, fetcher } from '../queryClient'
import { useMutation, useQuery, useQueryClient } from "react-query"
import { CREATE_MESSAGE, DELETE_MESSAGE, GET_MESSAGES, UPDATE_MESSAGE } from "../graphql/message"
// import useInfinteScroll from "../hooks/useInfiniteScroll"

const MsgList = ({ smsgs, users }) => {
    const client = useQueryClient()
    const { query } = useRouter()
    const userId = query.userId || query.userid || ''; // userid 대응
    const [ msgs, setMsgs ] = useState(smsgs)
    const [ editingId, setEditingId ] = useState(null)
    // const [hasNext, setHasNext] = useState(true)
    // const fetchMoreEl = useRef(null) //화면에 보이는가 안보이는가로 리스트 추가함
    // const intersecting = useInfinteScroll(fetchMoreEl) 

    const { mutate: onCreate } = useMutation(({ text }) => fetcher(CREATE_MESSAGE, { text, userId }), {
        onSuccess: ({ createMessage }) => {
          client.setQueryData(QueryKeys.MESSAGES, old => {
            return {
              messages: [createMessage, ...old.messages],
            }
          })
        },
      })
    
      const { mutate: onUpdate }= useMutation(({ text, id }) => fetcher(UPDATE_MESSAGE, { text, id, userId }), {
        onSuccess: ({ updateMessage}) => {
            client.setQueryData(QueryKeys.MESSAGES, old => {
                const targetIndex = old.messages.findIndex(msg => msg.id === updateMessage.id)
                if (targetIndex < 0) return old
                const newMsgs = [...old.messages]
                newMsgs.splice(targetIndex,1, updateMessage)
                return { messages: newMsgs}
            })
            doneEdit()
        },
      })

      const { mutate: onDelete }= useMutation( id  => fetcher(DELETE_MESSAGE, { id, userId }), {
        onSuccess: ({ deleteMessage: deletedId }) => {
            client.setQueryData(QueryKeys.MESSAGES, old => {
                const targetIndex = old.messages.findIndex(msg => msg.id === deletedId)
                if (targetIndex < 0) return old
                const newMsgs = [...old.messages]
                newMsgs.splice(targetIndex,1)
                return { messages: newMsgs}
            })
        },
      })

    const doneEdit = () => setEditingId(null)

    const { data, error, isError } = useQuery(QueryKeys.MESSAGES, () => fetcher(GET_MESSAGES))// stale : 옛것 미리 받아놓은

    useEffect(()=> {
        if(!data?.messages) return
        console.log('change msgs')
        setMsgs(data.messages)
    },[data?.messages])

    if(isError){
        console.error(error)
        return null;
    }

    // useEffect(() => {
    //     if(intersecting && hasNext) getMessages()
    // },[intersecting])

    return (
    <>
        {userId &&
            <MsgInput mutate={onCreate}/>}
           <ul className="messages">
            { msgs.map(x => 
            <MsgItem 
            key={x.id}{ ...x } 
            onUpdate={onUpdate} 
            startEdit={() => setEditingId(x.id)} 
            isEditing={editingId === x.id}
            onDelete={() => onDelete(x.id)}
            myId={userId}
            user={users.find(x => userId === x.id)}
            />
            )}
        </ul>
        {/* <div ref={fetchMoreEl}/> */}
    </>

    )
}

export default MsgList