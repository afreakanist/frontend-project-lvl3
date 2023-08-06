import { string, setLocale } from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import { differenceWith, uniqueId } from 'lodash';
import {
  addFeedElement,
  addPostElement,
  showErrorMessage,
  showSuccessMessage,
  showSectionHeaders,
} from './render';
import { inputElement } from './constants';

/* eslint-disable no-param-reassign */

// validation
setLocale({
  string: {
    url: ({ url }) => ({ type: 'error.validation', message: 'error.invalidURL', values: { url } }),
  },
  mixed: {
    notOneOf: ({ notOneOf }) => ({ type: 'error.validation', message: 'error.duplicate', values: { notOneOf } }),
  },
});

const baseProxyUrl = 'https://allorigins.hexlet.app/get';

const generateProxyUrl = (url) => {
  const proxyUrl = new URL(baseProxyUrl);

  proxyUrl.searchParams.set('url', url);
  proxyUrl.searchParams.set('disableCache', 'true');

  return proxyUrl.toString();
};

const parseRSSData = (data) => {
  const content = new window.DOMParser().parseFromString(data, 'text/xml');
  const parsingError = content.querySelector('parsererror');

  if (parsingError) {
    throw new Error(`${i18next.t('error.parsing')} ${parsingError.textContent}`);
  }
  // feeds
  const title = content.querySelector('title').textContent;
  const description = content.querySelector('description').textContent;
  // posts
  const items = content.querySelectorAll('item');
  const posts = Array.from(items).map((elem) => ({
    id: uniqueId(),
    link: elem.querySelector('link').textContent,
    title: elem.querySelector('title').textContent,
    description: elem.querySelector('description').textContent,
  }));

  return {
    feed: { title, description },
    posts: [...posts],
  };
};

const getRSS = (url) => axios.get(url)
  .then((response) => parseRSSData(response.data.contents));

const getNewPosts = (watchedState) => {
  watchedState.rssUrls.forEach((url) => {
    getRSS(generateProxyUrl(url)).then(({ posts }) => {
      const newPosts = differenceWith(
        posts,
        watchedState.posts,
        (newPost, savedPost) => newPost.title === savedPost.title,
      );
      if (newPosts.length > 0) {
        newPosts.forEach((post) => {
          watchedState.posts.unshift(post);
        });
      }
    });
  });
};

const updatePosts = (watchedState) => {
  getNewPosts(watchedState);

  setTimeout(updatePosts, 5000, watchedState);
};

// event handler
export const handleFormSubmit = async (event, watchedState) => {
  event.preventDefault();

  const urlSchema = string().trim().url().required()
    .notOneOf(watchedState.rssUrls);
  const url = inputElement.value;

  const isValid = await urlSchema.validate(url)
    .catch((error) => {
      const { message } = error.errors[0];
      watchedState.ui.feedback.status = `${i18next.t(message)}`;
    });

  if (isValid) {
    getRSS(generateProxyUrl(url))
      .then(({ feed, posts }) => {
        watchedState.rssUrls.push(url);
        watchedState.feeds.unshift(feed);
        posts.forEach((postData) => {
          watchedState.posts.unshift(postData);
        });
        watchedState.ui.feedback.status = 'success';
        watchedState.ui.headers = true;
      })
      .catch((error) => {
        watchedState.ui.feedback.status = error;
      });
  }

  updatePosts(watchedState);
};

export const renderChanges = (path, value, previousValue) => {
  switch (path) {
    case ('feeds'):
      addFeedElement(value[0]);
      break;
    case ('posts'):
      addPostElement(value[0]);
      break;
    case ('ui.feedback.status'):
      if (value === 'success') {
        showSuccessMessage();
      } else {
        showErrorMessage(value);
      }
      break;
    case ('ui.headers'):
      if (value !== previousValue) {
        showSectionHeaders();
      }
      break;
    default:
      break;
  }
};
