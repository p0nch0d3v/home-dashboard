import { useState } from "react";
import { 
  Modal, 
  Button, 
  Tabs, 
  Tab,
  Form,
  Row,
  Col
} from "react-bootstrap";

export default function ConfigModal ({ show, onClose, onSave, configurations }) {
  const [language, set_language] = useState(configurations.language);
  const [ipInfoApiKey, set_ipInfoApiKey] = useState(configurations.IPINFO_API_KEY); 
  const [openWeatherMapApiKey, set_openWeatherMapApiKey] = useState(configurations.OPENWEATHERMAP_API_KEY); 
  const [exchangeRateApiKey, set_exchangeRateApiKey] = useState(configurations.EXCHANGERATE_API_KEY); 

  const isSettingsValid = () => {
    return true;
  };

  const getObject = () => {
    return {
      language: language,
      IPINFO_API_KEY: ipInfoApiKey,
      OPENWEATHERMAP_API_KEY: openWeatherMapApiKey,
      EXCHANGERATE_API_KEY: exchangeRateApiKey,
    };
  };

  return (
    <Modal show={show} centered size="lg">
      <Modal.Header>
        <Modal.Title>Configuration</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Tabs defaultActiveKey="settings" className="mb-3">
        <Tab eventKey="settings" title="Settings">
          <Form>
            <Form.Group>
              <Form.Label>Language</Form.Label>
              <Form.Check type="radio" 
                          label="English" 
                          name="language" 
                          id="language-en" 
                          value="en"
                          checked={language === 'en'}
                          onChange={(e) => { if(e.target.checked) set_language(e.target.value); }} />
              <Form.Check type="radio" 
                          label="Spanish" 
                          name="language"
                          id="language-es" 
                          value="es"
                          checked={language === 'es'}
                          onChange={(e) => { if(e.target.checked) set_language(e.target.value); }} />
            </Form.Group>
            <Form.Group>
              <Form.Label>IpInfo ApI Key</Form.Label>
              <Form.Control type="text"
                            placeholder="IpInfo ApI Key"
                            value={ipInfoApiKey} 
                            onChange={(e) => { set_ipInfoApiKey(e.target.value); }} />
              <Form.Label>OpenWeatherMap API Key</Form.Label>
              <Form.Control type="text" 
                            placeholder="OpenWeatherMap API Key" 
                            value={openWeatherMapApiKey} 
                            onChange={(e) => { set_openWeatherMapApiKey(e.target.value); }} />
              <Form.Label>ExchangeRate API Key</Form.Label>
              <Form.Control type="text"
                            placeholder="ExchangeRate API Key"
                            value={exchangeRateApiKey} 
                            onChange={(e) => { set_exchangeRateApiKey(e.target.value); }} />
            </Form.Group>
          </Form>
        </Tab>
        <Tab eventKey="data" title="Data">
          DATA
        </Tab>
      </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" 
                size="lg" 
                onClick={onClose}>
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
