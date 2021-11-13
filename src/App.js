import { Component } from 'react';

import { Header } from 'Header/Header';
import { SearchForm } from 'SearchForm/SearchForm';
import { ImageGallery } from 'ImageGallery/ImageGallery';
import { Footer } from './Footer/Footer';
import { Modal } from 'Modal/Modal';

function URL(searchValue = '', page = 1) {
  return `https://pixabay.com/api/?key=22936688-6b3396d854cca2c3f8d0c7d41&q=${searchValue}&page=${page}&per_page=12&image_type=photo&orientation=horizontal&safesearch=true`;
}

class App extends Component {
  state = {
    searchValue: '',
    status: 'idle',
    images: [],
    modal: {
      shown: false,
      imageUrl: '',
    },
  };

  onSearchSubmit = searchValue => {
    this.setState({ searchValue });
  };

  componentDidUpdate(prevProps, prevState) {
    const prevValue = prevState.searchValue;
    const newValue = this.state.searchValue;

    if (prevValue !== newValue) {
      // console.log(`Changed from '${prevValue}' to "${newValue}`);
      fetch(URL(newValue))
        .then(res => res.json())
        .then(data => {
          if (data.totalHits === 0) {
            console.log(`Sorry, we couldn't find anything for you(`);
            return;
          }

          this.setState(() => {
            return { images: [...data.hits] };
          });
        });
    }
  }
  // async componentDidMount() {
  //   this.setState({ loading: true });

  //   try {
  //     const items = await getTeachers();
  //     this.setState({ items });
  //   } finally {
  //     this.setState({ loading: false });
  //   }
  // }

  onGalleryCardClick = e => {
    const url = e.currentTarget.getAttribute('datasrc');
    this.toggleModal(url);
  };

  toggleModal = (imageUrl = '') => {
    this.setState(({ modal }) => {
      return { modal: { shown: !modal.shown, imageUrl } };
    });
  };

  render() {
    return (
      <div className="App">
        <Header />
        <div className="container">
          {this.state.modal.shown && (
            <Modal
              src={this.state.modal.imageUrl}
              alt="jhjhj"
              onModalClose={this.toggleModal}
            />
          )}
          <SearchForm onSubmit={this.onSearchSubmit} />
          {this.state.searchValue ? (
            <ImageGallery
              images={this.state.images}
              onCardClick={this.onGalleryCardClick}
            />
          ) : null}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
