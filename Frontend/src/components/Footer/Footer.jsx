import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faGoogle, faInstagram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <div>
      <div className="container my-5">
        <footer className="text-center text-lg-start text-white" style={{ backgroundColor: '#1c2331' }}>
          <section className="d-flex justify-content-between p-4" style={{ backgroundColor: '#6351ce' }}>
            
            <div>
              <a href="#" className="text-white me-4">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="text-white me-4">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="text-white me-4">
                <FontAwesomeIcon icon={faGoogle} />
              </a>
              <a href="#" className="text-white me-4">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="text-white me-4">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="#" className="text-white me-4">
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </div>
          </section>
          <section>
            <div className="container text-center text-md-start mt-5">
              <div className="row mt-3">
                <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold">Menu Card For Cafe Owners</h6>
                  <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                  <p>Are you creating startup for Cafe ?<br></br> Then this is a best place for you to grow your business by preparing an apt menu card for customers and gain customer satisfaction and profit </p>
                </div>
                <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold">Analysis</h6>
                  <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                  <p className="text-white">Zomato</p>
                  <p className="text-white">Swiggy</p>
                  <p className="text-white">Starbucks</p>
                  
                </div>
                <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold">Linkedin links</h6>
                  <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                  <p><FontAwesomeIcon icon={faLinkedin} />  <a href="#!" className="text-white">Pallavi Bandarkar</a></p>
                  <p><FontAwesomeIcon icon={faLinkedin} />  <a href="https://www.linkedin.com/in/sneha-gawas/" className="text-white">Sneha Gawas</a></p>
                  <p><FontAwesomeIcon icon={faLinkedin} />  <a href="#!" className="text-white">Anannya Auchare</a></p>
                  <p><FontAwesomeIcon icon={faLinkedin} />  <a href="#!" className="text-white">Saniya Chandanshive </a></p>
                </div>
                <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                  <h6 className="text-uppercase fw-bold">Contact</h6>
                  <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                  <p><i className="fas fa-home mr-3"></i> Mumbai, INDIA</p>
                  <p><i className="fas fa-envelope mr-3"></i> cafeanalytics@gmail.com</p>
                  <p><i className="fas fa-phone mr-3"></i> + 91 834 567 89 63</p>
                </div>
              </div>
            </div>
          </section>
          <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            {/* Footer bottom section */}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Footer;
