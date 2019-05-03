import { Button, List, Image, Icon, Header, Dropdown, Input, Message, Grid } from 'semantic-ui-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Flex } from '@rebass/grid';
import axios from 'axios';

import './Dashboard.scss';
import listingsApi from '../../api/listings';
import usersApi from '../../api/users';
import booksApi from '../../api/books';
import { fetchPhotoUrls } from '../../utils/firebase';

import {
  AuthorsList, DashboardMenu
} from './Dashboard.styled';


const lookupBookByISBN = isbn => axios.get('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn).then(({ data }) => data);

const STOCK_PHOTO_URL = 'https://cor-cdn-static.bibliocommons.com/assets/default_covers/icon-book-93409e4decdf10c55296c91a97ac2653.png';

class Dashboard extends Component {
	constructor() {
		super();
		this.state = {
			listingIds: [],
			user: [],
			listings:[],
			photoUrls:[],
			wishlist:[],
			wishlistIds:[],
			books: [],
			image: STOCK_PHOTO_URL,
			wishlistIsbn:'',
			wishlistBookId:'',
			wishlistBookTitle:undefined,
			errorIsbn: false,
			errorDupl: false,
			bookAdded: false,
			showIndex:0,
			currBookTitle:''
		}
		this.handleDeleteListing = this.handleDeleteListing.bind(this);
		this.handleDeleteWishlist = this.handleDeleteWishlist.bind(this);
		this.toggle = this.toggle.bind(this);
		this.updateWishlistIsbn = this.updateWishlistIsbn.bind(this);
		this.updateWishlistBook= this.updateWishlistBook.bind(this);
		this.handleWishlistAdd = this.handleWishlistAdd.bind(this);
		this.hideMessage = this.hideMessage.bind(this);
		this.addBookToWishlist = this.addBookToWishlist.bind(this);

	}

	async componentDidMount() {
		const { user } = this.props;
		const { books } = await booksApi.get({});
		const { listings } = await listingsApi.get({ userId: user.firebaseId });

		const photoUrls = await new Promise(async resolve => {
			const urls = [];
			
			for (let listing of listings) {
				if (listing.imageNames.length) {
					try {
						const photoUrl = await fetchPhotoUrls(listing._id, [listing.imageNames[0]]);
						urls.push(photoUrl);
					// If firebase throws an error, fall back to the stock photo
					} catch {
						urls.push(STOCK_PHOTO_URL);
					}
				} else {
					urls.push(STOCK_PHOTO_URL);
				}
			}

			resolve(urls);
		});

		const wishlistBooks = await new Promise(async resolve => {
			const books = [];

			for (let wishlistItem of user.wishlist) {
				const bookObj = await booksApi.get({ id: wishlistItem });
				books.push(bookObj.book);
			}

			resolve(books);
		});

		this.setState({
			wishlist: wishlistBooks,
			wishlistIds: user.wishlist,
			photoUrls,
			listings,
			listingIds: user.listings,
			user: user.firebaseId,
			books,
		});
	}

	async handleDeleteListing(id) {
		const deletedListing = await listingsApi.delete({id});
		if (deletedListing) {
			const listingIndex = this.state.listingIds.indexOf(id);
	    	const newListingIds = [].concat(this.state.listingIds);
	    	newListingIds.splice(listingIndex, 1);
	    	const newListings = [].concat(this.state.listings);
	    	newListings.splice(listingIndex, 1);
	    	const newPhotoUrls = [].concat(this.state.photoUrls);
	    	newPhotoUrls.splice(listingIndex, 1);
	    	this.setState({listingIds:newListingIds, listings: newListings, photoUrls: newPhotoUrls});
    	}

	}

	async handleDeleteWishlist(book, bookIndex) {
		const newWishlistIds = [].concat(this.state.wishlistIds);
	 	newWishlistIds.splice(bookIndex, 1);
	 	const newWishlist = [].concat(this.state.wishlist);
		newWishlist.splice(bookIndex, 1);
		const { user } = this.props;
		const wishlist = newWishlist;
		const updatedUser = await usersApi.update({id: user.firebaseId, wishlist})

		if (updatedUser) {
			this.setState({wishlist:newWishlist, wishlistIds:newWishlistIds});
    	}
    	console.log(updatedUser.wishlist);

	}

	async navigateToListingEdit(id) {
		// change to listing edit when view created, now going to listings details
		this.props.history.push(`/listings/${id}`);
	}

	async navigateToBookSearch(query) {
		console.log(query);
		this.props.history.push({
			pathname: '/listings',
			search: `?query=${query}&exact=true`
		});
	}
	async addBookToWishlist () {
		let newBook = this.state.books.find(o => o._id === this.state.wishlistBookId);
		var wishlist = [].concat(this.state.wishlistIds);
		wishlist.push(this.state.wishlistBookId);
		console.log(wishlist);
		const { user } = this.props;
		await usersApi.update({id: user.firebaseId, wishlist})
		this.setState({bookAdded:true, wishlistIds:[...this.state.wishlistIds,
			this.state.wishlistBookId], wishlist:[...this.state.wishlist,newBook],
			currBookTitle:newBook.title});
	}

	async handleWishlistAdd () {
		// if id already in wishlist array, show an error
		// else add it (if add by isbn, check isbn of book first)
		if (this.state.wishlistBookId==='' && this.state.wishlistIsbn==='') {
			console.log('Do nothing');
		}
		else if (this.state.wishlistBookId!=='') {
			var wl = this.state.wishlist;
			if (wl.some(e => e._id === this.state.wishlistBookId)) { // book already in wishlost
				this.setState({errorDupl:true});
			}
			else {
				this.addBookToWishlist();
			}
		}
		else { 
			wl = this.state.wishlist;
			if (wl.some(e => e.isbn === this.state.wishlistIsbn)) { // book already in wl
				this.setState({errorDupl:true});
			}
			else {
				try { 
					var books = this.state.books;
					var newBook;
					if (books.some(e => e.isbn === this.state.wishlistIsbn)) {
						newBook = books.find(e => e.isbn === this.state.wishlistIsbn);
					}
					else { // add book to DB first then add to wishlist
				        await lookupBookByISBN(this.state.wishlistIsbn);
				        const newBookObj = await booksApi.create({isbn: this.state.wishlistIsbn});
				        newBook = newBookObj.book;
					}
					var wishlist = [].concat(this.state.wishlistIds);
					wishlist.push(newBook._id);
					console.log(wishlist);
					const { user } = this.props;
					await usersApi.update({id: user.firebaseId, wishlist});
					this.setState({bookAdded:true, wishlistIds:[...this.state.wishlistIds,
						newBook._id], wishlist:[...this.state.wishlist,newBook],
						currBookTitle:newBook.title});


			    } catch {
			        this.setState({errorIsbn:true});
				}
			}
		}
	}

	updateWishlistIsbn (event) {
	    this.setState({
	      wishlistIsbn: event.target.value,
	      wishlistBookId:'',
	    });
  	}

  	hideMessage () {
  		this.setState({errorDupl:false,errorIsbn:false, bookAdded:false, wishlistIsbn: '', wishlistBookId:'', currBookTitle:''})
  	}

	updateWishlistBook (event, data) {
		const { value } = data;
		const { text } = data.options.find(o => o.value === value);
	    this.setState({
	      wishlistIsbn: '',
	      wishlistBookId: value,
	      wishlistBookTitle: text
	    });
  	};
    
	toggle (index) {
		this.setState({showIndex:index});
	}

	render () {
		const showListings = (this.state.showIndex===0);
		const emptyListings = !(this.state.listings);
		const emptyWishlist = !(this.state.wishlist);
		const errorDupl = this.state.errorDupl;
		const errorIsbn = this.state.errorIsbn;
		const bookAdded = this.state.bookAdded;

		const dashboardMenu = ['Your Listings', 'Your Wishlist'];

		var bookOptions = this.state.books.map( book => ({key: book.isbn, text: book.title, value: book._id }) )
		return (
			<div id="dashboard-content">
			<Header as='h2' textAlign='center'>Dashboard </Header>
			<div id="dash-nav">
			<Flex>
			{dashboardMenu.map((option, index) => {
	          return <DashboardMenu
	            key={index}
	            className={this.state.showIndex === index ? 'active' : 'inactive'}
	            onClick={() => this.toggle(index)}
	            label={option}
	          />
	      	})
	      	}
	      	</Flex>
	      	</div>

			{showListings? // change
				(!emptyListings?
					<div className="dashboard-details">
					 <List celled>
					 		{this.state.listings.map((listing, index) => {
		    				    return (<List.Item key={index}>
							      <Image src={this.state.photoUrls[index]} size='tiny'/>
							      <List.Content>
							      <Header as='h4'>{listing.book.title}</Header>
							        <List.Description>
							          Price: {listing.price ? `$${listing.price}` : '—'} <br />
							          Exchange For: {listing.exchangeBook ? listing.exchangeBook.title : '—'} <br />
							        </List.Description>
								      <div className="listing-buttons">
								      <Button className="listing-buttons" icon labelPosition='left' type='submit' size='tiny' onClick={() => this.navigateToListingEdit(listing._id)}>
								      	<Icon name='edit' />
								      	Edit
								      </Button>
								      	<Button className="listing-buttons" icon color='red' labelPosition='left' type='submit' size='tiny' onClick={() => this.handleDeleteListing(listing._id)}>
								      	<Icon name='trash' />
								      	Delete
								      </Button>	
								      </div>					        
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
					<div className="dashboard-details">
					<Grid columns={2} divided>
					<Grid.Column className="wishlist-form">
					<div>

					  <Dropdown
					  	className="form-elem"
    					placeholder='Find book by title...'
    					search
    					selection
    					options={bookOptions}
    					noResultsMessage='Not found. Add with ISBN !'
    					onChange= {this.updateWishlistBook}
    					onClick = {this.hideMessage}
    					value = {this.state.wishlistBookId}
  						/>
  						<br></br>
  						<Input
  						  className="form-elem"
  						  onChange={this.updateWishlistIsbn}
  						  value={this.state.wishlistIsbn}
  						  placeholder='Find book by ISBN...'
  						  onClick = {this.hideMessage}
  						/>
  						<br></br>
  						<Button icon 
  						color='red' 
  						labelPosition='left'
  						type='submit'
						className="form-elem"
  						onClick={this.handleWishlistAdd}> 
  							Add to wishlist !
  							<Icon name='heart' />
  						</Button>
  					
					{errorDupl && <Message
						  className="error-msg"
					      error
					      header='This book is already in your wishlist!'
					    />}
					{errorIsbn && <Message
						  className="error-msg"
					      error
					      header='ISBN not found. Please check again.'
					    />}
					 {bookAdded && <Message
					 	  className="error-msg"
					      positive
					      header= {this.state.currBookTitle+' added to your wishlist !'} 
					    />}

					   </div>
					    </Grid.Column>
					    <Grid.Column className="wishlist-form">
					 <List celled>
					 		{this.state.wishlist.map((book, index) => {
		    				    return (<List.Item key={index}>
							      <List.Content>
							      <Header as='h4'>{book.title}</Header>
							      		{book.authors && <AuthorsList>
								          {book.authors.join(', ')}
								        </AuthorsList>
								    	}
								      	
								      <Button icon labelPosition='left' type='submit' size='tiny' onClick={() => this.navigateToBookSearch(book.title)}>
								      	<Icon name='search' />
								      	Find listings
								      </Button>	     
									<Button icon color='red' labelPosition='left' type='submit' size='tiny' onClick={() => this.handleDeleteWishlist(book, index)}>
								      	<Icon name='trash' />
								      	Remove
								      </Button>	
							      </List.Content>

							    </List.Item>)
							})
							}
						</List>
							</Grid.Column>
						</Grid>
					 </div>
	 
:
				null
				)
			}

        	</div>
		)

	}
}


export default connect(state => state.loginState)(Dashboard);