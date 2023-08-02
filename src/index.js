import onChange from 'on-change';
import 'bootstrap';
import './index.css';
import { formElement } from './constants';
import { renderChanges, handleFormSubmit } from './utils';

const app = () => {
  const state = {
    feeds: [],
    posts: [],
    ui: {
      feedback: {
        status: '',
      },
    },
  };

  const watchedState = onChange(state, renderChanges);

  formElement.addEventListener('submit', (event) => handleFormSubmit(event, watchedState));
};

app();
