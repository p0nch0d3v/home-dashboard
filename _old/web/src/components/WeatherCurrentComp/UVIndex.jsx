function UVIndex({ uv }) {
    return (
        <div className="weatherCurrentComp_item borderAll"
            style={{ backgroundColor: uv?.color }}>
            <div>
                <span>☂</span>
                {' UV '}{uv?.index}
            </div>
            {
                uv?.index > 0 ?
                    <div>{uv?.text}</div> : <></>
            }
        </div>
    );
}

export default UVIndex;