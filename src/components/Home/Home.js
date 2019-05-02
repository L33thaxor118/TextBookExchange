/** 
@author Srilakshmi Prasad
**/
import React from 'react';
import listingsApi from '../../api/listings';
import usersApi from '../../api/users';
import { authentication, fetchPhotoUrls } from '../../utils/firebase';

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
    constructor() {
        super();
        
		this.state = {
			listingIds: [],
			user: [],
			listings:[],
			photoUrls:[],
            currentImageIndex: 0
        };

        this.nextSlide = this.nextSlide.bind(this);
		this.previousSlide = this.previousSlide.bind(this);
	}

	async componentDidMount() {
		const id = authentication.currentUser.uid; // log into firebase to get user test w 100
		const userObj = await usersApi.get({id});
		const listingIds = userObj.user.listings;
		this.setState({
			user:id
		});

		await Promise.all(listingIds.map(async (id) => {
    		const listingObj = await listingsApi.get({id});
    		this.setState({
				listings: [...this.state.listings, listingObj.listing],
				listingIds: [...this.state.listingIds, id]
			});
  		}));

		await Promise.all(this.state.listings.map(async (listing) => {
    		const photoUrls = await fetchPhotoUrls(listing._id, listing.imageNames);
    		if (photoUrls.length===0) {
    			var photoUrl = 'https://cor-cdn-static.bibliocommons.com/assets/default_covers/icon-book-93409e4decdf10c55296c91a97ac2653.png';
    		}
    		else {
    			photoUrl = photoUrls[0];
    		}
    		this.setState({
				photoUrls: [...this.state.photoUrls, photoUrl]
			});
  		}));
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
                    <ImageSlide url={ this.state.photoUrls[this.state.currentImageIndex] } />
                    <Arrow direction="right" clickFunction={ this.nextSlide } glyph="&#9654;" />
                </div>
            </div>
		);
	}
}

export default Home;