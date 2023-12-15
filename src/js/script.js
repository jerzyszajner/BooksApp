{
  'use strict';

  class BooksList {
    constructor() {
      this.initData();
      this.getElements();
      this.initActions();
      this.render();
    }

    initData() {
      // Initialize data from dataSource
      this.data = dataSource.books;
      this.favoriteBooks = [];
      this.filters = [];
    }

    getElements() {
      // Get DOM elements
      this.booksListContainer = document.querySelector('.books-list');
      this.bookTemplate = Handlebars.compile(document.querySelector('#template-book').innerHTML);
      this.filtersForm = document.querySelector('.filters');
    }

    initActions() {
      const thisBooksList = this;

      // Add event listeners for book container and filters form
      this.booksListContainer.addEventListener('dblclick', function (event) {
        thisBooksList.addBookToFavorites(event);
      });

      this.filtersForm.addEventListener('click', function (event) {
        thisBooksList.handleFilterClick(event);
      });
    }

    render() {
      // Render books using Handlebars template
      for (let book of this.data) {
        const ratingWidth = book.rating * 10;
        const ratingBgc = this.determineRatingBgc(book.rating);
        const bookData = {
          id: book.id,
          name: book.name,
          price: book.price,
          rating: book.rating,
          ratingWidth,
          ratingBgc,
          image: book.image,
        };
        const generatedHTML = this.bookTemplate(bookData);
        const bookElement = utils.createDOMFromHTML(generatedHTML);
        this.booksListContainer.appendChild(bookElement);
      }
    }

    addBookToFavorites(event) {
      // Add book to favorites
      event.preventDefault();
      const clickedElement = event.target.offsetParent;
      if (clickedElement && clickedElement.classList.contains('book__image')) {
        const bookId = clickedElement.getAttribute('data-id');
        if (!this.favoriteBooks.includes(bookId)) {
          this.favoriteBooks.push(bookId);
          clickedElement.classList.add('favorite');
        } else {
          const index = this.favoriteBooks.indexOf(bookId);
          this.favoriteBooks.splice(index, 1);
          clickedElement.classList.remove('favorite');
        }
      }
    }

    handleFilterClick(event) {
      // Handle filter click
      const clickedElement = event.target;
      if (clickedElement.tagName === 'INPUT' && clickedElement.type === 'checkbox' && clickedElement.name === 'filter') {
        this.updateFilters(clickedElement);
        this.filterBooks();
      }
    }

    updateFilters(checkboxElement) {
      // Update filters based on selected checkboxes
      const filterValue = checkboxElement.value;
      if (checkboxElement.checked) {
        if (!this.filters.includes(filterValue)) {
          this.filters.push(filterValue);
        }
      } else {
        const index = this.filters.indexOf(filterValue);
        if (index > -1) {
          this.filters.splice(index, 1);
        }
      }
    }

    filterBooks() {
      // Filter books based on selected filters
      for (const book of this.data) {
        let shouldBeHidden = false;
        for (const filter of this.filters) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        const bookImage = this.booksListContainer.querySelector('.book__image[data-id="' + book.id + '"]');
        if (shouldBeHidden) {
          bookImage.classList.add('hidden');
        } else {
          bookImage.classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating) {
      // Determine background color based on rating
      if (rating < 6) {
        return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else {
        return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const app = new BooksList(); // eslint-disable-line no-unused-vars
  });
}