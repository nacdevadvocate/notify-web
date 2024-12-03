import React from 'react';
import styles from './JSONCardWithCopy.module.scss';
import { FaCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Type for the props
interface JSONCardWithCopyProps {
    data: Record<string, any>[]; // Array of objects
}

const JSONCardWithCopy: React.FC<JSONCardWithCopyProps> = ({ data }) => {
    const handleCopy = (jsonObject: Record<string, any>) => {
        const textToCopy = JSON.stringify(jsonObject, null, 2);
        navigator.clipboard.writeText(textToCopy)
            .then(() => toast.success('JSON Copied'))
            .catch(() => toast.error('Error happend'));
    };

    const removeKeyFromJson = <T extends Record<string, any>>(data: T, keyToRemove: string): Omit<T, typeof keyToRemove> => {
        const { [keyToRemove]: _, ...filteredData } = data;
        return filteredData;
      };

    if (!data || data.length === 0) {
        return <div className={styles.noData}>No notification available.</div>;
    }

    return (
        <div className={styles.cardContainer}>
            {data.map((item, index) => (
                <div className={styles.card} key={index}>
                    <span className={styles.notifDate}>{item.notificationDateByServer}</span>
                    <pre className={styles.prettyJSON}>
                        {JSON.stringify(removeKeyFromJson(item, 'notificationDateByServer'), null, 2)}
                    </pre>
                    <FaCopy
                        className={styles.copyButton}
                        onClick={() => handleCopy(removeKeyFromJson(item, 'notificationDateByServer'))}
                    />

                </div>
            ))}
        </div>
    );
};

export default JSONCardWithCopy;
