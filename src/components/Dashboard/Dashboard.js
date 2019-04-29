import { Button, List, Image, Icon } from 'semantic-ui-react';
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
			name:null,
			listings:[],
			photoUrls:[],
			image: 'https://cor-cdn-static.bibliocommons.com/assets/default_covers/icon-book-93409e4decdf10c55296c91a97ac2653.png'
		}
		this.handleDeleteListing = this.handleDeleteListing.bind(this);
	}

	async componentDidMount() {
		const id = authentication.currentUser.uid; // log into firebase to get user test w 100
		const userObj = await usersApi.get({id});
		const listingIds = userObj.user.listings
		//console.log(userObj.user.listings);
		this.setState({
			listingIds,
			name: userObj.user.displayName,
			user:id
		});

		await Promise.all(listingIds.map(async (id) => {
    		const listingObj = await listingsApi.get({id});
    		console.log(listingObj.listing);
    		this.setState({
				listings: [...this.state.listings, listingObj.listing]
			});
  		}));

		await Promise.all(this.state.listings.map(async (listing) => {
    		const photoUrls = await fetchPhotoUrls(listing._id, listing.imageNames);
    		console.log(photoUrls)
    		this.setState({
				photoUrls: [...this.state.photoUrls, photoUrls]
			});
  		}));
	}

	async handleDeleteListing() {

	}

	render () {
		return (
			<div>
			{this.state.name} Dashboard 
			{(this.state.listings)?
				<div>
				 <List>
				 		{this.state.listings.map((listing, index) => {
	    				    return (<List.Item>
						      <Image src={this.state.image} size='tiny'/>
						      <List.Content>
						        <List.Header as='a'>{listing.book.title}</List.Header>
						        <List.Description>
						          {listing.description}
						        </List.Description>
						      </List.Content>
						      <Button icon color='blue' labelPosition='left' type='submit' size='small'>
						      	<Icon name='edit' />
						      	Edit
						      </Button>
						      	<Button icon color='red' labelPosition='left' type='submit' size='small' onClick={this.handleDeleteListing}>
						      	<Icon name='trash' />
						      	Delete
						      </Button>
						    </List.Item>)
						})
						}
					</List>
				 </div>: 
				<Button type='submit'>'empty'</Button>
        	}
        	</div>
		)
	}
}

export default Dashboard;