import { useState } from "react";
import { StorageKeys, getStorageValue } from '../../services/DataService';

function StorageItem({ storageKey }) {
    const [storageDisplay, set_storageDisplay] = useState({});
    const onStorageLabelClick = (key) => {
        const _storageDisplay = { ...storageDisplay };
        _storageDisplay[key] = !_storageDisplay[key];
        set_storageDisplay(_storageDisplay);
    };
    const onStorageClearClick = (key) => {
        clearStorageValue(key);
    };

    return (
        <section className="mb-1">
            <button className="btn btn-secondary btn-sm"
                onClick={() => { onStorageLabelClick(storageKey) }}>
                {storageDisplay[storageKey] === true ? 'Close' : 'Open'}
            </button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <label>
                <strong>{storageKey}</strong>
            </label>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button className="btn btn-danger btn-sm"
                onClick={() => { onStorageClearClick(storageKey) }}>Clear</button>
            {storageDisplay[storageKey] === true && <pre className="mb-1 mt-1 storageValue" id={'storage_' + storageKey} >
                {JSON.stringify(getStorageValue(StorageKeys[storageKey]), null, 2)}
            </pre>}
        </section>
    );
}

export default StorageItem;