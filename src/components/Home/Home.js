/** 
@author Srilakshmi Prasad
**/
import React from 'react';
import './Home.scss';

const imgUrls = [
	"https://n1.sdlcdn.com/imgs/b/x/6/Computer-Systems-A-Programmer-s-SDL677179892-1-c5b32.jpg",
	"https://www.booktopia.com.au/http_coversbooktopiacomau/600/9780813349800/0000/a-history-of-the-modern-middle-east.jpg",
	"https://images.kogan.com/image/fetch/s--P-iJFyb7--/b_white,c_pad,f_auto,h_630,q_auto:good,w_1200/https://assets.kogan.com/images/booksbatch/BKT-9781118871645/html-css.jpg",
	"https://pictures.abebooks.com/isbn/9780134082318-us.jpg",
	"https://rukminim1.flixcart.com/image/704/704/book/0/4/7/physics-for-scientists-and-engineers-with-modern-physics-original-imaef2rkns7rqewk.jpeg?q=70"
];

const searchQueries = [
	"Computer Systems: A Programmer's Perspective",
	"A History of the Modern Middle East",
	"HTML and CSS: Design and Build Websites",
	"Campbell Biology, 11th Ed",
	"Physics for Scientists and Engineers with Modern Physics"
]

const Arrow = ({ direction, clickFunction, glyph }) => (
	<div 
		className={ `slide-arrow ${direction}` } 
		onClick={ clickFunction }>
		{ glyph } 
	</div>
);


const ImageSlide = ({ url, onSlideClick, title }) => {
	const styles = {
		backgroundImage: `url(${url})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center'
	};
	
	return (
		<div className="image-slide" style={styles} onClick={() => onSlideClick(title)}></div>
	);
}

class Home extends React.Component {
    constructor() {
        super();
        
		this.state = {
            currentImageIndex: 0
        };

        this.nextSlide = this.nextSlide.bind(this);
		this.previousSlide = this.previousSlide.bind(this);
	}

	navigateToBookSearch(query) {
		console.log(query);
		this.props.history.push({
			pathname: '/listings',
			search: `?query=${query}&exact=true`
		});
	}
	
	previousSlide () {
		const lastIndex = imgUrls.length - 1;
		const { currentImageIndex } = this.state;
		const shouldResetIndex = currentImageIndex === 0;
		const index =  shouldResetIndex ? lastIndex : currentImageIndex - 1;
		
		this.setState({
			currentImageIndex: index
		});
	}
	
	nextSlide () {
		const lastIndex = imgUrls.length - 1;
		const { currentImageIndex } = this.state;
		const shouldResetIndex = currentImageIndex === lastIndex;
		const index =  shouldResetIndex ? 0 : currentImageIndex + 1;

		this.setState({
			currentImageIndex: index
		});
	}
	
	render () {
		return (
            <div id="container">
                <h1 className="heading">Welcome! Click on a Textbook to Search for Listings</h1>
                <div className="carousel">
                    <Arrow direction="left" clickFunction={ this.previousSlide } glyph="&#9664;" />
					<ImageSlide 
						url={ imgUrls[this.state.currentImageIndex] } 
						onSlideClick={this.navigateToBookSearch.bind(this)} 
						title={ searchQueries[this.state.currentImageIndex] } />
                    <Arrow direction="right" clickFunction={ this.nextSlide } glyph="&#9654;" />
                </div>
            </div>
		);
	}
}

export default Home;