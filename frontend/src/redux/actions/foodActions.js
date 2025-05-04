import { getAll, getAllByTag, getAllTags, search } from '../../services/foodService';

export const loadTags = () => async (dispatch) => {
  const tags = await getAllTags();
  dispatch({
    type: 'TAGS_LOADED',
    payload: tags,
  });
};

export const loadFoods = (searchTerm, tag) => async (dispatch) => {
  let foods;
  if (tag) {
    foods = await getAllByTag(tag);
  } else if (searchTerm) {
    foods = await search(searchTerm);
  } else {
    foods = await getAll();
  }
  
  dispatch({
    type: 'FOODS_LOADED',
    payload: foods,
  });
};
