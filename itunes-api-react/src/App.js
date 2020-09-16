//Created by: Byron Georgopoulos
//Created on: 25/08/2020
//Last Updated on: 08/09/2020
//Created for: HyperionDev - L02T21: Capstone II (Full-Stack Web-Development Bootcamp)
//Description: This is the React App of my Full-Stack Express & React Web App that uses the iTunes API.

//Import React
import React, { Component } from 'react';

//Styling, React-Bootstrap, & React-Toastify (npm install --save react-toastify)
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Media from 'react-bootstrap/Media';
import { toast, ToastContainer } from 'react-toastify';

//Import Country Flag (npm install --save react-country-flag)
import ReactCountryFlag from 'react-country-flag';

//Import Font-Awesome 5 (npm i -S @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faItunes } from '@fortawesome/free-brands-svg-icons';
import { faMusic, faVideo, faTv, faPodcast, faBookReader, faFilm, faBook, faDesktop, faHeart, faSearch, faEraser, faTimes, faTrashAlt, faPlay, faQuestionCircle, faLightbulb, faRedo, faExclamationTriangle, faArrowAltCircleUp, faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

//Import react-audio-player (npm install --save react-audio-player)
import ReactAudioPlayer from 'react-audio-player';

//Import Photo for when no album art
import noAlbumArt from './noAlbumArt.png';

class App extends Component {

  constructor(props) {

    super(props);

    this.state = { favTrackId: '', favArtworkUrl100: '', favPreviewUrl: '', favTrackViewUrl: '', favTrackName: '', favArtistViewUrl: '', favArtistName: '', favCollectionViewUrl: '', favCollectionName: '', favGenreName: '', favKind: '' };

    this.state = { slIndex: '', slArtworkViewUrl: '', slPreviewUrl: '', slTrackViewUrl: '', slTrackName: '', slArtistViewUrl: '', slArtistName: '', slCollectionViewUrl: '', slCollectionName: '', slGenreName: '', slKind: ''};

    this.state = {
      error: null,
      isLoading: false,
      searchTerm: '',
      mediaType: 'all',
      showAdOpts: false,
      numOfRes: '20',
      country: 'US',
      resultCount: '',
      searchData: [],
      searchMsg: '',
      didSearch: false,
      searchResTerm: '',
      searchResNum: '',
      searchResType: '',
      searchResCountry: '',
      favArr: [],
      trackIdArr: [],
      showModal: false,
      listPoped: false,
      cardImgHover: false,
      hoverIndex: '',
      previewUrl: '',
      trackName: '',
      artistName: '',
      playTrack: false,
      favHoverIndex: '',
      hasSpotlight: false,
      slHover: false,
      recSearchArr: [],
      favSearch: '',
      searchArr: [],
      searchedFavArr: false,
      favListOpen: false,
    };

  }

  //User Input for search
  handleSearchTerm = (event) => {
    let searchTerm = event.target.value;
    this.setState({ searchTerm: searchTerm });
  }

  handleMediaType = (event) => {
    event.preventDefault();
    let mediaType = event.target.value;
    this.setState({ mediaType: mediaType });
  }

  handleNumOfRes = (event) => {
    event.preventDefault();
    let numOfRes = event.target.value;
    this.setState({ numOfRes: numOfRes });
  }

  handleCountry = (event) => {
    event.preventDefault();
    let country = event.target.value;
    this.setState({ country: country });
  }

  //If user searches a previous search from the list
  searchAgain = (searchTerm, mediaType, numOfRes, country) => {

    this.setState({
      searchTerm: searchTerm,
      mediaType: mediaType,
      numOfRes: numOfRes,
      country: country,
    },
    () => {
      this.handleSearch();
    });

  }

  //When the user clicks the Search btn
  handleSearch = () => {

    this.setState({ didSearch: true });

    let searchTerm = this.state.searchTerm;
    let mediaType = this.state.mediaType;
    let numOfRes = this.state.numOfRes;
    let country = this.state.country;

    let recSearchArr = [];
    recSearchArr = this.state.recSearchArr;
    let recSearchObj = { searchTerm: searchTerm, mediaType: mediaType, numOfRes: numOfRes, country: country };
    recSearchArr.push(recSearchObj);
    this.setState({ recSerachArr: recSearchArr });

    let baseURL = 'https://itunes.apple.com/search?';
    let apiURL = ``;

    if (numOfRes === '' && country === '')
    {
      apiURL = `${baseURL}term=${searchTerm}&media=${mediaType}`;
    }
    else
      if (numOfRes === '')
      {
        apiURL = `${baseURL}term=${searchTerm}&media=${mediaType}&country=${country}`;
      }
      else
        if (country === '')
        {
          apiURL = `${baseURL}term=${searchTerm}&media=${mediaType}&limit=${numOfRes}`;
        }
        else
        {
          apiURL = `${baseURL}term=${searchTerm}&media=${mediaType}&limit=${numOfRes}&country=${country}`;
        }
    
    fetch('/userSearch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiURL: apiURL }),
      })
      .then(this.setState({ isLoading: true }))
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            resultCount: result.resultCount,
            searchData: result.results,
            isLoading: false,
            searchTerm: '',
            mediaType: 'all',
            numOfRes: '20',
            country: 'US',
          });
        },
        (error) => {
          console.log(error);
          this.setState({
            error
          });
        }
      )
      .catch(error => console.log('Error:', error));

      this.refs.searchInput.value = '';
  }

  //When the user searchs their Favourites List
  handleSearchFav = (event) => {
    let favSearch = event.target.value;
    this.setState({ favSearch: favSearch });
  }

  //When the user clicks the Search btn (in their Fav List Modal)
  handleSearchFavList = () => {

    this.refs.searchFavListInput.value = '';

    let favSearch = this.state.favSearch;
    let favArr = [];
    favArr = this.state.favArr;
    let searchArr = [];

    for (let i = 0; i <= favArr.length - 1; i++)
    {
      favArr = this.state.favArr;
      if (favArr[i].favTrackName.toString().toLowerCase().includes(favSearch.toLowerCase()) || favArr[i].favArtistName.toString().toLowerCase().includes(favSearch.toLowerCase()) || favArr[i].favCollectionName.toString().toLowerCase().includes(favSearch.toLowerCase()) || favArr[i].favKind.toString().toLowerCase().includes(favSearch.toLowerCase()))
      {
        searchArr.push({ id: favArr[i].id, favArtworkUrl100: favArr[i].favArtworkUrl100, favPreviewUrl: favArr[i].favPreviewUrl, favTrackViewUrl: favArr[i].favTrackViewUrl, favTrackName: favArr[i].favTrackName, favArtistViewUrl: favArr[i].favArtistViewUrl, favArtistName: favArr[i].favArtistName, favCollectionViewUrl: favArr[i].favCollectionViewUrl, favCollectionName: favArr[i].favCollectionName, favGenreName: favArr[i].favGenreName, favKind: favArr[i].favKind });
      }
      this.setState({ searchArr: searchArr });
    }

    this.setState({ searchedFavArr: true });
  }

  //If the user clicks on the Back btn in their search Modal (i.e. from back to their whole favourites list)
  cancelSearchFavList = () => {
    this.setState({ searchedFavArr: false });
  }

  //If the user clicks the Clear Input btn
  handleClearInput = () => {
    this.setState({ searchTerm: '', mediaType: 'all', numOfRes: '20', country: 'US', didSearch: false, searchMsg: '' });
  }

  //Function to change the iTunes API terms to terms more aesthetically pleasing (i.e. changes tvShows to TV Shows, and vice versa)
  mediaDropTog = () => {

    let mediaType = this.state.mediaType;
    let retMedType = '';

    switch (mediaType)
    {
      case 'all':
        retMedType = 'All';
      break;

      case 'music':
        retMedType = 'Music';
      break;

      case 'movie':
        retMedType = 'Movies';
      break;

      case 'tvShow':
        retMedType = 'TV Shows';
      break;

      case 'podcast':
        retMedType = 'Podcasts';
      break;

      case 'audiobook':
        retMedType = 'Audiobooks';
      break;

      case 'shortFilm':
        retMedType = 'Short Films';
      break;

      case 'ebook':
        retMedType = 'E-Books';
      break;

      case 'software':
        retMedType = 'Software';
      break;
    }

    return retMedType;

}

  //Function to determine what Font Awesome icon to use, dependening on what media type they have chosen
  medDropTogIcon = () => {
    let mediaType = this.state.mediaType;
    let retMedType;

    switch (mediaType) {
      case 'all':
        retMedType = faItunes;
        break;

      case 'music':
        retMedType = faMusic;
        break;

      case 'movie':
        retMedType = faVideo;
        break;

      case 'tvShow':
        retMedType = faTv;
        break;

      case 'podcast':
        retMedType = faPodcast;
        break;

      case 'audiobook':
        retMedType = faBookReader;
        break;

      case 'shortFilm':
        retMedType = faFilm;
        break;

      case 'ebook':
        retMedType = faBook;
        break;

      case 'software':
        retMedType = faDesktop;
        break;
    }

    return retMedType;
  }

  //Used to change the output in the Previous Search section, to make it more aesthetically pleasing (i.e. tvShow becomes TV Show)
  mediaMsg = (mediaType) => {

    let retMedType = '';

    switch (mediaType) {
      case 'all':
        retMedType = 'All';
        break;

      case 'music':
        retMedType = 'Music';
        break;

      case 'movie':
        retMedType = 'Movies';
        break;

      case 'tvShow':
        retMedType = 'TV Shows';
        break;

      case 'podcast':
        retMedType = 'Podcasts';
        break;

      case 'audiobook':
        retMedType = 'Audiobooks';
        break;

      case 'shortFilm':
        retMedType = 'Short Films';
        break;

      case 'ebook':
        retMedType = 'E-Books';
        break;

      case 'software':
        retMedType = 'Software';
        break;
    }

    return retMedType;

  }

  //Determine what Font Awesome icon must be used for the Previous Search table, next to the media type (i.e. if tvShow/TV Show, then a little TV icon is used)
  mediaMsgIcon = (mediaType) => {

    let retMedType;

    switch (mediaType) {
      case 'all':
        retMedType = faItunes;
        break;

      case 'music':
        retMedType = faMusic;
        break;

      case 'movie':
        retMedType = faVideo;
        break;

      case 'tvShow':
        retMedType = faTv;
        break;

      case 'podcast':
        retMedType = faPodcast;
        break;

      case 'audiobook':
        retMedType = faBookReader;
        break;

      case 'shortFilm':
        retMedType = faFilm;
        break;

      case 'ebook':
        retMedType = faBook;
        break;

      case 'software':
        retMedType = faDesktop;
        break;
    }

    return retMedType;
  }

  //When a user clicks on the heart btn upon hover of a search item's album art
  addFav = (trackId, artworkUrl100, previewUrl, trackViewUrl, trackName, artistViewUrl, artistName, collectionViewUrl, collectionName, genreName, kind) => {

    this.setState({ listPoped: true });
    let id;
    let favArr = [];
    favArr = this.state.favArr;
    let trackIdArr = [];
    trackIdArr = this.state.trackIdArr;

    if (trackIdArr.includes(trackId))
    {
      let alreadyFav = true;
      this.addFavToast(alreadyFav, id, artworkUrl100, trackName, artistName, collectionName, genreName, kind);
    }
    else
    {
      trackIdArr.push(trackId);
      this.setState({ trackIdArr: trackIdArr });

      this.setState({ favTrackId: trackId, favArtworkUrl100: artworkUrl100, favPreviewUrl: previewUrl, favTrackViewUrl: trackViewUrl, favTrackName: trackName, favArtistViewUrl: artistViewUrl, favArtistName: artistName, favCollectionViewUrl: collectionViewUrl, favCollectionName: collectionName, favGenreName: genreName, favKind: kind });

      if (favArr.length < 1)
      {
        id = '1';
      }
      else
      {
        id = favArr.length + 1;
      }

      let favObj = { trackId: trackId, id: id, favArtworkUrl100: artworkUrl100, favPreviewUrl: previewUrl, favTrackViewUrl: trackViewUrl, favTrackName: trackName, favArtistViewUrl: artistViewUrl, favArtistName: artistName, favCollectionViewUrl: collectionViewUrl, favCollectionName: collectionName, favGenreName: genreName, favKind: kind }
      favArr.push(favObj);
      this.setState({ favArr: favArr });
      let alreadyFav = false;
      this.addFavToast(alreadyFav, id, artworkUrl100, trackName, artistName, collectionName, genreName, kind);
    }

  }

  //What data must be displayed on the pop-up toast notification when an item is added to the user's Favourite List Array (provides an error message if the track ID (from iTunes API) is already present)
  addFavToast = (alreadyFav, id, artworkUrl100, trackName, artistName, collectionName, genreName, kind) => {

    let trackNameStr = trackName;
    let artistNameStr = artistName;
    let collectionNameStr = collectionName;

    let favToast;

    if (alreadyFav)
    {
      
      const options = {
        autoClose: true || 3000,
        closeButton: true,
        hideProgressBar: false,
        position: toast.POSITION.BOTTOM_CENTER,
        pauseOnHover: true,
        type: toast.TYPE.ERROR,
        containerId: 'A',
      };

      if (trackNameStr.length > 42) {
        trackNameStr = trackNameStr.slice(0, 42) + '..';
      }

      if (artistNameStr.length > 42) {
        artistNameStr = artistNameStr.slice(0, 42) + '..';
      }

      if (collectionNameStr.length > 42) {
        collectionNameStr = collectionNameStr.slice(0, 42) + '..';
      }

      favToast = toast
        (
          <div>
            <h5 style={{ color: 'black', fontWeight: 'bold' }} > <FontAwesomeIcon icon={faExclamationTriangle} /> ERROR : COULDN'T ADD ITEM TO FAVOURITES LIST <FontAwesomeIcon icon={faExclamationTriangle} /></h5>
            <hr className='hrPad'></hr>
            <Media style={{ height: '150px', width: '600px' }} >
              <img src={artworkUrl100.replace('100x100', '1200x1200')} style={{ width: '150px', height: '150px' }} />
              <Media.Body style={{ color: 'black'}} >
                <Container style={{ paddingTop: '35px'}} >
                  <Row>
                    <Col sm={4} style={{ textAlign: 'right', float: 'right', color: 'black', fontWeight: 'bold' }} ><h6 style={{ fontWeight: 'bold' }} >Title:</h6></Col>
                    <Col sm={8} style={{ textAlign: 'left', float: 'left', color: 'black' }} ><h6>{trackNameStr}.</h6></Col>
                  </Row>
                  <Row>
                    <Col sm={4} style={{ textAlign: 'right', float: 'right', color: 'black', fontWeight: 'bold' }} ><h6 style={{ fontWeight: 'bold' }} >Artist:</h6></Col>
                    <Col sm={8} style={{ textAlign: 'left', float: 'left', color: 'black' }} ><h6>{artistNameStr}.</h6></Col>
                  </Row>
                  <Row>
                    <Col sm={4} style={{ textAlign: 'right', float: 'right', color: 'black', fontWeight: 'bold' }} ><h6 style={{ fontWeight: 'bold' }}>Collection:</h6></Col>
                  <Col sm={8} style={{ textAlign: 'left', float: 'left', color: 'black' }} ><h6>{collectionNameStr}.</h6></Col>
                  </Row>
                  <Row>
                    <Col sm={4} style={{ textAlign: 'right', float: 'right', color: 'black', fontWeight: 'bold' }} ><h6 style={{ fontWeight: 'bold' }}>Reason:</h6></Col>
                    <Col sm={8} style={{ textAlign: 'left', float: 'left', color: 'black' }} ><h6 style={{ fontWeight: 'bold' }}>ITEM ALREADY FAVOURITED</h6></Col>
                  </Row>
                </Container>
              </Media.Body>
            </Media>
          </div>
          , options);

    }

    else

    if (!alreadyFav)
    {

      const options = {
        autoClose: true || 3000,
        closeButton: true,
        hideProgressBar: false,
        position: toast.POSITION.BOTTOM_CENTER,
        pauseOnHover: true,
        containerId: 'A',
      };

      if (trackNameStr.length > 42) {
        trackNameStr = trackNameStr.slice(0, 42) + '..';
      }

      if (artistNameStr.length > 42) {
        artistNameStr = artistNameStr.slice(0, 42) + '..';
      }

      if (collectionNameStr.length > 42) {
        collectionNameStr = collectionNameStr.slice(0, 42) + '..';
      }

      favToast = toast
        (
          <div>
            <h5 id='toastHead' style={{ color: 'black', fontWeight: 'bold' }}> <FontAwesomeIcon icon={faHeart} style={{ color: '#DC3545' }} /> NEW FAVOURITE ADDED <FontAwesomeIcon icon={faHeart} style={{ color: '#DC3545' }} /> </h5>
            <hr className='hrPad' ></hr>
            <Media style={{ height: '150px', width: '600px' }} >
              <img src={artworkUrl100.replace('100x100', '1200x1200')} style={{ width: '150px', height: '150px' }} />
              <Media.Body >
                <Container className='toastCon' >
                  <Row>
                    <Col sm={4} style={{ textAlign: 'right', float: 'right', color: 'black', fontWeight: 'bold' }} ><h6 style={{ fontWeight: 'bold' }} >Title:</h6></Col>
                    <Col sm={8} style={{ textAlign: 'left', float: 'left', color: 'black' }} ><h6>{trackNameStr}.</h6></Col>
                  </Row>
                  <Row>
                    <Col sm={4} style={{ textAlign: 'right', float: 'right', color: 'black', fontWeight: 'bold' }} ><h6 style={{ fontWeight: 'bold' }} >Artist:</h6></Col>
                    <Col sm={8} style={{ textAlign: 'left', float: 'left', color: 'black' }} ><h6>{artistNameStr}.</h6></Col>
                  </Row>
                </Container>
                <hr className='hrPad' ></hr>
                <Container className='toastCon' >
                  <Row>
                    <Col sm={4} style={{ textAlign: 'right', float: 'right', color: 'black', fontWeight: 'bold' }} ><h6 style={{ fontWeight: 'bold' }}>Collection:</h6></Col>
                    <Col sm={8} style={{ textAlign: 'left', float: 'left', color: 'black' }} ><h6>{collectionNameStr}.</h6></Col>
                  </Row>
                  <Row>
                    <Col sm={4} style={{ textAlign: 'right', float: 'right', color: 'black', fontWeight: 'bold' }} ><h6 style={{ fontWeight: 'bold' }} >Genre:</h6></Col>
                    <Col sm={8} style={{ textAlign: 'left', float: 'left', color: 'black' }} ><h6>{genreName}.</h6></Col>
                  </Row>
                  <Row>
                    <Col sm={4} style={{ textAlign: 'right', float: 'right', color: 'black', fontWeight: 'bold' }} ><h6 style={{ fontWeight: 'bold' }}>Kind:</h6></Col>
                    <Col sm={8} style={{ textAlign: 'left', float: 'left', color: 'black' }} ><h6>{this.kindStrManip(kind)}.</h6></Col>
                  </Row>
                  <Row>
                    <Col sm={4} style={{ textAlign: 'right', float: 'right', color: 'black', fontWeight: 'bold' }} ><h6 style={{ fontWeight: 'bold' }}>Favourites Total:</h6></Col>
                    <Col sm={8} style={{ textAlign: 'left', float: 'left', color: 'black' }} ><h6>{id}.</h6></Col>
                  </Row>
                </Container>
              </Media.Body>
            </Media>
          </div>
          ,options);
    }

    return favToast;

  }

  //Simple function determining how the 'Back To Top' btn behaves that is located bottom-right of the page, just above the music navbar
  sideBtnToast = () => {

    const options = {
      autoClose: false,
      closeButton: false,
      hideProgressBar: true,
      position: toast.POSITION.BOTTOM_RIGHT,
      closeOnClick: false,
      containerId: 'B',
    };

    let sideBtnToast = toast(
      <div>
          <Button onClick={this.backToTop} variant='outline-info' > <FontAwesomeIcon icon={faArrowAltCircleUp} style={{ fontSize: '30px' }} /> </Button>
        </div>
    ,options);

    return sideBtnToast;

  }

  //When component mounts, ensure the sideBtnToast function (above) is called, and rendered
  componentDidMount () {
    this.sideBtnToast();
  }

  //Function for when a user clicks on the delete btn on their favourites list, whether their whole favourties, or when searching their favourites
  remFav = (id, index) => {

    let favArr = [];
    favArr = this.state.favArr;

    let searchArr = [];
    searchArr = this.state.searchArr;

    let slIndex = this.state.slIndex;

    if (slIndex + 1 > id)
    {
      this.setState({ slIndex: slIndex - 1});
    }

    if (searchArr != null)
    {
      favArr.splice(id - 1, 1);
      this.setState({ favArr: favArr });

      searchArr.splice(index, 1);
      this.setState({ searchArr: searchArr });
    }
    else
    {
      favArr.splice(id - 1, 1);
      this.setState({ favArr: favArr });
    }

    for (let i = 0; i <= favArr.length - 1; i++)
    {
      let favArr = this.state.favArr;
      favArr[i].id = i + 1;
      this.setState({ favArr: favArr });
    }

    if (favArr.length == 0)
    {
      this.setState({ listPoped: false });
    }

  }

  //Function to determine what data must be displayed in the 'Spotlight' card if a spotlight item has been added
  favSpotlight = (id, artworkUrl100, previewUrl, trackViewUrl, trackName, artistViewUrl, artistName, collectionNameUrl, collectionName, genreName, kind) => {
    this.setState({ slIndex: id, slArtworkViewUrl: artworkUrl100, slPreviewUrl: previewUrl, slTrackViewUrl: trackViewUrl, slTrackName: trackName, slArtistViewUrl: artistViewUrl, slArtistName: artistName, slCollectionViewUrl: collectionNameUrl, slCollectionName: collectionName, slGenreName: genreName, slKind: kind });
    this.setState({ hasSpotlight: true });
  }

  //When the kind is returned from the API, make the result more aesthetically pleasing (i.e. feature-movie becomes Feature Movie)
  kindStrManip = (kind) => {
    
    let retKind = '';

    switch (kind) {
      case 'song':
        retKind = 'Song';
        break;

      case 'book':
        retKind = 'Book';
        break;

      case 'coached-audio':
        retKind = 'Coached-Audio';
        break;

      case 'feature-movie':
        retKind = 'Feature Movie';
        break;

      case 'interactive-booklet':
        retKind = 'Interactive Booklet';
        break;

      case 'music-video':
        retKind = 'Music Video';
        break;

      case 'pdf':
        retKind = 'PDF';
        break;

      case 'podcast':
        retKind = 'Podcast';
        break;

      case 'podcast-episode':
        retKind = 'Podcast Episode';
        break;

      case 'software-package':
        retKind = 'Software Package';
        break;

      case 'tv-episode':
        retKind = 'TV Episode';
        break;

      case 'artistFor':
        retKind = 'Artist For';
        break;
    }
    
    return retKind;

  }

  //When album art is hovered over, set the index (bind), and change the opacity
  imgHoverTrue = (index, event) => {
    this.setState({ cardImgHover: true });
    this.setState({ hoverIndex: index });
    event.target.style.opacity = '0.25';
  }

  //When album art is no longer hovered over, return to default opacity
  imgHoverFalse = (event) => {
    this.setState({ cardImgHover: false });
    event.target.style.opacity = '1.0';
  }

  //When an item from the favourites list is hovered over, so that the specified index (using bind) can change color
  favHoverTrue = (index) => {
    this.setState({ favHoverIndex: index });
  }

  //When nothing in the favourites list is hovered over, make sure the index is null so that no color changes are apparent
  favHoverFalse = () => {
    this.setState({ favHoverIndex: null });
  }

  //When the user's spotlight track is hovered over
  slHoverTrue = (event) => {
    this.setState({ slHover: true });
    event.target.style.opacity = '0.25';
  }

  //When the user stops hovering over their Spotlight
  slHoverFalse = (event) => {
    this.setState({ slHover: false });
    event.target.style.opacity = '1.0';
  }

  //When the play btn is pressed (upon hover of album art)
  playTrack = (previewUrl, trackName, artistName) => {
    this.setState({ previewUrl: previewUrl, trackName: trackName, artistName: artistName });
    this.setState({ playTrack: true });
  }

  //Open Modal
  openModal = () => {
    this.setState({ showModal: true });
  }


  //Close Modal
  closeModal = () => {
    this.setState({ searchedFavArr: false });
    this.setState({ showModal: false });
  }

  //When the back to top button is pressed, scroll to top, and scroll smoothly
  backToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  //Render method
  render() {

    //Variables from state
    let error = this.state.error;
    let isLoading = this.state.isLoading;
    let didSearch = this.state.didSearch;
    let medDropTog = this.mediaDropTog();
    let medDropTogIcon = this.medDropTogIcon();
    let searchData = this.state.searchData;
    let cardImgHover = this.state.cardImgHover;
    let previewUrl = this.state.previewUrl;
    let trackName = this.state.trackName;
    let artistName = this.state.artistName;
    let playTrack = this.state.playTrack;

    //Map the returned search data as bootstarp cards
    let mapSearchData = searchData.map((item, index) => (
      <div className='col-md-4' ref='dataCol'>
        <Card id='dataCard' ref='dataCard' >
          <div onMouseEnter={this.imgHoverTrue.bind(this, index)} onMouseLeave={this.imgHoverFalse}>
            <Image variant='top' src={item.artworkUrl100.replace('100x100', '1200x1200')} style={{ width: '298px', height: '298px' }} />
            {
              cardImgHover &&
              (
                <Button onClick={this.addFav.bind(this, item.trackId, item.artworkUrl100, item.previewUrl ,item.trackViewUrl, item.trackName, item.artistViewUrl, item.artistName, item.collectionViewUrl, item.collectionName, item.primaryGenreName, item.kind )} style={{ display: this.state.hoverIndex === index ? '' : 'none', position: 'absolute', top: '20px', right: '100px', borderRadius: '50%', width: '100px', height: '100px' }} variant='danger' > <h1 style={{ paddingTop: '10px' }}><FontAwesomeIcon icon={faHeart} /></h1> </Button>
              )
            }
            {
              cardImgHover &&
              (
                <Button onClick={this.playTrack.bind(this, item.previewUrl, item.trackName, item.artistName)} style={{ display: this.state.hoverIndex === index ? '' : 'none', position: 'absolute', bottom: '275px', right: '100px', borderRadius: '50%', width: '100px', height: '100px' }} variant='info' > <h1 style={{ paddingTop: '10px', paddingLeft: '5px' }}><FontAwesomeIcon icon={faPlay} /></h1> </Button>
              )
            }
          </div>
          <Card.Body>
            <Card.Title id='cardTitle'><a href={item.trackViewUrl} target='_blank'><h5>{item.trackName}</h5></a></Card.Title>
            <hr></hr>
            <Card.Text><b>Artist:</b> <a href={item.artistViewUrl} target='_blank'>{item.artistName}</a>.</Card.Text>
            <Card.Text><b>Collection:</b> <a href={item.collectionViewUrl} target='_blank'>{item.collectionName}</a>.</Card.Text>
            <Card.Text><b>Genre:</b> {item.primaryGenreName}.</Card.Text>
            <Card.Text><b>Kind:</b> {this.kindStrManip(item.kind)}.</Card.Text>
          </Card.Body>
        </Card>
        <br></br>
      </div>
    ));

    let favArr;
    favArr = this.state.favArr;
    let listPoped = this.state.listPoped;
    
    //When an item is favourited, map it as a custom list, using bootstrap grids
    let mapFavArr = favArr.map((item, index) => (
      <div onMouseEnter={this.favHoverTrue.bind(this, index)} onMouseLeave={this.favHoverFalse.bind(this, index)}>
        <Container style={{ backgroundColor: this.state.favHoverIndex === index ? 'lightGrey' : '', paddingBottom: '10px', paddingTop: '10px' }} >
          <Row className='favList' >
            <Col sm={1}><Button onClick={this.playTrack.bind(this, item.favPreviewUrl, item.favTrackName, item.favArtistName)} variant='info' > <FontAwesomeIcon icon={faPlay} /> </Button></Col>
            <Col sm={1}>{item.id}.</Col>
            <Col sm={2}>{item.favTrackName}</Col>
            <Col sm={2}>{item.favArtistName}</Col>
            <Col sm={2}>{item.favCollectionName}</Col>
            <Col sm={1}>{item.favGenreName}</Col>
            <Col sm={1}>{this.kindStrManip(item.favKind)}</Col>
            <Col sm={1}><Button onClick={this.favSpotlight.bind(this, item.id, item.favArtworkUrl100, item.favPreviewUrl, item.favTrackViewUrl, item.favTrackName, item.favArtistViewUrl, item.favArtistName, item.favCollectionViewUrl, item.favCollectionName, item.favGenreName, item.favKind)} variant='dark' style={{ backgroundColor: this.state.slIndex === (item.id) ? '#eed760' : '', borderColor: this.state.slIndex === (item.id) ? '#eed760' : '' }}><FontAwesomeIcon icon={faLightbulb} /></Button></Col>
            <Col sm={1}><Button onClick={this.remFav.bind(this, item.id)} variant='danger' ><FontAwesomeIcon icon={faTrashAlt} /></Button></Col>
          </Row>
        </Container>
      </div>
    ));

    let searchArr;
    searchArr = this.state.searchArr;
    let searchedFavArr = this.state.searchedFavArr;

    //Map the returned (matching) items from the Favourties list that match the users search parameters
    let mapSearchArr = searchArr.map((item, index) => (
      <div onMouseEnter={this.favHoverTrue.bind(this, index)} onMouseLeave={this.favHoverFalse.bind(this, index)}>
        <Container style={{ backgroundColor: this.state.favHoverIndex === index ? 'lightGrey' : '', paddingBottom: '10px', paddingTop: '10px' }} >
          <Row className='favList' >
            <Col sm={1}><Button onClick={this.playTrack.bind(this, item.favPreviewUrl, item.favTrackName, item.favArtistName)} variant='info' > <FontAwesomeIcon icon={faPlay} /> </Button></Col>
            <Col sm={1}>{item.id}.</Col>
            <Col sm={2}>{item.favTrackName}</Col>
            <Col sm={2}>{item.favArtistName}</Col>
            <Col sm={2}>{item.favCollectionName}</Col>
            <Col sm={1}>{item.favGenreName}</Col>
            <Col sm={1}>{this.kindStrManip(item.favKind)}</Col>
            <Col sm={1}><Button onClick={this.favSpotlight.bind(this, item.id, item.favArtworkUrl100, item.favPreviewUrl, item.favTrackViewUrl, item.favTrackName, item.favArtistViewUrl, item.favArtistName, item.favCollectionViewUrl, item.favCollectionName, item.favGenreName, item.favKind)} variant='dark' style={{ backgroundColor: this.state.slIndex === (item.id) ? '#eed760' : '', borderColor: this.state.slIndex === (item.id) ? '#eed760' : '' }}><FontAwesomeIcon icon={faLightbulb} /></Button></Col>
            <Col sm={1}><Button onClick={this.remFav.bind(this, item.id, index)} variant='danger' ><FontAwesomeIcon icon={faTrashAlt} /></Button></Col>
          </Row>
        </Container>
      </div>
    ));

    let hasSpotlight = this.state.hasSpotlight;
    let slHover = this.state.slHover;
    let slTrackViewUrl = this.state.slTrackViewUrl;
    let slArtistViewUrl = this.state.slArtistViewUrl;
    let slCollectionViewUrl = this.state.slCollectionViewUrl;

    //Spotlight Card 
    let dispSpotlight = (
      <div>
        <Card id='dataCard' ref='dataCard' >
          {
            hasSpotlight &&
            <div onMouseEnter={this.slHoverTrue} onMouseLeave={this.slHoverFalse}>
              <Image variant='top' src={this.state.slArtworkViewUrl.replace('100x100', '1200x1200')} style={{ width: '298px', height: '298px' }} />
              {
                slHover &&
                (
                  <Button onClick={this.playTrack.bind(this, this.state.slPreviewUrl, this.state.slTrackName, this.state.slArtistName)} style={{ display: this.state.slHover === true ? '' : 'none', position: 'absolute', bottom: '350px', right: '100px', borderRadius: '50%', width: '100px', height: '100px' }} variant='info' > <h1 style={{ paddingTop: '10px', paddingLeft: '5px' }}><FontAwesomeIcon icon={faPlay} /></h1> </Button>
                )
              }
            </div>
          }
          <Card.Body>
            <Card.Title id='cardTitle'><a href={slTrackViewUrl} target='_blank'><h5>{this.state.slTrackName}</h5></a></Card.Title>
            <hr></hr>
            <Card.Text><b>Artist:</b> <a href={slArtistViewUrl} target='_blank'>{this.state.slArtistName}</a>.</Card.Text>
            <Card.Text><b>Collection:</b> <a href={slCollectionViewUrl} target='_blank'>{this.state.slCollectionName}</a>.</Card.Text>
            <Card.Text><b>Genre:</b> {this.state.slGenreName}.</Card.Text>
            <Card.Text><b>Kind:</b> {this.kindStrManip(this.state.slKind)}.</Card.Text>
          </Card.Body>
        </Card>
        <br></br>
      </div>
    );
  
  //Popover icon (looks like a '?') to explain how iTunes API works
  let recentSearch = (
      <Popover style={{ maxWidth: '1000px', width: '350px' }} >
        <Popover.Content id='searchMsg'>
          <h4 style={{ textAlign: 'center', float: 'center' }} >iTunes Search API: Notes</h4>
          <hr></hr>
        <Container>
            <Row>
            <Col sm={1}><h6>•</h6></Col>
            <Col sm={10}><h6>To improve response times, minimize the number of search results the iTunes Search API returns by selecting a smaller value from the dropdown button above (default is 20).</h6></Col>
            </Row>
          <Row>
            <Col sm={1}><h6>•</h6></Col>
            <Col sm={10}><h6>The iTunes Search API is limited to approximately 20 calls per minute (as of 31 Aug 2020). This is subject to change by Apple.</h6></Col>
          </Row>
          </Container>
        </Popover.Content>
      </Popover>
  );

  let recSearchArr = this.state.recSearchArr;
  
  //Map the Recent Search custom table
  let mapRecSearchArr = recSearchArr.map((item, index) => (
    <div>
      <Container>
        <Row className='recSearchList'>
          <Col sm={3}><h5 className='recSerachTerm'>{item.searchTerm}</h5></Col>
          <Col sm={2}><h5>{<FontAwesomeIcon icon={this.mediaMsgIcon(item.mediaType)} />} {this.mediaMsg(item.mediaType)}</h5></Col>
          <Col sm={2}><h5>{item.numOfRes}</h5></Col>
          <Col sm={3}><h5>{<ReactCountryFlag countryCode={item.country} svg />} {item.country}</h5></Col>
          <Col sm={2}><Button onClick={this.searchAgain.bind(this, item.searchTerm, item.mediaType, item.numOfRes, item.country)} id='searchAgainBtn' variant='success' ><FontAwesomeIcon icon={faRedo} /> Research</Button></Col>
        </Row>
      </Container>
      <hr></hr>
    </div>
  ));

    //Error Handling
    if (error)
    {
      return <div>Error: {error.message}</div>;
    }
    else
    {
      return (

        <div className='App'>

            <Navbar fixed='bottom' id='musicNav' className='justify-content-center'>
              {
                playTrack &&
                <div>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
                    <h6 style={{ marginTop: 'auto', marginBottom: 'auto' }} ><b>NOW PLAYING:</b> {trackName} - {artistName}</h6>
                    <ReactAudioPlayer src={previewUrl} autoPlay={playTrack} controls currentTime duration style={{ backgroundColor: 'black', width: '500px', float: 'center', justifyContent: 'center' }} />
                    <div style={{ marginTop: 'auto', marginBottom: 'auto', float: 'right' }} >
                    </div>
                  </div>
                </div>
              }
              {
                !playTrack &&
                <div>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
                    <h6 style={{ marginTop: 'auto', marginBottom: 'auto' }} >No Track Selected...</h6>
                    <ReactAudioPlayer src={previewUrl} autoPlay={playTrack} controls currentTime duration style={{ backgroundColor: 'black', width: '500px', float: 'center', justifyContent: 'center' }} />
                    <div style={{ marginTop: 'auto', marginBottom: 'auto', float: 'right' }} >
                    </div>
                  </div>
                </div>
              }
            </Navbar>

          <div>
            <ToastContainer enableMultiContainer containerId={'A'} limit={1} className='addFavToast'/>
            <ToastContainer enableMultiContainer containerId={'B'} className='sideBtnToast'/>

            {this.addFavToast}
            {this.sideBtnToast}
          </div>
          
          <Modal id='favModal' show={this.state.showModal} onHide={this.closeModal} animation={true} centered size='xl'>
            <Modal.Body>
              <br></br>
              <h2>Your Favourites from the iTunes Store:</h2>
              <br></br>
              <hr></hr>
              {
                !listPoped &&
                <div>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <h3>No Favourites from the iTunes Store Added Yet.</h3>
                  <hr></hr>
                  <h5>Click on the <FontAwesomeIcon icon={faHeart} style={{ color: '#DC3545'}} /> button to add an item to your favourites whilst hovering over an image...</h5>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                </div>
              }
              {
                listPoped &&
                <div>
                  <hr></hr>
                  {
                    searchedFavArr &&
                    <div>
                      <h3 className='favModalHead'>Search Results: </h3>
                      <h6>Searching for: '{this.state.favSearch}'</h6>
                      <hr></hr>
                      <Container>
                        <Row className='favList'>
                          <Col sm={1}><b>Play:</b></Col>
                          <Col sm={1}><b>ID:</b></Col>
                          <Col sm={2}><b>Title:</b></Col>
                          <Col sm={2}><b>Artist:</b></Col>
                          <Col sm={2}><b>Collection:</b></Col>
                          <Col sm={1}><b>Genre:</b></Col>
                          <Col sm={1}><b>Kind:</b></Col>
                          <Col sm={1}><b>Spotlight:</b></Col>
                          <Col sm={1}><b>Delete:</b></Col>
                        </Row>
                        <hr></hr>
                      </Container>
                      {mapSearchArr}
                    </div>
                  }
                  {
                    !searchedFavArr &&
                    <div>
                      <h3 className='favModalHead'>Your List of iTunes Store API Favourties: </h3>
                      <hr></hr>
                      <Container>
                        <Row className='favList'>
                          <Col sm={1}><b>Play:</b></Col>
                          <Col sm={1}><b>ID:</b></Col>
                          <Col sm={2}><b>Title:</b></Col>
                          <Col sm={2}><b>Artist:</b></Col>
                          <Col sm={2}><b>Collection:</b></Col>
                          <Col sm={1}><b>Genre:</b></Col>
                          <Col sm={1}><b>Kind:</b></Col>
                          <Col sm={1}><b>Spotlight:</b></Col>
                          <Col sm={1}><b>Delete:</b></Col>
                        </Row>
                        <hr></hr>
                      </Container>
                      {mapFavArr}
                    </div>
                  }
                </div>
              }
              <hr></hr>
              {
                !listPoped &&
                (
                  <Button variant='danger' onClick={this.closeModal} id='closeFavBtn'> <FontAwesomeIcon icon={faTimes} /> Close</Button>
                )
              }
              {
                listPoped &&
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Form.Label id='favSearchLabel'>Search Favourites: </Form.Label>
                    <p style={{ color: 'white' }} >___</p>
                    <Form.Control onChange={this.handleSearchFav} id='favSearchInput' type='text' placeholder='e.g. Coldplay...' ref='searchFavListInput' />
                    <p style={{ color: 'white' }} >___</p>
                    <Button onClick={this.handleSearchFavList} variant='success' id='searchFavBtn'>{<FontAwesomeIcon icon={faSearch} />} Search</Button>
                    <p style={{ color: 'white' }} >___</p>
                    {
                      searchedFavArr &&
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <Button onClick={this.cancelSearchFavList} variant='warning' id='cancelSearchFavBtn'>{<FontAwesomeIcon icon={faArrowAltCircleLeft} />} Back</Button>
                      <p style={{ color: 'white' }} >___</p>
                      </div>
                    }
                    <Button variant='danger' onClick={this.closeModal} id='closeFavBtn'> <FontAwesomeIcon icon={faTimes} /> Close</Button>
                  </div>
              }
              <hr></hr>
            </Modal.Body>
          </Modal>
          
          <br></br>
          <h1>iTunes Store API:</h1>
          <hr></hr>
          <br></br>
          <Container>
            <Row>
              <Col sm={8}>
                <h3>Search the iTunes Store:</h3>
                <hr></hr>
                <Form id='searchForm'>
                  <Container>
                    <Form.Group>
                      <Row>
                        <Col sm={4}>
                          <Form.Label className='searchFormLabel'>Enter a Search Term:</Form.Label>
                        </Col>
                        <Col sm={8}>
                          <Form.Control onChange={this.handleSearchTerm} id='searchInput' type='text' placeholder='e.g. Coldplay...' ref='searchInput' />
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group>
                      <Row>
                        <Col sm={4}>
                          <Form.Label className='searchFormLabel'>Select Type of Media:</Form.Label>
                        </Col>
                        <Col sm={8}>
                          <Dropdown ref='mediaSelect'>
                            <Dropdown.Toggle variant='outline-dark' className='dropdownToggle' ref='mediaSelect' ><FontAwesomeIcon icon={medDropTogIcon} /> {medDropTog}</Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item as='button' onClick={this.handleMediaType} className='dropdownOpt' value='all'><FontAwesomeIcon icon={faItunes} /> All</Dropdown.Item>
                              <Dropdown.Item as='button' onClick={this.handleMediaType} className='dropdownOpt' value='music'><FontAwesomeIcon icon={faMusic} /> Music</Dropdown.Item>
                              <Dropdown.Item as='button' onClick={this.handleMediaType} className='dropdownOpt' value='movie'><FontAwesomeIcon icon={faVideo} /> Movies</Dropdown.Item>
                              <Dropdown.Item as='button' onClick={this.handleMediaType} className='dropdownOpt' value='tvShow'><FontAwesomeIcon icon={faTv} /> TV Shows</Dropdown.Item>
                              <Dropdown.Item as='button' onClick={this.handleMediaType} className='dropdownOpt' value='podcast'><FontAwesomeIcon icon={faPodcast} /> Podcasts</Dropdown.Item>
                              <Dropdown.Item as='button' onClick={this.handleMediaType} className='dropdownOpt' value='audiobook'><FontAwesomeIcon icon={faBookReader} /> Audiobooks</Dropdown.Item>
                              <Dropdown.Item as='button' onClick={this.handleMediaType} className='dropdownOpt' value='shortFilm'><FontAwesomeIcon icon={faFilm} /> Short Films</Dropdown.Item>
                              <Dropdown.Item as='button' onClick={this.handleMediaType} className='dropdownOpt' value='ebook'><FontAwesomeIcon icon={faBook} /> E-Books</Dropdown.Item>
                              <Dropdown.Item as='button' onClick={this.handleMediaType} className='dropdownOpt' value='software'><FontAwesomeIcon icon={faDesktop} /> Software</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Col>
                      </Row>
                    </Form.Group>
                        <Form.Group>
                          <Row>
                            <Col sm={4}>
                              <Form.Label className='searchFormLabel'>Number of Search Results:</Form.Label>
                            </Col>
                            <Col sm={8}>
                              <Dropdown ref='resSelect'>
                                <Dropdown.Toggle variant='outline-dark' className='dropdownToggle' ref='resSelect'>{this.state.numOfRes}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item as='button' onClick={this.handleNumOfRes} className='dropdownOpt' value='5'>5</Dropdown.Item>
                                  <Dropdown.Item as='button' onClick={this.handleNumOfRes} className='dropdownOpt' value='10'>10</Dropdown.Item>
                                  <Dropdown.Item as='button' onClick={this.handleNumOfRes} className='dropdownOpt' value='20'>20</Dropdown.Item>
                                  <Dropdown.Item as='button' onClick={this.handleNumOfRes} className='dropdownOpt' value='25'>25</Dropdown.Item>
                                  <Dropdown.Item as='button' onClick={this.handleNumOfRes} className='dropdownOpt' value='50'>50</Dropdown.Item>
                                  <Dropdown.Item as='button' onClick={this.handleNumOfRes} className='dropdownOpt' value='100'>100</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>
                          </Row>
                        </Form.Group>
                        <Form.Group>
                          <Row>
                            <Col sm={4}>
                              <Form.Label className='searchFormLabel'>iTunes Store Country:</Form.Label>
                            </Col>
                            <Col sm={8}>
                              <Dropdown ref='countrySelect'>
                                <Dropdown.Toggle variant='outline-dark' className='dropdownToggle' ref='countrySelect'><ReactCountryFlag countryCode={this.state.country} svg id='disBtnFlag' /> {this.state.country}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item as='button' onClick={this.handleCountry} className='dropdownOpt' value='US'><ReactCountryFlag countryCode='US' svg /> US</Dropdown.Item>
                                  <Dropdown.Item as='button' onClick={this.handleCountry} className='dropdownOpt' value='ZA'><ReactCountryFlag countryCode='ZA' svg /> ZA</Dropdown.Item>
                                  <Dropdown.Item as='button' onClick={this.handleCountry} className='dropdownOpt' value='GB'><ReactCountryFlag countryCode='GB' svg /> GB</Dropdown.Item>
                                  <Dropdown.Item as='button' onClick={this.handleCountry} className='dropdownOpt' value='GR'><ReactCountryFlag countryCode='GR' svg /> GR</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>
                          </Row>
                        </Form.Group>
                  </Container>
                  <hr></hr>
                  <Form.Group>
                    <Container>
                      <Row>
                        <Col>
                          <Button onClick={this.handleSearch} variant='success' className='searchBtn'>{<FontAwesomeIcon icon={faSearch} />} Search</Button>
                        </Col>
                        <Col>
                          <Button onClick={this.openModal} variant='danger' className='favBtn'>{<FontAwesomeIcon icon={faHeart} />} Favourites</Button>
                        </Col>
                        <Col>
                          <Button onClick={this.handleClearInput} variant='warning' className='clearInBtn'>{<FontAwesomeIcon icon={faEraser} />} Clear Search</Button>
                        </Col>
                      </Row>
                    </Container>
                  </Form.Group>
                </Form>
                <hr></hr>
                <br></br>
                <h3>Recently Searched: </h3>
                <div className='recSearchCon'>
                  <hr></hr>
                <Container>
                  <Row style={{ textAlign: 'left', width: '98%' }} >
                    <Col sm={3}><b>Search Term:</b></Col>
                    <Col sm={2}><b>Media Type:</b></Col>
                    <Col sm={2}><b>Result(s):</b></Col>
                    <Col sm={3}><b>iTunes Store Country:</b></Col>
                    <Col sm={2}><b>Research:</b></Col>
                  </Row>
                </Container>
                  <hr></hr>
                  {mapRecSearchArr}
                </div>

              </Col>

              <Col sm={4} style={{ borderLeftStyle: 'solid', borderLeftColor: 'lightgrey', borderLeftWidth: '1px' }} >
                <h3>My Spotlight:</h3>
                <hr></hr>
                {
                  hasSpotlight &&
                  <div>
                    {dispSpotlight}
                  </div>
                }
                {
                  !hasSpotlight &&
                    <div style={{ margin: 'auto', height: '50%' }} >
                    <Card id='dataCard' ref='dataCard' >
                          <Image variant='top' src={noAlbumArt} style={{ width: '298px', height: '298px' }} />
                      <Card.Body>
                        <Card.Title id='cardTitle'> <h4>No Spotlight...</h4> </Card.Title>
                        <hr></hr>
                        <Card.Text><b>Start adding to your Favourties & choose a Spotlight Item from your Favourties List...</b></Card.Text>
                      </Card.Body>
                    </Card>
                    <br></br>

                    </div>
                }
              </Col>
            </Row>
          </Container>
          <hr></hr>
          
          {
            didSearch &&
            <div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingTop: '3px'}} >
                  <OverlayTrigger trigger='hover' placement='left' overlay={recentSearch} >
                    <h1> <FontAwesomeIcon icon={faQuestionCircle} style={{ color: 'cornFlowerBlue' }} /> </h1>
                  </OverlayTrigger>
                  <p style={{ color: 'white' }} >_</p>
                <h2 style={{ paddingTop: '3px' }}>Search Results:</h2> 
                </div>
              <hr></hr>
            </div>
          }

          <br></br>
          {
            didSearch &&
            <div>
              {
                isLoading &&
                <div>
                  <Modal show animation={true} centered size='sm'>
                    <Modal.Body>
                      <br></br>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
                          <Spinner id='loadSpin' animation='border' variant='primary' />
                          <p style={{ color: 'white' }} >_</p>
                          <h3 id='loadText'>Loading...</h3>
                       </div>
                      <br></br>
                    </Modal.Body>
                  </Modal>
                </div>
              }
              {
                !isLoading &&
                <div>
                  <Container id='searchData'>
                    <Row>
                      {mapSearchData}
                    </Row>
                  </Container>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                </div>
              }
            </div>
          }

        </div>
      );
    }
  }
}

export default App;