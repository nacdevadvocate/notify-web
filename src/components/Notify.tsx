import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { v4 as uuidv4 } from 'uuid';
import styles from './Notify.module.scss';
import JSONCardWithCopy from './JSONCardWithCopy';
import toast from 'react-hot-toast';
import { FaInfoCircle } from 'react-icons/fa';

const Notify: React.FC = () => {
    const navigate = useNavigate();
    const { userId: routeUserId } = useParams<{ userId: string }>();
    const baseURL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5000';
    const baseWSURL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:5000';


    const generateSocketUrl = (): string => {
        const existingUrl = localStorage.getItem('socketUrl');
        const expirationDate = localStorage.getItem('socketUrlExpiration');
        const currentDate = new Date().getTime();

        if (existingUrl && expirationDate && currentDate < parseInt(expirationDate, 10)) {
            return existingUrl;
        }

        const randomId = uuidv4();
        const newSocketUrl = `${baseWSURL}/${randomId}`;
        const newExpirationDate = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

        localStorage.setItem('socketUrl', newSocketUrl);
        localStorage.setItem('socketUrlExpiration', newExpirationDate.toString());

        return newSocketUrl;
    };

    const socketUrl = generateSocketUrl();
    const userId = socketUrl.split('/').pop() as string; // Extract user ID from the URL

    useEffect(() => {
        if (!routeUserId || routeUserId !== userId) {
            navigate(`/${userId}`);
        }
    }, [navigate, routeUserId, userId]);

    const [_messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
    const { sendMessage:_sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage]);


    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(url)
            .then(() => toast.success('URL copied to clipboard!'))
            .catch(() => toast.error('Failed to copy URL'));
    };

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    console.log({ lastMessage })

    const url = `${baseURL}/notifications/${userId}`;

    return (
        <div className={styles.container}>
            <div className={styles.notificationContainer}>
                <p className={styles.urlText}>
                    <span title={connectionStatus}>
                        <FaInfoCircle className={styles.wsInfo} />
                    </span>
                    <span>Your Notification URL ID:</span>
                    <span className={styles.url}>{url}</span>
                </p>


                <button
                    className={styles.copyButton}
                    onClick={handleCopyToClipboard}
                >
                    Copy
                </button>

            </div>

            <JSONCardWithCopy data={lastMessage ? JSON.parse(lastMessage.data) : []} />



            {/* {lastMessage ? <span>Last message: {lastMessage.data}</span> : null} */}
            {/* {lastMessage ? <pre>{lastMessage.data}</pre> : null} */}
            {/* <PrettyJSONRenderer data={lastMessage ? JSON.parse(lastMessage.data).reverse() : []} /> */}
            {/* <div>
                {messageHistory.map((message, idx) => (
                    <pre key={idx}>{message ? message.data : null}</pre>
                ))}
            </div> */}

            {/* <div className={styles.notificationView}>
                <h1>WebSocket Notifications</h1>
                <div className={styles.messageContainer}>
                    {messageHistory.map((msg, index) => (
                        <div key={index} className={styles.message}>
                            <strong>Message {index + 1}:</strong>
                            <pre key={index}>{msg ? JSON.stringify(msg.data) : null}</pre>
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );
};

export default Notify;
