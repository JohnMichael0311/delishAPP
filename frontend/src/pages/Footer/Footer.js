import React from 'react';
import './Footer.css';

export default function Footer() {
    // Open About Section by changing display to flex
    const openAbout = () => {
        document.getElementById('about').style.display = 'flex';
    };

    // Close About Section by changing display to none
    const closeAbout = () => {
        document.getElementById('about').style.display = 'none';
    };

    return (
        <>
            {/* About Section */}
            <div id="about" className="about">
                <a href="#" className="closebtn" onClick={closeAbout}>&times;</a>
                <div className="about-overlay">
                    <h1>About us</h1>
                    <p>
                        Launched in 2024, Our technology platform connects customers, <br />
                        restaurant partners, and delivery partners, serving their multiple needs. <br />
                        Customers use our platform to search and discover restaurants, read and write reviews, and much more. <br />
                        We provide restaurant partners with marketing tools and delivery services, and much more!
                    </p>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-col">
                        <ul>
                            <i className="fa fa-utensils"></i>
                            <span>DELISH.</span>
                        </ul>
                        <div className="map">
                            <ul>
                                <i className="fa fa-map-marker"></i>
                                <span>IIIT SRICITY - Chittor District 517001.</span>
                            </ul>
                        </div>
                        <div className="mail">
                            <ul>
                                <i className="fas fa-inbox"></i>
                                <span>support@DELISH.com</span>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>DELISH</h4>
                        <ul>
                            <li><a href="javascript:void(0)" onClick={openAbout}>About us</a></li>
                            <li><a href="#">Our services</a></li>
                            <li><a href="#">Privacy policy</a></li>
                            <li><a href="#">Payment policy</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Get help</h4>
                        <ul>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Delivery</a></li>
                            <li><a href="#">My orders</a></li>
                            <li><a href="#">Order Status</a></li>
                            <li><a href="#">Payment options</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Order Now</h4>
                        <ul>
                            <li><a href="#">Biryani's</a></li>
                            <li><a href="#">Pizza</a></li>
                            <li><a href="#">Starters</a></li>
                            <li><a href="#">Fast food</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        {/* <h4>Follow us</h4> */}
                        <div className="social-links">
                            <a href="https://www.facebook.com/" >
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://twitter.com/login" >
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://www.instagram.com/" >
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://www.linkedin.com/login" >
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href="https://www.pinterest.com/" >
                                <i className="fab fa-pinterest"></i>
                            </a>
                            <a href="https://www.youtube.com/" >
                                <i className="fab fa-youtube"></i>
                            </a>
                        </div>
                    </div>

                </div>
            </footer>
        </>
    );
}
