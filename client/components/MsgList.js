import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import MsgItem from "./MsgItem"
import MsgInput from "./MsgInput"
import fetcher from '../fetcher'

// const UserId = ['roy', 'jay']
// const getRandomUserId = () => UserId[Math.round(Math.random())]
// const originalMsgs = Array(50).fill(0).map((_,i) => ({
//     id: 50 - i,
//     userId: getRandomUserId(),
//     timestamp: 1234567890123 + (50 - i) * 1000 * 60,
//     text: `${50 - i} mock tex t`
// }))
const MsgList = () => {
    const { query } = useRouter()
    const userId = query.userId || query.userid || ''; // userid 대응
    const [ msgs, setMsgs ] = useState([])
    const [ editingId, setEditingId ] = useState(null)

    const onCreate = async text => {
        const newMsg = await fetcher('post', '/messages', {text, userId})
        if (!newMsg) throw Error('something wrong')
        setMsgs(msgs => [newMsg, ...msgs])

        // const newMsg = {
        //     id: msgs.length + 1,
        //     userId: getRandomUserId(),
        //     timestamp: Date.now(),
        //     text:`${msgs.length + 1} ${text}`,
        // }
        // console.log(msgs)
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
        const msgs = await fetcher('get', '/messages')
        setMsgs(msgs)
    }

    useEffect(() => {
        getMessages()
    },[])

    return (
        <>{userId &&
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
        />
        )}
        </ul>
        </>
    )
}

export default MsgList