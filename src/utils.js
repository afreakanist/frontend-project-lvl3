import { string, setLocale } from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import {
  addFeedElement,
  addPostElement,
  showErrorMessage,
  showSuccessMessage,
} from './render';
import { inputElement } from './constants';

// validation
setLocale({
  string: {
    url: ({ url }) => ({ type: 'error.validation', message: 'error.invalidURL', values: { url } }),
  },
});

const urlSchema = string().trim().url().required();

// RSS parsing
const parseRSSData = (data) => {
  const content = new window.DOMParser().parseFromString(data, 'text/xml');
  if (content.querySelector('parsererror')) {
    throw new Error(i18next.t('error.parsing'));
  } else {
    // feeds
    const title = content.querySelector('title').textContent;
    const description = content.querySelector('description').textContent;
    // posts
    const items = content.querySelectorAll('item');
    const posts = Array.from(items).map((elem) => ({
      link: elem.querySelector('link').textContent,
      title: elem.querySelector('title').textContent,
      description: elem.querySelector('description').textContent,
    }));

    return {
      feed: { title, description },
      posts: [...posts],
    };
  }
};

// event handler
export const handleFormSubmit = async (event, watchedState) => {
  event.preventDefault();

  const url = await urlSchema.validate(inputElement.value)
    .catch((error) => {
      const { type, message } = error.errors[0];
      watchedState.ui.feedback.status = `${i18next.t(type)} ${i18next.t(message)}`;
    });

  if (url) {
    axios.get(`https://allorigins.hexlet.app/get?url=${url}`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          if (!watchedState.feeds.some((entry) => entry.rssURL === response.data.status.url)) {
            watchedState.ui.feedback.status = 'success';
            const { feed, posts } = parseRSSData(response.data.contents);

            watchedState.feeds.unshift({
              rssURL: response.data.status.url,
              ...feed,
            });
            posts.forEach((postData) => {
              watchedState.posts.unshift({
                rssURL: response.data.status.url,
                ...postData,
              });
            });
            // TO DO: make posts and feeds section headers visible
          } else {
            throw new Error(i18next.t('error.duplicate'));
          }
        } else {
          throw new Error(i18next.t('error.generic', { error: response.status }));
        }
      })
      .catch((error) => {
        watchedState.ui.feedback.status = error;
      });
  }
};

// render changes
export const renderChanges = (path, value, previousValue) => {
  if (path === 'feeds') {
    addFeedElement(value[0]);
  } else if (path === 'posts') {
    addPostElement(value[0]);
  } else if (path === 'ui.feedback.status') {
    if (value === 'success') {
      showSuccessMessage();
    } else {
      showErrorMessage(value);
    }
  }
};
