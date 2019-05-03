import React, { Component } from 'react'; 
import { Icon } from 'semantic-ui-react';
import { Flex } from '@rebass/grid';
import './PhotosCarousel.scss';


class PhotosCarousel extends Component {
	constructor(props) {
		super();
		this.state = {
			currPhoto: 0,
			photos: []
		}
		this.goNext = this.goNext.bind(this);
		this.goPrev = this.goPrev.bind(this);
	}
	componentDidMount() {
		this.setState({photos: this.props.photos})
	}

	goNext() {
		var newPhoto = (this.state.currPhoto+1);
		if (newPhoto === this.state.photos.length) {
			newPhoto = 0;
		}
		this.setState({currPhoto: newPhoto})
	}

	goPrev() {
		var newPhoto = (this.state.currPhoto-1);
		if (newPhoto === (-1)) {
			newPhoto = (this.state.photos.length-1);
		}
		this.setState({currPhoto: newPhoto})
	}

	render () {
    	return (
    		<div>
    		<Flex flexDirection='row' width={1} alignItems='center'>
    		<Icon name='angle left' size='large' onClick={() => this.goPrev()}/>
			<img src={this.state.photos[this.state.currPhoto]} class="img" alt="book's photos"/>
    		<Icon name='angle right' size='large' onClick={() => this.goNext()}/>
    		</Flex>

    		</div>
        )
	}
}

export default PhotosCarousel;