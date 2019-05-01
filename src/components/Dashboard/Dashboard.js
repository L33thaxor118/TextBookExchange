import { Button, List, Image, Icon, Header, Dropdown, Input, Message } from 'semantic-ui-react';
import React, { Component } from 'react';

//import styles from './Dashboard.scss';
import listingsApi from '../../api/listings';
import usersApi from '../../api/users';
import booksApi from '../../api/books';
import { authentication, fetchPhotoUrls } from '../../utils/firebase';

import {
  AuthorsList
} from './Dashboard.styled';


class Dashboard extends Component {
	constructor() {
		super();
		this.state = {
			showListings: false,
			listingIds: [],
			user: [],
			listings:[],
			photoUrls:[],
			wishlist:[],
			books: [],
			image: 'https://cor-cdn-static.bibliocommons.com/assets/default_covers/icon-book-93409e4decdf10c55296c91a97ac2653.png',
			wishlistIsbn:'',
			wishlistBookId:'',
			wishlistBookTitle:undefined,
			errorIsbn: false,
			errorDupl: false,
			bookAdded: false
		}
		this.handleDeleteListing = this.handleDeleteListing.bind(this);
		this.handleDeleteWishlist = this.handleDeleteWishlist.bind(this);
		this.toggleListings = this.toggleListings.bind(this);
		this.toggleWishlist = this.toggleWishlist.bind(this);
		this.updateWishlistIsbn = this.updateWishlistIsbn.bind(this);
		this.updateWishlistBook= this.updateWishlistBook.bind(this);
		this.addBookToWishlist = this.addBookToWishlist.bind(this);
		this.hideMessage = this.hideMessage.bind(this);

	}

	async componentDidMount() {
		const id = authentication.currentUser.uid; // log into firebase to get user test w 100
		const userObj = await usersApi.get({id});
		const listingIds = userObj.user.listings;
		const booksObj = await booksApi.get({});
		this.setState({
			user:id,
			wishlist:[{
                "_id": "5cc221004c145b0011d8cdf1",
                "authors": [
                    "Nivaldo J. Tro"
                ],
                "isbn": "0134112830",
                "title": "Chemistry: A Molecular Approach"
            }, {
			    "_id": "5cc22a9e9d52f60011319df6",
			    "authors": [
			        "Markus Keller"
			    ],
			    "courses": [],
			    "isbn": "0124199879",
			    "title": "The Science of Grapevines: Anatomy and Physiology"
			},
			{
                "_id": "5cc21fe44c145b0011d8cdf0",
                "authors": [
                    "William L. Cleveland",
                    "Martin Bunton"
                ],
                "isbn": "081334980X",
                "title": "A History of the Modern Middle East"
            }],
			books: booksObj.books
		});
		console.log(this.state.books);
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
    			console.log('THERE');
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
		if (deletedListing) {
			const listingIndex = this.state.listingIds.indexOf(id);
			console.log(listingIndex);
	    	const newListingIds = [].concat(this.state.listingIds);
	    	newListingIds.splice(listingIndex, 1);
	    	const newListings = [].concat(this.state.listings);
	    	newListings.splice(listingIndex, 1);
	    	const newPhotoUrls = [].concat(this.state.photoUrls);
	    	newPhotoUrls.splice(listingIndex, 1);
	    	this.setState({listingIds:newListingIds, listings: newListings, photoUrls: newPhotoUrls});
    	}

	}

//document.write(book.authors.join(", "))

	async handleDeleteWishlist(book) {
		console.log('delete book from wishlist')
		// const deletedListing = await listingsApi.delete({id});
		// if (deletedListing) {
		// 	const listingIndex = this.state.listingIds.indexOf(id);
		// 	console.log(listingIndex);
	 //    	const newListingIds = [].concat(this.state.listingIds);
	 //    	newListingIds.splice(listingIndex, 1);
	 //    	const newListings = [].concat(this.state.listings);
	 //    	newListings.splice(listingIndex, 1);
	 //    	const newPhotoUrls = [].concat(this.state.photoUrls);
	 //    	newPhotoUrls.splice(listingIndex, 1);
	 //    	this.setState({listingIds:newListingIds, listings: newListings, photoUrls: newPhotoUrls});
  //   	}

	}

	async navigateToListingEdit(id) {
		// change to listing edit when view created, now going to listings details
		this.props.history.push(`/listings/${id}`);
	}

	async navigateToBookSearch(query) {
		console.log(query);
		this.props.history.push({
  			pathname: `/listings/`,
  			state: { query: query }
		})
	}
	toggleListings = () => {
		this.hideMessage();
		this.setState({showListings:true});
	}

	toggleWishlist= () => {
		this.hideMessage();
		this.setState({showListings:false});
	}

	async addBookToWishlist () {
		// if id already in wishlist array, show an error
		// else add it (if add by isbn, check isbn of book first)
		if (this.state.wishlistBookId==='' && this.state.wishlistIsbn==='') {
			console.log('Do nothing');
		}
		else if (this.state.wishlistBookId!=='') { // book in the DB
			var wl = this.state.wishlist;
			if (wl.some(e => e._id === this.state.wishlistBookId)) {
				console.log('Book already in wishlist!');
				this.setState({errorDupl:true});
			}
			else {
				console.log('Add book to wishlist');
				this.setState({bookAdded:true});
			} // if already in wishlist do nothing
		}
		else { // add book first then add to wishlist
			console.log('ADD book first')
			this.setState({errorIsbn:true});
		}
	}

	updateWishlistIsbn (event) {
		console.log(event.target.value);
		console.log(this.state.wishlistBookId);
	    this.setState({
	      wishlistIsbn: event.target.value,
	      wishlistBookId:'', // unselect !!!!
	    });
  	}

  	hideMessage () {
  		this.setState({errorDupl:false,errorIsbn:false, bookAdded:false, wishlistIsbn: '', wishlistBookId:''})
  	}

	updateWishlistBook (event, data) {
		const { value } = data;
		const { text } = data.options.find(o => o.value === value);
		// const updatedListing = this.state.newListing;
		// updatedListing.bookId = value;
		// updatedListing.title = text;
		//console.log(event.target.value);
		console.log(text); // title
		console.log(value); // book id

	    this.setState({
	      wishlistIsbn: '',
	      wishlistBookId: value,
	      wishlistBookTitle: text
	    });
  	};
    
//{active ? 'red' : null}

	render () {
		const showListings = (this.state.showListings===true);
		const emptyListings = !(this.state.listings);
		const emptyWishlist = !(this.state.wishlist);
		const errorDupl = this.state.errorDupl;
		const errorIsbn = this.state.errorIsbn;
		const bookAdded = this.state.bookAdded;


		var bookOptions = this.state.books.map( book => ({key: book.isbn, text: book.title, value: book._id }) )
    	//bookOptions.unshift({key: "no_select", text: "use ISBN", value: "None" })

		console.log(bookOptions);
		return (
			<div id="dashboard-content">
			<Header as='h2' textAlign='center'>Dashboard </Header>
			<Button.Group>
			    <Button onClick={this.toggleListings}> Your Listings </Button>
			    <Button onClick={this.toggleWishlist}> Your Wishlist </Button>
			</Button.Group>
			{showListings? // change
				(!emptyListings?
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
					 </div>
				:
				null
				)
				:
				(!emptyWishlist?
					<div>
					  <Dropdown
    					placeholder='Find book by title...'
    					search
    					selection
    					options={bookOptions}
    					noResultsMessage='Not found. Add with ISBN !'
    					onChange= {this.updateWishlistBook}
    					onClick = {this.hideMessage}
    					value = {this.state.wishlistBookId}
  						/>
  						<Input
  						  onChange={this.updateWishlistIsbn}
  						  value={this.state.wishlistIsbn}
  						  placeholder='Find book by ISBN...'
  						  onClick = {this.hideMessage}
  						/>

  						<Button icon color='red' labelPosition='left' type='submit' onClick={this.addBookToWishlist}> 
  							Add book to wishlist !
  							<Icon name='heart' />
  						</Button>

					{errorDupl && <Message
					      error
					      header='Error'
					      content='This book is already in your wishlist!'
					    />}
					{errorIsbn && <Message
					      error
					      header='Error'
					      content='ISBN not found. Please check again.'
					    />}
					 {bookAdded && <Message
					      positive
					      header='BOOK was added to your wishlist !'
					      content=':)'
					    />}
					 <List celled>
					 		{this.state.wishlist.map((book, index) => {
		    				    return (<List.Item>
							      <List.Content>
							      <Header as='h4'>{book.title}</Header>
								      	<AuthorsList>
								          {book.authors.join(', ')}
								        </AuthorsList>
								      <Button icon labelPosition='left' type='submit' size='tiny' onClick={() => this.navigateToBookSearch(book.title)}>
								      	<Icon name='search' />
								      	Find listings for this book
								      </Button>	     
									<Button icon color='red' labelPosition='left' type='submit' size='tiny' onClick={() => this.handleDeleteWishlist(book)}>
								      	<Icon name='trash' />
								      	Remove
								      </Button>	
							      </List.Content>

							    </List.Item>)
							})
							}
						</List>
					 </div>
				:
				null
				)
			}

        	</div>
		)

	}
}

export default Dashboard;