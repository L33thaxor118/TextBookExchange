import { Button, List, Image, Icon, Header } from 'semantic-ui-react';
import React, { Component } from 'react';

//import styles from './Dashboard.scss';
import listingsApi from '../../api/listings';
import usersApi from '../../api/users';
import { authentication, fetchPhotoUrls } from '../../utils/firebase';

class Dashboard extends Component {
	constructor() {
		super();
		this.state = {
			listingIds: [],
			user: [],
			listings:[],
			photoUrls:[],
			image: 'https://cor-cdn-static.bibliocommons.com/assets/default_covers/icon-book-93409e4decdf10c55296c91a97ac2653.png'
		}
		this.handleDeleteListing = this.handleDeleteListing.bind(this);
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

	async handleDeleteListing(id) {
		const deletedListing = await listingsApi.delete({id});
		// not needed after redux adaptation (?) :
		if (deletedListing) {
			const listingIndex = this.state.listingIds.indexOf(id);
			console.log(listingIndex);
	    	const newListingIds = [].concat(this.state.listingIds);
	    	newListingIds.splice(listingIndex, 1);
	    	const newListings = [].concat(this.state.listings);
	    	newListings.splice(listingIndex, 1);
	    	this.setState({listingIds:newListingIds, listings: newListings}); 
    	}

	}
	async navigateToListingEdit(id) {
		// change to listing edit when view created, now going to listings details
		this.props.history.push(`/listings/${id}`);
	}
	render () {
		return (
			<div>
			<Header as='h2' textAlign='center'>Your Dashboard </Header>
			
			{(this.state.listings)?
				<div>
				 <List celled>
				 		{this.state.listings.map((listing, index) => {
	    				    return (<List.Item>
						      <Image src={this.state.photoUrls[index]} size='tiny'/>
						      <List.Content>
						      <Header as='h4'>{listing.book.title}</Header>
						        <List.Description>
						          Price: {listing.price ? `$${listing.price}` : '—'} <br />
						          Exchange For: {listing.exchangeBook ? listing.exchangeBook.title : '—'} <br />
						        </List.Description>
							      <Button icon labelPosition='left' type='submit' size='tiny' onClick={() => this.navigateToListingEdit(listing._id)}>
							      	<Icon name='edit' />
							      	Edit
							      </Button>
							      	<Button icon color='red' labelPosition='left' type='submit' size='tiny' onClick={() => this.handleDeleteListing(listing._id)}>
							      	<Icon name='trash' />
							      	Delete
							      </Button>						        
						      </List.Content>

						    </List.Item>)
						})
						}
					</List>
				 </div>: 
				{}
        	}
        	</div>
		)
	}
}

export default Dashboard;