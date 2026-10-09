// src/pages/Home.jsx
import { useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';

const Home = () => {
  useEffect(() => {
    axios
      .get('/api/test')
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Hero />
    </>
  );
};

export default Home;