import React from 'react';
import styles from './PrettyJSONRenderer.module.scss';

// Type for the props
interface PrettyJSONRendererProps {
    data: Record<string, any>[]; // Array of objects with any key-value pairs
}

const PrettyJSONRenderer: React.FC<PrettyJSONRendererProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className={styles.noData}>No data available.</div>;
    }

    return (
        <div className={styles.jsonContainer}>
            <pre className={styles.prettyJSON}>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
};

export default PrettyJSONRenderer;
