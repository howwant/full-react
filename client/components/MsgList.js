import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import MsgItem from "./MsgItem"
import MsgInput from "./MsgInput"
import fetcher from '../fetcher'
import useInfinteScroll from "../hooks/useInfiniteScroll"

const MsgList = ({ smsgs, users }) => {
    const { query } = useRouter()
    const userId = query.userId || query.userid || ''; // userid 대응
    const [ msgs, setMsgs ] = useState(smsgs)
    const [ editingId, setEditingId ] = useState(null)
    const [hasNext, setHasNext] = useState(true)
    const fetchMoreEl = useRef(null) //화면에 보이는가 안보이는가로 리스트 추가함
    const intersecting = useInfinteScroll(fetchMoreEl)

    const onCreate = async text => {
        const newMsg = await fetcher('post', '/messages', {text, userId})
        if (!newMsg) throw Error('something wrong')
        setMsgs(msgs => [newMsg, ...msgs])
    }
    
    const onUpdate = async(text, id) => {
        const newMsg = await fetcher('put', `/messages/${id}`, { text, userId })
        if (!newMsg) throw Error('something wrong')
        setMsgs(msgs => {
            const targetIndex = msgs.findIndex(msg => msg.id === id)
            if (targetIndex < 0) return msgs
            const newMsgs = [...msgs]
            newMsgs.splice(targetIndex,1,newMsg)
            return newMsgs 
        })
        doneEdit()
    }

    const onDelete = async(id) => {
        const receviedId = await fetcher('delete', `/messages/${id}`, { params: { userId }})
        setMsgs(msgs => {
            const targetIndex = msgs.findIndex(msg => msg.id === receviedId + '')//receviedId를 문자열로 수정
            if (targetIndex < 0) return msgs
            const newMsgs = [...msgs]
            newMsgs.splice(targetIndex,1)
            return newMsgs
        })
    }

    const doneEdit = () => setEditingId(null)

    const getMessages = async() => {
        const newMsgs = await fetcher('get', '/messages',{ params: { cursor: msgs[msgs.length -1]?.id || ''}})
        if(newMsgs.length === 0){
            setHasNext(false)
            return
        }
        setMsgs(msgs => [...msgs,...newMsgs])
    }

    useEffect(() => {
        if(intersecting && hasNext) getMessages()
    },[intersecting])

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
            user={users[x.userId]}
            />
            )}
        </ul>
        <div ref={fetchMoreEl}/>
    </>

    )
}

export default MsgList