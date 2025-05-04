import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import { loadFoods, loadTags } from '../../redux/actions/foodActions';
import NotFound from '../../components/NotFound/NotFound';

export default function HomePage() {
  const dispatch = useDispatch();
  const { foods, tags } = useSelector((state) => state.food);
  const { searchTerm, tag } = useParams();

  useEffect(() => {
    dispatch(loadTags());
    dispatch(loadFoods(searchTerm, tag));
  }, [dispatch, searchTerm, tag]);

  return (
    <>
      <Search />
      <Tags tags={tags} />
      {foods.length === 0 && <NotFound linkText="Reset Search" />}
      <Thumbnails foods={foods} />
    </>
  );
}
