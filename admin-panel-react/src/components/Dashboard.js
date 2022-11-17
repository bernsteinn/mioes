import Login from "./LoginScreen"
import Sidebar from "./Sidebar"
import Spinner from "./Spinner"
import useInterval from './useInterval'
import {SocketContext, socket} from './socketContext';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import SetUpAccount from "./SetUpAccount"
import { Swiper, SwiperSlide} from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Mousewheel} from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/mousewheel';

export default function Dashboard(){
    const socket = useContext(SocketContext)
    const [isSocketConnected, setSocketConnected] = useState(socket.connected)
    const [lastUpdate, setLastUpdate] = useState(null)
    const [loading, setLoading] = useState(true)
    const [liveJobs, setLiveJobs] = useState(0)
    useEffect(() => {
        socket.emit("updateMe")
        }, [])
    socket.on("update", (jobs) => {
        setLiveJobs(jobs.liveJobs)
        setLoading(false)
    })
    return(<>
<SocketContext.Provider value={socket}>
    {loading == false ? <Sidebar element={
        <Swiper
            style={{maxWidth: '420px'}}
            className="swiper-container"
            modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]}
            slidesPerView={1}
            spaceBetween={20}
            effect='fade'
            loop={true}
            speed={300}
            mousewheel = {{
              invert: false,
            }}
            pagination={{
              el: '.swiper-pagination',
              clickable: true,
              dynamicBullets: true
            }}
            // Navigation arrows
            navigation = {{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
         >
            <style dangerouslySetInnerHTML={{__html: "\n@import url(\"https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap\");\n.swiper-slide-active{\n opacity: 1 !important\n}\n.swiper-container {\margin:auto !important;\nbox-sizing: border-box;\n}\n\n.swiper-container {\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n\n.swiper-container {\n  font-family: \"Montserrat\", sans-serif;\n  margin: 0;\n  width: 100%;\n  height: 100vh;\n  background-size: 200% 200%;\n  -webkit-animation: gradient 15s ease infinite;\n          animation: gradient 15s ease infinite;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  padding: 32px;\n}\n\n@-webkit-keyframes gradient {\n  0% {\n    background-position: 0% 50%;\n  }\n  50% {\n    background-position: 100% 50%;\n  }\n  100% {\n    background-position: 0% 50%;\n  }\n}\n\n@keyframes gradient {\n  0% {\n    background-position: 0% 50%;\n  }\n  50% {\n    background-position: 100% 50%;\n  }\n  100% {\n    background-position: 0% 50%;\n  }\n}\n.swiper-container h1 {\n  margin: 0;\n  font-weight: bold;\n  font-size: 24px;\n  line-height: 32px;\n  color: #26384E;\n  transform: translateY(20px);\n  transition: all 0.4s ease;\n  transition-delay: 0.2s;\n  overflow: hidden;\n  max-width: 100%;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n@media screen and (max-width: 520px) {\n  .swiper-container h1 {\n    font-size: 16px;\n    line-height: 24px;\n  }\n}\n\n.swiper-container p {\n  font-size: 16px;\n  line-height: 24px;\n  color: #889DB8;\n  transform: translateY(20px);\n  transition: all 0.4s ease;\n  transition-delay: 0.3s;\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n@media screen and (max-width: 520px) {\n  .swiper-container p {\n    font-size: 14px;\n    line-height: 20px;\n  }\n}\n\n.swiper-wrapper {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  z-index: 1;\n  position: relative;\n}\n\n.swiper-container {\n  background: linear-gradient(270deg, #f7f9ff 0%, #f2f6ff 100%);\n  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;\n  width: 100%;\n  position: relative;\n  height: 100%;\n  max-height: 420px;\n  border-radius: 10px;\n}\n\n.slider-image-wrapper {\n  height: 200px;\n  width: 100%;\n  overflow: hidden;\n}\n\n.slider-item {\n  width: 100%;\n  height: 100%;\n  border-radius: 10px;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  flex-shrink: 0;\n  opacity: 0;\n  background: linear-gradient(270deg, #f7f9ff 0%, #f2f6ff 100%);\n  cursor: -webkit-grab;\n  cursor: grab;\n}\n.slider-item-content {\n  padding: 32px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  transition: 0.4s;\n}\n.slider-item-content > * {\n  opacity: 0;\n  transform: translateY(20px);\n}\n\n.swiper-slide-active .slider-item-content > * {\n  transform: translateY(0px);\n  opacity: 1;\n}\n\n.slider-image {\n  width: 100%;\n  height: 100%;\n  -o-object-fit: cover;\n     object-fit: cover;\n  transition: 0.2s;\n}\n\n.swiper-pagination {\n  position: absolute;\n  left: 50%;\n  bottom: 8px;\n  transform: translatex(-50%);\n  z-index: 1;\n  width: auto !important;\n}\n\n.swiper-pagination-bullet {\n  border-radius: 0;\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  line-height: 30px;\n  font-size: 12px;\n  opacity: 1;\n  background: rgba(255, 185, 0, 0.3);\n  display: inline-block;\n  margin-right: 8px;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.swiper-pagination-bullet-active {\n  background: #FFB200;\n  width: 20px;\n  border-radius: 10px;\n}\n\n.slider-buttons {\n  position: absolute;\n  display: flex;\n  top: 100%;\n  justify-content: flex-end;\n  width: 100%;\n  padding-top: 8px;\n}\n\n.swiper-button-next,\n.swiper-button-prev {\n  background-color: transparent;\n  border: none;\n  cursor: pointer;\n  outline: none;\n  color: #fff;\n  position: relative;\n  margin-left: 4px;\n}\n.swiper-button-next:before,\n.swiper-button-prev:before {\n  content: \"\";\n  position: absolute;\n  background-color: #fff;\n  height: 1px;\n  width: 0;\n  left: 0;\n  bottom: -1px;\n  transition: 0.2s;\n}\n.swiper-button-next:hover:before,\n.swiper-button-prev:hover:before {\n  width: 100%;\n}\n\n.socials {\n  position: fixed;\n  top: 12px;\n  right: 16px;\n  display: flex;\n  align-items: center;\n}\n.socials .social-link {\n  display: inline-block;\n  margin-left: 8px;\n  color: #fff;\n}\n\n@media screen and (max-width: 520px) {\n  .swiper-button-next:hover:before,\n.swiper-button-prev:hover:before {\n    display: none;\n  }\n\n" }} />
          <SwiperSlide className="slider-item swiper-slide" style={{height: '378px'}}>
            <div className="slider-image-wrapper">
              <img className="slider-image" src="https://media.discordapp.net/attachments/931509795301765160/1042112346623070258/La-OSI-alerta-atencion-al-escanear-un-codigo-QR-desconocido-podrian-estafarte-Recuperado.jpg?width=1163&height=701" alt="SliderImg" />
            </div>
            <div className="slider-item-content">
              <h1>¿Que es mioes?</h1>
              <p>Mioes es la mejor manera de aumentar la productividad de tu negocio.</p>
            </div>
          </SwiperSlide>
          <SwiperSlide className="slider-item swiper-slide" style={{height: '378px'}}>
            <div className="slider-image-wrapper">
              <img className="slider-image" src="https://media.discordapp.net/attachments/931509795301765160/1042112998019436564/92592c23ebec82d12a687379c712d1cf.cms.jpg?width=1246&height=701" alt="SliderImg" />
            </div>
            <div className="slider-item-content">
              <h1>¿Como funciona mioes?</h1>
              <p>Es muy fácil. Simplemente registrate y configura tu perfil.</p>
            </div>
          </SwiperSlide>
          <SwiperSlide className="slider-item swiper-slide" style={{height: '378px'}}>
            <div className="slider-image-wrapper">
              <img className="slider-image" src="https://media.discordapp.net/attachments/931509795301765160/1042113355734859857/registro-pedidos_1098-13337.jpg?width=1246&height=701" alt="SliderImg" />
            </div>
            <div className="slider-item-content">
              <h1>¿Por que usar mioes?</h1>
              <p>Mioes es totalmente gratuito y ofrece una gran variedad de funciones.</p>
            </div>
          </SwiperSlide>
          <SwiperSlide className="slider-item swiper-slide" style={{height: '378px'}}>
            <div className="slider-image-wrapper">
              <img className="slider-image" src="https://cdn.discordapp.com/attachments/931509795301765160/1042113186008141824/findus-food-services-qr-code-1.jpg?width=1246&height=701" alt="SliderImg" />
            </div>
            <div className="slider-item-content">
              <h1>¿Que es una carta online?</h1>
              <p>Una carta con todos los platos de tu restaurante, pero con muchas funciones adicionales como la traducción del menu.</p>
            </div>
          </SwiperSlide>
        <div className="slider-buttons">
          <button className="swiper-button-prev">Prev</button>
          <button className="swiper-button-next">Next</button>
        </div>
        <div className="swiper-pagination" />
      </Swiper>
    }></Sidebar>:null}
</SocketContext.Provider>
    </>)
}