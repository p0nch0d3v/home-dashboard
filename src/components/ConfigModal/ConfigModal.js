import { useState } from "react";
import { 
  Modal, 
  Button, 
  Tabs, 
  Tab,
  Form,
  ButtonGroup,
  ToggleButton,
  Table,
  InputGroup,
  Row,
  Col
} from "react-bootstrap";
import { Times } from "../../constants"
import { StorageKeys, getStorageValue, clearStorageValue } from '../../services/DataService';

export default function ConfigModal ({ show, onClose, onSave, configurations, locationInfo }) {
  const localConfig  = {...configurations};
  const [language, set_language] = useState(localConfig.language || '');
  const [ipInfoApiKey, set_ipInfoApiKey] = useState(localConfig.IPINFO_API_KEY || ''); 
  const [openWeatherMapApiKey, set_openWeatherMapApiKey] = useState(localConfig.OPENWEATHERMAP_API_KEY || ''); 
  const [exchangeRateApiKey, set_exchangeRateApiKey] = useState(localConfig.EXCHANGERATE_API_KEY || ''); 
  const [widgets, set_widgets] = useState({...localConfig.widgets});
  const [services, set_services] = useState({...localConfig.services});

  const [storageDisplay, set_storageDisplay] = useState({});
  
  const isSettingsValid = () => {
    return true;
  };

  const getObject = () => {
    return {
      language: language,
      IPINFO_API_KEY: ipInfoApiKey,
      OPENWEATHERMAP_API_KEY: openWeatherMapApiKey,
      EXCHANGERATE_API_KEY: exchangeRateApiKey,
      widgets: {...widgets},
      services: {...services}
    };
  };

  const widgetSetIsActive = (widgetName, value) => {
    const _widgets = {...widgets};
    _widgets[widgetName].isActive = value;
    set_widgets(_widgets);
  };

  const widgetSetTime = (widgetName, value) => {
    const _widgets = {...widgets};
                          
    if (isNaN(parseInt(value))) {
      _widgets[widgetName].time.type = value;
    }
    else {
      _widgets[widgetName].time.value = parseInt(value);
    }

    _widgets[widgetName].time.total = _widgets[widgetName].time.value * Times[_widgets[widgetName].time.type];
    set_widgets(_widgets);
  };

  const widget = (name, isActive, setIsActive, time, setTime) => {
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
            {isActive ? 'Yes': 'No'}
            </ToggleButton>
          </ButtonGroup>
        </td>
        <td>
          <Row>
            <Col xs={12} sm={12} md={6}>
            <Form.Control type="text"
                    placeholder="Time"
                    value={time.value} 
                    onChange={(e) => { setTime(e.target.value) }} />
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Form.Select onChange={(e) => {setTime(e.target.value) }}>
                <option>Select Time {time.type}</option>
                <option value="second" selected={time.type === "second"}>Seconds</option>
                <option value="minute" selected={time.type === "minute"}>Minutes</option>
                <option value="hour" selected={time.type === "hour"}>Hours</option>
              </Form.Select>
            </Col>
          </Row>
        </td>
      </tr>);
  }

  const serviceSetIsActive = (widgetName, value) => {
    const _services = {...services};
    _services[widgetName] = value;
    set_services(_services);
  };

  const service = (name, isActive, setIsActive) => {
    return (
      <tr>
        <td>{name}</td>
        <td>
          <ButtonGroup>
            <ToggleButton id={'service_' + name + '_isActive'}
                          type="checkbox"
                          variant="outline-primary"
                          checked={isActive}
                          value="1"
                          onChange={(e) => { setIsActive(e.target.checked) }}>
            {isActive ? 'Yes': 'No'}
            </ToggleButton>
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  const storageElement = (storageKey) => {
    return (
      <section className="mb-2">
          <button className="btn btn-secondary btn-sm" 
                  onClick={ () => { onStorageLabelClick(storageKey) } }>
                    {storageDisplay[storageKey] === true ? 'Close' : 'Open'}
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <strong>{storageKey}</strong>
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <button className="btn btn-danger btn-sm"
          onClick={ () => { onStorageClearClick(storageKey) }}>Clear</button>
          { storageDisplay[storageKey] === true && <pre className="mb-1 mt-1 storageValue" id={'storage_' + storageKey} >
            { JSON.stringify(getStorageValue(StorageKeys[storageKey]), null, 2) }
          </pre> }
        </section>
      );
  };

  const onStorageLabelClick = (key) => {
    const _storageDisplay = {...storageDisplay};
    _storageDisplay[key] = !_storageDisplay[key];
    set_storageDisplay(_storageDisplay);
  };

  const onStorageClearClick = (key) => {
    clearStorageValue(key);
  };

  return (
    <Modal show={show} 
           size="xl" 
           animation={false} 
           centered={true} 
           scrollable={true} 
           className="modalConfig"
           style={{ overflow: 'scroll', width: '100%' }}>
      <Modal.Header>
        <Modal.Title>Configuration</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ width: '100%' }}>
        <Tabs defaultActiveKey="settings" className="mb-3" style={{ width: '100%' }} >
          <Tab eventKey="settings" title="Settings">
            <Form.Label style={{ fontWeight: '900' }}>Language</Form.Label>
            <br />
            <ButtonGroup>
              <ToggleButton type="radio"
                            id="language-en" 
                            name="language" 
                            value="en"
                            checked={language === 'en'}
                            onChange={ (e) => { if(e.target.checked) set_language(e.target.value); } }
                            variant="outline-primary" >
                EN
              </ToggleButton>
              <ToggleButton type="radio"
                            id="language-es"
                            name="language" 
                            value="es"
                            checked={language === 'es'}
                            onChange={ (e) => { if(e.target.checked) set_language(e.target.value); } }
                            variant="outline-primary" >
                ES
              </ToggleButton>
            </ButtonGroup>
            <br /><br />
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon3">
                  IpInfo ApI Key
                </InputGroup.Text>
                <Form.Control type="text"
                              placeholder="IpInfo ApI Key"
                              value={ipInfoApiKey} 
                              onChange={(e) => { set_ipInfoApiKey(e.target.value); }} />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon3">OpenWeatherMap API Key</InputGroup.Text>
                <Form.Control type="text" 
                              placeholder="OpenWeatherMap API Key" 
                              value={openWeatherMapApiKey} 
                              onChange={(e) => { set_openWeatherMapApiKey(e.target.value); }} />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon3">ExchangeRate API Key</InputGroup.Text>
                <Form.Control type="text"
                              placeholder="ExchangeRate API Key"
                              value={exchangeRateApiKey} 
                              onChange={(e) => { set_exchangeRateApiKey(e.target.value); }} />
              </InputGroup>
          </Tab>
          <Tab eventKey="widgets" title="Widgets" style={{ width: '100%' }}>
            <Table >
              <thead>
                <tr>
                  <td>Widget</td>
                  <td>Active</td>
                  <td>Time</td>
                </tr>
              </thead>
              <tbody> 
                { widget('Date & Time', 
                          widgets.DateTime.isActive, 
                          ((value) => { widgetSetIsActive('DateTime', value); }), 
                          widgets.DateTime.time,
                          ((value) => { widgetSetTime('DateTime', value); })
                )}
                { widget('Calendar', 
                        widgets.Calendar.isActive, 
                        ((value) => { widgetSetIsActive('Calendar', value); }), 
                        widgets.Calendar.time,
                        ((value) => { widgetSetTime('Calendar', value); })
                )}
                { widget('Current Weather', 
                        widgets.WeatherCurrent.isActive, 
                        ((value) => { widgetSetIsActive('WeatherCurrent', value); }), 
                        widgets.WeatherCurrent.time,
                        ((value) => { widgetSetTime('WeatherCurrent', value); })
                )}
                { widget('Current Weather Comp', 
                        widgets.WeatherCurrentComp.isActive, 
                        ((value) => { widgetSetIsActive('WeatherCurrentComp', value); }), 
                        widgets.WeatherCurrentComp.time,
                        ((value) => { widgetSetTime('WeatherCurrentComp', value); })
                )}
                { widget('Hourly Forecast', 
                        widgets.WeatherForecastHourly.isActive, 
                        ((value) => { widgetSetIsActive('WeatherForecastHourly', value); }), 
                        widgets.WeatherForecastHourly.time,
                        ((value) => { widgetSetTime('WeatherForecastHourly', value); })
                )}
                { widget('Daily Forecast', 
                        widgets.WeatherForecastDaily.isActive, 
                        ((value) => { widgetSetIsActive('WeatherForecastDaily', value); }), 
                        widgets.WeatherForecastDaily.time,
                        ((value) => { widgetSetTime('WeatherForecastDaily', value); })
                )}
                { widget('Exchange Rates', 
                        widgets.ExchangeRate.isActive, 
                        ((value) => { widgetSetIsActive('ExchangeRate', value); }), 
                        widgets.ExchangeRate.time,
                        ((value) => { widgetSetTime('ExchangeRate', value); })
                )}
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="services" title="Services">
            <Table>
              <thead>
                <tr>
                  <td>Service</td>
                  <td>Active</td>
                </tr>
              </thead>
              <tbody> 
                { service('GeoLocation',
                  services.GeoLocation,
                    ((value) => { serviceSetIsActive('GeoLocation', value); })
                )}
                { service('Current Weather', 
                    services.WeatherCurrent, 
                    ((value) => { serviceSetIsActive('WeatherCurrent', value); })
                )}
                { service('Hourly Forecast', 
                    services.WeatherForecastHourly, 
                    ((value) => { serviceSetIsActive('WeatherForecastHourly', value); })
                )}
                { service('Daily Forecast', 
                    services.WeatherForecastDaily, 
                    ((value) => { serviceSetIsActive('WeatherForecastDaily', value); })
                )}
                { service('Exchange Rates', 
                    services.ExchangeRate, 
                    ((value) => { serviceSetIsActive('ExchangeRate', value); })
                )}
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="storage" title="Storage">
            { storageElement(StorageKeys.configuration) }
            { storageElement(StorageKeys.ipInfo) }
            { storageElement(StorageKeys.cityInfo) }
            { storageElement(StorageKeys.locationInfo) }
            { storageElement(StorageKeys.currentConditions) }
            { storageElement(StorageKeys.forecastHourly) }
            { storageElement(StorageKeys.forecastDaily) }
            { storageElement(StorageKeys.exchangeRate) }
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" 
                size="lg" 
                onClick={onClose} >
            Close
        </Button>
        <Button variant="primary"
                size="lg"
                disabled={!isSettingsValid()}
                onClick={() => { onSave(getObject()); }} >
            Save Config
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
