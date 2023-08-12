import onChange from 'on-change';
import { formElement } from './constants';
import { renderChanges, handleFormSubmit } from './utils';

export default () => {
  const state = {
    rssUrls: [],
    feeds: [],
    posts: [],
    ui: {
      feedback: {
        status: '',
      },
      headers: false,
    },
  };

  const watchedState = onChange(state, renderChanges);

  formElement.addEventListener('submit', (event) => handleFormSubmit(event, watchedState));
};