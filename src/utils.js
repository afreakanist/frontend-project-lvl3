import { string } from 'yup';
import axios from 'axios';
import { differenceWith, uniqueId } from 'lodash';

/* eslint-disable no-param-reassign */

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
    const error = new Error(parsingError.textContent);
    error.isParsingError = true;
    throw error;
  }
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
    posts,
  };
};

const normalizePost = (post) => ({
  ...post,
  id: uniqueId('post'),
});

const getRSS = (url) => axios.get(url)
  .then((response) => parseRSSData(response.data.contents));

const handleError = (error, watchedState) => {
  watchedState.ui.form.isValid = false;
  watchedState.ui.form.status = 'error';
  if (axios.isAxiosError(error)) {
    watchedState.ui.feedback.status = 'error.network';
    console.error(error);
  } else if (error.isParsingError) {
    watchedState.ui.feedback.status = 'error.parsing';
    console.error(error);
  } else {
    watchedState.ui.feedback.status = 'error.generic';
    console.error(error);
  }
};

const getNewPosts = (watchedState) => {
  const parsedRssData = watchedState.rssUrls.map((url) => getRSS(generateProxyUrl(url)));
  return Promise.all(parsedRssData)
    .then((data) => {
      const posts = data.flatMap((item) => item.posts);
      const newPosts = differenceWith(
        posts,
        watchedState.posts,
        (newPost, savedPost) => newPost.title === savedPost.title,
      );
      if (newPosts.length > 0) {
        const normalizedPosts = newPosts.map((post) => normalizePost(post));
        watchedState.posts = [...normalizedPosts, ...watchedState.posts];
      }
    })
    .catch((error) => {
      handleError(error, watchedState);
    });
};

const updatePosts = (watchedState) => {
  const delayMs = 5000;

  setTimeout(() => {
    getNewPosts(watchedState)
      .finally(() => {
        updatePosts(watchedState);
      });
  }, delayMs);
};

// event handlers
export const handleFormSubmit = async (event, watchedState) => {
  event.preventDefault();

  watchedState.ui.form.status = 'pending';

  const urlSchema = string().trim().url().required()
    .notOneOf(watchedState.rssUrls);
  const url = event.target.querySelector('input').value;

  const isValid = await urlSchema.validate(url)
    .catch((error) => {
      const { message } = error.errors[0];
      watchedState.ui.feedback.status = message;
      watchedState.ui.form.isValid = false;
      watchedState.ui.form.status = 'error';
    });

  if (isValid) {
    getRSS(generateProxyUrl(url))
      .then(({ feed, posts }) => {
        watchedState.rssUrls.push(url);
        watchedState.feeds = [feed, ...watchedState.feeds];
        const normalizedPosts = posts.map((post) => normalizePost(post));
        watchedState.posts = [...normalizedPosts, ...watchedState.posts];
        watchedState.ui.feedback.status = 'success';
        watchedState.ui.form.isValid = true;
        watchedState.ui.form.status = 'ready';
        watchedState.ui.headers = true;
      })
      .then(() => {
        updatePosts(watchedState);
      })
      .catch((error) => {
        handleError(error, watchedState);
      });
  }
};

export const handlePostClick = (event, watchedState) => {
  const { postId } = event.target.dataset;
  if (!postId) return;

  watchedState.ui.viewedPosts.add(postId);
  watchedState.ui.previewInModal = watchedState.posts.find(({ id }) => id === postId);
};
