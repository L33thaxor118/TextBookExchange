/** 
@author Srilakshmi Prasad
**/
import React from 'react'
import './Home.scss';

// Needs to be listing images from current user's wishlist. 
// When you click on an image, it should open a listing (ideally)
const imgUrls = [
	"https://media.wiley.com/product_data/coverImage300/6X/11190152/111901526X.jpg", 
	"https://i.pinimg.com/736x/86/76/ad/8676ad1cf965cbccedd9c2e8c0fb3dd3.jpg",
	"https://www.fluentu.com/blog/french/wp-content/uploads/sites/3/2015/04/best-french-textbooks-2.jpg",
	"https://i.pinimg.com/originals/1f/7d/3a/1f7d3ad148180562e3dc35c444e4d6f0.jpg",
	"https://c1.staticflickr.com/9/8253/8642360250_89d73871d4_b.jpg"
];

const Arrow = ({ direction, clickFunction, glyph }) => (
	<div 
		className={ `slide-arrow ${direction}` } 
		onClick={ clickFunction }>
		{ glyph } 
	</div>
);

const ImageSlide = ({ url }) => {
	const styles = {
		backgroundImage: `url(${url})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center'
	};
	
	return (
		<div className="image-slide" style={styles}></div>
	);
}

class Home extends React.Component {
	constructor (props) {
		super(props);
		
		this.state = {
			currentImageIndex: 0
		};
		
		this.nextSlide = this.nextSlide.bind(this);
		this.previousSlide = this.previousSlide.bind(this);
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
                <h1>Welcome! Browse Listings</h1>
                <div className="carousel">
                    <Arrow direction="left" clickFunction={ this.previousSlide } glyph="&#9664;" />
                    <ImageSlide url={ imgUrls[this.state.currentImageIndex] } />
                    <Arrow direction="right" clickFunction={ this.nextSlide } glyph="&#9654;" />
                </div>
            </div>
		);
	}
}

export default Home;