import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import useStyles from './styles';

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const DogGallery = () => {
  const classes = useStyles();
  const [breeds, setBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [images, setImages] = useState({});

  useEffect(() => {
    axios.get('https://dog.ceo/api/breeds/list/all')
      .then((response) => {
        const breedList = Object.keys(response.data.message);
        setBreeds(breedList);
      })
      .catch((error) => {
        console.error('Errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', error);
      });
  }, []);

  useEffect(() => {
    fetchImagesForSelectedBreeds();
  }, [selectedBreeds]);

  const handleBreedSelect = (event) => {
    const { value } = event.target;
    setSelectedBreeds(value);
  };

  const fetchImagesForSelectedBreeds = async () => {
    const newImages = { ...images };

    if (selectedBreeds.length === 0) {
      setImages({});
      return;
    }
    for (const breed of selectedBreeds) {
      if (!images[breed]) {
        try {
          const response = await axios.get(
            `https://dog.ceo/api/breed/${breed}/images/random/3` // take only first 3 images
          );
          newImages[breed] = response.data.message;
        } catch (error) {
          console.error(`Errorrrrrrrrrrrrrrr`, error);
        }
      }
    }

    setImages(newImages);
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h4">Select Dog Breeds</Typography>
        <Select
          className={classes.select}
          multiple
          value={selectedBreeds}
          onChange={handleBreedSelect}
        >
          {breeds.map((breed) => (
            <MenuItem key={breed} value={breed}>
              {capitalizeFirstLetter(breed)}
            </MenuItem>
          ))}
        </Select>
      <div className={classes.galleryContainer}>
        {selectedBreeds.map((breed) => (
          <div key={breed}>
            <Typography variant="h6">{breed}</Typography>
            <Grid container spacing={2}>
              {images[breed]?.map((imageUrl, i) => (
                <Grid item key={i} xs={12} sm={6} md={4}>
                  <img
                    src={imageUrl}
                    alt={`Dog ${i}`}
                    className={classes.image}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default DogGallery;
