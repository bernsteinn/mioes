import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';

const ProductDisplay = () => (
<section className='section-products'>
   <style dangerouslySetInnerHTML={{__html: "\n@import url('https://fonts.googleapis.com/css?family=Roboto:300');\n.section-products{\n  width: 100%;\n  height: 100vh;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n          padding: 2%\n}\n.cardPlans{\n  position: relative;\n  max-width: 300px;\n  height: auto;\n  background: linear-gradient(-45deg,#fe0847,#feae3f);\n  border-radius: 15px;\n  margin: 0 auto;\n  padding: 40px 20px;\n  -webkit-box-shadow: 0 10px 15px rgba(0,0,0,.1) ;\n          box-shadow: 0 10px 15px rgba(0,0,0,.1) ;\n-webkit-transition: .5s;\ntransition: .5s;\n}\n.cardPlans:hover{\n  -webkit-transform: scale(1.1);\n          transform: scale(1.1);\n}\n.col-sm-4:nth-child(1) .cardPlans ,\n.col-sm-4:nth-child(1) .cardPlans .title .fa{\n  background: linear-gradient(-45deg,#f403d1,#64b5f6);\n\n}\n.col-sm-4:nth-child(2) .cardPlans,\n.col-sm-4:nth-child(2) .cardPlans .title .fa{\n  background: linear-gradient(-45deg,#ffec61,#f321d7);\n\n}\n.col-sm-4:nth-child(3) .cardPlans,\n.col-sm-4:nth-child(3) .cardPlans .title .fa{\n  background: linear-gradient(-45deg,#24ff72,#9a4eff);\n\n}\n.cardPlans::before{\n  content: '';\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 40%;\n  background: rgba(255, 255, 255, .1);\nz-index: 1;\n-webkit-transform: skewY(-5deg) scale(1.5);\n        transform: skewY(-5deg) scale(1.5);\n}\n.title .fa{\n  color:#fff;\n  font-size: 60px;\n  width: 100px;\n  height: 100px;\n  border-radius:  50%;\n  text-align: center;\n  line-height: 100px;\n  -webkit-box-shadow: 0 10px 10px rgba(0,0,0,.1) ;\n          box-shadow: 0 10px 10px rgba(0,0,0,.1) ;\n\n}\n.title h2 {\n  position: relative;\n  margin: 20px  0 0;\n  padding: 0;\n  color: #fff;\n  font-size: 28px;\n z-index: 2;\n}\n.price,.option{\n  position: relative;\n  z-index: 2;\n}\n.price h4 {\nmargin: 0;\npadding: 25px 0 ;\ncolor: #fff;\nfont-size: 60px;\n}\n.option ul {\n  margin: 0;\n  padding: 0;\n\n}\n.option ul li {\nmargin: 0 0 10px;\npadding: 0;\nlist-style: none;\ncolor: #fff;\nfont-size: 16px;\n}\n.cardPlans a {\n  position: relative;\n  z-index: 2;\n  background: #fff;\n  color : black;\n  width: 150px;\n  height: 40px;\n  line-height: 40px;\n  border-radius: 40px;\n  display: block;\n  text-align: center;\n  margin: 20px auto 0 ;\n  font-size: 16px;\n  cursor: pointer;\n  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, .1);\n          box-shadow: 0 5px 10px rgba(0, 0, 0, .1);\n\n}\n.cardPlans a:hover{\n    text-decoration: none;\n}\n\n" }} />
        <div className="container-fluid">
          <div className="container">
            <div className="row">
              <div className="col-sm-4">
                <div className="cardPlans text-center">
                  <div className="title">
                    <i className="fa fa-paper-plane" aria-hidden="true" />
                    <h2>Básico</h2>
                  </div>
                  <div className="price">
                    <h4><sup>€</sup>9</h4>
                  </div>
                  <div className="option">
                    <ul>
                      <li> <i className="fa fa-check" aria-hidden="true" /> 10 Pegatinas </li>
                      <li> <i className="fa fa-check" aria-hidden="true" /> Carta premium </li>
                      <li> <i className="fa fa-check" aria-hidden="true" /> Sin anuncios </li>
                      <li> <i className="fa fa-check" aria-hidden="true" /> Sin comisiones </li>
                      <li> <i className="fa fa-times" aria-hidden="true" /> Soporte premium </li>
                      <li> <i className="fa fa-times" aria-hidden="true" /> Más visibilidad en la app de MIOES </li>

                    </ul>
                  </div>
      <a href="/create-checkout-session?product=price_1M2st5JqBv3uTod9bIb3ouCa" id="checkout-and-portal-button">
        Comprar
      </a>
                </div>
              </div>
              {/* END Col one */}
              <div className="col-sm-4">
                <div className="cardPlans text-center">
                  <div className="title">
                    <i className="fa fa-plane" aria-hidden="true" />
                    <h2>Estándar</h2>
                  </div>
                  <div className="price">
                    <h4><sup>€</sup>13</h4>
                  </div>
                  <div className="option">
                    <ul>
                    <li> <i className="fa fa-check" aria-hidden="true" /> 25 Pegatinas </li>
                      <li> <i className="fa fa-check" aria-hidden="true" /> Carta premium </li>
                      <li> <i className="fa fa-check" aria-hidden="true" /> Sin anuncios </li>
                      <li> <i className="fa fa-check" aria-hidden="true" /> Sin comisiones </li>
                      <li> <i className="fa fa-check" aria-hidden="true" /> Soporte premium </li>
                      <li> <i className="fa fa-times" aria-hidden="true" /> Más visibilidad en la app de MIOES </li>
                    </ul>
                  </div>
      <a href="/create-checkout-session?product=price_1M2vJNJqBv3uTod9q9NM6jCa" id="checkout-and-portal-button">
        Comprar
      </a>
                </div>
              </div>
              {/* END Col two */}
              <div className="col-sm-4">
                <div className="cardPlans text-center">
                  <div className="title">
                    <i className="fa fa-rocket" aria-hidden="true" />
                    <h2>Premium</h2>
                  </div>
                  <div className="price">
                    <h4><sup>€</sup>25</h4>
                  </div>
                  <div className="option">
                    <ul>
                    <li> <i className="fa fa-check" aria-hidden="true" /> 50 Pegatinas </li>
                      <li> <i className="fa fa-check" aria-hidden="true" /> Carta premium </li>
                      <li> <i className="fa fa-check" aria-hidden="true" /> Sin anuncios </li>
                      <li> <i className="fa fa-check" aria-hidden="true" /> Sin comisiones </li>
                      <li> <i className="fa fa-check" aria-hidden="true" /> Soporte premium </li>
                      <li> <i className="fa fa-check" aria-hidden="true" /> Más visibilidad en la app de MIOES </li>
                    </ul>
                  </div>
                    <a href="/create-checkout-session?product=price_1M2vJoJqBv3uTod91QMNr5eA" id="checkout-and-portal-button">
                      Comprar
                    </a>
                </div>
              </div>
              {/* END Col three */}
            </div>
          </div>
        </div>
      </section>
);

const SuccessDisplay = ({ sessionId }) => {
  return (
    <section>
      <div className="product Box-root">
        <div className="description Box-root">
          <h3>Tu suscripción esta activa</h3>
        </div>
      </div>
      <form action="/create-portal-session" method="POST">
        <input
          type="hidden"
          id="session-id"
          name="session_id"
          value={sessionId}
        />
        <button id="checkout-and-portal-button" type="submit">
          Gestionar tu método de pago
        </button>
      </form>
    </section>
  );
};

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
  let [message, setMessage] = useState('');
  let [success, setSuccess] = useState(false);
  let [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setSuccess(true);
      setSessionId(query.get('session_id'));
    }

    if (query.get('canceled')) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [sessionId]);

  
  if (!success && message === '') {
    return <Sidebar element={<ProductDisplay/>}/>
  } else if (success && sessionId !== '') {
    toast.success("¡Plan activado con éxito! Disfruta de tus nuevas ventajas.")
    return <Sidebar element={<SuccessDisplay sessionId={sessionId}/>}/>;
  } else {
    toast.error("Compra cancelada. Si te han cobrado contacta con el soporte para recibir asistencia.")
    return <Sidebar element={<ProductDisplay/>}/>;
  }
}

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="14px"
    height="16px"
    viewBox="0 0 14 16"
    version="1.1"
  >
    <defs />
    <g id="Flow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        id="0-Default"
        transform="translate(-121.000000, -40.000000)"
        fill="#E184DF"
      >
        <path
          d="M127,50 L126,50 C123.238576,50 121,47.7614237 121,45 C121,42.2385763 123.238576,40 126,40 L135,40 L135,56 L133,56 L133,42 L129,42 L129,56 L127,56 L127,50 Z M127,48 L127,42 L126,42 C124.343146,42 123,43.3431458 123,45 C123,46.6568542 124.343146,48 126,48 L127,48 Z"
          id="Pilcrow"
        />
      </g>
    </g>
  </svg>
);