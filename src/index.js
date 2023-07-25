import { string, setLocale } from 'yup';
import 'bootstrap';
import i18next from 'i18next';
import en from './locales/en';
import ru from './locales/ru';
import './index.css';
import {
  headerElement,
  leadElement,
  formElement,
  inputElement,
  inputLabelElement,
  submitButton,
  exampleElement,
  footerCreatedElement,
  authorLinkElement,
  feedList,
} from './constants';
import {
  showSuccessMessage,
  showErrorMessage,
  addFeedItem,
  isDuplicate,
} from './utils';

// localization
i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  debug: true,
  resources: {
    en,
    ru,
  },
});

// adding strings to elements
headerElement.textContent = i18next.t('header');
leadElement.textContent = i18next.t('lead');
inputElement.setAttribute('placeholder', i18next.t('inputPlaceholder'));
inputLabelElement.textContent = i18next.t('inputPlaceholder');
submitButton.textContent = i18next.t('btnCaption');
exampleElement.textContent = i18next.t('linkExample');
footerCreatedElement.prepend(i18next.t('footerCreated'));
authorLinkElement.textContent = i18next.t('author');

// validation
setLocale({
  string: {
    url: ({ url }) => ({ type: 'error.validation', message: 'error.invalidURL', values: { url } }),
  },
});

const urlSchema = string().trim().url().required();

// listening to events
formElement.addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = await urlSchema.validate(inputElement.value)
    .catch((error) => {
      const { type, message } = error.errors[0];
      showErrorMessage(`${i18next.t(type)} ${i18next.t(message)}`);
    });

  if (url) {
    await fetch(url)
      .then((response) => {
        console.log(response)
        if (response.ok) {
          if (!isDuplicate(response.url)) {
            showSuccessMessage();
            feedList.push(response.url);
            addFeedItem(response.url);
            formElement.reset();
          } else {
            throw new Error(i18next.t('error.duplicate'));
          }
        } else {
          throw new Error(i18next.t('error.generic', { error: response.status }));
        }
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  }
});
