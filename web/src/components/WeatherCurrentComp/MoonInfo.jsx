function MoonInfo({ moon }) {
    return (
        <div className='weatherCurrentComp_item moonInfo borderAll'>
            <div className="d-flex w-100 align-items-center justify-content-evenly">
                <div className={'moon ' + moon.class}>
                    <div className='disc'></div>
                </div>
            </div>
            <div>{moon.text}</div>
        </div>
    );
}

export default MoonInfo;