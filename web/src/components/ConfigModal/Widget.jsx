import {
    ButtonGroup,
    ToggleButton,
  } from "react-bootstrap";
import Interval from "./Interval";

function Widget({ name, isActive, setIsActive, time, setTime }) {
    return (
        <tr>
            <td>{name}</td>
            <td>
                <ButtonGroup>
                    <ToggleButton id={'widget_' + name + '_isActive'}
                        type="checkbox"
                        variant="outline-primary"
                        checked={isActive}
                        value="1"
                        onChange={(e) => { setIsActive(e.target.checked) }}>
                        {isActive ? 'Yes' : 'No'}
                    </ToggleButton>
                </ButtonGroup>
            </td>
            <td>
                <Interval
                    value={time?.value}
                    type={time?.type}
                    onValueChange={(e) => setTime(e.target.value)}
                    onTypeChange={(e) => setTime(e.target.value)}
                />
            </td>
        </tr>
    );
}

export default Widget;