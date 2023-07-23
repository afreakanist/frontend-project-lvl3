import { string } from 'yup'; // validation

import 'bootstrap';
import './index.css';

const formElement = document.querySelector('form.rss-form');
const inputElement = formElement.querySelector('input#url-input');
const messageElement = document.querySelector('p.feedback');
// const feedsContainer = document.querySelector('div.feeds');
// const postsContainer = document.querySelector('div.posts');
const listContainer = document.querySelector('ul.list-group');

const urlSchema = string().trim().url().required();

const showSuccessMessage = () => {
  inputElement.classList.remove('is-invalid');
  messageElement.classList.remove('text-danger');
  messageElement.classList.add('text-success');
  messageElement.textContent = 'RSS was successfully loaded!';
};

const showErrorMessage = (error) => {
  inputElement.classList.add('is-invalid');
  messageElement.classList.remove('text-success');
  messageElement.classList.add('text-danger');
  messageElement.textContent = error;
};

// const hideError = () => {
//   inputElement.classList.remove('is-invalid');
//   messageElement.textContent = '';
// };

const generateFeedItem = (url) => {
  const feedItem = document.createElement('li');
  feedItem.classList.add('list-group-item');
  const linkElem = document.createElement('a');
  linkElem.classList.add('link-primary');
  linkElem.textContent = url;
  linkElem.setAttribute('href', url);
  feedItem.prepend(linkElem);
  return feedItem;
};

const addFeedItem = (url) => {
  listContainer.prepend(generateFeedItem(url));
};

const isDuplicate = (url) => {
  return feedList.some((entry) => entry === url); // true if is duplicate
};

// temporary feed list dummy
const feedList = [];

// rss url example: http://rss.art19.com/the-daily

formElement.addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = await urlSchema.validate(inputElement.value)
    .catch((error) => {
      showErrorMessage(error);
    });

  if (url) {
    await fetch(url)
      .then((response) => {
        if (response.ok) {
          if (!isDuplicate(response.url)) {
            showSuccessMessage();
            feedList.push(response.url);
            addFeedItem(response.url);
            formElement.reset();
          } else {
            throw new Error('Oops! You have already added this feed.');
          }
        } else {
          throw new Error('Oops! Someting went wrong.');
        }
      })
      .catch((error) => {
        showErrorMessage(error);
      })
  }
});
