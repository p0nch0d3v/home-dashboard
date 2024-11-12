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
  InputGroup
} from "react-bootstrap";
import { Times } from "../../constants"
import { StorageKeys, clearStorageValue } from '../../services/DataService';
import Interval from "./Interval";
import Widget from "./Widget";
import Service from "./Service";
import StorageItem from "./StorageItem";

export default function ConfigModal({ show, onClose, onSave, configurations }) {
  const localConfig = { ...configurations };
  const [language, set_language] = useState(localConfig.language || '');
  const [ipInfoApiKey, set_ipInfoApiKey] = useState(localConfig.IPINFO_API_KEY || '');
  const [openWeatherMapApiKey, set_openWeatherMapApiKey] = useState(localConfig.OPENWEATHERMAP_API_KEY || '');
  const [exchangeRateApiKey, set_exchangeRateApiKey] = useState(localConfig.EXCHANGERATE_API_KEY || '');
  const [homeDashboardApiKey, set_homeDashboardApiKey] = useState(localConfig.HOMEDASHBOARD_API_KEY);
  const [homeDashboardApiUrl, set_homeDashboardApiUrl] = useState(localConfig.HOMEDASHBOARD_API_URL);
  const [widgets, set_widgets] = useState({ ...localConfig.widgets });
  const [services, set_services] = useState({ ...localConfig.services });
  const [twitter, set_twitter] = useState({ ...localConfig.twitter });

  const isSettingsValid = () => {
    return true;
  };

  const getObject = () => {
    return {
      language: language,
      IPINFO_API_KEY: ipInfoApiKey,
      OPENWEATHERMAP_API_KEY: openWeatherMapApiKey,
      EXCHANGERATE_API_KEY: exchangeRateApiKey,
      HOMEDASHBOARD_API_KEY: homeDashboardApiKey,
      HOMEDASHBOARD_API_URL: homeDashboardApiUrl,
      TWITTER_USERNAME: { ...twitter }.username,
      widgets: { ...widgets },
      services: { ...services },
      twitter: { ...twitter }
    };
  };

  const widgetSetIsActive = (widgetName, value) => {
    const _widgets = { ...widgets };

    if (!_widgets[widgetName]) {
      _widgets[widgetName] = {
        time: { value: 0, type: "second", total: (0 * Times.second) },
        isActive: false
      };
    }

    _widgets[widgetName].isActive = value;
    set_widgets(_widgets);
  };

  const widgetSetTime = (widgetName, value) => {
    const _widgets = { ...widgets };

    if (!_widgets[widgetName]) {
      _widgets[widgetName] = {
        time: { value: 0, type: "second", total: (0 * Times.second) },
        isActive: false
      };
    }

    if (isNaN(parseInt(value))) {
      _widgets[widgetName].time.type = value;
    }
    else {
      _widgets[widgetName].time.value = parseInt(value);
    }

    _widgets[widgetName].time.total = _widgets[widgetName].time.value * Times[_widgets[widgetName].time.type];
    set_widgets(_widgets);
  };

  const serviceSetIsActive = (serviceName, value) => {
    const _services = { ...services };

    if (!_services[serviceName]) {
      _services[serviceName] = {
        time: { value: 0, type: "second", total: (0 * Times.second) },
        isActive: false
      };
    }

    _services[serviceName].isActive = value;
    set_services(_services);
  };

  const serviceSetTime = (serviceName, value) => {
    const _services = { ...services };

    if (!_services[serviceName]) {
      _services[serviceName] = {
        time: { value: 0, type: "second", total: (0 * Times.second) },
        isActive: false
      };
    }

    if (isNaN(parseInt(value))) {
      _services[serviceName].time.type = value;
    }
    else {
      _services[serviceName].time.value = parseInt(value);
    }

    _services[serviceName].time.total = _services[serviceName].time.value * Times[_services[serviceName].time.type];
    set_services(_services);
  };

  const setTwitterTime = (value) => {
    let newTwitter = { ...twitter };

    if (!newTwitter.maxDateToShow) {
      newTwitter.maxDateToShow = { value: 0, type: "second", total: (0 * Times.second) };
    }

    if (isNaN(parseInt(value))) {
      newTwitter.maxDateToShow.type = value;
    }
    else {
      newTwitter.maxDateToShow.value = parseInt(value);
    }

    newTwitter.maxDateToShow.total = newTwitter?.maxDateToShow?.value * Times[newTwitter?.maxDateToShow?.type];
    set_twitter(newTwitter);
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
                onChange={(e) => { if (e.target.checked) set_language(e.target.value); }}
                variant="outline-primary" >
                EN
              </ToggleButton>
              <ToggleButton type="radio"
                id="language-es"
                name="language"
                value="es"
                checked={language === 'es'}
                onChange={(e) => { if (e.target.checked) set_language(e.target.value); }}
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
            <InputGroup className="mb-3">
              <InputGroup.Text >Home Dashboard URL</InputGroup.Text>
              <Form.Control type="text"
                placeholder="Home Dashboard URL"
                value={homeDashboardApiUrl}
                onChange={(e) => { set_homeDashboardApiUrl(e.target.value); }}>
              </Form.Control>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text >Home Dashboard API Key</InputGroup.Text>
              <Form.Control type="text"
                placeholder="Home Dashboard API Key"
                value={homeDashboardApiKey}
                onChange={(e) => { set_homeDashboardApiKey(e.target.value); }}>
              </Form.Control>
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
                <Widget
                  name={'Date & Time'}
                  isActive={widgets.DateTime.isActive}
                  setIsActive={(value) => { widgetSetIsActive('DateTime', value); }}
                  time={widgets.DateTime.time}
                  setTime={(value) => { widgetSetTime('DateTime', value); }} 
                />
                <Widget
                  name={'Calendar'}
                  isActive={widgets.Calendar.isActive}
                  setIsActive={(value) => { widgetSetIsActive('Calendar', value); }}
                  time={widgets.Calendar.time}
                  setTime={(value) => { widgetSetTime('Calendar', value); }} 
                />
                <Widget
                  name={'Current Weather'}
                  isActive={widgets.WeatherCurrent.isActive}
                  setIsActive={(value) => { widgetSetIsActive('WeatherCurrent', value); }}
                  time={widgets.WeatherCurrent.time}
                  setTime={(value) => { widgetSetTime('WeatherCurrent', value); }} 
                />
                <Widget
                  name={'Current Weather Comp'}
                  isActive={widgets.WeatherCurrentComp.isActive}
                  setIsActive={(value) => { widgetSetIsActive('WeatherCurrentComp', value); }}
                  time={widgets.WeatherCurrentComp.time}
                  setTime={(value) => { widgetSetTime('WeatherCurrentComp', value); }} 
                />
                <Widget
                  name={'Hourly Forecast'}
                  isActive={widgets.WeatherForecastHourly.isActive}
                  setIsActive={(value) => { widgetSetIsActive('WeatherForecastHourly', value); }}
                  time={widgets.WeatherForecastHourly.time}
                  setTime={(value) => { widgetSetTime('WeatherForecastHourly', value); }} 
                />
                <Widget
                  name={'Daily Forecast'}
                  isActive={widgets.WeatherForecastDaily.isActive}
                  setIsActive={(value) => { widgetSetIsActive('WeatherForecastDaily', value); }}
                  time={widgets.WeatherForecastDaily.time}
                  setTime={(value) => { widgetSetTime('WeatherForecastDaily', value); }} 
                />
                <Widget
                  name={'Twitter'}
                  isActive={widgets.Twitter.isActive}
                  setIsActive={(value) => { widgetSetIsActive('Twitter', value); }}
                  time={widgets.Twitter.time}
                  setTime={(value) => { widgetSetTime('Twitter', value); }} 
                />
                <Widget
                  name={'Exchange Rates'}
                  isActive={widgets.ExchangeRate.isActive}
                  setIsActive={(value) => { widgetSetIsActive('ExchangeRate', value); }}
                  time={widgets.ExchangeRate.time}
                  setTime={(value) => { widgetSetTime('ExchangeRate', value); }} 
                />
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="services" title="Services">
            <Table>
              <thead>
                <tr>
                  <td>Service</td>
                  <td>Active</td>
                  <td>Time</td>
                </tr>
              </thead>
              <tbody>
                <Service 
                  name={'GeoLocation'}
                  isActive={services.GeoLocation.isActive} 
                  setIsActive={(value) => { serviceSetIsActive('GeoLocation', value)}}
                  time={services.GeoLocation.time} 
                  setTime={(value) => { serviceSetTime('GeoLocation', value); }} 
                />
                <Service 
                  name={'Current Weather'}
                  isActive={services.WeatherCurrent.isActive} 
                  setIsActive={(value) => { serviceSetIsActive('WeatherCurrent', value)}}
                  time={services.WeatherCurrent.time} 
                  setTime={(value) => { serviceSetTime('WeatherCurrent', value); }} 
                />
                <Service 
                  name={'Hourly Forecast'}
                  isActive={services.WeatherForecastHourly.isActive} 
                  setIsActive={(value) => { serviceSetIsActive('WeatherForecastHourly', value)}}
                  time={services.WeatherForecastHourly.time} 
                  setTime={(value) => { serviceSetTime('WeatherForecastHourly', value); }} 
                />
                <Service 
                  name={'Daily Forecast'}
                  isActive={services.WeatherForecastDaily.isActive} 
                  setIsActive={(value) => { serviceSetIsActive('WeatherForecastDaily', value)}}
                  time={services.WeatherForecastDaily.time} 
                  setTime={(value) => { serviceSetTime('WeatherForecastDaily', value); }} 
                />
                <Service 
                  name={'Twitter'}
                  isActive={services.Twitter.isActive} 
                  setIsActive={(value) => { serviceSetIsActive('Twitter', value)}}
                  time={services.Twitter.time} 
                  setTime={(value) => { serviceSetTime('Twitter', value); }} 
                />
                <Service 
                  name={'Exchange Rates'}
                  isActive={services.ExchangeRate.isActive} 
                  setIsActive={(value) => { serviceSetIsActive('ExchangeRate', value)}}
                  time={services.ExchangeRate.time} 
                  setTime={(value) => { serviceSetTime('ExchangeRate', value); }} 
                />
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="twitter" title="Twitter">
            <Form.Label style={{ fontWeight: '900' }}>Last Tweet by</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon3">Username</InputGroup.Text>
              <Form.Control type="text"
                placeholder="Twitter username"
                value={twitter.username}
                onChange={(e) => {
                  let newT = { ...twitter };
                  newT.username = e.target.value;
                  set_twitter(newT);
                }} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="">Tweets To Show</InputGroup.Text>
              <Form.Control type="number"
                placeholder="Tweets To Show"
                min="2"
                value={twitter.tweetsToShow}
                onChange={(e) => {
                  let newT = { ...twitter };
                  newT.tweetsToShow = e.target.value;
                  set_twitter(newT);
                }} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="">Max Date To Show</InputGroup.Text>
              <Interval
                value={twitter?.maxDateToShow?.value}
                type={twitter?.maxDateToShow?.type}
                onValueChange={(e) => setTwitterTime(e.target.value)}
                onTypeChange={(e) => setTwitterTime(e.target.value)}
                style={{ maxWidth: '66%' }}
              />
            </InputGroup>
          </Tab>
          <Tab eventKey="storage" title="Storage">
            <StorageItem storageKey={StorageKeys.configuration} />
            <StorageItem storageKey={StorageKeys.ipInfo} />
            <StorageItem storageKey={StorageKeys.cityInfo} />
            <StorageItem storageKey={StorageKeys.locationInfo} />
            <StorageItem storageKey={StorageKeys.currentConditions} />
            <StorageItem storageKey={StorageKeys.forecastHourly} />
            <StorageItem storageKey={StorageKeys.forecastDaily} />
            <StorageItem storageKey={StorageKeys.exchangeRate} />
            <StorageItem storageKey={StorageKeys.lastTweetBy} />
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
