import { Form, Row, Col } from "react-bootstrap";
import { TimeNames } from '../../constants';

function Interval({ style, type, value, onTypeChange, onValueChange }) {
    return (
        <Row style={style}>
            <Col xs={12} sm={3} md={4}>
                <Form.Control
                    type="number"
                    value={value}
                    onChange={onValueChange}
                />
            </Col>
            <Col xs={12} sm={9} md={8}>
                <Form.Select onChange={onTypeChange}>
                    <option>Select Time {type}</option>
                    <option value={TimeNames.second} selected={type === TimeNames.second}>Seconds</option>
                    <option value={TimeNames.minute} selected={type === TimeNames.minute}>Minutes</option>
                    <option value={TimeNames.hour} selected={type === TimeNames.hour}>Hours</option>
                    <option value={TimeNames.day} selected={type === TimeNames.day}>Days</option>
                </Form.Select>
            </Col>
        </Row>



    );
}

export default Interval;